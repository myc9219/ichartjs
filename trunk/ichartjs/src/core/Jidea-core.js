/*!
 * Jidea-core Library
 * version:0.9
 * 
 * email:wanghetommy@163.com
 */
;(function(window){
window.undefined = window.undefined;
var ua = navigator.userAgent.toLowerCase(),
	mc = function(e) {
		return e.test(ua)
	},ts = Object.prototype.toString,
        docMode = document.documentMode,
        isOpera = mc(/opera/),
        isOpera10_5 = isOpera && mc(/version\/10\.5/),
        isChrome = mc(/\bchrome\b/),
        isWebKit = mc(/webkit/),
        isSafari = !isChrome && mc(/safari/),
        isSafari2 = isSafari && mc(/applewebkit\/4/),
        isSafari3 = isSafari && mc(/version\/3/),
        isSafari4 = isSafari && mc(/version\/4/),
        isIE = !isOpera && mc(/msie/),
        isIE8 = isIE && (mc(/msie 8/) && docMode != 7 && docMode != 9 || docMode == 8),
        isIE9 = isIE && (mc(/msie 9/) && docMode != 7 && docMode != 8 || docMode == 9),
        isIE10 = isIE && (mc(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9 || docMode == 10),
        supportCanvas = !!document.createElement('canvas').getContext,
        isGecko = !isWebKit && mc(/gecko/),
        isGecko3 = isGecko && mc(/rv:1\.9/),
        isGecko4 = isGecko && mc(/rv:2\.0/),
        isFF3_0 = isGecko3 && mc(/rv:1\.9\.0/),
        isFF3_5 = isGecko3 && mc(/rv:1\.9\.1/),
        isFF3_6 = isGecko3 && mc(/rv:1\.9\.2/),
        isFF4 = isGecko4 && mc(/rv:2\.0\.\d/),
        isFF = isGecko&&mc(/firefox/),
        isWindows = mc(/windows|win32/),
        isMac = mc(/macintosh|mac os x/),
        isLinux = mc(/linux/),
        INFO = {
			version : "0.9",
			email : 'wanghetommy@163.com'
		},
		arithmetic = {
			Linear: function(t,b,c,d){ return c*t/d + b; },
			Quad:{
				easeIn: function(t,b,c,d){
					return c*(t/=d)*t + b;
				},
				easeOut: function(t,b,c,d){
					return -c *(t/=d)*(t-2) + b;
				},
				easeInOut: function(t,b,c,d){
					if ((t/=d/2) < 1) return c/2*t*t + b;
					return -c/2 * ((--t)*(t-2) - 1) + b;
				}
			},
			Cubic:{
				easeIn: function(t,b,c,d){
					return c*(t/=d)*t*t + b;
				},
				easeOut: function(t,b,c,d){
					return c*((t=t/d-1)*t*t + 1) + b;
				},
				easeInOut: function(t,b,c,d){
					if ((t/=d/2) < 1) return c/2*t*t*t + b;
					return c/2*((t-=2)*t*t + 2) + b;
				}
			},
			Quart:{
				easeIn: function(t,b,c,d){
					return c*(t/=d)*t*t*t + b;
				},
				easeOut: function(t,b,c,d){
					return -c * ((t=t/d-1)*t*t*t - 1) + b;
				},
				easeInOut: function(t,b,c,d){
					if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
					return -c/2 * ((t-=2)*t*t*t - 2) + b;
				}
			},
			Bounce: {
				easeOut: function(t,b,c,d){
					if ((t/=d) < (1/2.75)) {
						return c*(7.5625*t*t) + b;
					} else if (t < (2/2.75)) {
						return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
					} else if (t < (2.5/2.75)) {
						return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
					} else {
						return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
					}
				}
			}
		};
var Jidea_ = (function(window) {//spirit from jquery
	var isReady= false,
		readyBound= false,
		readyList=[],
		DOMContentLoaded = (function(){
			if ( document.addEventListener ) {
				return function() {
					document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
					ready();
				};
			} else if ( document.attachEvent ) {
				return function() {
					if ( document.readyState === "complete" ) {
						document.detachEvent( "onreadystatechange", DOMContentLoaded );
						ready();
					}
				};
			}
		})(),
		doScrollCheck = function () {
			if ( isReady ) {
				return;
			}
			try {
				document.documentElement.doScroll("left");
			} catch(e) {
				setTimeout( doScrollCheck, 1 );
				return;
			}
			ready();
		},
		ready = function() {
			if ( !isReady ) {
				isReady = true;
				for(var i =0;i<readyList.length;i++){
					readyList[i].call(document);
				}
				readyList = [];
			}
		},
		bindReady = function() {
			if ( readyBound ) return;
			readyBound = true;
			if ( document.readyState === "complete" ) {
				return setTimeout(ready,1);
			}
			if ( document.addEventListener ) {
				document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
				window.addEventListener( "load", ready, false );
			} else if ( document.attachEvent ) {
				document.attachEvent( "onreadystatechange", DOMContentLoaded );
				window.attachEvent( "onload", ready );
				var toplevel = false;
	
				try {
					toplevel = window.frameElement == null;
				} catch(e) {}
	
				if ( document.documentElement.doScroll && toplevel ) {
					doScrollCheck();
				}
			}
		},bind = function(fn){
			bindReady();
			if (isReady )
				fn.call( document, _ );
			else
				readyList.push( function() { return fn.call(this);});
		},_ = function(selector){
			if ( !selector || selector.nodeType ) {
				return selector;
			}
			if ( typeof selector === "string" ) {
				if(selector.indexOf("#")!=-1){
					selector = selector.substring(1);
				}
				return document.getElementById(selector);	
			}
			if ( typeof selector === "function" ) {
				bind( selector );
			}
		};
		
		_.apply = function(d, e) { 
			if (d && e && typeof e == "object") {
				for (var a in e) {
					if(typeof e[a]!='undefined')
					d[a] = e[a]
				}
			}
			if(!e&&d){
				var clone={};
				for (var a in d) {
					clone[a] = d[a]
				}
				return clone;
			}
			return d
		};
		/**
		 * only get the attr that target not exist
		 */
		_.applyIf = function(d, e) { 
			if (d && e && typeof e == "object") {
				for (var a in e) {
					if(typeof e[a]!='undefined'&&typeof d[a]=='undefined')
					d[a] = e[a]
				}
			}
			if(!e&&d){
				return _.apply(d);
			}
			return d
		};
		/**
		 * there will apply a deep clone
		 */
		_.merge = function(d, e, f) {
			if (d && e && typeof e == "object") {
				for (var a in e) {
					if(typeof e[a]!='undefined'){
						if(ts.apply(e[a]) === "[object Object]"){
							if(ts.apply(d[a]) === "[object Object]"){
								_.merge(d[a],e[a]);
							}else{
								d[a] = _.clone(e[a],true);
							}
						}else{
							d[a] = e[a]; 
						}
					}
				}
				if(typeof f == "object"){
					return _.merge(d,f);
				}
			}
			return d;
		};
		//get attribute that given
		_.clone = function(a,e,deep) {
			var d = {};
			if(ts.apply(a) === "[object Array]"&&ts.apply(e) === "[object Object]"){
				for(var i=0;i<a.length;i++){
					if(deep&&ts.apply(e[a[i]]) === "[object Object]")
						d[a[i]] = _.clone(e[a[i]]);
					else
						d[a[i]] = e[a[i]];
				}
			}else if(ts.apply(a) === "[object Object]"){
				for (var b in a) {
					//avoid recursion reference
					if(e&&ts.apply(a[b]) === "[object Object]"&&!(a[b] instanceof _.Painter))
						d[b] = _.clone(a[b],e);
					else
						d[b] = a[b];
				}
			}
			return d;
		};
		
		_.override = function(e, D) {
			if (D) {
				var C = e.prototype;
				_.apply(C, D);
				if (_.isIE && D.hasOwnProperty("toString")) {
					C.toString = D.toString
				}
			}
		};
		/*
		function extendtest(a,b) {
		    for ( var i in b ) {
		        var g = b.__lookupGetter__(i), s = b.__lookupSetter__(i);
		       
		        if ( g || s ) {
		            if ( g )
		                a.__defineGetter__(i, g);
		            if ( s )
		                a.__defineSetter__(i, s);
		         } else
		             a[i] = b[i];
		    }
		    return a;
		}
		*/
		_.extend = function() { //spirit from ext2.0
					var C = function(E) {
						for (var D in E) {
							this[D] = E[D];
						}
					};
					var e = Object.prototype.constructor;
					return function(G,O) {
						var J = function() {
							G.apply(this, arguments);
						}
					var E = function() {
					}, H, D = G.prototype;
					E.prototype = D;
					H = J.prototype = new E();
					H.constructor = J;
					J.superclass = D;//the pointer to the superclass
					if (D.constructor == e) {
						D.constructor = G;
					}
					J.override = function(F) {
						_.override(J, F);
					};
					H.superclass = H.supr = (function() {
						return D;
					});
					H.override = C;
					_.override(J, O);
					J.extend = function(F) {
						return _.extend(J, F)
					};
					return J;
				}
		}();
		
		_.apply(_,INFO);
		
		_.apply(_,{
			isEmpty : function(C, e) {
					return C === null || C === undefined
							|| ((_.isArray(C) && !C.length))
							|| (!e ? C === "" : false)
			},
			isArray : function(e) {
				return ts.apply(e) === "[object Array]"
			},
			isDate : function(e) {
				return ts.apply(e) === "[object Date]"
			},
			isObject : function(e) {
				return !!e
						&& ts.apply(e) === "[object Object]"
			},
			isFunction : function(e) {
				return ts.apply(e) === "[object Function]"
			},
			isNumber : function(e) {
				return typeof e === "number" && isFinite(e)
			},
			isString : function(e) {
				return typeof e === "string"
			},
			isBoolean : function(e) {
				return typeof e === "boolean"
			},
			isFalse : function(e) {
				return typeof e === "boolean" && !e;
			},
			isElement : function(e) {
				return e ? !!e.tagName : false
			},
			isDefined : function(e) {
				return typeof e !== "undefined"
			},
			getFont : function(w,s,f) {
				return w+" "+s+"px "+f;
			},
			/**
			 * obtain the dom document 
			 * @return {Document} 
			 */
			getDoc : function() {
				var doc = window.contentWindow ? window.contentWindow.document : window.contentDocument ? window.contentDocument : window.document;
				return doc;
			},
			/**
			 * define the interface,the subclass must implement it
			 */
			DefineAbstract:function(M,H){
				if(!H[M])
					throw new Error("Cannot instantiate the type '"+H.type+"'.you must implements it with method '"+M+"'.");
			},
			getAnimationArithmetic:function(tf){
				if(tf=='linear'){
					return arithmetic.Linear;
				}
				if(tf=='bounce'){
					return arithmetic.Bounce.easeOut;
				}
				
				if(tf=='easeInOut'||tf=='easeIn'||tf=='easeOut')
				return arithmetic[_.DefaultAnimationArithmetic][tf];
				return arithmetic.Linear;                                   
			},
			//simple noConflict implements
			noConflict: function( deep ) {
				return Jidea_;
			},
			emptyFn:function(){return true;},
			supportCanvas:supportCanvas,
			isOpera : isOpera,
			isWebKit : isWebKit,
			isChrome : isChrome,
			isSafari : isSafari,
			isSafari2 : isSafari2,
			isSafari3 : isSafari3,
			isSafari4 : isSafari4,
			isIE : isIE,
			isIE8 : isIE8,
			isIE9 : isIE9,
			isGecko : isGecko,
			isGecko3 : isGecko3,
			isGecko4 : isGecko4,
			isFF:isFF,
			isFF3_0:isFF3_0,
			isFF3_5:isFF3_5,
			isFF3_6:isFF3_6,
			isFF4:isFF4,
			isLinux : isLinux,
			isWindows : isWindows,
			isMac : isMac,
			/**
			 * static variable
			 */
			FRAME:20,
			INTERVAL:30,
			DefaultAnimationArithmetic:'Cubic'
		});
	return _;
	
})(window);

Jidea_.Assert = {
	gtZero:function (v,n){
		if(!Jidea.isNumber(v)&&v>=0){
			throw new Error(n+ " has required a type Number gt zero,but given:"+v);
		}
	},
	gt:function (v,c,n){
		if(!Jidea.isNumber(v)&&v>=c){
			throw new Error(n+ " has required a type Number gt "+c+",but given:"+v);
		}
	},
	isNumber:function(v,n){
		if(!Jidea.isNumber(v)){
			throw new Error(n+ " has required a type Number,but given:"+v);
		}
	},
	isNotEmpty:function(v,cause){
		if(!v||v==''){
			throw new Error("it has required not empty.cause:"+cause);
		}	
		if(Jidea.isArray(v)&&v.length==0){
			throw new Error("Array has required must has one element at least.cause:"+cause);
		}
	},
	isArray:function(v,n){
		if(!Jidea.isArray(v)){
			throw new Error(n +" has required a type Array,but given:"+v);
		}
	},
	isFunction:function(v,n){
		if(!Jidea.isFunction(v)){
			throw new Error(n +" has required a type Function,but given:"+v);
		}
	},
	isTrue:function(v,cause){
		if(v!==true){
			throw new Error(cause);
		}
	},
	equal:function(v1,v2,cause){
		if(v1!==v2){
			throw new Error(cause);
		}
	}
}

if(!String.prototype.trim){
	String.prototype.trim = function() {
		return (this || "").replace( /^\s+|\s+$/g, "");
	}
}

window.Jidea = window.$ = Jidea_;

})(window);
