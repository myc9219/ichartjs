/**
 * @overview the column2d componment
 * @component#@chart#iChart.Column2D
 * @extend#iChart.Column
 */
iChart.Column2D = iChart.extend(iChart.Column, {
	/**
	 * initialize the context for the Column2D
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Column2D.superclass.configure.call(this);

		this.type = 'column2d';
		
	},
	doConfig : function() {
		iChart.Column2D.superclass.doConfig.call(this);
		/**
		 * get the max/min scale of this coordinate for calculated the height
		 */
		var _ = this._(),S = _.coo.getScale(_.get('scaleAlign')), bs = _.coo.get('brushsize'), H = _.coo.get('height'), h2 = _.get('colwidth') / 2, gw = _.get('colwidth') + _.get('hispace'), h;
		
		_.data.each(function(d, i) {
			h = (d.value - S.start) * H / S.distance;
			_.doParse(_,d, i, {
				id : i,
				originx :_.x + _.get('hispace') + i * gw,
				originy : _.y + H - h - bs,
				height : h
			});
			_.rectangles.push(new iChart.Rectangle2D(_.get('sub_option'), _));
			_.doLabel(i, d.name, _.x + _.get('hispace') + gw * i + h2, _.y + H + _.get('text_space'));
		}, _);

		
	}

});
/**
 *@end 
 */