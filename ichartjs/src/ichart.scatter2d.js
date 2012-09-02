	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Scatter2D
	 * @extend#iChart.Line
	 */
	iChart.Scatter2D = iChart.extend(iChart.Line,{
		/**
		 * initialize the context for the Scatter2D
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Scatter2D.superclass.configure.call(this);
			
			this.type = 'scatter2d';
			this.dataType=='custom';
			
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
			iChart.Scatter2D.superclass.doConfig.call(this);
			
			this.coo = new iChart.Coordinate2D(this.get('coordinate'),this);
			
			
			this.pushComponent(this.coo,true);
			this.push('segment_style.coordinate',this.coo);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('scaleAlign')),
				B = this.coo.getScale(this.get('labelAlign')),
				W=this.get('coordinate.valid_width'),
				H=this.get('coordinate.valid_height'),
				sp=this.get('label_spacing'),
				points,x,y,
				ox=this.get('segment_style.originx'),
				oy=this.get('segment_style.originy'),
				p;
			
			this.data.each(function(d,i){
				points = [];
				d.value.each(function(v,j){
					x = (v.x-B.start)*W/B.distance;
					y = (v.y-S.start)*H/S.distance;
					p = {x:ox+x,y:oy-y,value:v.x+'/'+v.y,text:v.x+'/'+v.y};
					iChart.merge(p,this.fireEvent(this,'parsePoint',[d,x,y,j]))
					points.push(p);
				},this);	
				this.push('segment_style.points',points);
				this.push('segment_style.brushsize',d.linewidth||1);
				this.push('segment_style.background_color',d.color);
				
				this.lines.push(new iChart.Points(this.get('segment_style'),this));
			},this);
			
			this.pushComponent(this.lines);
			
		}
		
});//@end