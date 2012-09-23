/**
 * @overview This is base class of all element.All must extend this so that has ability for configuration
 * this class include some base attribute
 * @component#iChart.Element
 * @extend#Object
 */
iChart.Element = function(config) {
	/**
	 * indicate the element's type
	 */
	this.type = 'element';

	/**
	 * define abstract method
	 */
	iChart.DefineAbstract('configure', this);
	iChart.DefineAbstract('afterConfiguration', this);

	/**
	 * All of the configuration will in this property
	 */
	this.options = {};

	this.set({
		/**
		 * @inner {String} The unique id of this element (defaults to an auto-assigned id).
		 */
		id : '',
		/**
		 * @cfg {Number} Specifies the font size of this element in pixels.(default to 12)
		 */
		fontsize : 12,
		/**
		 * @cfg {String} Specifies the font of this element.(default to 'Verdana')
		 */
		font : 'Verdana',
		/**
		 * @cfg {String} Specifies the font weight of this element.(default to 'normal')
		 */
		fontweight : 'normal',
		/**
		 * @cfg {Object} Specifies the border for this element.
		 * Available property are:
		 * @Option enable {boolean} If enable the border
		 * @Option color {String} the border's color.(default to '#BCBCBC')
		 * @Option style {String} the border's style.(default to 'solid')
		 * @Option width {Number/String} the border's width.If given array,the option radius will be 0.(default to 1)
		 * @Option radius {Number/String} the border's radius.(default to 0)
		 */
		border : {
			enable : false,
			color : '#BCBCBC',
			style : 'solid',
			width : 1,
			radius : 0
		},
		/**
		 * @cfg {Boolean} Specifies whether the element should be show a shadow.In general there will be get a high render speed when apply false.(default to false)
		 */
		shadow : false,
		/**
		 * @cfg {String} Specifies the color of your shadow is.(default to '#666666')
		 */
		shadow_color : '#666666',
		/**
		 * @cfg {Number} Specifies How blur you want your shadow to be.(default to 4)
		 */
		shadow_blur : 4,
		/**
		 * @cfg {Number} Specifies Horizontal distance (x-axis) between the shadow and the shape in pixel.(default to 0)
		 */
		shadow_offsetx : 0,
		/**
		 * @cfg {Number} Specifies Vertical distance (y-axis) between the shadow and the shape in pixel.(default to 0)
		 */
		shadow_offsety : 0
	});

	/**
	 * the running variable cache
	 */
	this.variable = {};
	
	/**
	 * the container of all events
	 */
	this.events = {
		'touchstart':[],
		'touchmove':[],
		'touchend':[]
	};
	
	this.preventEvent = false;
	this.initialization = false;
	
	/**
	 * inititalize configure
	 */
	this.configure.apply(this, Array.prototype.slice.call(arguments, 1));
	
	/**
	 * clone the original config
	 */
	this.default_ = iChart.clone(this.options,true);
	
	/**
	 * megre customize config
	 */
	this.set(config);

	this.afterConfiguration();
}

iChart.Element.prototype = {
	_:function(){return this},	
	getPlugin:function(n){
		return this.constructor.plugin_[n];
	},
	set : function(c) {
		if (iChart.isObject(c))
			iChart.merge(this.options, c);
	},
	pushIf : function(name, value) {
		if (!iChart.isDefined(this.get(name))) {
			return this.push(name, value);
		}
		return this.get(name);
	},
	/**
	 * average write speed about 0.013ms
	 */
	push : function(name, value) {
		var A = name.split("."), V = this.options;
		for (i = 0; i < A.length - 1; i++) {
			if (!V[A[i]])
				V[A[i]] = {};
			V = V[A[i]];
		}
		V[A[A.length - 1]] = value;
		return value;
	},
	/**
	 * average read speed about 0.005ms
	 */
	get : function(name) {
		var A = name.split("."), V = this.options[A[0]];
		for (i = 1; i < A.length; i++) {
			if (!V)
				return null;
			V = V[A[i]];
		}
		return V;
	}
}//@end
