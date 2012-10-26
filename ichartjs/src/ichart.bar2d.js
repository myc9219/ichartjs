/**
 * @overview this component will draw a bar2d chart.
 * @component#@chart#iChart.Bar2D
 * @extend#iChart.Bar
 */
iChart.Bar2D = iChart.extend(iChart.Bar, {
	/**
	 * initialize the context for the pie
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Bar2D.superclass.configure.call(this);

		this.type = 'bar2d';

	},
	doConfig : function() {
		iChart.Bar2D.superclass.doConfig.call(this);

		/**
		 * get the max/min scale of this coordinate for calculated the height
		 */
		var _ = this._(), S = _.coo.getScale(_.get('scaleAlign')), W = _.coo.get(_.W), h2 = _.get('barheight') / 2, gw = _.get('barheight') + _.get('barspace'),w,I = _.x+S.basic*W;
		
		_.data.each(function(d, i) {
			w = (d.value - S.start) * W / S.distance;
			_.doParse(_, d, i,{
				id : i,
				originy : _.y + _.get('barspace') + i * gw,
				width : Math.abs(w),
				originx: I+(w>0?1:-Math.abs(w))
			});
			
			_.rectangles.push(new iChart.Rectangle2D(_.get('sub_option'), _));
			_.doLabel(i, d.name, _.x - _.get('text_space'), _.y + _.get('barspace') + i * gw + h2);
		}, _);
	}

});
/**
 * @end
 */
