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
	drawCell : function(x, y, text, color) {
		var s = this.get('sign_size'), n = this.get('sign');
		if (n == 'round') {
			this.T.round(x + s / 2, y + s / 2, s / 2, color);
		} else if (n == 'round-bar') {
			this.T.drawBox(x, y + s * 5 / 12, s, s / 6,0, color);
			this.T.round(x + s / 2, y + s / 2, s / 4, color);
		} else if (n == 'square-bar') {
			this.T.drawBox(x, y + s * 5 / 12, s, s / 6, 0,color);
			this.T.drawBox(x + s / 4, y + s / 4, s / 2, s / 2, 0,color);
		} else {
			this.T.drawBox(x, y, s, s, 0,color);
		}
		var textcolor = this.get('color');

		if (this.get('text_with_sign_color')) {
			textcolor = color;
		}
		this.T.fillText(text, x + this.get('signwidth'), y + s / 2, this.get('textwidth'), textcolor);

		this.fireEvent(this, 'drawCell', [this]);
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
			x += this.columnwidth[j] + this.get('signwidth') + this.get('legend_space');
			suffix++;
		}
	},
	isEventValid : function(e) {
		var r = {
			valid : false
		};
		if (e.offsetX > this.x && e.offsetX < (this.x + this.width) && e.offsetY > this.y && e.offsetY < (this.y + this.height)) {
			this.data.each(function(d, i) {
				if (e.offsetX > d.x && e.offsetX < (d.x + d.width + this.get('signwidth')) && e.offsetY > d.y && e.offsetY < (d.y + this.get('line_height'))) {
					r = {
						valid : true,
						index : i,
						target : d
					}
				}
			}, this);
		}
		return r;
	},
	doDraw : function() {
		this.T.drawBox(this.x, this.y, this.width, this.height, this.get('border'), this.get('f_color'), false, this.get('shadow'), this.get('shadow_color'), this.get('shadow_blur'), this.get('shadow_offsetx'), this.get('shadow_offsety'));
		
		this.T.textStyle('left', 'middle', iChart.getFont(this.get('fontweight'), this.get('fontsize'), this.get('font')));

		var x = this.x + this.get('padding_left'), y = this.y + this.get('padding_top'), text, c = this.get('column'), r = this.get('row');

		for ( var i = 0; i < r; i++) {
			this.drawRow(i * c, x, y);
			y += this.get('line_height');
			this.fireEvent(this, 'drawRaw', [this, i * c]);
		}
	},
	calculate : function(data, D) {
		this.data = data;

		var suffix = 0, maxwidth = w = this.get('width'), width = 0, wauto = (w == 'auto'), c = iChart.isNumber(this.get('column')), r = iChart.isNumber(this.get('row')), L = this.data.length, d, h, g = this.container;

		if (!c && !r)
			c = 1;

		if (c && !r)
			this.push('row', Math.ceil(L / this.get('column')));
		if (!c && r)
			this.push('column', Math.ceil(L / this.get('row')));

		c = this.get('column');
		r = this.get('row');

		if (L > r * c) {
			r += Math.ceil((L - r * c) / c);
			this.push('row', r);
		}

		this.columnwidth = new Array(c);

		if (wauto) {
			maxwidth = 0;// 行最大宽度
}

// calculate the width each item will used
D.each(function(d, i) {
	iChart.merge(d, this.fireEvent(this, 'parse', [this, d.name, i]));
	d.text = d.text || d.name;
	d.width = this.T.measureText(d.text);
}, this);

// calculate the each column's width it will used
for ( var i = 0; i < c; i++) {
	width = 0;
	suffix = i;
	while (suffix < L) {
		width = Math.max(width, this.data[suffix].width);
		suffix += c;
	}
	this.columnwidth[i] = width;
	maxwidth += width;
}

if (wauto) {
	w = this.push('width', maxwidth + this.get('hpadding') + this.get('signwidth') * c + (c - 1) * this.get('legend_space'));
}

if (w > this.get('maxwidth')) {
	w = this.push('width', this.get('maxwidth'));
}

this.push('textwidth', w - this.get('hpadding') - this.get('signwidth'));

this.width = w;
this.height = h = this.push('height', r * this.get('line_height') + this.get('vpadding'));

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
	this.x = g.get('centerx') - this.get('textwidth') / 2;
} else {
	this.x = g.get('r_originx') - w;
}

this.x = this.push('originx', this.x + this.get('offsetx'));
this.y = this.push('originy', this.y + this.get('offsety'));
},
	doConfig : function() {
		iChart.Legend.superclass.doConfig.call(this);
		iChart.Assert.isNotEmpty(this.get('data'), this.type + '[data]');

		var ss = this.get('sign_size'), g = this.container;

		this.T.textFont(this.get('fontStyle'));

		this.push('signwidth', (ss + this.get('sign_space')));

		if (this.get('line_height') < ss) {
			this.push('line_height', ss + ss / 5);
		}

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

		this.calculate(this.data, this.data);

	}
});// @end
