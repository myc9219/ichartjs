	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.LineBasic2D
	 * @extend#iChart.Line
	 */
	iChart.LineBasic2D = iChart.extend(iChart.Line,{
		/**
		 * initialize the context for the LineBasic2D
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.LineBasic2D.superclass.configure.call(this);
			
			this.type = 'basicline2d';
			
			this.configuration({
				
			});
			 
			this.registerEvent();
			
			this.tipInvokeHeap = [];
		},
		doAnimation:function(t,d){
			var l,p;
			this.coordinate.draw();
			for(var i=0;i<this.lines.length;i++){
				l = this.lines[i]; 
				this.fireEvent(this,'beforeLineAnimation',[this,l]);
				
				for(var j=0;j<l.points.length;j++){
					p = l.points[j];
					p.y = Math.ceil(this.animationArithmetic(t,0,p.height,d));
				}
				
				l.drawLineSegment();
				
				this.fireEvent(this,'afterLineAnimation',[this,l]);
			}
		},
		doConfig:function(){
			iChart.LineBasic2D.superclass.doConfig.call(this);
			
			this.coordinate = new iChart.Coordinate2D(iChart.merge({
					kedu:[{
						 position:this.get('keduAlign'),	
						 max_scale:this.get('maxValue')
					},{
						 position:this.get('labelAlign'),	
						 scaleEnable:false,
						 start_scale:1,
						 scale:1,
						 end_scale:this.get('maxItemSize'),
						 labels:this.get('labels')
					}],
				 	axis:{
						width:[0,0,2,2]
				 	}
				},this.get('coordinate')),this);
			
			
			this.pushComponent(this.coordinate,true);
			
			this.push('segment_style.tip.showType','follow');
			this.push('segment_style.coordinate',this.coordinate);
			this.push('segment_style.tipInvokeHeap',this.tipInvokeHeap);
			
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coordinate.getScale(this.get('keduAlign')),
				H=this.get('coordinate.valid_height'),
				sp=this.get('label_spacing'),
				points,x,y;
			
			//?多个点重合的Tip处理?
			
			for(var i=0;i<this.data.length;i++){
				points = [];
				for(var j=0;j<this.data[i].value.length;j++){
					x = sp*j;
					y = (this.data[i].value[j]-S.start)*H/S.distance;
					points.push(iChart.merge({x:x,y:y,value:this.data[i].value[j]},this.fireEvent(this,'parsePoint',[this.data[i].value[j],x,y,j])));
				}
				
				this.push('segment_style.spacing',sp);
				this.push('segment_style.points',points);
				this.push('segment_style.brushsize',this.data[i].linewidth||1);
				this.push('segment_style.background_color',this.data[i].color);
				
				this.lines.push(new iChart.LineSegment(this.get('segment_style'),this));
			}
			this.pushComponent(this.lines);
			
						
			
		}
		
});