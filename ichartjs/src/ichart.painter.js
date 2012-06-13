/**
 * @overview The interface this class defined include draw and event,so the sub class has must capability to draw and aware of event.
 * this class is a abstract class,so you should not try to initialize it.
 * @component#iChart.Painter
 * @extend#iChart.Element
 */
iChart.Painter = iChart.extend(iChart.Element, {

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
			 * @cfg {Number} Specifies Horizontal offset(x-axis) in pixel.(default to 0)
			 */
			offsetx : 0,
			/**
			 * @cfg {Number}Specifies Vertical distance (y-axis) in pixel.(default to 0)
			 */
			offsety : 0,
			/**
			 * @cfg {String} Specifies the backgroundColor for this element.(defaults to 'FDFDFD')
			 */
			background_color : '#FEFEFE',
			/**
			 * @cfg {float} Specifies the factor make color dark or light for this element,relative to background-color,the bigger the value you set,the larger the color changed.scope{0.01 - 0.5}.(defaults to '0.15')
			 */
			color_factor : 0.15,
			/**
			 * @cfg {Boolean} True to apply the gradient.(default to false)
			 */
			gradient : false,
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
		this.registerEvent(
		/**
		 * @event Fires after the element initializing is finished this is for test
		 * @paramter iChart.Painter#this
		 */
		'initialize',
		/**
		 * @event Fires when this element is clicked
		 * @paramter iChart.Painter#this
		 * @paramter EventObject#e The click event object
		 * @paramter Object#param The additional parameter
		 */
		'click',
		/**
		 * @event Fires when this element is dblclick
		 * @paramter iChart.Painter#this
		 * @paramter EventObject#e The dblclick event object
		 */
		'dblclick',
		/**
		 * @event Fires when the mouse move on the element
		 * @paramter iChart.Painter#this
		 * @paramter EventObject#e The mousemove event object
		 */
		'mousemove',
		/**
		 * @event Fires when the mouse hovers over the element
		 * @paramter iChart.Painter#this
		 * @paramter EventObject#e The mouseover event object
		 */
		'mouseover',
		/**
		 * @event Fires when the mouse exits the element
		 * @paramter iChart.Painter#this
		 * @paramter EventObject#e The mouseout event object
		 */
		'mouseout',
		/**
		 * @event Fires before the element drawing.Return false from an event handler to stop the draw.
		 * @paramter iChart.Painter#this
		 */
		'beforedraw',
		/**
		 * @event Fires after the element drawing when calling the draw method.
		 * @paramter iChart.Painter#this
		 */
		'draw');

	},
	afterConfiguration : function() {

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
			 * fire the initialize event,this probable use to unit test
			 */
			this.fireEvent(this, 'initialize', [this]);
		}
	},
	is3D : function() {
		return this.dimension == iChart._3D;
	},
	/**
	 * @method The commnd fire to draw the chart use configuration,this is a abstract method.Currently known,both <link>iChart.Chart</link> and <link>iChart.Component</link> implement this method.
	 * @return void
	 */
	draw : function(o) {
		this.init();
		this.draw = function(o){
			/**
			 * fire the beforedraw event
			 */
			if (!this.fireEvent(this, 'beforedraw', [this])) {
				return this;
			}
			/**
			 * execute the commonDraw() that the subClass implement
			 */
			this.commonDraw(o);

			/**
			 * fire the draw event
			 */
			this.fireEvent(this, 'draw', [this]);
		}
		this.draw(o);
	},
	fireString : function(socpe, name, args, s) {
		var t = this.fireEvent(socpe, name, args);
		return iChart.isString(t) ? t : s;
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
	on : function(name, fn) {
		if (iChart.isString(name) && iChart.isFunction(fn))
			if(!this.events[name]){
				console.log(name);
			}
			this.events[name].push(fn);
		return this;
	},
	doConfig : function() {
		var padding = iChart.parsePadding(this.get('padding')), bg = this.get('background_color'), f = this.get('color_factor');
		this.push('padding_top', padding[0]);
		this.push('padding_right', padding[1]);
		this.push('padding_bottom', padding[2]);
		this.push('padding_left', padding[3]);
		this.push('hpadding', padding[1] + padding[3]);
		this.push('vpadding', padding[0] + padding[2]);
		this.push('fontStyle', iChart.getFont(this.get('fontweight'), this.get('fontsize'), this.get('font')));
		this.push('fill_color', bg);
		this.push("light_color", iChart.light(bg, f));
		this.push("dark_color", iChart.dark(bg, f));
		this.push("light_color2", iChart.light(bg, f * 2));
		this.push("dark_color2", iChart.dark(bg, f) * 2);
		this.id = this.get('id');

	}
});//@end
