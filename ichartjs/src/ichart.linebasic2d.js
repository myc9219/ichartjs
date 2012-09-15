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
			var _ = this._();
			
			_.coo = new iChart.Coordinate2D(iChart.merge({
					scale:[{
						 position:_.get('scaleAlign'),	
						 max_scale:_.get('maxValue')
					},{
						 position:_.get('labelAlign'),	
						 scaleEnable:false,
						 start_scale:1,
						 scale:1,
						 end_scale:_.get('maxItemSize'),
						 labels:_.get('data_labels')
					}]
				},_.get('coordinate')),_);
			
			
			_.components.push(_.coo);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = _.coo.getScale(_.get('scaleAlign')),
				H=_.get('coordinate.valid_height'),
				sp=_.get('label_spacing'),
				points,x,y,
				ox=_.get('segment_style.originx'),
				oy=_.get('segment_style.originy'),
				p;
			
			_.push('segment_style.tip.showType','follow');
			_.push('segment_style.coordinate',_.coo);
			_.push('segment_style.tipInvokeHeap',_.tipInvokeHeap);
			_.push('segment_style.point_space',sp);
			
			_.data.each(function(d,i){
				points = [];
				d.value.each(function(v,j){
					x = sp*j;
					y = (v-S.start)*H/S.distance;
					p = {x:ox+x,y:oy-y,value:v,text:v};
					iChart.merge(p,_.fireEvent(_,'parsePoint',[d,v,x,y,j]))
					if (_.get('tip.enable'))
						p.text = _.fireString(_,'parseTipText',[d,v,j],v);
					points.push(p);
				},_);	
				
				_.push('segment_style.points',points);
				_.push('segment_style.brushsize',d.linewidth||1);
				_.push('segment_style.background_color',d.color);
				
				_.lines.push(new iChart.LineSegment(_.get('segment_style'),_));
			},this);
			_.components.push(_.lines);
			
		}
		
});//@end