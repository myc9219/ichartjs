	
	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Bar2D
	 * @extend#iChart.Bar
	 */
	iChart.Bar2D = iChart.extend(iChart.Bar,{
		/**
		 * initialize the context for the pie
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Bar2D.superclass.configure.call(this);
			
			this.type = 'bar2d';
			
			/**
			 * this.set({});
			 */
		},
		doConfig:function(){
			iChart.Bar2D.superclass.doConfig.call(this);
			
			/**
			 * get the max/min scale of this coordinate for calculated the height
			 */
			var S = this.coo.getScale(this.get('keduAlign')),
				W = this.coo.get('width'),
				h2 = this.get('barheight')/2,
				gw = this.get('barheight')+this.get('barspace');
			
			this.data.each(function(d, i) {
				
				this.doParse(d, i, i, 0, this.y+this.get('barspace')+i*gw, (d.value - S.start) * W / S.distance);
				d.reference = new iChart.Rectangle2D(this.get('rectangle'), this);
				this.rectangles.push(d.reference);
				
				this.labels.push(new iChart.Text({
					id:i,
					textAlign:'right',
					textBaseline:'middle',
					text:d.name,
					originx:this.x - this.get('text_space'),
	 				originy:this.y + this.get('barspace')+i*gw +h2
				},this));
			}, this);
			
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
		}
		
});//@end