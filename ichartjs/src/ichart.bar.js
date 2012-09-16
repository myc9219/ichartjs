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
	doParse : function(_,d, i, id, x, y, w) {
		var t = (_.get('showpercent') ? iChart.toPercent(d.value / _.total, _.get('decimalsnum')) : d.value);
		if (_.get('tip.enable'))
			_.push('rectangle.tip.text', _.fireString(_, 'parseTipText', [d, d.value, i], d.name + ' ' + t));
		
		_.set({
			rectangle:{
				id:id,
				name:d.name,
				value:t,
				background_color:d.color,
				originy:y,
				width:w
			}
		});	
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
		
		var _ = this._(),b = 'barheight',z = 'z_index';
		/**
		 * Apply the coordinate feature
		 */
		iChart.Coordinate.coordinate.call(_);
		
		_.rectangles.zIndex = _.get(z);
		
		_.labels.zIndex = _.get(z) + 1;

		if (_.dataType == 'simple') {

			var L = _.data.length, H = _.get('coordinate.height'), bh = _.pushIf(b, H / (L * 2 + 1));
			/**
			 * bar's height
			 */
			if (bh * L > H) {
				bh = _.push(b, H / (L * 2 + 1));
			}
			/**
			 * the space of two bar
			 */
			_.push('barspace', (H - bh * L) / (L + 1));
		}

		if (_.is3D()) {

		}
		/**
		 * use option create a coordinate
		 */
		_.coo = iChart.Coordinate.coordinate_.call(_);
		_.components.push(_.coo);

		/**
		 * Quick config to all rectangle
		 */
		iChart.applyIf(_.get('rectangle'), iChart.clone(_.get('communal_option'), _.options));
		
		/**
		 * quick config to all rectangle
		 */
		_.push('rectangle.height', bh);
		_.push('rectangle.valueAlign', 'right');
		_.push('rectangle.tipAlign', 'right');
		_.push('rectangle.originx', _.x + _.coo.get('brushsize'));

	}

});// @end
