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
		this.type = 'label';

		this.set({
			/**
			 * @cfg {String} Specifies the text of this label,Normally,this will given by chart.(default to '').
			 */
			text : '',
			/**
			 * @cfg {Number} Specifies the lineheight when text display multiline.(default to 12).
			 */
			line_height : 12,
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
			 * @cfg {Number} Override the default as 2 in pixel.
			 */
			padding : '2 5',
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
			text_with_sign_color : false
		});

		/**
		 * this element support boxMode
		 */
		this.atomic = true;

		this.registerEvent();

	},
	isEventValid : function(e) {
		return {
			valid : iChart.inRange(this.labelx,this.labelx + this.get('width'), e.x) && iChart.inRange(this.labely, this.labely + this.get('height'), e.y)
		};
	},
	text : function(text) {
		if (text)
			this.push('text', text);
		this.push('width',this.T.measureText(this.get('text')) + this.get('hpadding') + this.get('sign_size') + this.get('sign_space'));
	},
	localizer:function(){
		var Q =  this.get('quadrantd');
		this.labelx = (Q>=1&&Q<=2)?(this.get('labelx') - this.get('width')):this.get('labelx');
        this.labely = Q>=2?(this.get('labely') - this.get('height')):this.get('labely');
	},
	doLayout:function(x,y){
		var _ = this._();
		_.push('labelx',_.get('labelx')+x);
		_.push('labely',_.get('labely')+y);
		_.get('line_potins').each(function(p){
			p.x +=x;
			p.y +=y;
		},_);
	},
	doDraw : function() {
		var _ = this._();
		
		_.localizer();
		
		var p = _.get('line_potins'),ss = _.get('sign_size'),
		x = _.labelx + _.get('padding_left'),
		y = _.labely +_.get('padding_top');
		
		_.T.lineArray(p,_.get('line_thickness'), _.get('border.color'));
		_.T.box(_.labelx, _.labely, _.get('width'), _.get('height'), _.get('border'), _.get('f_color'), false, _.get('shadow'), _.get('shadow_color'), _.get('shadow_blur'), _.get('shadow_offsetx'), _.get('shadow_offsety'));
		
		_.T.textStyle('left', 'top', _.get('fontStyle'));
		
		var textcolor = _.get('color');
		if (_.get('text_with_sign_color')) {
			textcolor = _.get('scolor');
		}
		if (_.get('sign') == 'square') {
			_.T.box(x, y, ss, ss,0,_.get('scolor'));
		} else {
			_.T.round(x + ss / 2, y + ss / 2, ss / 2, _.get('scolor'));
		}
		_.T.fillText(_.get('text'), x + ss + _.get('sign_space'), y, _.get('textwidth'), textcolor);
	},
	doConfig : function() {
		iChart.Label.superclass.doConfig.call(this);
		var _ = this._();
		_.T.textFont(iChart.getFont(_.get('fontweight'), _.get('fontsize'), _.get('font')));
		
		if(_.get('fontsize')>_.get('line_height')){
			_.push('line_height',_.get('fontsize'));
		}
		
		_.push('height',_.get('line_height') + _.get('vpadding'));
		
		_.text();
		
		_.localizer();
		

	}
});
/**
 * @end
 */
