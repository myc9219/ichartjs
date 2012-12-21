/**
 * @overview the stacked column2d componment
 * @component#@chart#iChart.ColumnStacked2D
 * @extend#iChart.Column2D
 */
iChart.ColumnStacked2D = iChart.extend(iChart.Column, {
	/**
	 * initialize the context for the ColumnStacked2D
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.ColumnStacked2D.superclass.configure.call(this);

		this.type = 'columnstacked2d';
		/**
		 * indicate the data was stacked
		 */
		this.stacked = true;
		
	},
	doConfig : function() {
		iChart.ColumnStacked2D.superclass.doConfig.call(this);
		
		/**
		 * get the max/min scale of this coordinate for calculated the height
		 */
		var _ = this._(),
			c = _.get('column_width'),
			s = _.get('column_space'),
			S = _.coo.getScale(_.get('scaleAlign')),
			H = _.coo.get(_.H), 
			h2 = c / 2, 
			gw = c + s, 
			h,
			h0,
			y0 = _.coo.get(_.Y) +  H,
			y = y0 - S.basic*H - (_.is3D()?(_.get('zHeight') * (_.get('bottom_scale') - 1) / 2 * _.get('yAngle_')):0),
			x = s+_.coo.get('x_start');
			y0 = y0 + _.get('text_space') + _.coo.get('axis.width')[2];
			
		/**
		 * disable the label
		 */	
		_.push('sub_option.label',false);
		
		_.data.each(function(d, i) {
			h0 = 0;
			d.value.each(function(v, j){
				h = (v - S.start) * H / S.distance;
				_.doParse(_,d, i, {
					id : i,
					originx :x + i * gw,
					originy : y  - (h>0? h :0)-h0,
					height : Math.abs(h)
				});
				h0 += h;
				_.rectangles.push(new iChart[_.sub](_.get('sub_option'), _));
			});
			_.doLabel(_,i, d.name, x + gw * i + h2, y0);
		}, _);
		
		
	}
});
/**
 *@end 
 */