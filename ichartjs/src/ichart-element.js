/**
 * @overview this is base class of all component.All must extend this so that has ability for configuration
 * @component#iChart.Element
 * @extend#Object
 */
iChart.Element = function(config){
	/**
	 * indicate the element's type
	 */
	this.type = 'element';
	
	/**
	 * define abstract method
	 */
	iChart.DefineAbstract('configure',this);
	
	/**
	 * All of the configuration will in this property
	 */
	this.configurations = {};
	
	
	this.configuration({
		 /**
		  * @cfg {String} The unique id of this module (defaults to an auto-assigned id). 
		  */
		 id:'',
		 /**
		  * @cfg {Number} Specifies the font size of this component in pixels.(default to 12)
		  */
		 fontsize:12,
		 /**
		  * @cfg {String} Specifies the font of this component.(default to 'Verdana')
		  */
 		 font:'Verdana',
 		/**
		  * @cfg {String} Specifies the font weight of this component.(default to 'normal')
		  */
 		 fontweight:'normal',
		 /**
		  * @cfg {Object} Specifies the border for this component
		  */
		 border:{
			enable:false,
			color:'#BCBCBC',
			style:'solid',
			width:1,
			radius:5
		 },
		 /**
		  *@cfg {Boolean} Specifies whether the component should be show a shadow.(default to false)
		 */
		 shadow:false,
		 /**
		  *@cfg {String} Specifies the color of your shadow is.(default to '#666666')
		 */
		 shadow_color:'#666666',
		 /**
		  *@cfg {Number} How blur you want your shadow to be.(default to 4)
		 */
		 shadow_blur:4,
		 /**
		  *@cfg {Number} Horizontal distance (x-axis) between the shadow and the shape in pixel.(default to 0)
		 */
		 shadow_offsetx:0,
		 /**
		  *@cfg {Number} Vertical distance (y-axis) between the shadow and the shape in pixel.(default to 0)
		 */
		 shadow_offsety:0,
		 /**
		  * @inner {Boolean} inner use 
		  */
		 debug:false
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
	
	this._default_c = config || {};//if use this._default_c may be need to clone config
	
	/**
	 * inititalize configure
	 */
	this.configure.apply(this,Array.prototype.slice.call(arguments,1));
	
	/**
	 * megre customize config
	 */
	this.configuration(this._default_c);
	
	this.afterConfiguration();
}

iChart.Element.prototype = {
	configuration:function(C){
		if(iChart.isObject(C)){
			iChart.merge(this.configurations,C);
		}
	},
	afterConfiguration:function(){},
    /**
     * average write speed about 0.013ms
     */
    push:function(name, value)
    {
		var A = name.split("."),V = this.configurations;
		for(i=0;i<A.length-1;i++){
			if(!V[A[i]])V[A[i]] = {};V = V[A[i]];
		}
		V[A[A.length-1]] = value;
		return value;
    },
    /**
     * average read speed about 0.005ms
     */
    get:function(name)
    {
        var A = name.split("."),V = this.configurations[A[0]];
		for(i=1;i<A.length;i++){
			if(!V)
		        return null;
			V = V[A[i]];
		}
		return V;
    }
}
