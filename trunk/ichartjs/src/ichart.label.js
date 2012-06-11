/**
 * @overview this component use for abc
 * @component#iChart.Label
 * @extend#iChart.Component
 */
iChart.Label = iChart.extend(iChart.Component, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Label.superclass.configure.apply(this, arguments);

		/**
		 * indicate the legend's type
		 */
		this.type = 'legend';

		this.set({
			/**
			 * @cfg {String} Specifies the text of this label,Normally,this will given by chart.(default to '').
			 */
			text : '',
			/**
			 * @cfg {Number} Specifies the lineheight when text display multiline.(default to 16).
			 */
			line_height : 16,
			/**
			 * @cfg {String} Specifies the shape of legend' sign (default to 'square').Available value are：
			 * @Option 'round'
			 * @Option 'square'
			 */
			sign : 'square',
			/**
			 * @cfg {Number} Specifies the size of legend' sign in pixel.(default to 12)
			 */
			sign_size : 12,
			/**
			 * @cfg {Number} Specifies the size of legend' sign in pixel.(default to 12)
			 */
			padding : 5,
			/**
			 * @cfg {Number} Override the default as 2 in pixel.
			 */
			offsety : 2,
			/**
			 * @cfg {Number} Specifies the space between the sign and text.(default to 5)
			 */
			sign_space : 5,
			/**
			 * @inner {Boolean} 
			 */
			highlight : false,
			/**
			 * @cfg {Number} Override the default as '#efefef'.
			 */
			background_color : '#efefef',
			/**
			 * @cfg {Boolean} If true the text's color will accord with sign's.(default to false)
			 */
			text_with_sign_color : false,
			/**
			 * @cfg {Object} Override the default as border.radius = 2
			 */
			border : {
				radius : 2
			}
		});
		
		/**
		 * this element support boxMode
		 */
		this.atomic = true;
		
		this.registerEvent();

	},
	isEventValid : function(e) {
		return {
			valid : iChart.inRange(this.labelx, this.labelx + this.width, e.offsetX) && iChart.inRange(this.labely, this.labely + this.height, e.offsetY)
		};
	},
	text : function(text) {
		if (text)
			this.push('text', text);
		this.width = this.T.measureText(this.get('text')) + this.get('hpadding') + this.get('sign_size') + this.get('sign_space');
	},
	doDraw : function(opts) {
		opts = opts || {};
		if (opts.invoke) {
			this.updateLcb(opts.invoke);
		}

		/**
		 * when highlight fire
		 */
		if (opts.highlight) {
			this.fireEvent(this, 'highlight');
		}

		/** drawBorder* */
		this.lineFn.call(this);
		this.T.drawBorder(this.labelx, this.labely, this.width, this.height, this.get('border.width'), this.get('border.color'), this.get('border.radius'), this.get('background_color'), false, this.get('shadow'), this.get('shadow_color'), this.get('shadow_blur'), this
				.get('shadow_offsetx'), this.get('shadow_offsety'));

		this.T.textStyle('left', 'top', this.get('fontStyle'));

		var x = this.labelx + this.get('padding_left'), y = this.labely + this.get('padding_top') + this.get('offsety'), ss = this.get('sign_size');

		var textcolor = this.get('color');
		if (this.get('text_with_sign_color')) {
			textcolor = this.get('scolor');
		}
		if (this.get('sign') == 'square') {
			this.T.rectangle(x, y, ss, ss, this.get('scolor'), 1);
		} else {
			this.T.round(x + ss / 2, y + ss / 2, ss / 2, this.get('scolor'), 1);
		}

		this.T.fillText(this.get('text'), x + ss + this.get('sign_space'), y, this.get('textwidth'), textcolor);
	},
	updateLcb : function(L) {
		this.lineFn = L.lineFn;
		var XY = L.labelXY.call(this);
		this.labelx = XY.labelx;
		this.labely = XY.labely;
		this.x = L.origin.x;
		this.y = L.origin.y;
		// console.log(this.x+","+this.y+","+this.labelx+","+this.labely);
	},
	doConfig : function() {
		iChart.Label.superclass.doConfig.call(this);

		this.T.textFont(iChart.getFont(this.get('fontweight'), this.get('fontsize'), this.get('font')));
		this.height = this.get('line_height') + this.get('vpadding');

		this.text();

		var lcb = this.get('lineCB');
		if (lcb) {
			this.updateLcb(lcb);
		}

	}
});// @end
