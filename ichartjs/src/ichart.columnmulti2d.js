/**
 * @overview this component will draw a cluster column2d chart.
 * @component#@chart#iChart.ColumnMulti2D
 * @extend#iChart.Column
 */
iChart.ColumnMulti2D = iChart.extend(iChart.Column, {
	/**
	 * initialize the context for the ColumnMulti2D
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.ColumnMulti2D.superclass.configure.call(this);

		this.type = 'columnmulti2d';
		this.dataType = 'complex';

		this.set({
			/**
			 * @cfg {Array} the array of labels close to the axis
			 */
			labels : []
		});

	},
	doConfig : function() {
		iChart.ColumnMulti2D.superclass.doConfig.call(this);

		/**
		 * get the max/min scale of this coordinate for calculated the height
		 */
		var _ = this._(),bw = _.get('colwidth'),H = _.get('coordinate.height'),S = _.coo.getScale(_.get('scaleAlign')), gw = _.data.length * bw + _.get('hispace'), h, I = _.y - S.basic * H + H;
		
		/**
		 * quick config to all rectangle
		 */
		_.push('sub_option.width', bw);
		
		_.columns.each(function(column, i) {
			column.item.each(function(d, j) {
				h = (d.value - S.start) * H / S.distance;
				_.doParse(_, d, j, {
					id : i + '-' + j,
					originx : _.x + _.get('hispace') + j * bw + i * gw,
					originy : I - (h > 0 ? h : 0),
					height : Math.abs(h)
				});
				_.rectangles.push(new iChart.Rectangle2D(_.get('sub_option'), this));
			}, _);

			_.doLabel(_, i, column.name, _.x + _.get('hispace') * 0.5 + (i + 0.5) * gw, _.y + H + _.get('text_space'));
		}, _);

	}
});
/**
 * @end
 */
