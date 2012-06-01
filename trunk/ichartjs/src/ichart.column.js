/**
 * @overview this component use for abc
 * @component#iChart.Column
 * @extend#iChart.Chart
 */
iChart.Column = iChart.extend(iChart.Chart, {
	/**
	 * initialize the context for the Column
	 */
	configure : function(config) {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Column.superclass.configure.call(this);

		this.type = 'column';
		this.dataType = 'simple';
		this.set({
			/**
			 * @cfg {Object} the option for coordinate
			 */
			coordinate : {},
			/**
			 * @cfg {Number} the width of each column(default to calculate according to coordinate's width)
			 */
			hiswidth : undefined,
			/**
			 * @cfg {Number} the distance of column's bottom and text(default to 6)
			 */
			text_space : 6,
			/**
			 * @cfg {String} the align of scale(default to 6) Available value are:
			 * @Option 'left'
			 * @Option 'right'
			 */
			keduAlign : 'left',
			/**
			 * @inner {Object} the option for label
			 * @extend iChart.Chart
			 * @see iChart.Chart#label
			 */
			label : {
				padding : 5
			},
			/**
			 * @inner {Boolean}
			 */
			customize_layout : false
		});

		this.registerEvent('rectangleover', 'rectanglemouseout', 'rectangleclick','parseValue','parseText');

		this.rectangles = [];
		this.labels = [];
	},
	doAnimation : function(t, d) {
		var r, h;
		this.coo.draw();
		for ( var i = 0; i < this.rectangles.length; i++) {
			r = this.rectangles[i];
			h = Math.ceil(this.animationArithmetic(t, 0, r.height, d));
			r.push('originy', r.y + (r.height - h));
			r.push('height', h);
			this.labels[i].draw();
			r.drawRectangle();
		}
	},
	doConfig : function() {
		iChart.Column.superclass.doConfig.call(this);

		/**
		 * apply the coordinate feature
		 */
		iChart.Interface.coordinate.call(this);
		/**
		 * quick config to all rectangle
		 */
		this.push('rectangle', iChart.clone(['customize_layout', 'shadow', 'shadow_blur', 'shadow_offsetx', 'shadow_offsety', 'gradient', 'color_factor', 'label', 'tip', 'border'], this.options));

		/**
		 * register event
		 */
		this.on('rectangleover', function(e, r) {
			this.T.css("cursor", "pointer");

		}).on('rectanglemouseout', function(e, r) {
			this.T.css("cursor", "default");
		});

	}

});// @end
