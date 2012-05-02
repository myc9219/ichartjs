;(function(){
	/**
	 * @overview this component use for abc
	 * @component#Jidea.Element
	 * @extend#Object
	 */
	Jidea.Element = function(config){
		/**
		 * indicate the legend's type
		 */
		this.type = 'element';
		/**
		 * define interface method
		 */
		Jidea.DefineAbstract('configure',this);
		Jidea.DefineAbstract('beforeshow',this);
		/**
		 * All of the configuration will in this property
		 */
		this._config_ = {};
		this.configuration({
			 border:{
				enable:false,
				width:1,
				style:'solid',
				color:'#BCBCBC',
				radius:5
			 },
			 animation:true,
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
			 width:0,
			 height:0,
			 style:'',
			 index:999,
			 offset_top:0,
			 offset_left:0
		});
		
		this._default_c = config || {};
		
		/**
		 * 初始化配置、事件注册
		 * @memberOf {Painter} 
		 */
		this.configure.apply(this,Array.prototype.slice.call(arguments,1));
		
		//merge style
		if(this._default_c.style){
			this._default_c.style = this.get('style')+";"+this._default_c.style;
		}
		
		this.transitions = "";
		
		this.variable = {};
		
		/**
		 * 与自定义参数进行整合
		 * @memberOf {Painter} 
		 */
		this.configuration(this._default_c);
		
		/**
		 * 用已经配置好的参数进行进一步配置
		 * @memberOf {Painter} 
		 */
		this.initialize();
		
		this.applyStyle();
	};
Jidea.Element.prototype = {
	initialize:function(){
		//the element's wrap
		this.wrap = this.get('wrap');
		this.dom = document.createElement("div");
		
		if(this.get('shadow')){
			this.css('boxShadow',this.get('shadow_offsetx')+'px '+this.get('shadow_offsety')+'px '+this.get('shadow_blur')+'px '+this.get('shadow_color'));
		}
		if(this.get('border.enable')){
			this.css('border',this.get('border.width')+"px "+this.get('border.style')+" "+this.get('border.color'));
			this.css('borderRadius',this.get('border.radius')+"px");
		}
		this.css('zIndex',this.get('index'));
	},
	width:function(){
		return this.dom.offsetWidth;
	},
	height:function(){
		return this.dom.offsetHeight;
	},
	onTransitionEnd:function(fn,useCapture){
		var type = 'transitionend';
		if(Jidea.isWebKit){
			type = 'webkitTransitionEnd';
		}else if(Jidea.isOpera){
			type = 'oTransitionEnd';
		}
		Jidea.Event.addEvent(this.dom,type,fn,useCapture);
	},
	transition:function(v){
		this.transitions = this.transitions==''?v:this.transitions+','+v;
		if(Jidea.isWebKit){
			this.css('WebkitTransition',this.transitions);
		}else if(Jidea.isGecko){
			this.css('MozTransition',this.transitions);
		}else if(Jidea.isOpera){
			this.css('OTransition',this.transitions);
		}else{
			this.css('transition',this.transitions);
		}
	},
	show:function(e,m){
		this.beforeshow(e,m);
		this.css('visibility','visible');
	},
	hidden:function(e){
		this.css('visibility','hidden');
	},
	getDom:function(){
		return this.dom;
	},
	css:function(k,v){
		if(Jidea.isString(k))if(Jidea.isDefined(v))this.dom.style[k]=v;else return this.dom.style[k];
	},
	applyStyle:function(){
		var styles  = this.get('style').split(";"),style;
		for(var i = 0;i< styles.length;i++){
			style = styles[i].split(":");
			if(style.length>1)this.css(style[0],style[1]);
		}
	},
	configuration:function(C){
		if(Jidea.isObject(C)){
			Jidea.merge(this._config_,C);
		}
	},
    /**
     * average write speed about 0.013ms
     */
    push:function(name, value)
    {
		var A = name.split("."),V = this._config_;
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
        var A = name.split("."),V = this._config_[A[0]];
		for(i=1;i<A.length;i++){
			if(!V)
		        return null;
			V = V[A[i]];
		}
		return V;
    }
}
})();
