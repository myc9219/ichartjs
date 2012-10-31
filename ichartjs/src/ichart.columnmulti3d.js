/**
 * @overview this component will draw a cluster column2d chart.
 * @component#@chart#iChart.ColumnMulti3D
 * @extend#iChart.Column
 */
iChart.ColumnMulti3D = iChart.extend(iChart.Column, {
	/**
	 * initialize the context for the ColumnMulti3D
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.ColumnMulti3D.superclass.configure.call(this);

		this.type = 'columnmulti3d';
		this.dataType = 'complex';
		this.dimension = iChart._3D;

		this.set({
			/**
			 * @cfg {Number(0~90)} Three-dimensional rotation X in degree(angle).(default to 60)
			 */
			xAngle : 60,
			/**
			 * @cfg {Number(0~90)} Three-dimensional rotation Y in degree(angle).(default to 20)
			 */
			yAngle : 20,
			/**
			 * @cfg {Number} Three-dimensional z-axis deep factor.frame of reference is width.(default to 1)
			 */
			zScale : 1,
			group_fator : 0.3,
			/**
			 * @cfg {Number(1~)} Three-dimensional z-axis deep factor of pedestal.frame of reference is width.(default to 1.4)
			 */
			bottom_scale : 1.4,
			/**
			 * @cfg {Array} the array of labels close to the axis
			 */
			labels : []
		});
	},
	doConfig : function() {
		iChart.ColumnMulti3D.superclass.doConfig.call(this);

		/**
		 * get the max/min scale of this coordinate for calculated the height
		 */
		var _ = this._(),bw = _.get('colwidth'),H = _.get('coordinate.height'),
			S = _.coo.getScale(_.get('scaleAlign')),q = bw*_.get('group_fator'), 
			gw = _.data.length * (bw+q)-q + _.get('hispace'), h, 
			I = _.coo.get('originy') - S.basic * H + H,
			x = _.get('hispace')+_.coo.get('originx');
		
		/**
		 * quick config to all rectangle
		 */
		_.push('sub_option.width', bw);
		var g = 0;
		_.columns.each(function(column, i) {
			column.item.each(function(d, j) {
				h = (d.value - S.start) * H / S.distance;
				_.doParse(_, d, j, {
					id : i + '-' + j,
					originx : x + j * (bw+q) + i * gw,
					originy : I - (h > 0 ? h : 0),
					height : Math.abs(h)
				});
				_.rectangles.push(new iChart.Rectangle3D(_.get('sub_option'), this));
			}, _);
				
			_.doLabel(_, i, column.name, _.x + _.get('hispace') * 0.5 + (i + 0.5) * gw, _.y + H + _.get('text_space'));
		}, _);

	}
});
/**
 * @end
 */
