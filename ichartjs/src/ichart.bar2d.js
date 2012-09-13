	
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
			
		},
		doConfig:function(){
			iChart.Bar2D.superclass.doConfig.call(this);
			
			/**
			 * get the max/min scale of this coordinate for calculated the height
			 */
			var _ = this._(),
				S = _.coo.getScale(_.get('scaleAlign')),
				W = _.coo.get('width'),
				h2 = _.get('barheight')/2,
				gw = _.get('barheight')+_.get('barspace');
			
			_.data.each(function(d, i) {
				_.doParse(_,d, i, i, 0, _.y+_.get('barspace')+i*gw, (d.value - S.start) * W / S.distance);
				d.reference = new iChart.Rectangle2D(_.get('rectangle'), _);
				_.rectangles.push(d.reference);
				
				_.labels.push(new iChart.Text({
					id:i,
					textAlign:'right',
					textBaseline:'middle',
					text:d.name,
					originx:_.x - _.get('text_space'),
	 				originy:_.y + _.get('barspace')+i*gw +h2
				},_));
			}, _);
			
			_.components.push(_.labels);
			_.components.push(_.rectangles);
		}
		
});//@end