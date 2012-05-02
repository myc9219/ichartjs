/**
 * This file is base class of the iChart - use for
 * 画图的基类、其他组件要继承此组件
 * 
 * @overview this component use for abc
 * @component#iChart.Painter
 * @extend#Object
 */
iChart.Painter = function(config){
	
	/**
	 * indicate the module's type
	 */
	this.type = 'painter';
	
	this.dimension = iChart.Math._2D;
	/**
	 * define interface method
	 */
	iChart.DefineAbstract('configure',this);
	iChart.DefineAbstract('commonDraw',this);
	iChart.DefineAbstract('initialize',this);
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
		  * @cfg {Number} the main linewidth of the graph in an module (defaults to 1)
		  */
		 brushsize:1,
		 strokeStyle:'gray',
		 lineJoin:'round',
		 fontsize:12,
 		 font:'Verdana',
 		 fontweight:'normal',
 		 /**
		  * @cfg {Number} the padding for this canvas,the same rule as css padding
		  */
 		 padding:10,
		 originx:0,
		 originy:0,
 		 color:'black',
 		 offsetx:0,
		 offsety:0,
		 /**
		  * @cfg {Object} the config for this border 
		  */
		 border:{
			enable:true,
			color:'#BCBCBC',
			width:1,
			style:'',
			radius:5
		 },
		 background_color:'#fDfDfD',
		 /**
		  * @cfg {float}  (0.01 - 0.5)
		  */
		 color_factor:0.15,
		 /**
		 *@cfg {String} ('2d','3d')
		 */
		 style:'',
		 /**
		  *@cfg {Boolean} 是否阴影效果
		 */
		 shadow:false,
		 /**
		  *@cfg {String} 
		 */
		 shadow_color:'#666666',
		 /**
		  *@cfg {Number} 
		 */
		 shadow_blur:4,
		 /**
		  *@cfg {Number} 
		 */
		 shadow_offsetx:0,
		 /**
		  *@cfg {Number} 
		 */
		 shadow_offsety:0,
		 debug:false,
		 listeners:null
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
	
	this.variable.event = {
		mouseover:false
	};
	/**
	 * register the common event
	 */
	this.registerEvent(
		'initialize',
		'click',
		'dbclick',
		'mousemove',
		'mouseover',
		'mouseout',
		'keydown',
		'beforedraw',
		'draw'
	);
	
	this._default_c = config || {};//if use this._default_c may be need to clone config
	
	/**
	 * 初始化配置、事件注册
	 * @memberOf {Painter} 
	 */
	this.configure.apply(this,Array.prototype.slice.call(arguments,1));
	
	/**
	 * 与自定义参数进行整合
	 * @memberOf {Painter} 
	 */
	this.configuration(this._default_c);
	
	/**
	 * register event
	 */
	if(iChart.isObject(this.get('listeners'))){
		for(var e in this.get('listeners')){
			this.on(e,this.get('listeners')[e]);
		}
	}
	this.initialization = false;
	
	
	if(this.autoInitialized){
		this.init();
	}
	
}

iChart.Painter.prototype = {
	registerEvent:function(){
		for(var i =0;i<arguments.length;i++){
			this.events[arguments[i]] = [];
			//console.log(this.type+':'+arguments[i]);				
		}
	},
	init:function(){
		if(!this.initialization){
			this.initialize();
			/**
			* fire the afterConfig event,this most use to unit test
			*/
			this.fireEvent(this,'initialize');
		}
	},
	is3D:function(){
		return this.dimension==iChart.Math._3D;
	},
	draw:function(opts){
		this.init();
		/**
		 * fire the beforedraw event
		*/
		if(!this.fireEvent(this,'beforedraw')){
			return this;
		}
		/**
		 * execute the commonDraw() that the subClass implement
		 */
		this.commonDraw(opts);	
		
		/**
		* fire the draw event
		*/
		this.fireEvent(this,'draw');
	},
	fireEvent:function(socpe,name,args){
		var L = this.events[name].length;
		if(L==1)
			return this.events[name][0].apply(socpe,args);
		var r = true;
		for(var i = 0;i<L;i++){
			r = this.events[name][i].apply(socpe,args);
		}
		return r;
	},
	on:function(name,fn){
		if(iChart.isString(name)&&iChart.isFunction(fn))
		this.events[name].push(fn);
		return this;
	},
	doConfig:function(){
		var padding = iChart.Math.parsePadding(this.get('padding'));
		this.push('padding_top',padding[0]);
		this.push('padding_right',padding[1]);
		this.push('padding_bottom',padding[2]);
		this.push('padding_left',padding[3]);
		this.push('hpadding',padding[1]+padding[3]);
		this.push('vpadding',padding[0]+padding[2]);
		
		this.push('fontStyle',iChart.getFont(this.get('fontweight'),this.get('fontsize'),this.get('font')));
		
		this.push('fill_color',this.get('background_color'));
		this.push("light_color",iChart.Math.light(this.get('background_color'),this.get('color_factor')));
		this.push("dark_color",iChart.Math.dark(this.get('background_color'),this.get('color_factor')));
		
		this.push("light_color2",iChart.Math.light(this.get('background_color'),this.get('color_factor')*2));
		this.push("dark_color2",iChart.Math.dark(this.get('background_color'),this.get('color_factor'))*2);
		
		this.id = this.get('id');
		
	},
	shadowOn:function(){
		this.target.shadowOn(this.get('shadow'),this.get('shadow_color'),this.get('shadow_blur'),this.get('shadow_offsetx'),this.get('shadow_offsety'));
	},
	shadowOff:function(){
		this.target.shadowOff();
	},
	configuration:function(C){
		if(iChart.isObject(C)){
			iChart.merge(this.configurations,C);
		}
	},
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
