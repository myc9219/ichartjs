/**
 * @overview the bar2d componment
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
		var _ = this._(), S = _.coo.getScale(_.get('scaleAlign')), W = _.coo.get('width'), h2 = _.get('barheight') / 2, gw = _.get('barheight') + _.get('barspace');

		_.data.each(function(d, i) {
			_.doParse(_, d, i,{
				id : i,
				originy : _.y + _.get('barspace') + i * gw,
				width : (d.value - S.start) * W / S.distance
			});
			_.rectangles.push(new iChart.Rectangle2D(_.get('sub_option'), _));
			_.doLabel(i, d.name, _.x - _.get('text_space'), _.y + _.get('barspace') + i * gw + h2);
		}, _);

	}

});
/**
 * @end
 */
