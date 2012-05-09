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
			data : undefined,
			width : 'auto',
			column : 1,
			row : 'max',
			maxwidth : 0,
			line_height : 16,
			/**
			 * @cfg {String} the shape of legend' sign (default to 'square') The
			 *      following list provides all available value you can use：
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
			 * @cfg {Number} the distance of legend' sign and text (default to
			 *      5)
			 */
			sign_space : 5,
			legendspace : 5,
			text_with_sign_color : false,
			/**
			 * @cfg {String} this property specifies the horizontal position of
			 *      the legend in an module (defaults to 'right') The following
			 *      list provides all available value you can use：
			 * @Option 'left'
			 * @Option 'center' Only applies when valign = 'top|bottom'
			 * @Option 'right'
			 */
			align : 'right',

			/**
			 * @cfg {String} this property specifies the vertical position of
			 *      the legend in an module (defaults to 'middle') Available
			 *      value are:
			 * @Option 'top'
			 * @Option 'middle' Only applies when align = 'left|right'
			 * @Option 'bottom'
			 */
			valign : 'middle'
		});

		this.registerEvent('drawCell', 'parse', 'drawRaw');

	},
	drawCell : function(x, y, text, color) {
		var s = this.get('sign_size'), n = this.get('sign');
		if (n == 'round') {
			this.T.round(x + s / 2, y + s / 2, s / 2, color);
		} else if (n == 'round-bar') {
			this.T.rectangle(x, y + s * 5 / 12, s, s / 6, color);
			this.T.round(x + s / 2, y + s / 2, s / 4, color);
		} else if (n == 'square-bar') {
			this.T.rectangle(x, y + s * 5 / 12, s, s / 6, color);
			this.T.rectangle(x + s / 4, y + s / 4, s / 2, s / 2, color);
		} else {
			this.T.rectangle(x, y, s, s, color);
		}
		var textcolor = this.get('color');

		if (this.get('text_with_sign_color')) {
			textcolor = color;
		}
		this.T.fillText(text, x + this.get('signwidth'), y + s / 2, this.get('textwidth'), textcolor);

		this.fireEvent(this, 'drawCell', [x, y, text, color]);
	},
	drawRow : function(suffix, x, y) {
		var d;
		for ( var j = 0; j < this.get('column'); j++) {
			d = this.data[suffix];
			if (suffix < this.data.length) {
				this.fireEvent(this, 'drawCell', [d]);
				this.drawCell(x, y, d.text, d.color);
				d.x = x;
				d.y = y;
			}
			x += this.columnwidth[j] + this.get('signwidth') + this.get('legendspace');
			suffix++;
		}
	},
	isEventValid : function(e) {
		if (e.offsetX > this.x && e.offsetX < (this.x + this.width) && e.offsetY > this.y && e.offsetY < (this.y + this.height)) {
			for ( var i = 0; i < this.data.length; i++) {
				if (e.offsetX > this.data[i].x && e.offsetX < (this.data[i].x + this.data[i].width + this.get('signwidth')) && e.offsetY > this.data[i].y
						&& e.offsetY < (this.data[i].y + this.get('line_height'))) {
					return {
						valid : true,
						value : i,
						target : this.data[i]
					};
				}
			}
		}
		return {
			valid : false
		};
	},
	doDraw : function() {
		if (this.get('border.enable'))
			this.T.drawBorder(this.x, this.y, this.width, this.height, this.get('border.width'), this.get('border.color'), this.get('border.radius'), this.get('fill_color'),
					false, this.get('shadow'), this.get('shadow_color'), this.get('shadow_blur'), this.get('shadow_offsetx'), this.get('shadow_offsety'));
		
		this.T.textStyle('left', 'middle', iChart.getFont(this.get('fontweight'), this.get('fontsize'), this.get('font')));
		
		var x = this.x + this.get('padding_left'), y = this.y + this.get('padding_top'), text, c = this.get('column'), r = this.get('row');
		
		for ( var i = 0; i < r; i++) {
			this.fireEvent(this, 'drawRaw', [i * c]);
			this.drawRow(i * c, x, y);
			y += this.get('line_height');
		}

	},
	doConfig : function() {
		iChart.Legend.superclass.doConfig.call(this);
		iChart.Assert.isNotEmpty(this.get('data'), this.type + '[data]');

		var suffix = 0, maxwidth = w = this.get('width'), width = 0, wauto = (w == 'auto'), ss = this.get('sign_size'), c = iChart.isNumber(this.get('column')), r = iChart
				.isNumber(this.get('row')), L = this.data.length, d,h,g=this.container;

		this.push('signwidth', (ss + this.get('sign_space')));

		if (this.get('line_height') < ss) {
			this.push('line_height', ss + ss / 5);
		}

		if (!c && !r)
			c = 1;
		if (c && !r)
			this.push('row', Math.ceil(L / this.get('column')));
		if (!c && r)
			this.push('column', Math.ceil(L / this.get('row')));

		c = this.get('column');
		r = this.get('row');

		this.columnwidth = new Array(c);

		if (wauto) {
			this.T.textFont(this.get('fontStyle'));
			maxwidth = 0;// 行最大宽度
		}

		// calculate the width each item will used
		for ( var i = 0; i < L; i++) {
			d = this.data[i];
			iChart.merge(d, this.fireEvent(this, 'parse', [d, i]));
			d.text = d.text || d.name;
			d.width = this.T.measureText(d.text);
		}

		// calculate the each column's width it will used
		for ( var i = 0; i < c; i++) {
			width = 0;// 初始化宽度
			suffix = i;
			while (suffix < L) {
				width = Math.max(width, this.data[suffix].width);
				suffix += c;
			}
			this.columnwidth[i] = width;
			maxwidth += width;
		}

		if (wauto) {
			w = this.push('width', maxwidth + this.get('hpadding') + this.get('signwidth') * c + (c - 1) * this.get('legendspace'));
		}

		if (w > this.get('maxwidth')) {
			w = this.push('width', this.get('maxwidth'));
		}

		this.push('textwidth', w - this.get('hpadding') - this.get('signwidth'));

		this.width = w;
		this.height = h = this.push('height', r * this.get('line_height') + this.get('vpadding'));
		
		// if the position is incompatible,rectify it.
		if (this.get('align') == 'center' && this.get('valign') == 'middle') {
			this.push('valign', 'top');
		}

		// if this position incompatible with container,rectify it.
		if (g.get('align') == 'left') {
			if (this.get('valign') == 'middle') {
				this.push('align', 'right');
			}
		}
		
		if (this.get('valign') == 'top') {
			this.y = g.get('t_originy');
		} else if (this.get('valign') == 'bottom') {
			this.y = g.get('b_originy') - h;
		} else {
			this.y = g.get('centery') - h / 2;
		}
		
		if (this.get('align') == 'left') {
			this.x = g.get('l_originx');
		} else if (this.get('align') == 'center') {
			this.x= g.get('centerx') - this.get('textwidth') / 2;
		} else {
			this.x = g.get('r_originx') - w;
		}

		this.x = this.push('originx', this.x + this.get('offsetx'));
		this.y = this.push('originy', this.y + this.get('offsety'));
		
	}
});