	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.LineBasic2D
	 * @extend#iChart.Line
	 */
	iChart.LineBasic2D = iChart.extend(iChart.Line,{
		/**
		 * initialize the context for the LineBasic2D
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.LineBasic2D.superclass.configure.call(this);
			
			this.type = 'basicline2d';
			
			 
			this.tipInvokeHeap = [];
		},
		doAnimation:function(t,d){
			var l,ps,p;
			this.coo.draw();
			for(var i=0;i<this.lines.length;i++){
				l = this.lines[i]; 
				p = l.get('points');
				for(var j=0;j<p.length;j++){
					p[j].y = l.y - Math.ceil(this.animationArithmetic(t,0,l.y-p[j].y_,d));
				}
				l.drawSegment();
			}
		},
		doConfig:function(){
			iChart.LineBasic2D.superclass.doConfig.call(this);
			
			this.coo = new iChart.Coordinate2D(iChart.merge({
					scale:[{
						 position:this.get('scaleAlign'),	
						 max_scale:this.get('maxValue')
					},{
						 position:this.get('labelAlign'),	
						 scaleEnable:false,
						 start_scale:1,
						 scale:1,
						 end_scale:this.get('maxItemSize'),
						 labels:this.get('data_labels')
					}]
				},this.get('coordinate')),this);
			
			
			this.components.push(this.coo);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('scaleAlign')),
				H=this.get('coordinate.valid_height'),
				sp=this.get('label_spacing'),
				points,x,y,
				ox=this.get('segment_style.originx'),
				oy=this.get('segment_style.originy'),
				p;
			
			this.push('segment_style.tip.showType','follow');
			this.push('segment_style.coordinate',this.coo);
			this.push('segment_style.tipInvokeHeap',this.tipInvokeHeap);
			this.push('segment_style.point_space',sp);
			
			this.data.each(function(d,i){
				points = [];
				d.value.each(function(v,j){
					x = sp*j;
					y = (v-S.start)*H/S.distance;
					p = {x:ox+x,y:oy-y,value:v,text:v};
					iChart.merge(p,this.fireEvent(this,'parsePoint',[d,v,x,y,j]))
					if (this.get('tip.enable'))
						p.text = this.fireString(this,'parseTipText',[d,v,j],v);
					points.push(p);
				},this);	
				
				this.push('segment_style.points',points);
				this.push('segment_style.brushsize',d.linewidth||1);
				this.push('segment_style.background_color',d.color);
				
				this.lines.push(new iChart.LineSegment(this.get('segment_style'),this));
			},this);
			this.components.push(this.lines);
			
		}
		
});//@end