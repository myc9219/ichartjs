/**
 * @overview This is base class of all element.All must extend this so that has ability for configuration
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
		 * @cfg {Object} Specifies the border for this element
		 */
		border : {
			enable : false,
			color : '#BCBCBC',
			style : 'solid',
			width : 1,
			radius : 5
		},
		/**
		 * @cfg {Boolean} Specifies whether the element should be show a shadow.(default to false)
		 */
		shadow : false,
		/**
		 * @cfg {String} Specifies the color of your shadow is.(default to '#666666')
		 */
		shadow_color : '#666666',
		/**
		 * @cfg {Number} How blur you want your shadow to be.(default to 4)
		 */
		shadow_blur : 4,
		/**
		 * @cfg {Number} Horizontal distance (x-axis) between the shadow and the shape in pixel.(default to 0)
		 */
		shadow_offsetx : 0,
		/**
		 * @cfg {Number} Vertical distance (y-axis) between the shadow and the shape in pixel.(default to 0)
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
	this.events = {};
	this.preventEvent = false;
	this.initialization = false;

	
	//this.registerEvent();
	/**
	 * inititalize configure
	 */
	this.configure.apply(this, Array.prototype.slice.call(arguments, 1));

	/**
	 * megre customize config
	 */
	this.set(config);

	this.afterConfiguration();
}

iChart.Element.prototype = {
	set : function(c) {
		if (iChart.isObject(c))
			iChart.merge(this.options, c);
	},
	pushIf : function(name, value) {
		if (!this.get(name)) {
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
}
