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
			 * @cfg {Number} Specifies the thickness of line in pixel.(default to 1).
			 */
			line_thickness:1,
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
			 * @cfg {Number} Override the default as 5 in pixel.
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
			valid : iChart.inRange(this.labelx,this.labelx + this.get('width'), e.offsetX) && iChart.inRange(this.labely, this.labely + this.get('height'), e.offsetY)
		};
	},
	text : function(text) {
		if (text)
			this.push('text', text);
		this.push('width',this.T.measureText(this.get('text')) + this.get('hpadding') + this.get('sign_size') + this.get('sign_space'));
	},
	localizer:function(){
		var Q =  this.get('quadrantd');
		this.labelx = (Q>=2&&Q<=3)?(this.get('labelx') - this.get('width')):this.get('labelx');
        this.labely = Q>=3?(this.get('labely') - this.get('height')):this.get('labely');
	},
	doDraw : function() {
		this.localizer();
		
		var p = this.get('line_potins'),ss = this.get('sign_size'),
		x = this.labelx + this.get('padding_left'),
		y = this.labely +this.get('padding_top');
		
		this.T.lines(p,this.get('line_thickness'), this.get('border.color'),this.get('line_globalComposite'));
		
		this.T.drawBorder(this.labelx, this.labely, this.get('width'), this.get('height'), this.get('border.width'), this.get('border.color'), this.get('border.radius'), this.get('background_color'), false, this.get('shadow'), this.get('shadow_color'), this.get('shadow_blur'), this.get('shadow_offsetx'), this.get('shadow_offsety'));
		
		this.T.textStyle('left', 'top', this.get('fontStyle'));
		
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
	doConfig : function() {
		iChart.Label.superclass.doConfig.call(this);

		this.T.textFont(iChart.getFont(this.get('fontweight'), this.get('fontsize'), this.get('font')));
		
		this.push('height',this.get('line_height') + this.get('vpadding'));

		this.text();
		
		this.localizer();
		

	}
});// @end
