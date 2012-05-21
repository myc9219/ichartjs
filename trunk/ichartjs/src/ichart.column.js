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

		this.set({
			coordinate : {},
			hiswidth : undefined,
			shadow : true,
			text_space : 6,
			/**
			 * @cfg {String} Available value are:
			 * @Option 'left'
			 * @Option 'right'
			 */
			keduAlign : 'left',
			/**
			 * @cfg {Object}
			 * @extend iChart.Chart
			 * @see iChart.Chart#label
			 */
			label : {
				padding : 5
			},
			/**
			 * @cfg {Boolean}
			 */
			customize_layout : false
		});

		this.registerEvent('rectangleover', 'rectanglemouseout', 'rectangleclick', 'parseValue', 'parseText', 'animating');

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
			this.fireEvent(this, 'animating', [this, r, t, r.heigh, d]);
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

});//@end