/**
 * @overview this class is abstract,use for config column
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
			/**
			 * @cfg {<link>iChart.Coordinate2D</link>} the option for coordinate.
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
			 * @cfg {<link>iChart.Rectangle</link>} Specifies option of rectangle.
			 */
			sub_option : {},
			/**
			 * @cfg {<link>iChart.Text</link>} Specifies option of label at bottom.
			 */
			label:{}
		});

		this.registerEvent();

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
	doLabel:function(id,text,x, y){
		this.labels.push(new iChart.Text(iChart.apply(this.get('label'),{
			id : id,
			text : text,
			originx : x,
			originy : y
		}), this));
	},
	doParse : function(_,d, i, o) {
		_.doActing(_,d,o,i);
	},
	doConfig : function() {
		iChart.Column.superclass.doConfig.call(this);
		
		var _ = this._(),c = 'colwidth',z = 'z_index';
		
		_.rectangles = [];
		_.labels = [];
		
		_.components.push(_.labels);
		_.components.push(_.rectangles);
		
		/**
		 * apply the coordinate feature
		 */
		iChart.Coordinate.coordinate.call(_);
		
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
		_.coo = iChart.Coordinate.coordinate_.call(_);

		_.components.push(_.coo);
		
		_.push('sub_option.width', _.get(c));
	}

});
/**
 * @end
 */