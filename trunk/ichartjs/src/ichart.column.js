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
			 * @cfg {Object} the option for coordinate. see <link>iChart.Coordinate2D</link>
			 */
			coordinate : {},
			/**
			 * @cfg {Number} the width of each column(default to calculate according to coordinate's width)
			 */
			colwidth : undefined,
			/**
			 * @cfg {Number} the distance of column's bottom and text(default to 6)
			 */
			text_space : 6,
			/**
			 * @cfg {String} the align of scale(default to 'left') Available value are:
			 * @Option 'left'
			 * @Option 'right'
			 */
			scaleAlign : 'left',
			/**
			 * @cfg {Object} option of rectangle.see <link>iChart.Rectangle</link>
			 */
			rectangle : {}
		});

		this.registerEvent();

		this.rectangles = [];
		this.labels = [];
		this.labels.ignore = true;
	},
	doAnimation : function(t, d) {
		var _ = this._(), h;
		_.coo.draw();
		_.labels.each(function(l){
			l.draw();
		});
		_.rectangles.each(function(r){
			h = Math.ceil(_.animationArithmetic(t, 0, r.height, d));
			r.push('originy', r.y + (r.height - h));
			r.push('height', h);
			r.drawRectangle();
		});
	},
	/**
	 * @method Returns the coordinate of this element.
	 * @return iChart.Coordinate2D
	 */
	getCoordinate:function(){
		return this.coo;
	},
	doParse : function(_,d, i, id, x, y, h) {
		var t = (_.get('showpercent') ? iChart.toPercent(d.value / _.total, _.get('decimalsnum')) : d.value);
		if (_.get('tip.enable'))
			_.push('rectangle.tip.text', _.fireString(_, 'parseTipText', [d,d.value,i],d.name + ' '+t));
		_.set({
			rectangle:{
				id:id,
				name:d.name,
				value:t,
				background_color:d.color,
				originx:x,
				originy:y,
				height:h
			}
		});	
	},
	doConfig : function() {
		iChart.Column.superclass.doConfig.call(this);
		
		var _ = this._(),c = 'colwidth',z = 'z_index';
		/**
		 * apply the coordinate feature
		 */
		iChart.Interface.coordinate.call(_);
		
		_.rectangles.zIndex = _.get(z);
		
		_.labels.zIndex = _.get(z) + 1;
		
		
		if (_.dataType == 'simple') {
			var L = _.data.length, W = _.get('coordinate.width'), hw = _.pushIf(c, W / (L * 2 + 1));

			if (hw * L > W) {
				hw = _.push(c, W / (L * 2 + 1));
			}
			
			/**
			 * the space of two column
			 */
			_.push('hispace', (W - hw * L) / (L + 1));

		}

		if (_.is3D()) {
			_.push('zHeight', _.get(c) * _.get('zScale'));
		}
		
		/**
		 * use option create a coordinate
		 */
		_.coo = iChart.Interface.coordinate_.call(_);

		_.components.push(_.coo);
		
		/**
		 * quick config to all rectangle
		 */
		iChart.applyIf(_.get('rectangle'), iChart.clone(_.get('communal_option'), _.options));
		
		_.push('rectangle.width', _.get(c));
	}

});// @end
