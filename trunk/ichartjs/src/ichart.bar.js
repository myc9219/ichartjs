/**
 * @overview this component use for abc
 * @component#iChart.Bar
 * @extend#iChart.Chart
 */
iChart.Bar = iChart.extend(iChart.Chart, {
	/**
	 * initialize the context for the bar
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Bar.superclass.configure.call(this);

		this.type = 'bar';
		this.dataType = 'simple';
		this.set({
			/**
			 * @cfg {Object} Specifies the option for coordinate.For details see <link>iChart.Coordinate2D</link>
			 */
			coordinate : {
				alternate_direction : 'h'
			},
			/**
			 * @cfg {Number} Specifies the width of each bar(default to calculate according to coordinate's height)
			 */
			barheight : undefined,
			/**
			 * @cfg {Number} Specifies the distance of bar's bottom and text(default to 6)
			 */
			text_space : 6,
			/**
			 * @cfg {String} Specifies the align of scale(default to 'bottom') Available value are:
			 * @Option 'top,'bottom'
			 */
			scaleAlign : 'bottom',
			/**
			 * @cfg {Object} option of rectangle.see <link>iChart.Rectangle</link>
			 */
			rectangle : {}
		});

		this.registerEvent();

		this.rectangles = [];
		this.labels = [];
	},
	doParse : function(d, i, id, x, y, w) {
		var t = (this.get('showpercent') ? iChart.toPercent(d.value / this.total, this.get('decimalsnum')) : d.value);
		if (this.get('tip.enable'))
			this.push('rectangle.tip.text', this.fireString(this, 'parseTipText', [d, d.value, i], d.name + ' ' + t));

		this.push('rectangle.value', t);
		this.push('rectangle.background_color', d.color);

		this.push('rectangle.id', id);
		// this.push('rectangle.originx', x);
	this.push('rectangle.originy', y);
	this.push('rectangle.width', w);

},
	doAnimation : function(t, d) {
		this.coo.draw();
		this.labels.each(function(l, i) {
			l.draw();
		}, this);

		this.rectangles.each(function(r, i) {
			r.push('width', Math.ceil(this.animationArithmetic(t, 0, r.width, d)));
			r.drawRectangle();
		}, this);
	},
	doConfig : function() {
		iChart.Bar.superclass.doConfig.call(this);
		/**
		 * Apply the coordinate feature
		 */
		iChart.Interface.coordinate.call(this);

		if (this.dataType == 'simple') {

			var L = this.data.length, H = this.get('coordinate.height'), bh = this.pushIf('barheight', H / (L * 2 + 1));
			/**
			 * bar's height
			 */
			if (bh * L > H) {
				bh = this.push('barheight', H / (L * 2 + 1));
			}
			/**
			 * the space of two bar
			 */
			this.push('barspace', (H - bh * L) / (L + 1));
		}

		if (this.is3D()) {

		}
		/**
		 * use option create a coordinate
		 */
		this.coo = iChart.Interface.coordinate_.call(this);
		this.pushComponent(this.coo, true);

		/**
		 * Quick config to all rectangle
		 */
		iChart.apply(this.get('rectangle'), iChart.clone(['shadow', 'shadow_color', 'shadow_blur', 'shadow_offsetx', 'shadow_offsety', 'gradient', 'color_factor'], this.options));

		/**
		 * quick config to all rectangle
		 */
		this.push('rectangle.height', bh);
		this.push('rectangle.valueAlign', 'right');
		this.push('rectangle.tipAlign', 'right');
		this.push('rectangle.originx', this.x + this.coo.get('brushsize'));

	}

});// @end
