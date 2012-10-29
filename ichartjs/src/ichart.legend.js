/**
 * @overview this component use for abc
 * @component#iChart.Legend
 * @extend#iChart.Component
 */
iChart.Legend = iChart.extend(iChart.Component, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Legend.superclass.configure.apply(this, arguments);

		/**
		 * indicate the legend's type
		 */
		this.type = 'legend';

		this.set({
			/**
			 * @cfg {Array} Required,The datasource of Legend.Normally,this will given by chart.(default to undefined)
			 */
			data : undefined,
			/**
			 * @cfg {Number} Specifies the width.Note if set to 'auto' will be fit the actual width.(default to 'auto')
			 */
			width : 'auto',
			/**
			 * @cfg {Number/String} Specifies the number of column.(default to 1) Note:If set to 'max',the list will be lie on the property row
			 */
			column : 1,
			/**
			 * @cfg {Number/String} Specifies the number of column.(default to 'max') Note:If set to 'max',the list will be lie on the property column
			 */
			row : 'max',
			/**
			 * @cfg {Number} Specifies the limited width.Normally,this will given by chart.(default to 0)
			 */
			maxwidth : 0,
			/**
			 * @cfg {Number} Specifies the lineheight when text display multiline.(default to 16)
			 */
			line_height : 16,
			/**
			 * @cfg {String} Specifies the shape of legend' sign (default to 'square') Available value are：
			 * @Option 'round'
			 * @Option 'square'
			 * @Option 'round-bar'
			 * @Option 'square-bar'
			 */
			sign : 'square',
			/**
			 * @cfg {Number} the size of legend' sign (default to 12)
			 */
			sign_size : 12,
			/**
			 * @cfg {Number} the distance of legend' sign and text (default to 5)
			 */
			sign_space : 5,
			/**
			 * @cfg {Number} Specifies the space between the sign and text.(default to 5)
			 */
			legend_space : 5,
			
			z_index : 1009,
			/**
			 * @cfg {Boolean} If true the text's color will accord with sign's.(default to false)
			 */
			text_with_sign_color : false,
			/**
			 * @cfg {String} Specifies the horizontal position of the legend in chart.(defaults to 'right').Available value are:
			 * @Option 'left'
			 * @Option 'center' Only applies when valign = 'top|bottom'
			 * @Option 'right'
			 */
			align : 'right',

			/**
			 * @cfg {String} this property specifies the vertical position of the legend in an module (defaults to 'middle'). Available value are:
			 * @Option 'top'
			 * @Option 'middle' Only applies when align = 'left|right'
			 * @Option 'bottom'
			 */
			valign : 'middle'
		});

		/**
		 * this element support boxMode
		 */
		this.atomic = true;

		this.registerEvent(
		/**
		 * @event Fires when parse this element'data.Return text value will override existing.
		 * @paramter iChart.Chart#this
		 * @paramter string#text the text will display
		 * @paramter int#i the index of data
		 * @return string
		 */
		'parse',
		/**
		 * @event Fires after raw was drawed
		 * @paramter iChart.Chart#this
		 * @paramter int#i the index of legend
		 */
		'drawRaw',
		/**
		 * @event Fires after a cell was drawed
		 * @paramter iChart.Chart#this
		 */
		'drawCell');

	},
	isEventValid : function(e,_) {
		var r = {
			valid : false
		};
		if (e.x > this.x && e.x < (_.x + _.width) && e.y > _.y && e.y < (_.y + _.height)) {
			_.data.each(function(d, i) {
				if (e.x > d.x && e.x < (d.x + d.width_ + _.get('signwidth')) && e.y > d.y && e.y < (d.y + _.get('line_height'))) {
					r = {
						valid : true,
						index : i,
						target : d
					}
				}
			}, _);
		}
		return r;
	},
	drawCell : function(x, y, text, color,n) {
		var s = this.get('sign_size'),f = this.getPlugin('sign');
		if(!f||!f.call(this,this.T,n,x + s / 2,y + s / 2,s,color)){
			if (n == 'round') {
				this.T.round(x + s / 2, y + s / 2, s / 2, color);
			} else if (n == 'round-bar') {
				this.T.box(x, y + s * 5 / 12, s, s / 6, 0, color);
				this.T.round(x + s / 2, y + s / 2, s / 4, color);
			} else if (n == 'square-bar') {
				this.T.box(x, y + s * 5 / 12, s, s / 6, 0, color);
				this.T.box(x + s / 4, y + s / 4, s / 2, s / 2, 0, color);
			} else {
				this.T.box(x, y, s, s, 0, color);
			}
		}
		
		var textcolor = this.get('color');

		if (this.get('text_with_sign_color')) {
			textcolor = color;
		}
		this.T.fillText(text, x + this.get('signwidth'), y + s / 2, this.get('textwidth'), textcolor);

	},
	drawRow : function(suffix, x, y) {
		var d;
		for ( var j = 0; j < this.get('column'); j++) {
			d = this.data[suffix];
			if (suffix < this.data.length) {
				this.fireEvent(this, 'drawCell', [this,d]);
				this.drawCell(x, y, d.text, d.color,d.sign || this.get('sign'));
				d.x = x;
				d.y = y;
			}
			x += this.columnwidth[j] + this.get('signwidth') + this.get('legend_space');
			suffix++;
		}
	},
	doDraw : function(_) {
		//_.push('border.radius',5); ??
		_.T.box(_.x, _.y, _.width, _.height, _.get('border'), _.get('f_color'), false, _.get('shadow'));
		_.T.textStyle(_.L, 'middle', iChart.getFont(_.get('fontweight'), _.get('fontsize'), _.get('font')));

		var x = _.x + _.get('padding_left'), y = _.y + _.get('padding_top'), text, c = _.get('column'), r = _.get('row');

		for ( var i = 0; i < r; i++) {
			_.drawRow(i * c, x, y);
			y += _.get('line_height');
			_.fireEvent(_, 'drawRaw', [_, i * c]);
		}
	},
	doConfig : function() {
		iChart.Legend.superclass.doConfig.call(this);
		
		var _ = this._(),ss = _.get('sign_size'), g = _.container;

		_.T.textFont(_.get('fontStyle'));

		_.push('signwidth', (ss + _.get('sign_space')));

		if (_.get('line_height') < ss) {
			_.push('line_height', ss + ss / 5);
		}

		/**
		 * if the position is incompatible,rectify it.
		 */
		if (_.get('align') == _.C && _.get('valign') == 'middle') {
			_.push('valign', _.O);
		}

		/**
		 * if this position incompatible with container,rectify it.
		 */
		if (g.get('align') == _.L) {
			if (_.get('valign') == 'middle') {
				_.push('align', _.R);
			}
		}

		var suffix = 0, maxwidth = w = _.get(_.W), width = 0, wauto = (w == 'auto'), c = iChart.isNumber(_.get('column')), r = iChart.isNumber(_.get('row')), L = _.data.length, d, h;
		
		if (!c && !r)
			c = 1;
		
		if (c && !r)
			_.push('row', Math.ceil(L / _.get('column')));
		if (!c && r)
			_.push('column', Math.ceil(L / _.get('row')));

		c = _.get('column');
		r = _.get('row');

		if (L > r * c) {
			r += Math.ceil((L - r * c) / c);
			_.push('row', r);
		}

		_.columnwidth = new Array(c);

		if (wauto) {
			maxwidth = 0;
		}

		/**
		 * calculate the width each item will used
		 */
		_.data.each(function(d, i) {
			iChart.merge(d, _.fireEvent(_, 'parse', [_, d.name, i]));
			d.text = d.text || d.name;
			d.width_ = _.T.measureText(d.text);
		}, _);

		/**
		 * calculate the each column's width it will used
		 */
		for ( var i = 0; i < c; i++) {
			width = 0;
			suffix = i;
			while (suffix < L) {
				width = Math.max(width, _.data[suffix].width_);
				suffix += c;
			}
			_.columnwidth[i] = width;
			maxwidth += width;
		}

		if (wauto) {
			w = _.push(_.W, maxwidth + _.get('hpadding') + _.get('signwidth') * c + (c - 1) * _.get('legend_space'));
		}

		if (w > _.get('maxwidth')) {
			w = _.push(_.W, _.get('maxwidth'));
		}

		_.push('textwidth', w - _.get('hpadding') - _.get('signwidth'));

		_.width = w;
		_.height = h = _.push(_.H, r * _.get('line_height') + _.get('vpadding'));

		if (_.get('valign') == _.O) {
			_.y = g.get('t_originy');
		} else if (_.get('valign') == _.B) {
			_.y = g.get('b_originy') - h;
		} else {
			_.y = g.get('centery') - h / 2;
		}

		if (_.get('align') == _.L) {
			_.x = g.get('l_originx');
		} else if (_.get('align') == _.C) {
			_.x = g.get('centerx') - _.get('textwidth') / 2;
		} else {
			_.x = g.get('r_originx') - w;
		}

		_.x = _.push(_.X, _.x + _.get('offsetx'));
		_.y = _.push(_.Y, _.y + _.get('offsety'));

	}
});/** @end */
