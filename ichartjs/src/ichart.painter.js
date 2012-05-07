/**
 * 
 * @overview this element use for 画图的基类、其他组件要继承此组件
 * @component#iChart.Painter
 * @extend#iChart.Element
 */
iChart.Painter = iChart.extend(iChart.Element,{

	configure : function() {
		/**
		 * indicate the element's type
		 */
		this.type = 'painter';

		this.dimension = iChart._2D;

		/**
		 * define abstract method
		 */
		iChart.DefineAbstract('commonDraw', this);
		iChart.DefineAbstract('initialize', this);

		this.set({
			/**
			 * @cfg {Number} Specifies the default linewidth of the canvas's context in this element.(defaults to 1)
			 */
			brushsize : 1,
			/**
			 * @cfg {String} Specifies the default strokeStyle of the canvas's context in this element.(defaults to 'gray')
			 */
			strokeStyle : 'gray',
			/**
			 * @cfg {String} Specifies the default lineJoin of the canvas's context in this element.(defaults to 'round')
			 */
			lineJoin : 'round',
			/**
			 * @cfg {Number} Specifies the padding for this element in pixel,the same rule as css padding.(defaults to 10)
			 */
			padding : 10,
			/**
			 * @cfg {String} Specifies the color for this element.(defaults to 'black')
			 */
			color : 'black',
			/**
			 * @cfg {Number} Horizontal offset(x-axis) in pixel.(default to 0)
			 */
			offsetx : 0,
			/**
			 * @cfg {Number}Vertical distance (y-axis) in pixel.(default to 0)
			 */
			offsety : 0,
			/**
			 * @cfg {String} Specifies the backgroundColor for this element.(defaults to 'FDFDFD')
			 */
			background_color : '#FDFDFD',
			/**
			 * @cfg {float} The factor make color dark or light for this element.(0.01 - 0.5).(defaults to '0.15')
			 */
			color_factor : 0.15,
			/**
			 * @cfg {String} ('2d','3d')
			 */
			style : '',
			/**
			 * @cfg {Object} Here,specify as true by default
			 */
			border : {
				enable : true
			},
			/**
			 * @cfg {Object} A config object containing one or more event handlers.(default to null)
			 */
			listeners : null,
			/**
			 * @inner {Number} inner use
			 */
			originx : 0,
			/**
			 * @inner {Number} inner use
			 */
			originy : 0
		});

		this.variable.event = {
			mouseover : false
		};

		/**
		 * register the common event
		 */
		this.registerEvent('initialize', 'click', 'dbclick', 'mousemove',
				'mouseover', 'mouseout', 'keydown', 'beforedraw', 'draw');

	},
	registerEvent : function() {
		for ( var i = 0; i < arguments.length; i++) {
			this.events[arguments[i]] = [];
		}
	},
	init : function() {
		if (!this.initialization) {
			/**
			 * register event
			 */
			if (iChart.isObject(this.get('listeners'))) {
				for ( var e in this.get('listeners')) {
					this.on(e, this.get('listeners')[e]);
				}
			}

			this.initialize();
			/**
			 * fire the afterConfig event,this most use to unit test
			 */
			this.fireEvent(this, 'initialize');
		}
	},
	is3D : function() {
		return this.dimension == iChart._3D;
	},
	draw : function(opts) {
		this.init();
		/**
		 * fire the beforedraw event
		 */
		if (!this.fireEvent(this, 'beforedraw')) {
			return this;
		}
		/**
		 * execute the commonDraw() that the subClass implement
		 */
		this.commonDraw(opts);

		/**
		 * fire the draw event
		 */
		this.fireEvent(this, 'draw');
	},
	fireString : function(socpe, name, args,s) {
		var t = this.fireEvent(socpe, name, args);
		return iChart.isString(t)?t:s;
	},
	fireEvent : function(socpe, name, args) {
		var L = this.events[name].length;
		if (L == 1)
			return this.events[name][0].apply(socpe, args);
		var r = true;
		for ( var i = 0; i < L; i++) {
			r = this.events[name][i].apply(socpe, args);
		}
		return r;
	},
	on:function(name, fn) {
		if (iChart.isString(name) && iChart.isFunction(fn))
			this.events[name].push(fn);
		return this;
	},
	doConfig : function() {
		var padding = iChart.parsePadding(this.get('padding'));
		this.push('padding_top', padding[0]);
		this.push('padding_right', padding[1]);
		this.push('padding_bottom', padding[2]);
		this.push('padding_left', padding[3]);
		this.push('hpadding', padding[1] + padding[3]);
		this.push('vpadding', padding[0] + padding[2]);

		this.push('fontStyle', iChart.getFont(this.get('fontweight'), this
				.get('fontsize'), this.get('font')));

		this.push('fill_color', this.get('background_color'));
		this.push("light_color", iChart.light(
				this.get('background_color'), this.get('color_factor')));
		this.push("dark_color", iChart.dark(this.get('background_color'),
				this.get('color_factor')));

		this.push("light_color2", iChart.light(this
				.get('background_color'), this.get('color_factor') * 2));
		this.push("dark_color2", iChart.dark(this.get('background_color'),
				this.get('color_factor')) * 2);

		this.id = this.get('id');

	},
	shadowOn : function() {
		this.T.shadowOn(this.get('shadow'), this.get('shadow_color'), this
				.get('shadow_blur'), this.get('shadow_offsetx'), this
				.get('shadow_offsety'));
	},
	shadowOff : function() {
		this.T.shadowOff();
	}
});
