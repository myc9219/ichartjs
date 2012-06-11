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
			 * @cfg {Object} the option for coordinate
			 */
			coordinate : {},
			/**
			 * @cfg {Number} the width of each bar(default to calculate according to coordinate's height)
			 */
			barheight : undefined,
			/**
			 * @cfg {Number} the distance of column's bottom and text(default to 6)
			 */
			text_space : 6,
			/**
			 * @cfg {String} the align of scale(default to 'bottom') Available value are:
			 * @Option 'top,'bottom'
			 */
			keduAlign : 'bottom',
			/**
			 * @cfg {Object} the option for label
			 * @extend iChart.Chart
			 * @see iChart.Chart#label
			 */
			label : {
				padding : 5
			},
			/**
			 * @cfg {Object} the option for rectangle
			 */
			rectangle : {}
		});

		this.registerEvent();

		this.rectangles = [];
		this.labels = [];
	},
	doParse : function(d, i, id, x, y, w) {
		if (this.get('label.enable'))
			this.push('rectangle.label.text', this.fireString(this, 'parseLabelText', [d, i], d.name + ":" + d.value));
		if (this.get('tip.enable'))
			this.push('rectangle.tip.text', this.fireString(this, 'parseTipText', [d, i], d.name + ":" + d.value));

		this.push('rectangle.value', d.value);
		this.push('rectangle.background_color', d.color);

		this.push('rectangle.id', id);
		//this.push('rectangle.originx', x);
		this.push('rectangle.originy', y);
		this.push('rectangle.width', w);

	},
	doAnimation:function(t,d){
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
		
		if (this.is3D()){
			
		}
		/**
		 * use option create a coordinate
		 */
		this.coo = iChart.Interface.coordinate_.call(this);
		this.pushComponent(this.coo, true);

		/**
		 * Quick config to all rectangle
		 */
		iChart.apply(this.get('rectangle'), iChart.clone(['label', 'tip', 'border'], this.options));
			
		/**
		 * quick config to all rectangle
		 */
		this.push('rectangle.height',bh);
		this.push('rectangle.valueAlign','right');
		this.push('rectangle.tipAlign','right');
		this.push('rectangle.originx',this.x + this.coo.get('brushsize'));
		
		
	}

});// @end
