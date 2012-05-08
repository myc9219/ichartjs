/**
 * iChart-core Library
 * version:0.9
 * 
 * email:wanghetommy@gmail.com
 */
;(function(window){
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
        isFF3_5 = isGecko3 && mc(/rv:1\.9\.1/),
        isFF3_6 = isGecko3 && mc(/rv:1\.9\.2/),
        isFF4 = isGecko4 && mc(/rv:2\.0\.\d/),
        isFF = isGecko&&mc(/firefox/),
        isWindows = mc(/windows|win32/),
        isMac = mc(/macintosh|mac os x/),
        isLinux = mc(/linux/),
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
		
var iChart_ = (function(window) {//spirit from jquery
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
		
		//*******************Math************************
		var sin = Math.sin, cos = Math.cos, atan=Math.atan,tan = Math.tan,acos = Math.acos,
			sqrt = Math.sqrt, abs = Math.abs,pi = Math.PI, pi2 = 2*pi,
			ceil=Math.ceil,round = Math.round,floor=Math.floor,max=Math.max,min=Math.min,
			pF = parseFloat,
			parseParam =  function(s,d) {
				if(_.isNumber(s))
					return new Array(s,s,s,s);
				s = s.replace( /^\s+|\s+$/g,"").replace(/\s{2,}/g,/\s/).replace(/\s/g,',').split(",");
				if(s.length==1){
					s[0] = s[1] = s[2] = s[3] = pF(s[0])||d;
				}else if(s.length==2){
					s[0] = s[2] = pF(s[0])||d;
					s[1] = s[3] = pF(s[1])||d;
				}else if(s.length==3){
					s[0] = pF(s[0])||d;
					s[1] = s[3] = pF(s[1])||d;
					s[2] = pF(s[2])||d;
				}else{
					s[0] = pF(s[0])||d;
					s[1] = pF(s[1])||d;
					s[2] = pF(s[2])||d;
					s[3] = pF(s[3])||d;
				}
			return s;
		},
		factor = function(v){
			if(v==0)return v;
			var f = v/10,i=0;
				while(f<1){
					f *= 10;i++;
				}
				while(f/10>1){
					f /= 10;i--;
				}
				f = floor(f);
				while(i>0){
					f /=10;i--;
				}
				while(i<0){
					f *=10;i++;
				}
			return f;
		},
		innerColor  = ["navy","olive","silver","gold","lime","fuchsia","aqua","green","red","blue","pink","purple","yellow","maroon","black","gray","white"],	
		colors = {
			navy:'rgb(0,0,128)',
			olive:'rgb(128,128,0)',
			orange:'rgb(255,165,0)',
			silver:'rgb(192,192,192)',
			white:'rgb(255,255,255)',
			gold:'rgb(255,215,0)',
			lime:'rgb(0,255,0)',
			fuchsia:'rgb(255,0,255)',
			aqua:'rgb(0,255,255)',
			green:'rgb(0,128,0)',
			red:'rgb(255,0,0)',
			blue:'rgb(0,0,255)',
			pink:'rgb(255,192,203)',
			purple:'rgb(128,0,128)',
			yellow:'rgb(255,255,0)',
			maroon:'rgb(128,0,0)',
			black:'rgb(0,0,0)',
			azure:'rgb(240,255,255)',
			beige:'rgb(245,245,220)',
			brown:'rgb(165,42,42)',
			cyan:'rgb(0,255,255)',
			darkblue:'rgb(0,0,139)',
			darkcyan:'rgb(0,139,139)',
			darkgrey:'rgb(169,169,169)',
			darkgreen:'rgb(0,100,0)',
			darkkhaki:'rgb(189,183,107)',
			darkmagenta:'rgb(139,0,139)',
			darkolivegreen:'rgb(85,107,47)',
			darkorange:'rgb(255,140,0)',
			darkorchid:'rgb(153,50,204)',
			darkred:'rgb(139,0,0)',
			darksalmon:'rgb(233,150,122)',
			darkviolet:'rgb(148,0,211)',
			indigo:'rgb(75,0,130)',
			khaki:'rgb(240,230,140)',
			lightblue:'rgb(173,216,230)',
			lightcyan:'rgb(224,255,255)',
			lightgreen:'rgb(144,238,144)',
			lightgrey:'rgb(211,211,211)',
			lightpink:'rgb(255,182,193)',
			lightyellow:'rgb(255,255,224)',
			magenta:'rgb(255,0,255)',
			violet:'rgb(128,0,128)'
		},
		hex2Rgb = function(hex) {
			hex = hex.replace(/#/g,"").replace(/^(\w)(\w)(\w)$/,"$1$1$2$2$3$3");
			return  'rgb(' + parseInt(hex.substring(0, 2), 16) + ','
					+ parseInt(hex.substring(2, 4), 16) + ','
					+ parseInt(hex.substring(4, 6), 16) + ')';
		},
		i2hex=function (N) {
			return ('0'+parseInt(N).toString(16)).slice(-2);
		},
		rgb2Hex=function(rgb) {
			var m = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
			return m?('#' + i2hex(m[1]) + i2hex(m[2]) + i2hex(m[3])).toUpperCase():null;
		},
		c2a=function(rgb){
			var result =  /rgb\((\w*),(\w*),(\w*)\)/.exec(rgb);
			if(result){
				return new Array(result[1],result[2],result[3]);
			}
			result =  /rgba\((\w*),(\w*),(\w*),(.*)\)/.exec(rgb);
			if(result){
				return new Array(result[1],result[2],result[3],result[4]);
			}
			throw new Error("invalid colors value '"+rgb+"'");
		},
		toHsv=function(r,g,b){
			if(_.isArray(r)){
				g = r[1];
				b = r[2];
				r = r[0];
			}
			r = r/255;
			g = g/255;
			b = b/255;
			var m  = max(max(r,g),b),
				mi  = min(min(r,g),b),
				dv = m - mi;
			if(dv == 0){
				return new Array(0,0,m);
			}
			var h;
			if(r==m){
				h = (g-b)/dv;
			}else if(g==m){
				h = (b-r)/dv + 2;
			}else if(b==m){
				h = (r-g)/dv + 4;
			}
			h*=60;
			if(h<0)h+=360;
			return new Array(h,dv/m,m);
		},
		toRgb=function (color) {
			color = color.replace(/\s/g,'').toLowerCase();
			//  Look for rgb(255,255,255)
			if (/rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)/.exec(color)){
				return color;
			}
			
			//Look for rgba(255,255,255,0.3)
			if (/rgba\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},(0(\.[0-9])?|1(\.0)?)\)/.exec(color)){
				return color;
			}
			
			// Look for #a0b1c2 or #fff
			if (/#(([a-fA-F0-9]{6})|([a-fA-F0-9]{3}))/.exec(color))
				return hex2Rgb(color);
			// Look a string  for green
			if(colors[color])
				return colors[color];
			throw new Error("invalid colors value '"+color+"'");
		},
		hsv2Rgb=function(h,s,v,a){
			if(_.isArray(h)){
				a = s;
				s = h[1];
				v = h[2];
				h = h[0];
			}
			var r,g,b,hi,f;
				hi = floor(h/60)%6;
				f = h/60 - hi;
				p = v*(1-s);
			    q = v*(1-s*f);
			    t = v*(1-s*(1-f));
				 switch(hi) {
			      case 0:
			        r = v; g = t; b = p;
			        break;
			      case 1:
			        r = q; g = v; b = p;
			        break;
			      case 2:
			        r = p; g = v; b = t;
			        break;
			      case 3:
			        r = p; g = q; b = v;
			        break;
			      case 4:
			        r = t; g = p; b = v;
			        break;
			      case 5:
			        r = v; g = p; b = q;
			        break;
			    }
			return 'rgb'+(a?'a':'')+'('+round(r*255)+','+round(g*255)+','+round(b*255)+(a?','+a+')':')');
		},
		//the increment of s(v) of hsv model
		s_inc = 0,
		v_inc = 0.14,
		/**
		 * 当目标值>0.1时:以增量iv为上限、随着目标值的减小增量减小
		 * 当目标值<=0.1时:若指定的增量大于目标值则直接返回其1/2、否则返回增量值
		 */
		inc = function(v,iv){
			iv = iv || v_inc;
			if(v>0.5){
				return iv - (1-v)/10;
			}else if(v>0.1){
				return iv - 0.16 + v/5;
			}else{
				return v>iv?iv:v/2;
			}
		},
		/**
		 * 变色龙
		 * @param {Boolean} d true为变深,false为变浅
		 * @param {Object} rgb
		 * @param {Number} iv 明度(0-1)
		 * @param {Number} is 纯度(0-1)
		 */
		anole = function (d,rgb,iv,is) {
			rgb = c2a(toRgb(rgb));
			var hsv = toHsv(rgb);
			hsv[1] -=is||s_inc;
			if(d){
				hsv[2] -=inc(hsv[2],iv);
				hsv[1] = _.upTo(hsv[1],1);
				hsv[2] = _.lowTo(hsv[2],0);
			}else{
				hsv[2] +=inc((1-hsv[2]),iv);
				hsv[1] = _.lowTo(hsv[1],0);
				hsv[2] = _.upTo(hsv[2],1);
			}
			return hsv2Rgb(hsv,rgb[3]);
		};
		
		_.apply(_,{
			version : "1.0",
			email : 'wanghetommy@gmail.com',
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
				if(tf=='linear')
					return arithmetic.Linear;
				if(tf=='bounce')
					return arithmetic.Bounce.easeOut;
				if(tf=='easeInOut'||tf=='easeIn'||tf=='easeOut')
				return arithmetic[_.DefaultAnimationArithmetic][tf];
				return arithmetic.Linear;                                   
			},
			//simple noConflict implements
			noConflict: function( deep ) {
				return iChart_;
			},
			parseBorder:function(s,d) {
				return parseParam(s,d);	
			},
			parsePadding:function(s,d) {
				return parseParam(s,d);	
			},
			/**
			 * the distance of two point
			 */
			distanceP2P:function(x1,y1,x2,y2){
				return sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
			},
			/**
			 * the angle of two line that two point and x-axis positive direction,anticlockwise
			atanToAngle:function(ox,oy,x,y){
				if(ox==x){
					if(y>oy)return 90;
					return 270;
				}
				var quadrant = _.quadrant(ox,oy,x,y);
				var angle = _.radian2Angle(atan(abs((oy-y)/(ox-x))));
				if(quadrant==1){
					angle = 180 - angle;
				}else if(quadrant==2){
					angle = 180 + angle;
				}else if(quadrant==3){
					angle = 360 - angle;
				}
				return angle;
			},*/
			atan2Radian:function(ox,oy,x,y){
				if(ox==x){
					if(y>oy)return pi/2;
					return pi*3/2;
				}
				var q = _.quadrant(ox,oy,x,y);
				var r = atan(abs((oy-y)/(ox-x)));
				if(q==1){
					r = pi - r;
				}else if(q==2){
					r = pi + r;
				}else if(q==3){
					r = pi2 - r;
				}
				return r;
			},
			angle2Radian:function(a){
				return a*pi/180;
			},
			radian2Angle:function(r){
				return r*180/pi;
			},
			/**
			 * indicate angle in which quadrant,and it different from math's concept.this will return 0 if it in first quadrant(other eg.0,1,2,3)
			 * @param {Number} ox
			 * @param {Number} oy
			 * @param {Number} x
			 * @param {Number} y
			 * @return {Number} 
			 */
			quadrant:function (ox,oy,x,y){
				if(ox<x){if(oy<y){return 3;}else{return 0;}}else{if(oy<y){return 2;}else{return 1;}}
			},
			quadrantd:function(a){
				a = 2*(a%(pi*2));
				return ceil(a/pi);
			},
			upTo:function (u,v){
				return v>u?u:v;
			},
			lowTo:function (l,v){
				return v<l?l:v;
			},
			between:function(l,u,v){
				return v>u?u:v<l?l:v;
			},
			inRange:function(l,u,v){
				return u>v&&l<v;
			},
			angleInRange:function(l,u,v){
				l = l%pi2;
				u  =  u%pi2;
				if(u>l){
					return u>v&&l<v;
				}
				if(u<l){
					return v <u || v >l;
				}
				return v ==u;
			},
			inRangeClosed:function(l,u,v){
				return u>=v&&l<=v;
			},
			inEllipse:function(x,y,a,b){
				return (x*x/a/a+y*y/b/b)<=1;
			},
			p2Point:function(x,y,a,C){
				return {
					x:x + cos(a)*C,
					y:y + sin(a)*C
				}
			},
			/**
			 * 计算空间点坐标矢量
			 * @param {Number} x
			 * @param {Number} y
			 */
			vectorP2P:function(x,y,radian){
				if(!radian){
					y = _.angle2Radian(y);
					x = _.angle2Radian(x);
				}
				y = sin(y);
				return {
					x:y*sin(x),
					y:y*cos(x)
				}
			},
			iGather : function(P){
				return (P||'ichartjs') + '-'+new Date().getTime().toString();
			},
			toPercent:function(v,d){
				return '('+(v*100).toFixed(d)+'%)';
			},
			parseFloat:function(v,d){
				if(!_.isNumber(v)){
					v = pF(v);
					if(!_.isNumber(v))
						throw new Error("'"+d+"'is not a valid number.");
				}
				return v;
			},
			/**
			 * 返回向上靠近一个最小数量级的数
			 */
			ceil:function(max){
				return max+factor(max);
			},
			/**
			 * 返回向下靠近一个最小数量级的数 NEXT
			 */
			floor:function(max){
				return max-factor(max);
			},
			get:function(i){
			  return innerColor[i%16];
			},
			_2D:'2d',
			_3D:'3d',
			light:function (rgb,iv,is) {
				return anole(false,rgb,iv,is);
			},
			dark:function (rgb,iv,is) {
				return anole(true,rgb,iv,is);				
			},
			fixPixel: function(v) {
				return _.isNumber(v)?v:pF(v.replace('px',""))||0 ;
			},
			toPixel: function(v) {
				return _.isNumber(v)?v+'px':_.fixPixel(v)+'px';
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
		
		_.Assert = {
			gtZero:function (v,n){
				_.Assert.gt(v,0,n);
			},
			gt:function (v,c,n){
				if(!_.isNumber(v)&&v>=c)
					throw new Error(n+ " required Number gt "+c+",given:"+v);
			},
			isNumber:function(v,n){
				if(!_.isNumber(v))
					throw new Error(n+ " required Number,given:"+v);
			},
			isNotEmpty:function(v,cause){
				if(!v||v==''){
					throw new Error(" required not empty.cause:"+cause);
				}	
				if(_.isArray(v)&&v.length==0){
					throw new Error("required must has one element at least.cause:"+cause);
				}
			},
			isArray:function(v,n){
				if(!_.isArray(v))
					throw new Error(n +" required Array,given:"+v);
			},
			isFunction:function(v,n){
				if(!_.isFunction(v))
					throw new Error(n +" required Function,given:"+v);
			},
			isTrue:function(v,cause){
				if(v!==true)
					throw new Error(cause);
			},
			equal:function(v1,v2,cause){
				if(v1!==v2)
					throw new Error(cause);
			}
		};
		
		/**
		 * defined Event
		 */
		_.Event = {
				addEvent:function(ele,type,fn,useCapture){
				 	if (ele.addEventListener) 
					 	ele.addEventListener(type,fn,useCapture);
				 	else if (ele.attachEvent) 
				 		ele.attachEvent('on' + type, fn);
				 	else 
				 		ele['on' + type] = fn;
				},
			    fix: function( e ) { //inspire by jquery
					// Fix event for mise
					if(typeof(e) == 'undefined'){
						e = window.event;
					}
					// Fix target property, if necessary
					if ( !e.target ) {
						e.target = e.srcElement || document;
					}
									
					// Add relatedTarget, if necessary
					if ( !e.relatedTarget && e.fromElement ) {
						e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
					}
					
					// Calculate pageX/Y if missing and clientX/Y available
					if ( e.pageX == null && e.clientX != null ) {
						var doc = document.documentElement, body = document.body;
						e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
						e.pageY = e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
					}
					
					// This is mainly for FF which doesn't provide offsetX
			        if (typeof(e.offsetX) == 'undefined' && typeof(e.offsetY) == 'undefined') {
				        // Browser not with offsetX and offsetY
				        if (typeof(e.offsetX) != 'number') {
				            var x = 0,y = 0,obj = e.target;
				            while (obj != document.body && obj) {
				                x += obj.offsetLeft;
				                y += obj.offsetTop;
				                obj = obj.offsetParent;
				            }
				            e.offsetX = e.pageX - x;
				            e.offsetY = e.pageY - y;
				        }
			        }
					
					// Add which for key events
					if ( e.which == null && (e.charCode != null || e.keyCode != null) ) {
						e.which = e.charCode != null ? e.charCode : e.keyCode;
					}
					
					// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
					if ( !e.metaKey && e.ctrlKey ) {
						e.metaKey = e.ctrlKey;
					}
					
					// Add which for click: 1 === left; 2 === middle; 3 === right
					// Note: button is not normalized, so don't use it
					if ( !e.which && e.button !== undefined ) {
						e.which = (e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ));
					}
					
					// Any browser that doesn't implement stopPropagation() (MSIE)
			        if (!e.stopPropagation) {
			            e.stopPropagation = function () {window.event.cancelBubble = true;}
			        }
					return e;
				}
			};
	return _;
	
})(window);


window.iChart = window.$ = iChart_;

})(window);
;(function($){/**
 * @overview this is base class of all element.All must extend this so that has
 *           ability for configuration
 * @component#$.Element
 * @extend#Object
 */
$.Element = function(config) {
	/**
	 * indicate the element's type
	 */
	this.type = 'element';

	/**
	 * define abstract method
	 */
	$.DefineAbstract('configure', this);

	/**
	 * All of the configuration will in this property
	 */
	this.options = {};

	this.set({
		/**
		 * @inner {String} The unique id of this element (defaults to an
		 *        auto-assigned id).
		 */
		id : '',
		/**
		 * @cfg {Number} Specifies the font size of this element in
		 *      pixels.(default to 12)
		 */
		fontsize : 12,
		/**
		 * @cfg {String} Specifies the font of this element.(default to
		 *      'Verdana')
		 */
		font : 'Verdana',
		/**
		 * @cfg {String} Specifies the font weight of this element.(default to
		 *      'normal')
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
		 * @cfg {Boolean} Specifies whether the element should be show a
		 *      shadow.(default to false)
		 */
		shadow : false,
		/**
		 * @cfg {String} Specifies the color of your shadow is.(default to
		 *      '#666666')
		 */
		shadow_color : '#666666',
		/**
		 * @cfg {Number} How blur you want your shadow to be.(default to 4)
		 */
		shadow_blur : 4,
		/**
		 * @cfg {Number} Horizontal distance (x-axis) between the shadow and the
		 *      shape in pixel.(default to 0)
		 */
		shadow_offsetx : 0,
		/**
		 * @cfg {Number} Vertical distance (y-axis) between the shadow and the
		 *      shape in pixel.(default to 0)
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

$.Element.prototype = {
	set : function(c) {
		if ($.isObject(c)) {
			$.merge(this.options, c);
		}
	},
	afterConfiguration : function() {
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
/**
 * 
 * @overview this element use for 画图的基类、其他组件要继承此组件
 * @component#$.Painter
 * @extend#$.Element
 */
$.Painter = $.extend($.Element, {

	configure : function() {
		/**
		 * indicate the element's type
		 */
		this.type = 'painter';

		this.dimension = $._2D;

		/**
		 * define abstract method
		 */
		$.DefineAbstract('commonDraw', this);
		$.DefineAbstract('initialize', this);

		this.set({
			/**
			 * @cfg {Number} Specifies the default linewidth of the canvas's
			 *      context in this element.(defaults to 1)
			 */
			brushsize : 1,
			/**
			 * @cfg {String} Specifies the default strokeStyle of the canvas's
			 *      context in this element.(defaults to 'gray')
			 */
			strokeStyle : 'gray',
			/**
			 * @cfg {String} Specifies the default lineJoin of the canvas's
			 *      context in this element.(defaults to 'round')
			 */
			lineJoin : 'round',
			/**
			 * @cfg {Number} Specifies the padding for this element in pixel,the
			 *      same rule as css padding.(defaults to 10)
			 */
			padding : 10,
			/**
			 * @cfg {String} Specifies the color for this element.(defaults to
			 *      'black')
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
			 * @cfg {String} Specifies the backgroundColor for this
			 *      element.(defaults to 'FDFDFD')
			 */
			background_color : '#FDFDFD',
			/**
			 * @cfg {float} The factor make color dark or light for this
			 *      element.(0.01 - 0.5).(defaults to '0.15')
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
			 * @cfg {Object} A config object containing one or more event
			 *      handlers.(default to null)
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
		this.registerEvent('initialize', 'click', 'dbclick', 'mousemove', 'mouseover', 'mouseout', 'keydown', 'beforedraw', 'draw');

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
			if ($.isObject(this.get('listeners'))) {
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
		return this.dimension == $._3D;
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
	fireString : function(socpe, name, args, s) {
		var t = this.fireEvent(socpe, name, args);
		return $.isString(t) ? t : s;
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
		if ($.isString(name) && $.isFunction(fn))
			this.events[name].push(fn);
		return this;
	},
	doConfig : function() {
		var padding = $.parsePadding(this.get('padding')), bg = this.get('background_color'),f=this.get('color_factor');
		this.push('padding_top', padding[0]);
		this.push('padding_right', padding[1]);
		this.push('padding_bottom', padding[2]);
		this.push('padding_left', padding[3]);
		this.push('hpadding', padding[1] + padding[3]);
		this.push('vpadding', padding[0] + padding[2]);
		this.push('fontStyle', $.getFont(this.get('fontweight'), this.get('fontsize'), this.get('font')));
		this.push('fill_color', bg);
		this.push("light_color", $.light(bg, f));
		this.push("dark_color", $.dark(bg, f));
		this.push("light_color2", $.light(bg, f * 2));
		this.push("dark_color2", $.dark(bg, f) * 2);
		this.id = this.get('id');

	}
});

/**
 * 
 * @overview this component use for 画图的基类、其他组件要继承此组件
 * @component#$.Painter
 * @extend#$.Element
 */
$.Html = $.extend($.Element,{
	configure : function(T) {
		
		/**
		 * indicate the element's type
		 */
		this.type = 'html';
		
		this.T = T;
		
		/**
		 * define abstract method
		 */
		$.DefineAbstract('beforeshow',this);
		
		this.set({
			 animation:true,
			 /**
			  * @inner The width of this element in pixels.
			  */
			 width:0,
			 /**
			  * @inner The height of this element in pixels.
			  */
			 height:0,
			 /**
			 * @cfg {String} Custom style specification to be applied to this element.(default to '')
			 * like this:'padding:10px;font-size:12px'
			 */
			 style:'',
			 /**
			  * @inner The z-index of this element.(default to 999)
			  */
			 index:999,
			 /**
			  * @inner The top of this element.(default to 0)
			  */
			 offset_top:0,
			 /**
			  * @inner The left of this element.(default to 0)
			  */
			 offset_left:0
		});
		
		
		this.transitions = "";
	},
	afterConfiguration:function(){
		this.initialize();
	},
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
		
		this.applyStyle();
	},
	width:function(){
		return this.dom.offsetWidth;
	},
	height:function(){
		return this.dom.offsetHeight;
	},
	onTransitionEnd:function(fn,useCapture){
		var type = 'transitionend';
		if($.isWebKit){
			type = 'webkitTransitionEnd';
		}else if($.isOpera){
			type = 'oTransitionEnd';
		}
		$.Event.addEvent(this.dom,type,fn,useCapture);
	},
	transition:function(v){
		this.transitions = this.transitions==''?v:this.transitions+','+v;
		if($.isWebKit){
			this.css('WebkitTransition',this.transitions);
		}else if($.isGecko){
			this.css('MozTransition',this.transitions);
		}else if($.isOpera){
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
		if($.isString(k))if($.isDefined(v))this.dom.style[k]=v;else return this.dom.style[k];
	},
	applyStyle:function(){
		var styles  = this.get('style').split(";"),style;
		for(var i = 0;i< styles.length;i++){
			style = styles[i].split(":");
			if(style.length>1)this.css(style[0],style[1]);
		}
	}
});

	/**
	 * @overview this component use for abc
	 * @component#$.Component
	 * @extend#$.Painter
	 */
	$.Component = $.extend($.Painter,{
		configure : function(c) {
			/**
			 * invoked the super class's configuration
			 */
			$.Component.superclass.configure.apply(this,arguments);
	
			/**
			 * indicate the element's type
			 */
			this.type = 'component';
	
			this.set({
				/**
				 * @cfg {Boolean} indicate whether there has a effect of color gradient
				 */
				gradient : true
			});
	
			this.inject(c);
			
			this.final_parameter = {};
	
	},
	afterConfiguration:function(){
		this.init();
	},
	initialize : function() {
		if (!this.preventEvent)
			/**
			 * define abstract method
			 */
			$.DefineAbstract('isEventValid', this);
	
		$.DefineAbstract('doDraw', this);
	
		this.doConfig();
		this.initialization = true;
	},
	doConfig : function() {
		$.Component.superclass.doConfig.call(this);
		/**
		 * originx
		 */
		this.x = this.get('originx');
		/**
		 * 
		 * originy
		 */
		this.y = this.get('originy');
		
		/**
		 * if have evaluate it
		 */
		this.data = this.get('data');
	
		if (this.is3D()) {
			$.Interface._3D.call(this);
		}
		
		if (this.get('tip.enable')) {
			/**
			 * make tip's border in accord with sector
			 */
			this.pushIf('tip.border.color', this.get('background_color'));
	
			if (!$.isFunction(this.get('tip.invokeOffset')))
				/**
				 * indicate the tip must calculate position
				 */
				this.push('tip.invokeOffset', this.tipInvoke());
		}
	
	},
	isMouseOver : function(e) {
		return this.isEventValid(e);
	},
	redraw : function() {
		this.container.draw();
	},
	commonDraw : function(opts) {
		// 转换中心坐标至当前目标坐标中心?
		// this.T.ctx.translate(this.x,this.y);
		/**
		 * execute the doDraw() that the subClass implement
		 */
		this.doDraw.call(this, opts);
	
	},
	inject : function(c) {
		if (c) {
			this.container = c;
			this.target = this.T = c.T;
		}
	}
	});	$.Interface = function(){
		var simple = function() {
			var M=0,V=0,MI,ML=0,d;
			for(var i=0;i<this.data.length;i++){
				d = this.data[i];
				$.merge(d,this.fireEvent(this,'parseData',[d,i]));
				if(!d.color)
				d.color = $.get(i);
				V  = d.value;
				if($.isNumber(V)){
					V = $.parseFloat(V,this.type+':data['+i+']');
					d.value = V;
					this.total+=V;
					M = V>M?V:M;
					if(!MI)
						MI = V;
					MI = V<MI?V:MI;
				}else if($.isArray(V)){
					var T = 0;
					ML = V.length>ML?V.length:ML;
					for(var j=0;j<V.length;j++){
						T+=V[j];
						if(!MI)
						MI = V;
						M = V[j]>M?V[j]:M;
						MI = V[j]<MI?V[j]:MI;
					}
					d.total = T;
				}
			}
			
			if($.isArray(this.get('labels'))){
				ML = this.get('labels').length>ML?this.get('labels').length:ML;
			}
			
			this.push('maxItemSize',ML);
			this.push('minValue',MI);
			this.push('maxValue',M);
			this.push('total',this.total);
		},
		complex = function(){
			this.columnKeys = this.get('columnKeys');
			var M=0,MI=0,V,d,L=this.columnKeys.length;
			
			for(var i=0;i<this.data.length;i++){
				d = this.data[i];
				$.Assert.equal(d.value.length,L,this.type+':data length and columnKeys not corresponding.');
				$.merge(d,this.fireEvent(this,'parseData',[d,this.columnKeys,i]));
				$.Assert.equal(d.value.length,L,this.type+':data length and columnKeys not corresponding.');
			}
			
			for(var i=0;i<L;i++){
				var item = [];
				for(var j=0;j<this.data.length;j++){
					d = this.data[j];
					V = d.value[i];
					d.value[i] = $.parseFloat(V,this.type+':data['+j+','+i+']');
					if(!d.color)
					d.color = $.get(j);
					//NEXT 此总数需考虑?
					this.total+=V;
					M = V>M?V:M;
					MI = V<MI?V:MI;
					
					item.push({
						name:d.name,
						value:d.value[i],
						color:d.color
					});
				}
				this.columns.push({
					name:this.columnKeys[i],
					item:item
				});
				
			}
			this.push('minValue',MI);
			this.push('maxValue',M);
			this.push('total',this.total);
		};
		return {
			_3D:function(){
				var P = $.vectorP2P(this.get('xAngle'),this.get('yAngle'));
				this.push('xAngle_',P.x);
				this.push('yAngle_',P.y);
			},
			_2D:'2d',
			coordinate2d:function(){
				return new $.Coordinate2D($.apply({
					kedu:{
						 position:this.get('keduAlign'),	
						 max_scale:this.get('maxValue'),
						 min_scale:this.get('minValue')
					}
				},this.get('coordinate')),this);
			},
			coordinate3d:function(){
				return new $.Coordinate3D($.apply({
					kedu:{
						 position:this.get('keduAlign'),	
						 scaleAlign:this.get('keduAlign'),	
						 max_scale:this.get('maxValue'),
						 min_scale:this.get('minValue')
					}
				},this.get('coordinate')),this);
			},
			coordinate:function(){
				
				/**
				 * calculate  chart's measurement
				 */
				var w = this.pushIf('coordinate.width',this.get('client_width')*0.8),
					h=this.pushIf('coordinate.height',this.get('client_height')*0.8);
				
				/**
				 * calculate chart's alignment
				 */
				if (this.get('align') == 'left') {
					this.push('originx',this.get('l_originx'));
				}else if (this.get('align') == 'right'){
					this.push('originx',this.get('r_originx')-w);
				}else{
					this.push('originx',this.get('centerx')-w/2);
				}
				
				this.push('originx',this.get('originx')+this.get('offsetx'));
				this.push('originy',this.get('centery')-h/2+this.get('offsety'));
				
				if(!this.get('coordinate.valid_width')||this.get('coordinate.valid_width')>w){
					this.push('coordinate.valid_width',w);
				}
				
				if(!this.get('coordinate.valid_height')||this.get('coordinate.valid_height')>h){
					this.push('coordinate.valid_height',h);
				}
				
				/**
				 * originx
				 */
				this.x = this.get('originx');
				/**
				 * 
				 * originy 
				 */
				this.y = this.get('originy');
				
				this.push('coordinate.originx',this.x);
				this.push('coordinate.originy',this.y);
				
			},
			parser:function() {
				this.data = this.get('data');
				if(this.dataType=='simple'){
					simple.call(this);
				}else if(this.dataType=='complex'){
					complex.call(this);
				}
			}
		}	
	}();
 	/**
	 * @overview this component use for abc
	 * @component#$.Tip
	 * @extend#$.Element
	 */
	$.Tip = $.extend($.Html,{
		configure:function(){
			
			/**
			 * invoked the super class's  configuration
			 */
			$.Tip.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the legend's type
			 */
			this.type = 'tip';
			
			this.set({
				 text:'',
				 /**
				  * 
				  * @param {String} {'fixed','follow'}(default to 'follow')
				  */
				 showType:'follow',
				 invokeOffset:null,
				 /**
				  * @cfg {Number}  ms
				  */
				 fade_duration:300,
				 move_duration:100,
				 shadow:true,
				 /**
				  * @cfg {Boolean}  if  calculate the position every time (default to false)
				  */
				 invokeOffsetDynamic:false,
				 style:'textAlign:left;padding:4px 5px;cursor:pointer;backgroundColor:rgba(239,239,239,.85);fontSize:12px;color:black;',
				 border:{
					enable:true
				 },
				 delay:200
			});
		},
		follow:function(e,m){
			var style = this.dom.style;
			if(this.get('invokeOffsetDynamic')){
				if(m.hit){
					if($.isString(m.text)||$.isNumber(m.text)){
						this.dom.innerHTML =  m.text;
					}
					var o = this.get('invokeOffset')(this.width(),this.height(),m);
					
					style.top =  o.top+"px";
					style.left = o.left+"px";
				}
			}else{
				if(this.get('showType')=='follow'){
					style.top = (e.offsetY-this.height()*1.1-2)+"px";
					style.left = (e.offsetX+2)+"px";
				}else if($.isFunction(this.get('invokeOffset'))){
					var offset = this.get('invokeOffset')(this.width(),this.height(),m);
					style.top =  offset.top+"px";
					style.left = offset.left+"px";
				}else{
					style.top = (e.offsetY-this.height()*1.1-2)+"px";
					style.left = (e.offsetX+2)+"px";
				}
			}
			
		},
		beforeshow:function(e,m){
			this.follow(e,m);
		},
		show:function(e,m){
			this.beforeshow(e,m);
			this.css('visibility','visible');
			if(this.get('animation')){
				this.css('opacity',1);
			}
		},
		hidden:function(e){
			if(this.get('animation')){
				this.css('opacity',0);
			}else{
				this.css('visibility','hidden');
			}
		},
		initialize:function(){
			$.Tip.superclass.initialize.call(this);
			
			var self = this;
			
			self.css('position','absolute');
			self.dom.innerHTML = self.get('text');
			
			self.hidden();
			
			if(self.get('animation')){
				var m =  self.get('move_duration')/1000+'s ease-in 0s';
				self.transition('opacity '+self.get('fade_duration')/1000+'s ease-in 0s');
				self.transition('top '+m);
				self.transition('left '+m);
				self.onTransitionEnd(function(e){
					if(self.css('opacity')==0){
						self.css('visibility','hidden');
					}
				},false);
			}
			
			self.wrap.appendChild(self.dom);
			
			self.T.on('mouseover',function(e,m){
				self.show(e,m);	
			}).on('mouseout',function(e,m){
				self.hidden(e);	
			});
			
			if(self.get('showType')=='follow'){
				self.T.on('mousemove',function(e,m){
					if(self.T.variable.event.mouseover){
						setTimeout(function(){
							if(self.T.variable.event.mouseover)
								self.follow(e,m);
						},self.get('delay'));
					}
				});
			}
			
		}
});
	/**
	 * @overview this component use for abc
	 * @component#$.CrossHair
	 * @extend#$.Element
	 */
	$.CrossHair = $.extend($.Html,{
		configure:function(){
		
			/**
			 * invoked the super class's  configuration
			 */
			$.CrossHair.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'crosshair';
			
			this.set({
				 text:'',
				 top:0,
				 left:0,
				 /**
				  * @cfg {Boolean} private use 
				  */
				 hcross:true,
				  /**
				  * @cfg {Boolean} private use 
				  */
				 vcross:true,
				 invokeOffset:null,
				 line_width:1,
				 line_color:'green',
				 shadow_color:'#dedede',
				 delay:200
			});
		},
		//this function will implement at every target object,and this just default effect
		follow:function(e,m){
			if(this.get('invokeOffset')){
				var o = this.get('invokeOffset')(e,m);
				if(o&&o.hit){
					this.horizontal.style.top = (o.top-this.top)+"px";
					this.vertical.style.left = (o.left-this.left)+"px";
				}
			}else{
				//set the 1px offset will make the line at the top left all the time 
				this.horizontal.style.top = (e.offsetY-this.top-1)+"px";
				this.vertical.style.left = (e.offsetX-this.left-1)+"px";
			}
		},
		beforeshow:function(e,m){
			this.follow(e,m);
		},
		initialize:function(){
			$.CrossHair.superclass.initialize.call(this);
			
			this.top = $.fixPixel(this.get('top'));
			this.left = $.fixPixel(this.get('left'));
			
			this.dom = document.createElement("div");
			
			this.dom.style.zIndex=this.get('index');
			this.dom.style.position="absolute";
			//set size zero make  integration with vertical and horizontal
			this.dom.style.width= $.toPixel(0);
			this.dom.style.height=$.toPixel(0);
			this.dom.style.top=$.toPixel(this.get('top'));
			this.dom.style.left=$.toPixel(this.get('left'));
			this.css('visibility','hidden');
			
			this.horizontal = document.createElement("div");
			this.vertical = document.createElement("div");
			
			this.horizontal.style.width= $.toPixel(this.get('width'));
			this.horizontal.style.height= $.toPixel(this.get('line_width'));
			this.horizontal.style.backgroundColor = this.get('line_color');
			this.horizontal.style.position="absolute";
			
			this.vertical.style.width= $.toPixel(this.get('line_width'));
			this.vertical.style.height = $.toPixel(this.get('height'));
			this.vertical.style.backgroundColor = this.get('line_color');
			this.vertical.style.position="absolute";
			this.dom.appendChild(this.horizontal);
			this.dom.appendChild(this.vertical);
			
			if(this.get('shadow')){
				this.dom.style.boxShadow = this.get('shadowStyle');
			}
			
			this.wrap.appendChild(this.dom);
			
			var self = this;
			
			this.T.on('mouseover',function(e,m){
				self.show(e,m);	
			}).on('mouseout',function(e,m){
				self.hidden(e,m);	
			}).on('mousemove',function(e,m){
				self.follow(e,m);
			});
			
			
			
		}
});/**
 * @overview this component use for abc
 * @component#$.Legend
 * @extend#$.Component
 */
$.Legend = $.extend($.Component, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Legend.superclass.configure.apply(this, arguments);

		/**
		 * indicate the legend's type
		 */
		this.type = 'legend';

		this.set({
			data : undefined,
			width : 'auto',
			column : 1,
			row : 'max',
			maxwidth : 0,
			line_height : 16,
			/**
			 * @cfg {String} the shape of legend' sign (default to 'square') The
			 *      following list provides all available value you can use：
			 * @Option 'round'
			 * @Option 'square'
			 * @Option 'round-bar'
			 * @Option 'square-bar'
			 */
			sign : 'square',
			/**
			 * @cfg {Number} the size of legend' sign (default to 12)
			 */
			sign_size : 12,
			/**
			 * @cfg {Number} the distance of legend' sign and text (default to
			 *      5)
			 */
			sign_space : 5,
			legendspace : 5,
			text_with_sign_color : false,
			/**
			 * @cfg {String} this property specifies the horizontal position of
			 *      the legend in an module (defaults to 'right') The following
			 *      list provides all available value you can use：
			 * @Option 'left'
			 * @Option 'center' Only applies when valign = 'top|bottom'
			 * @Option 'right'
			 */
			align : 'right',

			/**
			 * @cfg {String} this property specifies the vertical position of
			 *      the legend in an module (defaults to 'middle') Available
			 *      value are:
			 * @Option 'top'
			 * @Option 'middle' Only applies when align = 'left|right'
			 * @Option 'bottom'
			 */
			valign : 'middle'
		});

		this.registerEvent('drawCell', 'analysing', 'drawRaw');

	},
	drawCell : function(x, y, text, color) {
		var s = this.get('sign_size'), n = this.get('sign');
		if (n == 'round') {
			this.T.round(x + s / 2, y + s / 2, s / 2, color);
		} else if (n == 'round-bar') {
			this.T.rectangle(x, y + s * 5 / 12, s, s / 6, color);
			this.T.round(x + s / 2, y + s / 2, s / 4, color);
		} else if (n == 'square-bar') {
			this.T.rectangle(x, y + s * 5 / 12, s, s / 6, color);
			this.T.rectangle(x + s / 4, y + s / 4, s / 2, s / 2, color);
		} else {
			this.T.rectangle(x, y, s, s, color);
		}
		var textcolor = this.get('color');

		if (this.get('text_with_sign_color')) {
			textcolor = color;
		}
		this.T.fillText(text, x + this.get('signwidth'), y + s / 2, this.get('textwidth'), textcolor);

		this.fireEvent(this, 'drawCell', [x, y, text, color]);
	},
	drawRow : function(suffix, x, y) {
		var d;
		for ( var j = 0; j < this.get('column'); j++) {
			d = this.data[suffix];
			if (suffix < this.data.length) {
				this.fireEvent(this, 'drawCell', [d]);
				this.drawCell(x, y, d.text, d.color);
				d.x = x;
				d.y = y;
			}
			x += this.columnwidth[j] + this.get('signwidth') + this.get('legendspace');
			suffix++;
		}
	},
	isEventValid : function(e) {
		if (e.offsetX > this.x && e.offsetX < (this.x + this.width) && e.offsetY > this.y && e.offsetY < (this.y + this.height)) {
			for ( var i = 0; i < this.data.length; i++) {
				if (e.offsetX > this.data[i].x && e.offsetX < (this.data[i].x + this.data[i].width + this.get('signwidth')) && e.offsetY > this.data[i].y
						&& e.offsetY < (this.data[i].y + this.get('line_height'))) {
					return {
						valid : true,
						value : i,
						target : this.data[i]
					};
				}
			}
		}
		return {
			valid : false
		};
	},
	doDraw : function() {
		if (this.get('border.enable'))
			this.T.drawBorder(this.x, this.y, this.width, this.height, this.get('border.width'), this.get('border.color'), this.get('border.radius'), this.get('fill_color'),
					false, this.get('shadow'), this.get('shadow_color'), this.get('shadow_blur'), this.get('shadow_offsetx'), this.get('shadow_offsety'));
		
		this.T.textStyle('left', 'middle', $.getFont(this.get('fontweight'), this.get('fontsize'), this.get('font')));
		
		var x = this.x + this.get('padding_left'), y = this.y + this.get('padding_top'), text, c = this.get('column'), r = this.get('row');
		
		for ( var i = 0; i < r; i++) {
			this.fireEvent(this, 'drawRaw', [i * c]);
			this.drawRow(i * c, x, y);
			y += this.get('line_height');
		}

	},
	doConfig : function() {
		$.Legend.superclass.doConfig.call(this);
		$.Assert.isNotEmpty(this.get('data'), this.type + '[data]');

		var suffix = 0, maxwidth = w = this.get('width'), width = 0, wauto = (w == 'auto'), ss = this.get('sign_size'), c = $.isNumber(this.get('column')), r = $
				.isNumber(this.get('row')), L = this.data.length, d,h,g=this.container;

		this.push('signwidth', (ss + this.get('sign_space')));

		if (this.get('line_height') < ss) {
			this.push('line_height', ss + ss / 5);
		}

		if (!c && !r)
			c = 1;
		if (c && !r)
			this.push('row', Math.ceil(L / this.get('column')));
		if (!c && r)
			this.push('column', Math.ceil(L / this.get('row')));

		c = this.get('column');
		r = this.get('row');

		this.columnwidth = new Array(c);

		if (wauto) {
			this.T.textFont(this.get('fontStyle'));
			maxwidth = 0;// 行最大宽度
		}

		// calculate the width each item will used
		for ( var i = 0; i < L; i++) {
			d = this.data[i];
			$.merge(d, this.fireEvent(this, 'analysing', [d, i]));
			d.text = d.text || d.name;
			d.width = this.T.measureText(d.text);
		}

		// calculate the each column's width it will used
		for ( var i = 0; i < c; i++) {
			width = 0;// 初始化宽度
			suffix = i;
			while (suffix < L) {
				width = Math.max(width, this.data[suffix].width);
				suffix += c;
			}
			this.columnwidth[i] = width;
			maxwidth += width;
		}

		if (wauto) {
			w = this.push('width', maxwidth + this.get('hpadding') + this.get('signwidth') * c + (c - 1) * this.get('legendspace'));
		}

		if (w > this.get('maxwidth')) {
			w = this.push('width', this.get('maxwidth'));
		}

		this.push('textwidth', w - this.get('hpadding') - this.get('signwidth'));

		this.width = w;
		this.height = h = this.push('height', r * this.get('line_height') + this.get('vpadding'));
		
		// if the position is incompatible,rectify it.
		if (this.get('align') == 'center' && this.get('valign') == 'middle') {
			this.push('valign', 'top');
		}

		// if this position incompatible with container,rectify it.
		if (g.get('align') == 'left') {
			if (this.get('valign') == 'middle') {
				this.push('align', 'right');
			}
		}
		
		if (this.get('valign') == 'top') {
			this.y = g.get('t_originy');
		} else if (this.get('valign') == 'bottom') {
			this.y = g.get('b_originy') - h;
		} else {
			this.y = g.get('centery') - h / 2;
		}
		
		if (this.get('align') == 'left') {
			this.x = g.get('l_originx');
		} else if (this.get('align') == 'center') {
			this.x= g.get('centerx') - this.get('textwidth') / 2;
		} else {
			this.x = g.get('r_originx') - w;
		}

		this.x = this.push('originx', this.x + this.get('offsetx'));
		this.y = this.push('originy', this.y + this.get('offsety'));
		
	}
});	/**
	 * @overview this component use for abc
	 * @component#$.Label
	 * @extend#$.Component
	 */
	$.Label = $.extend($.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Label.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the legend's type
			 */
			this.type = 'legend';
			
			this.set({
				 text:'',
				 line_height:16,
				 /**
				  * @cfg {String} the shape of legend' sign (default to 'square')
				  
				  * The following list provides all available value you can use：
				  
				  * @Option 'round'
				  * @Option 'square'
				  */
				 sign:'square',
				 /**
				  * @cfg {Number} the size of legend' sign (default to 12)
				  */
				 sign_size:12,
				 padding:5,
				 offsety:2,
				 sign_space:5,
				 highlight:false,
				 background_color:'#efefef',
				 text_with_sign_color:false,
				 border:{
					radius:2
				 }
			});
			
			this.registerEvent(
				'beforeDrawRow',
				'highlight',
				'drawRow'
			);
				
		},
		isEventValid:function(e){ 
			return {valid:$.inRange(this.labelx,this.labelx+this.width,e.offsetX)&&$.inRange(this.labely,this.labely+this.height,e.offsetY)};
		},
		doDraw:function(opts){
			opts = opts || {};
			if(opts.invoke){
				this.updateLcb(opts.invoke);
			}
			
			/**
			 * when highlight fire
			 */
			if(opts.highlight){
				this.fireEvent(this,'highlight');
			}
			
			/**drawBorder**/
			this.lineFn.call(this);
			this.T.drawBorder(this.labelx,this.labely,this.width,this.height,this.get('border.width'),this.get('border.color'),this.get('border.radius'),this.get('background_color'),false,this.get('shadow'),this.get('shadow_color'),this.get('shadow_blur'),this.get('shadow_offsetx'),this.get('shadow_offsety'));
			
			
			this.T.textStyle('left','top',this.get('fontStyle'));
			
			var x = this.labelx+this.get('padding_left'),
				y = this.labely+this.get('padding_top')+this.get('offsety'),
				ss = this.get('sign_size');
			
			var textcolor = this.get('color');
			if(this.get('text_with_sign_color')){
				textcolor = this.get('scolor');
			}
			if(this.get('sign')=='square'){				
				this.T.rectangle(x,y,ss,ss,this.get('scolor'),1);
			}else{		
				this.T.round(x+ss/2,y+ss/2,ss/2,this.get('scolor'),1);
			}	
			
			this.T.fillText(this.get('text'),x+ss+this.get('sign_space'),y,this.get('textwidth'),textcolor);
		},
		updateLcb:function(L){
			this.lineFn = L.lineFn;
			var XY = L.labelXY.call(this);
			this.labelx = XY.labelx;
			this.labely = XY.labely;
			this.x = L.origin.x;
			this.y = L.origin.y;
			//console.log(this.x+","+this.y+","+this.labelx+","+this.labely);
		},
		doConfig:function(){
			$.Label.superclass.doConfig.call(this);
			
			this.T.textFont($.getFont(this.get('fontweight'),this.get('fontsize'),this.get('font')));
			this.height = this.get('line_height')+this.get('vpadding');
			
			this.width = this.T.measureText(this.get('text'))+this.get('hpadding')+this.get('sign_size')+this.get('sign_space');
			
			var lcb = this.get('lineCB');
			if(lcb){
				this.updateLcb(lcb);
			}
			
			
			
			
			
		}
});	/**
	 * @overview this component use for abc
	 * @component#$.Text
	 * @extend#$.Component
	 */
	$.Text = $.extend($.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Text.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'text';
			
			this.set({
				text:'',
				//textAlign：文字水平对齐方式。可取属性值: start, end, left,right, center。默认值:
				textAlign:'center',
				//textBaseline可取属性值：top, hanging, middle,alphabetic, ideographic, bottom。默认值：alphabetic.
				textBaseline:'top'
			});
			
			this.registerEvent();
			/**
			 * indicate this component not need support event
			 */
			this.preventEvent = true;
		},
		doDraw:function(opts){
			if(this.get('text')!='')
			this.T.text(this.get('text'),this.x,this.y,false,this.get('color'),this.get('textAlign'),this.get('textBaseline'),this.get('fontStyle'));
		},
		doConfig:function(){
			$.Text.superclass.doConfig.call(this);
			
			
			
			
		}
});;(function($){

var inc = Math.PI/90,PI = Math.PI,PI2 = 2*Math.PI,sin=Math.sin,cos=Math.cos,
	fd=function(w,c){
		return w<=1?(Math.floor(c)+0.5):Math.floor(c);
	};
/**
 * @private support an improved API for drawing in canvas
 */
function Cans(c){
	if (typeof c === "string")
        c = document.getElementById(c);
	if(!c||!c['tagName']||c['tagName'].toLowerCase()!='canvas')
		throw new Error("there not a canvas element");
	
	this.canvas = c;
	this.c = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
}

Cans.prototype = {
	css:function(attr,style){
		if($.isDefined(style))
			this.canvas.style[attr] = style;
		else
			return this.canvas.style[attr];
	},
	/* it seem not improve the speed
	isPointInPathArc:function(x,y,radius,s,e,color,ccw,a2r,x0,y0){
		var angle = s,x0,y0,ccw=!!ccw,a2r=!!a2r;
			if(!a2r)
			this.c.moveTo(x,y);
			this.c.beginPath();
			if(a2r)
			this.c.moveTo(x,y);
			this.c.arc(x,y,radius,s,e,ccw);
			this.c.lineTo(x,y);
			return this.c.isPointInPath(x0,y0);
	},
	/*
	/**
	 * draw arc API
	 * @param {Number} x 圆心x
	 * @param {Number} y 圆心y
	 * @param {Number} r 半径
	 * @param {Number} s 起始弧度
	 * @param {Number} e 结束弧度
	 * @param {String} c fill color
	 * @param {Boolean} b border enable
	 * @param {Number} bw border's width
	 * @param {String} bc border's color
	 * @param {Boolean} sw shadow enable
	 * @param {String} swc shadow color
	 * @param {Number} swb shadow blur
	 * @param {Number} swx shadow's offsetx
	 * @param {Number} swy shadow's offsety
	 * @param {Boolean} ccw 方向
	 * @param {Boolean} a2r 是否连接圆心
	 * @param {Boolean} last 是否置于最底层
	 * @return this
	 */
	arc:function(x,y,r,s,e,c,b,bw,bc,sw,swc,swb,swx,swy,ccw,a2r,last){
		var x0,y0,ccw=!!ccw,a2r=!!a2r;
		this.c.save();
		if(!!last)//&&!$.isOpera
			this.c.globalCompositeOperation = "destination-over";
		if(b)
			this.strokeStyle(bw,bc);
		this.shadowOn(sw,swc,swb,swx,swy).fillStyle(c);
		this.c.moveTo(x,y);
		this.c.beginPath();
		this.c.arc(x,y,r,s,e,ccw);
		if(a2r)
			this.c.lineTo(x,y);
		this.c.closePath();
	    this.c.fill();   
	    if(b)
	    	this.c.stroke();
	    this.c.restore();
		return this;
	},
	/**
	 * draw ellipse API
	 * @param {Object} x 圆心坐标
	 * @param {Object} y 圆心坐标
	 * @param {Object} a x轴半径
	 * @param {Object} b y轴半径
	 * @param {Object} s 同arc()
	 * @param {Object} e	  同arc()
	 * @param {String} c   color
	 * @param {Object} ccw 同arc()
	 * @param {Object} a2r 连接圆心
	 */
	ellipse:function(x,y,a,b,s,e,c,bo,bow,boc,sw,swc,swb,swx,swy,ccw,a2r,last){
		var angle = s,ccw=!!ccw,a2r=!!a2r;
			this.c.save();
			if(!!last)
				this.c.globalCompositeOperation = "destination-over";
			if(b)
				this.strokeStyle(bow,boc);
			this.shadowOn(sw,swc,swb,swx,swy).fillStyle(c);
			
			this.c.moveTo(x,y);
			this.c.beginPath();
			if(a2r)
				this.c.moveTo(x,y);
			
			while(angle<=e){
				this.c.lineTo(x+a*cos(angle),y+(ccw?(-b*sin(angle)):(b*sin(angle))));
				angle+=inc;
			}
			this.c.lineTo(x+a*cos(e),y+(ccw?(-b*sin(e)):(b*sin(e))));
			this.c.closePath();
			if(b)
			this.c.stroke();
			this.c.fill();
			this.c.restore();
			return this;
	},
	/**
	 * draw sector
	 * @param {Number} x round x
	 * @param {Number} yround y
	 * @param {Number} r radius
	 * @param {Number} s start radian
	 * @param {Number} e end radian
	 * @param {String} c fill color
	 * @param {Boolean} b border enable
	 * @param {Number} bw border's width
	 * @param {String} bc border's color
	 * @param {Boolean} sw shadow enable
	 * @param {String} swc shadow color
	 * @param {Number} swb shadow blur
	 * @param {Number} swx shadow's offsetx
	 * @param {Number} swy shadow's offsety
	 * @param {Boolean} ccw direction
	 */
	sector:function(x,y,r,s,e,c,b,bw,bc,sw,swc,swb,swx,swy,ccw){
		if(sw){
			//fixed Chrome and Opera bug
			this.arc(x,y,r,s,e,c,b,bw,bc,sw,swc,swb,swx,swy,ccw,true);
			this.arc(x,y,r,s,e,c,b,bw,bc,false,swc,swb,swx,swy,ccw,true);
		}else{
			this.arc(x,y,r,s,e,c,b,bw,bc,false,0,0,0,0,ccw,true);
		}
		return this;
	},
	sector3D:function () {
		var x0,y0,
		sPaint = function(x,y,a,b,s,e,ccw,h,color){
			if((ccw&&e<=PI)||(!ccw&&s>=PI))return false;
			var Lo = function(A,h){
				this.c.lineTo(x+a*cos(A),y+(h||0)+(ccw?(-b*sin(A)):(b*sin(A))));
			};
			s = ccw&&e>PI&&s<PI?PI:s;
			e = !ccw&&s<PI&&e>PI?PI:e;
			var angle = s;
			this.c.fillStyle = $.dark(color);
			this.c.moveTo(x+a*cos(s),y+(ccw?(-b*sin(s)):(b*sin(s))));
			this.c.beginPath();
			while(angle<=e){
				Lo.call(this,angle);
				angle=angle+inc;
			}
			Lo.call(this,e);
			this.c.lineTo(x+a*cos(e),(y+h)+(ccw?(-b*sin(e)):(b*sin(e))));
			angle = e;
			while(angle>=s){
				Lo.call(this,angle,h);
				angle=angle-inc;
			}
			Lo.call(this,s,h);
			this.c.lineTo(x+a*cos(s),y+(ccw?(-b*sin(s)):(b*sin(s))));
			this.c.closePath();
			this.c.fill();
		},
		layerDraw = function(x,y,a,b,ccw,h,A,color){
			this.c.moveTo(x,y);
			this.c.beginPath();
			this.c.fillStyle = $.dark(color);
			this.c.lineTo(x,y+h);
			var x0 = x+a*cos(A);
			var y0 = y+h+(ccw?(-b*sin(A)):(b*sin(A)));
			this.c.lineTo(x0,y0);
			this.c.lineTo(x0,y0-h);
			this.c.lineTo(x,y);
			this.c.closePath();
			this.c.fill();
		},
		layerPaint = function(x,y,a,b,s,e,ccw,h,color){
			var ds = ccw?(s<PI/2||s>1.5*PI):(s>PI/2&&s<1.5*PI),
				de = ccw?(e>PI/2&&e<1.5*PI):(e<PI/2||e>1.5*PI);
			if(!ds&&!de)return false;
			if(ds)
				layerDraw.call(this,x,y,a,b,ccw,h,s,color);
			if(de)
				layerDraw.call(this,x,y,a,b,ccw,h,e,color);
		};
		return function(x,y,a,b,s,e,h,c,bo,bow,boc,sw,swc,swb,swx,swy,ccw,isw){
			//browser opera  has bug when use destination-over and shadow
			sw = sw && !$.isOpera;
			this.c.save();
			this.c.globalCompositeOperation = "destination-over";
			this.c.fillStyle = c;
			//paint inside layer
			layerPaint.call(this,x,y,a,b,s,e,ccw,h,c);
			//paint bottom layer
			this.ellipse(x,y+h,a,b,s,e,c,bo,bow,boc,sw,swc,swb,swx,swy,ccw,true);
			this.c.globalCompositeOperation = "source-over";
			
			//paint top layer
			//var g = this.avgRadialGradient(x,y,0,x,y,a,[$.light(c,0.1),$.dark(c,0.05)]);
			this.ellipse(x,y,a,b,s,e,c,bo,bow,boc,false,swc,swb,swx,swy,ccw,true);
			//paint outside layer
			sPaint.call(this,x,y,a,b,s,e,ccw,h,c);
			
			this.c.restore();
			return this;
		}
	}(),
	textStyle:function(a,l,f){
		return this.textAlign(a).textBaseline(l).textFont(f);
	},
	strokeStyle:function(w,c,j){
		if(w)
		this.c.lineWidth = w;
		if(c)
		this.c.strokeStyle = c;
		if(j)
		this.c.lineJoin = j;
		return this;
	},
	globalAlpha:function(v){
		if(v)
		this.c.globalAlpha = v;
		return this;
	},
	fillStyle:function(c){
		if(c)
		this.c.fillStyle = c;
		return this;
	},
	textAlign:function(a){
		if(a)
		this.c.textAlign =a;
		return this;
	},
	textBaseline:function(l){
		if(l)
		this.c.textBaseline =l;
		return this;
	},
	textFont:function(font){
		if(font)
		this.c.font = font;
		return this;
	},
	shadowOn:function(s,c,b,x,y){
		if($.isString(s)){
			y = x;x = b;b = c;c = s;c = true;
		}
		if(s){
			this.c.shadowColor = c; 
			this.c.shadowBlur = b;
			this.c.shadowOffsetX = x;   
			this.c.shadowOffsetY = y; 
		}
		return this;
	},
	shadowOff:function(){
		this.c.shadowColor = 'white'; 
		this.c.shadowBlur = this.c.shadowOffsetX= this.c.shadowOffsetY = 0;
	},
	avgLinearGradient:function(xs,ys,xe,ye,c){
		var g = this.createLinearGradient(xs, ys, xe, ye);
		for(var i =0;i<c.length;i++	)
			g.addColorStop(i/(c.length-1),c[i]);   
		return g;
	},
	createLinearGradient:function(xs, ys, xe, ye){
		return this.c.createLinearGradient(xs, ys, xe, ye);    
	},
	avgRadialGradient:function(xs, ys,rs,xe, ye,re,c){
		var g = this.createRadialGradient(xs,ys,rs,xe,ye,re);
		for(var i =0;i<c.length;i++	)
			g.addColorStop(i/(c.length-1),c[i]);   
		return g;
	},
	createRadialGradient:function(xs, ys,rs,xe, ye,re){
		return this.c.createRadialGradient(xs, ys,rs,xe, ye,re);    
	},
	fillText:function(t,x,y,max,color,mode,lineheight){
		t = t+"";
		max = max || false;
		mode = mode || 'lr'; 
		lineheight = lineheight || 16;
		this.fillStyle(color);
		var T = t.split(mode=='tb'?"":"\n");
		for(var i =0;i<T.length;i++){
			if(max){
				this.c.fillText(T[i],x,y,max);
			}else{
				this.c.fillText(T[i],x,y);
			}
			y+=lineheight;
		}
		return this;
	},
	measureText:function(text){
		return this.c.measureText(text).width;
	},
	moveTo:function(x,y){
		x = x||0;
		y = y ||0;
		this.c.moveTo(x,y);
		return this;
	},
	lineTo:function(x,y){
		x = x||0;
		y = y ||0;
		this.c.lineTo(x,y);
		return this;
	},
	save:function(){this.c.save();return this;},
	restore:function(){this.c.restore();return this;},
	beginPath:function(){
		this.c.beginPath();
		return this;
	},
	closePath:function(){
		this.c.closePath();
		return this;
	},
	stroke:function(){
		this.c.stroke();
		return this;
	},
	fill:function(){
		this.c.fill();
		return this;
	},
	text:function(text,x,y,max,color,align,line,font,mode,lineheight){
		this.c.save();
		this.textStyle(align,line,font);
		this.fillText(text,x,y,max,color,mode,lineheight);
		this.c.restore();
		return this;
	},
	//can use cube3D instead of this?
	cube:function(x,y,xv,yv,width,height,zdeep,bg,b,bw,bc,sw,swc,swb,swx,swy){
		x = fd(bw,x);
		y = fd(bw,y);
		zdeep = (zdeep&&zdeep>0)?zdeep:width;
		var x1=x+zdeep*xv,y1=y-zdeep*yv;
		x1 = fd(bw,x1);
		y1 = fd(bw,y1);
		//styles -> top-front-right
		if(sw){
			this.polygon(bg,b,bw,bc,sw,swc,swb,swx,swy,false,[x,y,x1,y1,x1+width,y1,x+width,y]);
			this.polygon(bg,b,bw,bc,sw,swc,swb,swx,swy,false,[x,y,x,y+height,x+width,y+height,x+width,y]);
			this.polygon(bg,b,bw,bc,sw,swc,swb,swx,swy,false,[x+width,y,x1+width,y1,x1+width,y1+height,x+width,y+height]);
		}
		/**
		 * clear the shadow on the body
		 */
		this.polygon($.dark(bg),b,bw,bc,false,swc,swb,swx,swy,false,[x,y,x1,y1,x1+width,y1,x+width,y]);
		this.polygon(bg,b,bw,bc,false,swc,swb,swx,swy,false,[x,y,x,y+height,x+width,y+height,x+width,y]);
		this.polygon($.dark(bg),b,bw,bc,false,swc,swb,swx,swy,false,[x+width,y,x1+width,y1,x1+width,y1+height,x+width,y+height]);
		return this;
	},
	/**
	 * cube3D
	 * @param {Number} x 左下角前面x坐标
	 * @param {Number} y 左下角前面y坐标	
	 * @param {Number} rotatex x旋转值,默认角度为单位
	 * @param {Number} rotatey y旋转值,默认角度为单位
	 * @param {Number} width 宽度
	 * @param {Number} height 高度
	 * @param {Number} zh z轴长
	 * @param {Number} border 边框
	 * @param {Number} linewidth 
	 * @param {String} bcolor
	 * @param {Array} styles 立方体各个面样式,包含:{alpha,color},共六个面
	 * @return this
	 */
	cube3D:function(x,y,rotatex,rotatey,angle,w,h,zh,b,bw,bc,styles){
		//styles -> 下底-底-左-右-上-前
		x = fd(bw,x);
		y = fd(bw,y);
		//Deep of Z'axis
		zh = (!zh||zh==0)?w:zh;
		
		if(angle){
			var P = $.vectorP2P(rotatex,rotatey);
				rotatex=x+zh*P.x,
				rotatey=y-zh*P.y;
		}else{
			rotatex=x+zh*rotatex,
			rotatey=y-zh*rotatey;
		}
		
		while(styles.length<6)
			styles.push(false);
		
		rotatex = fd(bw,rotatex);
		rotatey = fd(bw,rotatey);
		
		var side = [];
		
		if(rotatey<0){
			if($.isObject(styles[4]))
				side.push($.applyIf({points:[x,y-h,rotatex,rotatey-h,rotatex+w,rotatey-h,x+w,y-h]},styles[4]));
		}else{
			if($.isObject(styles[0]))
				side.push($.applyIf({points:[x,y,rotatex,rotatey,rotatex+w,rotatey,x+w,y]},styles[0]));
		}
		
		if($.isObject(styles[1]))
			side.push($.applyIf({points:[rotatex,rotatey,rotatex,rotatey-h,rotatex+w,rotatey-h,rotatex+w,rotatey]},styles[1]));
		
		if($.isObject(styles[2]))
			side.push($.applyIf({points:[x,y,x,y-h,rotatex,rotatey-h,rotatex,rotatey]},styles[2]));
		
		if($.isObject(styles[3]))
			side.push($.applyIf({points:[x+w,y,x+w,y-h,rotatex+w,rotatey-h,rotatex+w,rotatey]},styles[3]));
		
		if(rotatey<0){
			if($.isObject(styles[0]))
				side.push($.applyIf({points:[x,y,rotatex,rotatey,rotatex+w,rotatey,x+w,y]},styles[0]));
		}else{
			if($.isObject(styles[4]))
				side.push($.applyIf({points:[x,y-h,rotatex,rotatey-h,rotatex+w,rotatey-h,x+w,y-h]},styles[4]));
		}
		
		if($.isObject(styles[5]))
			side.push($.applyIf({points:[x,y,x,y-h,x+w,y-h,x+w,y]},styles[5]));
				
		for(var i=0;i<side.length;i++){
			this.polygon(side[i].color,b,bw,bc,side[i].shadow,side[i].shadowColor,side[i].blur,side[i].sx,side[i].sy,side[i].alpha,side[i].points);
		}
		return this;
	},
	/**
	 * polygon
	 * @param {Object} border
	 * @param {Object} linewidth
	 * @param {Object} bcolor
	 * @param {Object} bgcolor
	 * @param {Object} alpham
	 * @param {Object} points
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	polygon:function(bg,b,bw,bc,sw,swc,swb,swx,swy,alpham,points){
		if(points.length<2)return;
		this.c.save();
		this.strokeStyle(bw,bc);
		this.c.beginPath();
		this.fillStyle(bg)
			.globalAlpha(alpham)
			.shadowOn(sw,swc,swb,swx,swy)
			.moveTo(points[0],points[1]);
		for(var i=2;i<points.length;i+=2)
			this.lineTo(points[i],points[i+1]);
		this.c.closePath();
		if(b)
			this.c.stroke();
		this.c.fill();
		this.c.restore();
		return this;
	},
	line:function(x1,y1,x2,y2,w,c,last){
		if(!w||w==0)return this;
		this.c.save();
		if(!!last)
			this.c.globalCompositeOperation = "destination-over";
		
		x1 = fd(w,x1);
		y1 = fd(w,y1);
		x2 = fd(w,x2);
		y2 = fd(w,y2);
		
		this.c.beginPath();
		this.strokeStyle(w,c).moveTo(x1,y1).lineTo(x2,y2).c.stroke();
		this.c.closePath();
		this.c.restore();
		return this;
	},
	round:function(x,y,r,c,bw,bc){
		this.c.beginPath();
		this.c.fillStyle = c;
		this.c.arc(x, y, r, 0, PI2, false);
		this.c.closePath();
		this.c.fill();
		if(bw){
			this.c.lineWidth = bw;
			this.c.strokeStyle = bc || '#010101';
			this.c.stroke();
		}
		return this;
	},
	backgound:function(x,y,w,h,bgcolor){
		this.c.save();
		this.c.globalCompositeOperation = "destination-over";
		this.c.translate(x,y);
		this.c.beginPath();
		this.c.fillStyle = bgcolor;
		this.c.fillRect(0,0,w,h);
		this.c.restore();
		return this;
	},
	rectangle:function(x,y,w,h,bgcolor,border,linewidth,bcolor,sw,swc,swb,swx,swy){
		this.c.save();
		x = fd(linewidth,x);
		y = fd(linewidth,y);
		this.c.translate(x,y);
		this.c.beginPath();
		this.c.fillStyle = bgcolor;
		this.shadowOn(sw,swc,swb,swx,swy);
		if(border&&$.isNumber(linewidth)){
			this.c.lineWidth = linewidth;
			this.c.strokeStyle = bcolor;
			this.c.strokeRect(0,0,w,h);
		}
		
		this.c.fillRect(0,0,w,h);
		
		if(border&&$.isArray(linewidth)){
			this.c.strokeStyle = bcolor;
			this.line(0,0,w,0,linewidth[0],bcolor);
			this.line(w,0,w,h,linewidth[1],bcolor);
			this.line(0,h,w,h,linewidth[2],bcolor);
			this.line(0,0,0,h,linewidth[3],bcolor);
		}
		this.c.restore();
		return this;
	},
	clearRect:function(x,y,w,h){
		x = x || 0;
		y = y || 0;
		w = w || this.width;
		h = h || this.height;
		this.c.clearRect(x, y, w, h); 
		return this;
	},
	drawBorder:function(x,y,w,h,line,color,round,bgcolor,last,shadow,scolor,blur,offsetx,offsety){
		this.c.save();
		var x0 = fd(line,x);
		var y0 = fd(line,y);
		if(x0!=x){
			x = x0;w -=1;
		}
		if(y0!=y){
			y = y0;h -=1;
		}
		this.c.translate(x,y);
		this.c.lineWidth = line;
		this.c.strokeStyle = color;
		
		if(!!last){
			this.c.globalCompositeOperation = "destination-over";
		}
		if(bgcolor){
			this.c.fillStyle = bgcolor;
		}
		
		round = round==0?0:$.parseBorder(round);
		
		if($.isArray(round)){//draw a round corners border
			this.c.beginPath();
			this.c.moveTo(round[0],0);
			this.c.lineTo(w-round[1],0);
			this.c.arcTo(w,0,w,round[1],round[1]);
			this.c.lineTo(w,h-round[2]);
			this.c.arcTo(w,h,w-round[2],h,round[2]);
			this.c.lineTo(round[3],h);
			this.c.arcTo(0,h,0,h-round[3],round[3]);
			this.c.lineTo(0,round[0]);
			this.c.arcTo(0,0,round[0],0,round[0]);
			this.c.closePath();
			this.shadowOn(shadow,scolor,blur,offsetx,offsety);
			if(bgcolor){
				this.c.fill();
			}
			if(shadow)
			this.shadowOff();
			this.c.globalCompositeOperation = "source-over";
			
			this.c.stroke();
		}else{//draw a rectangular border	
			this.shadowOn(shadow,scolor,blur,offsetx,offsety);
			if(bgcolor){
				this.c.fillRect(0,0,w,h);
			}
			if(shadow)
			this.shadowOff();
			this.c.strokeRect(0,0,w,h);
		}
		this.c.restore();
		return this;
	},
	toImageURL:function(){
		return this.canvas.toDataURL("image/png");
	},
	addEvent:function(type,fn,useCapture){
		$.Event.addEvent(this.canvas,type,fn,useCapture);
	}
	
	
}


//window.Cans = Cans;
/**
 * @overview this component use for abc
 * @component#$.Chart
 * @extend#$.Painter
 */
$.Chart = $.extend($.Painter,{
		/**
		 * @cfg {TypeName} 
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Chart.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the element's type
			 */
			this.type = 'chart';
			
			this.set({
				 render:'',
				 data:[],
				 /**
				  * @cfg {Number} the width of this canvas
				  */
				 width:undefined,
				 /**
				  * @cfg {Number} the height of this canvas
				  */
				 height:undefined,
				 /**
				  * @cfg {String} this property specifies the horizontal alignment of graph in an module (defaults to 'center')
				  */
				 align:'center',
				 /**
				  * @cfg {Boolean} indicate if  the chart clear segment of canvas(defaults to true)
				  */
				 segmentRect:true,
				 /**
				  *@cfg {String} if the title is empty,then will not display (default to '')
				  */
				 title:'',
				 /**
				  * @cfg {String}
				  * Available value are:
				  * @Option 'left'
				  * @Option 'center'
				  * @Option 'right'
				  */
				 title_align:'center',
				 /**
				  * @cfg {String}
				  * Available value are:
				  * @Option 'top'
				  * @Option 'middle' Only applies when title_writingmode = 'tb'
				  * @Option 'bottom' 
				  */
				 title_valign:'top',
				 /**
				  * @cfg {String}
				  * Available value are:
				  * @Option 'lr,'tb'
				  */
				 title_writingmode:'lr',
				 /**
				  * @cfg {TypeName} 
				  */
				 title_font:'Verdana',
				 title_fontweight:'bold',
				 title_fontsize:20,
				 title_color:'black',
				 title_height:25,
				 /**
				  * @cfg {Boolean} 
				 */
				 animation:false,
				 /**
				 * @cfg {Function} the custom funtion for animation
				 */
				 doAnimationFn:$.emptyFn,
				 /**
				 * @cfg {String} (default to 'ease-in-out')
				 * Available value are:
				 * @Option 'easeIn'
				 * @Option 'easeOut'
				 * @Option 'easeInOut'
				 * @Option 'linear'
				 */
				 animation_timing_function:'easeInOut',
				 /**
				 * @cfg {Number} 
				 */
				 duration_animation_duration:1600,
				 /**
				  *@cfg {Boolean} if the legend displayed (default to false)
				  */
				 legend:{
					enable:false
				 },
				 /**
				  *@cfg {Boolean} if the tip enabled (default to false)
				  */
				 tip:{
					enable:false
				 }
			});
				
			/**
			 * register the common event
			 */
			this.registerEvent(
				'parseData',
				'parseTipText',
				'parseLabelText',
				'beforeAnimation',
				'afterAnimation'
			);
			
			this.T = null;
			this.rendered = false;
			
			this.animationed = false;
			
			this.components = [];
			this.total = 0;
			
		},
		pushComponent:function(c,b){
			if($.isArray(c)){
				if(!!b)
					this.components = c.concat(this.components);
				else
					this.components = this.components.concat(c);
			}else{
				if(!!b)
					this.components = [c].concat(this.components);
				else
					this.components.push(c);
			}
			
		},
		plugin:function(c,b){
			this.init();
			c.inject(this);
			this.pushComponent(c,b);
		},
		toImageURL:function(){
			return this.T.toImageURL();
		},
		segmentRect:function(){
			this.T.clearRect(this.get('l_originx'),this.get('t_originy'),this.get('client_width'),this.get('client_height'));
		},
		resetCanvas:function(){
			this.T.backgound(
					this.get('l_originx'),
					this.get('t_originy'),
					this.get('client_width'),
					this.get('client_height'),
					this.get('background_color'));
		},
		animation:function(){
			return function(self){
				//console.time('Test for animation');
				//clear the part of canvas
				self.segmentRect();
				//doAnimation of implement
				self.doAnimation(self.variable.animation.time,self.duration);
				//fill the background
				self.resetCanvas();
				if(self.variable.animation.time<self.duration){
					self.variable.animation.time++;setTimeout(function(){self.animation(self)},$.INTERVAL)}
				else{
					setTimeout(function(){
						self.variable.animation.time = 0;
						self.animationed = true;
						self.draw();
						self.processAnimation = false;
						self.fireEvent(this,'afterAnimation',[this]);	
					},$.INTERVAL);
				}
				//console.timeEnd('Test for animation');
			}
		}(),
		doAnimation:function(t,d){
			this.get('doAnimationFn').call(this,t,d);
		},
		commonDraw:function(){
			$.Assert.isTrue(this.rendered,this.type+' has not rendered.');
			$.Assert.isTrue(this.initialization,this.type+' has initialize failed.');
			$.Assert.gtZero(this.data.length,this.type+'\'data is empty.');
			
			//console.time('Test for draw');
			
			if(!this.redraw){
				this.title();
				if(this.get('border.enable')){
					this.T.drawBorder(0,0,this.width,this.height,this.get('border.width'),this.get('border.color'),this.get('border.radius'),this.get('background_color'),true);
				}else{
					this.T.backgound(0,0,this.width,this.height,this.get('background_color'));
				}
			}
			this.redraw = true;
			
			if(!this.animationed&&this.get('animation')){
				this.fireEvent(this,'beforeAnimation',[this]);
				this.animation(this);
				return;
			}
			
			this.segmentRect(); 
			
			for(var i =0;i<this.components.length;i++){
				 this.components[i].draw();
			}
			 
			this.resetCanvas();
			//console.timeEnd('Test for draw');
			
		},
		/**
		 * Draw the title when title not empty
		 */
		title:function(){
			if(this.get('title')=='')
				return;
			if(this.get('title_writingmode')=='tb'){
								
			}else{
				if(this.get('title_align')=='left'){
					this.push('title_originx',this.get('padding_left'));
				}else if(this.get('title_align')=='right'){
					this.push('title_originx',this.width-this.get('padding_right'));
				}else{
					this.push('title_originx',this.get('client_width')/2);//goto midline
				}	
				this.T.textAlign(this.get('title_align'));
				if(this.get('title_valign')=='bottom'){
					this.push('title_originy',this.height-this.get('padding_bottom'));
				}else{
					this.push('title_originy',this.get('padding_top'));	
				}
				this.T.textBaseline(this.get('title_valign'));
				
			}
			this.T.textFont($.getFont(this.get('title_fontweight'),this.get('title_fontsize'),this.get('title_font')));
			this.T.fillText(this.get('title'),this.get('title_originx'),this.get('title_originy'),this.get('client_width'),this.get('title_color'));
		},
		create:function(shell){
			//默认的要计算为warp的div
			this.width =  this.push('width',this.get('width')||400);
			this.height = this.push('height',this.get('height')||300);
			var style = "width:"+this.width+"px;height:"+this.height+"px;padding:0px;overflow:hidden;position:relative;";
			
			
			
			var id = $.iGather(this.type);
			this.shellid = $.iGather(this.type+"-shell");
			var html  = "<div id='"+this.shellid+"' style='"+style+"'>" +
							"<canvas id= '"+id+"'  width='"+this.width+"' height="+this.height+"'>" +
								"<p>Your browser does not support the canvas element</p>" +
							"</canvas>" +
						"</div>";
			//also use appendChild()
			shell.innerHTML = html;
			
			this.element = document.getElementById(id);
			this.shell = document.getElementById(this.shellid);
			//this.element.width = this.width;
			//this.element.height = this.height;
			/**
			 * the base canvas wrap for draw
			 */
			this.T = this.target = new Cans(this.element);
			
			this.rendered  = true;
		},
		render:function(id){
			this.push('render',id);
		},
		initialize:function(){
			if(!this.rendered){
				var r = this.get('render');
				if (typeof r == "string"&&document.getElementById(r))
					this.create(document.getElementById(r));
				else if(typeof r =='object')
					this.create(r);
			}
			
			if(this.get('data').length>0&&this.rendered&&!this.initialization){
				$.Interface.parser.call(this);
				this.doConfig();
				this.initialization = true;
			}
		},
		doConfig:function(){
			$.Chart.superclass.doConfig.call(this);
			//for compress
			var self = this,E=self.variable.event;
			
			if(self.get('animation')){
				self.processAnimation = self.get('animation');
				self.duration = Math.ceil(self.get('duration_animation_duration')*$.FRAME/1000);
				self.variable.animation = {time:0};
				self.animationArithmetic = $.getAnimationArithmetic(self.get('animation_timing_function'));
			}
			
			if(self.is3D()){
				$.Interface._3D.call(self);
			}
			
			self.T.strokeStyle(self.get('brushsize'),self.get('strokeStyle'),self.get('lineJoin'));
			
			self.T.addEvent('click',function(e){self.fireEvent(self,'click',[$.Event.fix(e)]);},false);
			
			self.T.addEvent('mousemove',function(e){self.fireEvent(self,'mousemove',[$.Event.fix(e)]);},false);
			
			self.on('click',function(e){
				if(self.processAnimation)return;
				//console.time('Test for click');
				var cot;
				for(var i = 0;i < self.components.length;i++){
					cot = self.components[i];
					if(cot.preventEvent)continue;
					var M = cot.isMouseOver(e);
					if(M.valid)
						self.components[i].fireEvent(cot,'click',[e,M]);
				}
				//console.timeEnd('Test for click');
			});
			
			self.on('mousemove',function(e){
				if(self.processAnimation)return;
				//console.time('Test for doMouseMove');
				var O = false;
				for(var i = 0;i < self.components.length;i++){
					var cot = self.components[i],cE = cot.variable.event;
					if(cot.preventEvent)continue;
					var M = cot.isMouseOver(e);
					if(M.valid){
						O = true;
						if(!E.mouseover){
							E.mouseover = true;
							self.T.css("cursor","pointer");
							self.fireEvent(self,'mouseover',[e]);
						}
						if(!cE.mouseover){
							cE.mouseover = true;
							cot.fireEvent(cot,'mouseover',[e,M]);
						}
						cot.fireEvent(cot,'mousemove',[e,M]);
					}else{
						if(cE.mouseover){
							cE.mouseover = false;
							cot.fireEvent(cot,'mouseout',[e,M]);
						}
					}
				}
				
				if(!O&&E.mouseover){
					E.mouseover = false;
					self.T.css("cursor","default");
					self.fireEvent(self,'mouseout',[e]);
				}
				//console.timeEnd('Test for doMouseMove');
			});
			$.Assert.isArray(self.data);
			
			self.push('l_originx',self.get('padding_left'));
			self.push('r_originx',self.width - self.get('padding_right'));
			self.push('t_originy',self.get('padding_top'));
			self.push('b_originy',self.height-self.get('padding_bottom'));
					
			var offx = 0,offy=0;
			
			if(self.get('title')!=''){
				if(self.get('title_writingmode')=='tb'){//竖直排列
					offx = self.get('title_height');
					if(self.get('title_align')=='left'){
						self.push('l_originx',self.get('l_originx')+self.get('title_height'));
					}else{
						self.push('r_originx',self.width-self.get('l_originx')-self.get('title_height'));
					}
				}else{//横向排列
					offy = self.get('title_height');
					
					if(self.get('title_align')=='left'){
						self.push('title_originx',self.get('padding_left'));
					}else if(self.get('title_align')=='right'){
						self.push('title_originx',self.width-self.get('padding_right'));
					}else{
						self.push('title_originx',self.get('client_width')/2);//goto midline
					}	
					if(self.get('title_valign')=='bottom'){
						self.push('title_originy',self.height-self.get('padding_bottom'));
						self.push('b_originy',self.height-self.get('b_originy')-self.get('title_height'));
					}else{
						self.push('t_originy',self.get('t_originy')+self.get('title_height'));
						self.push('title_originy',self.get('padding_top'));	
					}
				}
			}	
			
			self.push('client_width',(self.get('width') - self.get('hpadding')-offx));
			self.push('client_height',(self.get('height') - self.get('vpadding')-offy));
			
			self.push('minDistance',Math.min(self.get('client_width'),self.get('client_height')));
			self.push('maxDistance',Math.max(self.get('client_width'),self.get('client_height')));
			self.push('minstr',self.get('client_width')<self.get('client_height')?'width':'height');
			
			self.push('centerx',self.get('l_originx')+self.get('client_width')/2);
			self.push('centery',self.get('t_originy')+self.get('client_height')/2);
			/*
			if(self.get('border.enable')){
				var round = $.parseBorder(self.get('border.radius'));
				self.push('radius_top',round[0]);
				self.push('radius_right',round[1]);
				self.push('radius_bottom',round[2]);
				self.push('radius_left',round[3]);
			}*/
			
			/**
			 * legend
			 */
			if(self.get('legend.enable')){
				self.legend = new $.Legend($.apply({
				 	 maxwidth:self.get('client_width'),
				 	 data:self.data
				},self.get('legend')),self);
				
				self.components.push(self.legend);
			}
			/**
			 * tip's wrap
			 */
			if(self.get('tip.enable')){
				self.push('tip.wrap',self.shell);
			}
			
		}
});
})($);
	/**
	 * @overview this component use for abc
	 * @component#$.Custom
	 * @extend#$.Component
	 */
	$.Custom = $.extend($.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Custom.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'custom';
			
			this.set({
				drawFn:$.emptyFn,
				eventValid:null	
			});
			
			this.registerEvent();
			
		},
		doDraw:function(opts){
			this.get('drawFn').call(this,opts);
		},
		isEventValid:function(e){
			if($.isFunction(this.get('eventValid')))
			return this.get('eventValid').call(this,e);
			return {valid:false};
		},
		doConfig:function(){
			$.Custom.superclass.doConfig.call(this);
		}
});	/**
	 * @overview
	 * this is inner use for axis
	 * 用于坐标系上坐标刻度的配置
	 * @component#$.KeDu
	 * @extend#$.Component
	 */
	$.KeDu = $.extend($.Component,{
			configure:function(){
				
				/**
				 * invoked the super class's  configuration
				 */
				$.KeDu.superclass.configure.apply(this,arguments);
				
				/**
				 * indicate the component's type
				 */
				this.type = 'kedu';
				
				this.set({
					 /**
					  * @cfg {String} the axis's type(default to 'h')
					  * Available value are:
					  * @Option 'h' :horizontal
					  * @Option 'v' :vertical
					 */
					 which:'h',
					 /**
					 * @inner {Number}
					 */
					 distance:undefined,
					 start_scale:0,
					 end_scale:undefined,
					 min_scale:undefined,
					 max_scale:undefined,
					 scale:undefined,
					 scale_share:5,
					 /**
					  *@cfg {Boolean} 是否显示刻度
				 	  */
					 scale_line_enable:true,
					 scale_size:1,
					 scale_width:4,
					 scale_color:'#333333',
					 scaleAlign:'center',
					 labels:[],
					 /**
					  * @cfg {Boolean} indicate whether the grid is accord with kedu
					  */
					 kedu2grid:true,
					 text_height:16,
					 text_space:4,
					 textAlign:'left',
					 /**
					  *@cfg {Number} 显示百分比精确小数点位数
				 	  */
					 decimalsnum:0,
					 /**
					  * @cfg {String} the style of overlapping(default to 'none')
					  * Available value are:
					  * @Option 'square'
					  * @Option 'round'
					  * @Option 'none'
					 */
					 join_style:'none',
					 /**
					  *@cfg {Number}
					 */
					 join_size:2,
					 label:'',
					 label_position:''
					 
				});
				
				this.registerEvent(
				   /**
					 *@cfg {Function} the event when parse text、you can return a object like this:{text:'',textX:100,textY:100} to override the given
					 * Available param are:
					 * @param text:item's text
					 * @param textX:coordinate-x of item's text
					 * @param textY:coordinate-y of item's text
					 * @param index:item's index
					 * (text,x,y,index)
				 	 */
					'parseText'
				);
				
				this.items = [];
				this.number = 0;
				
			},
			isEventValid:function(e){
				return {valid:false};
			},
			/**
			 * 按照从左自右,从上至下原则
			 */
			doDraw:function(){
				var x=y=x0=y0=tx=ty=0,
					w = this.get('scale_width'),
					w2 = w/2,
					sa=this.get('scaleAlign'),
					ta=this.get('textAlign'),
					ts=this.get('text_space');
				if(this.isHorizontal){
					if(sa=='top'){
						y = -w;
					}else if(sa=='center'){
						y = - w2;
						y0 = w2;
					}else{
						y0 =w;
					}
					this.T.textAlign('center');
					if(ta=='top'){
						ty = -ts;
						this.T.textBaseline('bottom');
					}else{
						ty = ts;
						this.T.textBaseline('top');
					}
				}else{
					if(sa=='left'){
						x = -w;
					}else if(sa=='center'){
						x = - w2;
						x0 = w2;
					}else{
						x0 = w;
					}
					this.T.textBaseline('middle');
					if(ta=='right'){
						this.T.textAlign('left');
						tx = ts;	
					}else{
						this.T.textAlign('right');
						tx = -ts;
					}
				}
				//将上述的配置部分转移到config中?
				
				//每一个text的个性化问题?
				this.T.textFont(this.get('fontStyle'));
				
				for(var i =0;i<this.items.length;i++){
					if(this.get('scale_line_enable'))
					this.T.line(this.items[i].x+x,this.items[i].y+y,this.items[i].x+x0,this.items[i].y+y0,this.get('scale_size'),this.get('scale_color'),false);
					
					this.T.fillText(this.items[i].text,this.items[i].textX+tx,this.items[i].textY+ty,false,this.get('color'),'lr',this.get('text_height'));
				}
			},
			doConfig:function(){
				$.KeDu.superclass.doConfig.call(this);
				$.Assert.isNumber(this.get('distance'),'distance');
				
				var customLabel = this.get('labels').length,
					min_scale = this.get('min_scale'),
					max_scale = this.get('max_scale'),
					scale = this.get('scale'),
					end_scale = this.get('end_scale'),
					start_scale = this.get('start_scale');
				
				
				if(customLabel>0){
					this.number = customLabel-1;
				}else{
					$.Assert.isTrue($.isNumber(max_scale)||$.isNumber(end_scale),'max_scale&end_scale');
					
					//end_scale must greater than maxScale
					if(!end_scale||end_scale<max_scale){
						end_scale =  this.push('end_scale',$.ceil(max_scale));
					}
					//startScale must less than minScale
					if(start_scale>min_scale){
						this.push('start_scale',$.floor(min_scale));
					}
					
					if(scale&&scale<end_scale-start_scale){
						this.push('scale_share',(end_scale-start_scale)/scale);
					}
					
					//value of each scale
					if(!scale||scale>end_scale-start_scale){
						scale = this.push('scale',(end_scale-start_scale)/this.get('scale_share'));
					}
					
					this.number = this.get('scale_share');
				}
				
				//the real distance of each scale
				this.push('distanceOne',this.get('valid_distance')/this.number);
				
				var text,maxwidth =0,x,y;
						
				this.T.textFont(this.get('fontStyle'));
				this.push('which',this.get('which').toLowerCase());
				this.isHorizontal = this.get('which')=='h';
				
				//有效宽度仅对水平刻度有效、有效高度仅对垂直高度有效
				for(var i=0;i<=this.number;i++){
					text = customLabel?this.get('labels')[i]:(scale*i+start_scale).toFixed(this.get('decimalsnum'));
					x = this.isHorizontal?this.get('valid_x')+i*this.get('distanceOne'):this.x;
					y = this.isHorizontal?this.y:this.get('valid_y')+this.get('distance')-i*this.get('distanceOne');
					this.items.push($.merge({text:text,x:x,y:y,textX:x,textY:y},this.fireEvent(this,'parseText',[text,x,y,i])));
					maxwidth = Math.max(maxwidth,this.T.measureText(text));
				}
				
				//what does follow code doing?
				this.left = this.right = this.top =this.bottom = 0,
				ts=this.get('text_space');
				ta=this.get('textAlign');
				sa=this.get('scaleAlign'),
				w = this.get('scale_width'),
				w2 = w/2;
				
				if(this.isHorizontal){
					if(sa=='top'){
						this.top = w;
					}else if(sa=='center'){
						this.top = w2;
					}else{
						this.top = 0;
					}
					this.bottom = w - this.top;
					if(ta=='top'){
						this.top +=this.get('text_height') + ts;
					}else{
						this.bottom +=this.get('text_height') + ts;
					}
				}else{
					if(sa=='left'){
						this.left = w;
					}else if(sa=='center'){
						this.left = w2;
					}else{
						this.left = 0;
					}
					this.right = w - this.left;
					if(ta=='left'){
						this.left += maxwidth + ts;
					}else{
						this.right +=maxwidth + ts;
					}
				}
			}
	});
	
	/**
	 * @overview this component use for abc
	 * @component#$.Coordinate2D
	 * @extend#$.Component
	 */
	$.Coordinate2D = $.extend($.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configurationuration
			 */
			$.Coordinate2D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'coordinate2d';
			
			this.set({
				 sign_size:12,
				 sign_space:5,
				 kedu:[],
				 valid_width:undefined,
				 valid_height:undefined,
				 grid_line_width:1,
				 grid_color:'#c4dede',
				 gridlinesVisible:true,
				 /**
				  * @cfg {Boolean} indicate whether the grid is accord with kedu,on the premise of grids is not specify.
				  * this just give a convenient way bulid grid for default.and actual value depend on kedu's kedu2grid
				  */
				 kedu2grid:true,
				 /**
				  * @cfg {Object} this is  grid config for custom.the detailed like this:
				  * way:the manner calculate grid-line (default to 'share_alike')
				  *   *   Available property are:
					  *   @Option share_alike 
					  *   @Option given_value 
			 	  * value: way-share_alike:the number of way-share.given_value:the distance each grid line(unit:pixel)
				  * {
				  *  horizontal:
				  *   {
				  * 	way:'share_alike',
				  * 	value:10
				  *   }
				  *  vertical:
				  *   {
				  * 	way:'given_value',
				  * 	value:40
				  *   }
				  * }
				  */
				 grids:undefined,
				  /**
				  * @cfg {Boolean} the grid line will be ignored when gird and axis overlap
				  */
				 ignoreOverlap:true,
				 ignoreEdge:false,
				 gradient:false,
				 ylabel:'',
				 xlabel:'',
				 color_factor:0.18,
				 background_color:'#FEFEFE',
				 alternate_color:true,
				 crosshair:{
					enable:false
				 },
				 width:undefined,
				 height:undefined,
				 /**
				  *@cfg {Object} rounded to two digit
			 	  */
				 axis:{
					enable:true,
					color:'#666666',
					width:1,
					style:''
				 }
			});
			
			this.registerEvent();
			
			this.kedu = [];
			this.gridlines = [];
		},
		getScale:function(p){
			
			for(var i=0;i<this.kedu.length;i++){
				var k = this.kedu[i];
				if(k.get('position')==p){
					return {
						start:k.get('start_scale'),
						end:k.get('end_scale'),
						distance:k.get('end_scale')-k.get('start_scale')
					};
				}
			}
			return {start:0,end:0,distance:0};
		},
		isEventValid:function(e){
			return {valid:e.offsetX>this.x&&e.offsetX<(this.x+this.get('width'))&&e.offsetY<this.y+this.get('height')&&e.offsetY>this.y};
		},
		doDraw:function(opts){
			
			this.T.rectangle(
						this.x,
						this.y,
						this.get('width'),
						this.get('height'),
						this.get('fill_color'),
						this.get('axis.enable'),
						this.get('axis.width'),
						this.get('axis.color'),
						this.get('shadow'),
						this.get('shadow_color'),
						this.get('shadow_blur'),
						this.get('shadow_offsetx'),
						this.get('shadow_offsety')
					);

			if(this.get('alternate_color')){
				var x,y,
					f = false,
					axis =[0,0,0,0],
					c = $.dark(this.get('background_color'),0.04);
				if(this.get('axis.enable')){
					axis = this.get('axis.width');
				}
			}
			var gl = this.gridlines;
			for(var i=0;i<gl.length;i++){
				gl[i].x1 = Math.round(gl[i].x1);
				gl[i].y1 = Math.round(gl[i].y1);
				gl[i].x2 = Math.round(gl[i].x2);
				gl[i].y2 = Math.round(gl[i].y2);
				if(this.get('alternate_color')){
					//vertical
					if(gl[i].x1==gl[i].x2){
						//next to do
					}
					//horizontal
					if(gl[i].y1==gl[i].y2){
						if(f){
							this.T.rectangle(
								gl[i].x1+axis[3],
								gl[i].y1+this.get('grid_line_width'),
								gl[i].x2-gl[i].x1-axis[3]-axis[1],
								y-gl[i].y1-this.get('grid_line_width'),
								c);
						}
						x = gl[i].x1;
						y = gl[i].y1;
						f = !f;
					}
				}
				this.T.line(gl[i].x1,gl[i].y1,gl[i].x2,gl[i].y2,this.get('grid_line_width'),this.get('grid_color'));
			}
			for(var i=0;i<this.kedu.length;i++){
				this.kedu[i].draw();
			}
		},
		doConfig:function(){
			$.Coordinate2D.superclass.doConfig.call(this);
			$.Assert.isNumber(this.get('width'),'width');
			$.Assert.isNumber(this.get('height'),'height');
			//console.log(this.get('wall_style'));
			
			
			this.on('mouseover',function(e){
				this.T.css("cursor","default");
			});
			
			if(!this.get('valid_width')||this.get('valid_width')>this.get('width')){
				this.push('valid_width',this.get('width'));
			}
			if(!this.get('valid_height')||this.get('valid_height')>this.get('height')){
				this.push('valid_height',this.get('height'));
			}
			
			/** 
			 * apply the gradient color to fill_color
			 */
			if(this.get('gradient')&&$.isString(this.get('background_color'))){
				this.push('fill_color',this.T.avgLinearGradient(this.x,this.y,this.x,this.y+this.get('height'),[this.get('dark_color'),this.get('light_color')]));
			}
			
			
			if(this.get('axis.enable')){
				var aw = this.get('axis.width');
				if(!$.isArray(aw))
				this.push('axis.width',[aw,aw,aw,aw]);
			}
			
			
			if(this.get('crosshair.enable')){
				this.push('crosshair.wrap',this.container.shell);
				this.push('crosshair.height',this.get('height'));
				this.push('crosshair.width',this.get('width'));
				this.push('crosshair.top',this.y);
				this.push('crosshair.left',this.x);
				
				this.crosshair = new $.CrossHair(this.get('crosshair'),this);
			}
			
			var kd,jp,
				cg = !!(this.get('gridlinesVisible')&&this.get('grids')),//custom grid
				hg = cg&&!!this.get('grids.horizontal'),
				vg = cg&&!!this.get('grids.vertical'),
				h = this.get('height'),
				w = this.get('width'),
				vw = this.get('valid_width'),
				vh = this.get('valid_height'),
				k2g = this.get('gridlinesVisible')&&this.get('kedu2grid')&&!(hg&&vg),
				sw =(w - vw)/2;
				sh =(h - vh)/2,
				axis = this.get('axis.width');
			
			if(!$.isArray(this.get('kedu'))){
				if($.isObject(this.get('kedu')))
					this.push('kedu',[this.get('kedu')]);
				else
					this.push('kedu',[]);
			}
			
			for(var i =0;i<this.get('kedu').length;i++){
				kd = this.get('kedu')[i];
				jp = kd['position'];
				jp = jp || 'left';
				jp = jp.toLowerCase();
				kd['originx'] = this.x;
				kd['originy'] = this.y;
				kd['valid_x'] = this.x + sw;
				kd['valid_y'] = this.y + sh;
				kd['position'] = jp;
				//calculate coordinate,direction,distance
				if(jp=='top'){
					kd['which'] = 'h';
					kd['distance'] = w;
					kd['valid_distance'] = vw;
				}else if(jp=='right'){
					kd['which'] = 'v';
					kd['distance'] = h;
					kd['valid_distance'] = vh;
					kd['originx'] += w;
					kd['valid_x'] += vw;
				}else if(jp=='bottom'){
					kd['which'] = 'h';
					kd['distance'] = w;
					kd['valid_distance'] = vw;
					kd['originy'] += h;
					kd['valid_y'] += vh;
				}else{
					kd['which'] = 'v';
					kd['distance'] = h;
					kd['valid_distance'] = vh;
				}
 				this.kedu.push(new $.KeDu(kd,this.container));
			}
			
			var iol = this.push('ignoreOverlap',this.get('ignoreOverlap')&&this.get('axis.enable')||this.get('ignoreEdge'));
			
			if(iol){
				if(this.get('ignoreEdge')){
					var ignoreOverlap = function(w,x,y){
						return w=='v'?(y==this.y)||(y==this.y+h):(x==this.x)||(x==this.x+w);
					}
				}else{
					var ignoreOverlap = function(wh,x,y){
							return wh=='v'?(y==this.y&&axis[0]>0)||(y==(this.y+h)&&axis[2]>0):(x==this.x&&axis[3]>0)||(x==(this.x+w)&&axis[1]>0);
						}
				}
			}
			
			if(k2g){
				var kedu,x,y;
 				for(var i=0;i<this.kedu.length;i++){
 					kedu = this.kedu[i];
 					//disable,given specfiy grid will ignore kedu2grid 
 					if($.isFalse(kedu.get('kedu2grid'))||hg&&kedu.get('which') == 'v'||vg&&kedu.get('which') == 'h'){
 						continue;
		 					}
 					x = y = 0;
					if(kedu.get('position')=='top'){
						y = h;
					}else if(kedu.get('position')=='right'){
						x = -w;
					}else if(kedu.get('position')=='bottom'){
						y = -h;
					}else{
						x = w;
					}
					for(var j =0;j<kedu.items.length;j++){
						if(iol)
							if(ignoreOverlap.call(this,kedu.get('which'),kedu.items[j].x,kedu.items[j].y))continue;
						this.gridlines.push({x1:kedu.items[j].x,y1:kedu.items[j].y,x2:kedu.items[j].x+x,y2:kedu.items[j].y+y});
					}
				}
 			}
			if(vg){
				var gv = this.get('grids.vertical');
				$.Assert.gtZero(gv['value'],'value');
				var d = w/gv['value'],
					n  = gv['value'];
				if(gv['way']=='given_value'){
					n = d;
					d = gv['value'];
					d = d>w?w:d;
				}
				
				for(var i = 0;i<=n;i++){
					if(iol)
						if(ignoreOverlap.call(this,'h',this.x+i*d,this.y))continue;
					this.gridlines.push({x1:this.x+i*d,y1:this.y,x2:this.x+i*d,y2:this.y+h});
				}
			}
			if(hg){
				var gh = this.get('grids.horizontal');
				$.Assert.gtZero(gh['value'],'value');
				var d = h/gh['value'],
					n  = gh['value'];
				if(gh['way']=='given_value'){
					n = d;
					d = gh['value'];
					d = d>h?h:d;
				}
				
				for(var i = 0;i<=n;i++){
					if(iol)
						if(ignoreOverlap.call(this,'v',this.x,this.y+i*d))continue;
					this.gridlines.push({x1:this.x,y1:this.y+i*d,x2:this.x+w,y2:this.y+i*d});
				}
			}
			
		}
});
/**
 * @overview this component use for abc
 * @component#$.Coordinate3D
 * @extend#$.Coordinate2D
 */
$.Coordinate3D = $.extend($.Coordinate2D,{
		configure:function(){
			/**
			 * invoked the super class's  configurationuration
			 */
			$.Coordinate3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'coordinate3d';
			this.dimension = $._3D;
			
			this.set({
				 xAngle:60,
				 yAngle:20,
				 xAngle_:undefined,
				 yAngle_:undefined,
				 zHeight:0,
				 pedestal_height:22,
				 board_deep:20,
				 gradient:true,
				 ignoreEdge:true,
				 alternate_color:false,
				 shadow:true,
				 grid_color:'#7a8d44',
				 background_color:'#d6dbd2',
				 shadow_offsetx:4,
				 shadow_offsety:2,
				 /**
				  *@cfg {String} for 3D
				  * Available property are:
				  * @Option color the color of wall
				  * @Option alpha the opacity of wall
			 	  */
				 wall_style:[],
				 axis:{
					enable:false
				 }
			});
		},
		doDraw:function(opts){
			var w=this.get('width'),
				h=this.get('height'),
				xa=this.get('xAngle_'),
				ya=this.get('yAngle_'),
				zh=this.get('zHeight'),
				offx = xa*zh,
				offy = ya*zh,
				gl = this.gridlines;
			
			/**
			 * bottom 
			 */
			this.T.cube3D(
						this.x,
						this.y + h + this.get('pedestal_height'),
						xa,
						ya,
						false,
						w,
						this.get('pedestal_height'),
						zh*3/2,
						this.get('axis.enable'),
						this.get('axis.width'),
						this.get('axis.color'),
						this.get('bottom_style')
					);
			/**
			 * board_style 
			 */
			this.T.cube3D(
						this.x+this.get('board_deep')*xa,
						this.y+ h-this.get('board_deep')*ya,
						xa,
						ya,
						false,
						w,
						h,
						zh,
						this.get('axis.enable'),
						this.get('axis.width'),
						this.get('axis.color'),
						this.get('board_style')
					);
			
			this.T.cube3D(
						this.x,
						this.y+h,
						xa,
						ya,
						false,
						w,
						h,
						zh,
						this.get('axis.enable'),
						this.get('axis.width'),
						this.get('axis.color'),
						this.get('wall_style')
					);
			
			for(var i=0;i<gl.length;i++){
				 this.T.line(gl[i].x1,gl[i].y1,gl[i].x1+offx,gl[i].y1-offy,this.get('grid_line_width'),this.get('grid_color'));
				 this.T.line(gl[i].x1+offx,gl[i].y1-offy,gl[i].x2+offx,gl[i].y2-offy,this.get('grid_line_width'),this.get('grid_color'));
			}
			
			for(var i=0;i<this.kedu.length;i++){
				this.kedu[i].draw();
			}
		},
		doConfig:function(){
			$.Coordinate3D.superclass.doConfig.call(this);
			
			var bg = this.get('background_color'),
				dark_color = $.dark(bg,0.1),
				h = this.get('height'),
				w = this.get('width');
			
			if(this.get('wall_style').length<3){
				this.push('wall_style',[
					{color:dark_color},
					{color:bg},
					{color:dark_color}
				]);
			}
			
			var dark = this.get('wall_style')[0].color;
			
			//右-前
			this.push('bottom_style',[
				 {color:bg,shadow:this.get('shadow'),shadowColor:this.get('shadow_color'),blur:this.get('shadow_blur'),sx:this.get('shadow_offsetx'),sy:this.get('shadow_offsety')},
				 false,
				 false,
				 {color:dark},
				 {color:dark},
				 {color:dark}
			]);
			
			//上-右
			this.push('board_style',[
				 false,false,false,{color:dark},{color:bg},false
			]);
			//下底-底-左-右-上-前
			if(this.get('gradient')){
				var offx = this.get('xAngle_')*this.get('zHeight'),
					offy = this.get('yAngle_')*this.get('zHeight'),
					ws = this.get('wall_style'),
					bs = this.get('bottom_style');
				
				if($.isString(ws[0].color)){
					ws[0].color = this.T.avgLinearGradient(this.x,this.y+h,this.x+w,this.y+h,[dark,this.get('dark_color')]);
				}
				if($.isString(ws[1].color)){
					ws[1].color = this.T.avgLinearGradient(this.x+offx,this.y-offy,this.x+offx,this.y+h-offy,[this.get('dark_color'),this.get('light_color')]);
				}
				if($.isString(ws[2].color)){
					ws[2].color = this.T.avgLinearGradient(this.x,this.y,this.x,this.y+h,[bg,this.get('dark_color')]);
				}
				bs[5].color = this.T.avgLinearGradient(this.x,this.y+h,this.x,this.y+h+this.get('pedestal_height'),[bg,dark_color]);
			}
			
			
		}
});	/**
	 * @overview this component use for abc
	 * @component#$.Rectangle
	 * @extend#$.Component
	 */
	$.Rectangle = $.extend($.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Rectangle.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'rectangle';
			
			this.set({
				width:0,
				height:0,
				value_space:10,
				value:'',
				tipAlign:'top',
				valueAlign:'top',
				textAlign:'center',
				textBaseline:'top',
				color_factor:0.16,
				shadow:true,
				shadow_blur:3,
				shadow_offsetx:0,
				shadow_offsety:-1
			});
			
			this.registerEvent();
			
		},
		doDraw:function(opts){
			this.drawRectangle();
			this.drawValue();
		},
		doConfig:function(){
			$.Rectangle.superclass.doConfig.call(this);
			$.Assert.gtZero(this.get('width'),'width');
			this.width = this.get('width');
			this.height = this.get('height');
			
			
			this.centerX = this.x + this.width/2;
			this.centerY = this.y + this.height/2;
			
			if(this.get('tip.enable')){
				if(this.get('tip.showType')!='follow'){
					this.push('tip.invokeOffsetDynamic',false);
				}
				
				this.tip = new $.Tip(this.get('tip'),this);
			}
			
			this.variable.event.highlight = false;
			
			this.on('mouseover',function(e){
				//console.time('mouseover');
				this.variable.event.highlight = true;
				this.redraw();
				this.variable.event.highlight = false;
				/**
				 * notify the chart so that can control whole situation
				 */
				this.container.fireEvent(this.container,'rectangleover',[e,this]);
				//console.timeEnd('mouseover');
			}).on('mouseout',function(e){
				//console.time('mouseout');
				this.variable.event.highlight = false;
				this.redraw();
				this.container.fireEvent(this.container,'rectanglemouseout',[e,this]);
				//console.timeEnd('mouseout');
			}).on('click',function(e){
				this.container.fireEvent(this.container,'rectangleclick',[e,this]);
			});
			
			this.on('beforedraw',function(){
				if(this.variable.event.highlight){
					this.push('fill_color',this.get('light_color'));
				}else{
					this.push('fill_color',this.get('background_color'));
				}
				return true;
			});
			
			
		}
});	/**
	 * @overview this component use for abc
	 * @component#$.Rectangle2D
	 * @extend#$.Rectangle
	 */
	$.Rectangle2D = $.extend($.Rectangle,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Rectangle2D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'rectangle2d';
			
			this.set({
				shadow_offsety:-2
			});
			
			this.registerEvent();
			
		},
		drawValue:function(){
			if(this.get('value')!=''){
				this.T.text(this.get('value'),this.get('value_x'),this.get('value_y'),false,this.get('color'),this.get('textAlign'),this.get('textBaseline'),this.get('fontStyle'));
			}
		},
		drawRectangle:function(){
			this.T.rectangle(
				this.get('originx'),
				this.get('originy'),
				this.get('width'),
				this.get('height'),
				this.get('fill_color'),
				this.get('border.enable'),
				this.get('border.width'),
				this.get('border.color'),
				this.get('shadow'),
				this.get('shadow_color'),
				this.get('shadow_blur'),
				this.get('shadow_offsetx'),
				this.get('shadow_offsety'));
		},
		isEventValid:function(e){
			return {valid:e.offsetX>this.x&&e.offsetX<(this.x+this.width)&&e.offsetY<(this.y+this.height)&&e.offsetY>(this.y)};
		},
		tipInvoke:function(){
			var self = this;
			//base on event? NEXT
			return function(w,h){
				return {
					left:self.tipX(w,h),
					top:self.tipY(w,h)
				}
			}
		},
		doConfig:function(){
			$.Rectangle2D.superclass.doConfig.call(this);
			var self = this,tipAlign = self.get('tipAlign'),valueAlign=self.get('valueAlign');
			if(tipAlign=='left'||tipAlign=='right'){
				self.tipY = function(w,h){return self.centerY - h/2;};
			}else{
				self.tipX = function(w,h){return self.centerX -w/2;};
			}
			
			if(tipAlign=='left'){
				self.tipX = function(w,h){return self.x - self.get('value_space') -w;};
			}else if(tipAlign=='right'){
				self.tipX = function(w,h){return self.x + self.width + self.get('value_space');};
			}else if(tipAlign=='bottom'){
				self.tipY = function(w,h){return self.y  +self.height+3;};
			}else{
				self.tipY = function(w,h){return self.y  - h -3;};
			}
			
			if(valueAlign=='left'){
				self.push('textAlign','right');
				self.push('value_x',self.x - self.get('value_space'));
				self.push('value_y',self.centerY);
			}else if(valueAlign=='right'){
				self.push('textAlign','left');
				self.push('textBaseline','middle');
				self.push('value_x',self.x + self.width + self.get('value_space'));
				self.push('value_y',self.centerY);
			}else if(valueAlign=='bottom'){
				self.push('value_x',self.centerX);
				self.push('value_y',self.y  + self.height + self.get('value_space'));
				self.push('textBaseline','top');
			}else{
				self.push('value_x',self.centerX);
				self.push('value_y',self.y  - self.get('value_space'));
				self.push('textBaseline','bottom');
			}
			
			self.valueX = self.get('value_x');
			self.valueY = self.get('value_y');
		}
});	/**
	 * @overview this component use for abc
	 * @component#$.Rectangle3D
	 * @extend#$.Rectangle
	 */
	$.Rectangle3D = $.extend($.Rectangle,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Rectangle3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'rectangle3d';
			this.dimension = $._3D;
			
			this.set({
				zHeight:undefined,
				xAngle:60,//有范围限制
				yAngle:20,//有范围限制
				xAngle_:undefined,
				yAngle_:undefined,
				shadow_offsetx:2
			});
			
			this.registerEvent(
				'beforepop',
				'analysing',
				'drawRow'
			);
			
		},
		drawValue:function(){
			if(this.get('value')!='')
			this.T.text(this.get('value'),this.centerX,this.topCenterY + this.get('value_space'),false,this.get('color'),'center','top',this.get('fontStyle'));
		},
		drawRectangle:function(){
			this.T.cube(
				this.get('originx'),
				this.get('originy'),
				this.get('xAngle_'),
				this.get('yAngle_'),
				this.get('width'),
				this.get('height'),
				this.get('zHeight'),
				this.get('fill_color'),
				this.get('border.enable'),
				this.get('border.width'),
				this.get('light_color'),
				this.get('shadow'),
				this.get('shadow_color'),
				this.get('shadow_blur'),
				this.get('shadow_offsetx'),
				this.get('shadow_offsety')
			);
		},
		isEventValid:function(e){
			return {valid:!this.preventEvent&&e.offsetX>this.x&&e.offsetX<(this.x+this.get('width'))&&e.offsetY<this.y+this.get('height')&&e.offsetY>this.y};
		},
		tipInvoke:function(){
			var self = this;
			return function(w,h){
				return {
					left:self.topCenterX - w/2,
					top:self.topCenterY - h
				}
			}
		},
		doConfig:function(){
			$.Rectangle3D.superclass.doConfig.call(this);
			
			this.pushIf("zHeight",this.get('width'));
			
			this.centerX=this.x+this.get('width')/2;
			
			this.topCenterX=this.x+(this.get('width')+this.get('width')*this.get('xAngle_'))/2;
			
			this.topCenterY=this.y-this.get('width')*this.get('yAngle_')/2;
			
			
			
		}
});$.Sector = $.extend($.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Sector.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'sector';
			
			this.set({
				 counterclockwise:false,
				 startAngle:0,
				 middleAngle:0,
				 endAngle:0,
				 totalAngle:0,
				 /**
				  *@cfg {String} the event's name trigger pie pop(default to 'click')
				 */
				 pop_event:'click',
				 expand:false,
				 /**
				  *@cfg {Boolean} if it has animate when a piece popd (default to false)
			 	  */
				 pop_animate:false,
				 /**
				  *@cfg {Boolean} if the piece mutex,it means just one piece could pop (default to true)
				 */
				 mutex:false,
				 increment:undefined,
				 shadow:true,
				 gradient:true,
				 /**
				 *@cfg {Boolean} if the label displayed (default to true)
				 */
				 label:{
					 enable:true,
					 /**
					  * label线的长度
					  * @memberOf {label} 
					  */
					 linelength:undefined
				 },
				 tip:{
					 enable:false,
					 border:{
						width:2
					 }
				 }
			});
			
			this.registerEvent();
			
			this.label = null;
			this.tip = null;
		},
		expand:function(p){
			this.expanded = true;
		},	
		collapse:function(){
			this.expanded = false;
		},
		toggle:function(){
			this.expanded = !this.expanded;
		},
		drawLabel:function(){
			if(this.get('label.enable')){
				/**
				 * draw the labels
				 */
				this.label.draw({
					highlight:this.highlighted,
					invoke:this.labelInvoke(this.x,this.y)
				});
			}
		},
		doDraw:function(opts){
			this.drawSector();
			this.drawLabel();
		},
		doConfig:function(){
			$.Sector.superclass.doConfig.call(this);
			
			
			this.push('totalAngle',this.get('endAngle')-this.get('startAngle'));
			
			/**
			 * make the label's color in accord with sector
			 */
			this.push('label.scolor',this.get('background_color'));
			
			this.expanded = this.get('expand');
			
			var self = this;
			
			if(this.get('tip.enable')){
				if(this.get('tip.showType')!='follow'){
					this.push('tip.invokeOffsetDynamic',false); 
				}
				this.tip = new $.Tip(this.get('tip'),this);
			}
			
			this.variable.event.poped = false;
			
			this.on(this.get('pop_event'),function(e,r){
//					console.profile('Test for pop');
//					console.time('Test for pop');
					self.variable.event.poped = true;
					self.toggle();
					
					self.redraw();
					
					self.variable.event.poped = false;
//					console.timeEnd('Test for pop');
//					console.profileEnd('Test for pop');
			});
			
			this.on('beforedraw',function(){
				this.x = this.get('originx');
				this.y = this.get('originy');
				if(this.expanded){
					if(this.get('mutex')&&!self.variable.event.poped){
						this.expanded = false;
					}else{
						this.x+=this.get('increment')*Math.cos(2*Math.PI-this.get('middleAngle'));
						this.y-=this.get('increment')*Math.sin(2*Math.PI-this.get('middleAngle'));
					}
				}
				return true;
			});
			
			
		}
});	/**
	 * @overview this component use for abc
	 * @component#$.Sector2D
	 * @extend#$.Sector
	 */
	$.Sector2D = $.extend($.Sector,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Sector2D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'sector2d';
			
			this.set({
				radius:0
			});
			
			this.registerEvent(
				'beforepop',
				'analysing',
				'drawRow'
			);
		},
		drawSector:function(){
			this.T.sector(
					this.x,
					this.y,
					this.r,
					this.get('startAngle'),
					this.get('endAngle'),
					this.get('fill_color'),
					this.get('border.enable'),
					this.get('border.width'),
					this.get('border.color'),
					this.get('shadow'),
					this.get('shadow_color'),
					this.get('shadow_blur'),
					this.get('shadow_offsetx'),
					this.get('shadow_offsety'),
					this.get('counterclockwise'));
		},
		isEventValid:function(e){
			if(this.get('label.enable')){
				if(this.label.isEventValid(e).valid)
					return {valid:true};
			}
			if((this.r)<$.distanceP2P(this.x,this.y,e.offsetX,e.offsetY)){
				return {valid:false};
			}
			/**
			 * 与x轴正方向形成的夹角、x轴逆时针的角度、并转换弧度参照 
			 */
			if($.angleInRange(this.get('startAngle'),this.get('endAngle'),(2*Math.PI - $.atan2Radian(this.x,this.y,e.offsetX,e.offsetY)))){
				return {valid:true};
			}
			return {valid:false};
		},
		tipInvoke:function(){
			var A = this.get('middleAngle'),
				Q  = $.quadrantd(A),
				self = this,
				r = this.get('radius');
			return function(w,h){
				var P = $.p2Point(self.x,self.y,A,r*0.8);
				return {
					left:(Q>=2&&Q<=3)?(P.x - w):P.x,
					top:Q>=3?(P.y - h):P.y
				}
			}
		},
		labelInvoke:function(x,y){
			var A = this.get('middleAngle');
			var P = $.p2Point(x,y,A,this.r + this.get('label.linelength'));
			var P2 = $.p2Point(x,y,A,this.r/2);
			var Q  = $.quadrantd(A);
			return {
				origin:{
					x:P2.x,
					y:P2.y
				},
				lineFn:function(){
					this.T.line(P2.x,P2.y,P.x,P.y,this.get('border.width'),this.get('border.color'));
				},
				labelXY:function(){
					return {
						labelx:(Q>=2&&Q<=3)?(P.x - this.width):P.x,
						labely:Q>=3?(P.y - this.height):P.y
					}
				}
			}
		},
		doConfig:function(){
			$.Sector2D.superclass.doConfig.call(this);
			
			this.r = this.get('radius');
			$.Assert.gtZero(this.r);
			
			
			if(this.get('gradient')){
				this.push('fill_color',this.T.avgRadialGradient(this.x,this.y,0,this.x,this.y,this.r,[this.get('light_color'),this.get('dark_color')]));
			}
			
			this.pushIf('increment',$.lowTo(5,this.r/8));
			
			if(this.get('label.enable')){
				this.pushIf('label.linelength',$.lowTo(10,this.r/8));
				this.label = new $.Label(this.get('label'),this);
			}
		}
});	/**
	 * @overview this component use for abc
	 * @component#$.Sector3D
	 * @extend#$.Sector
	 */
	$.Sector3D = $.extend($.Sector,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Sector3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'sector3d';
			this.dimension = $._3D;
			
			this.set({
				/**
				 * @cfg {Number}  major semiaxis of ellipse
				 */
				semi_major_axis:0,
				/**
				 * @cfg {Number} minor semiaxis of ellipse
				 */
				semi_minor_axis:0,
				cylinder_height:0,
				 border:{
					color:'#BCBCBC'
				 }
			});
			
			this.registerEvent(
				'beforepop',
				'analysing',
				'drawRow'
			);
			
		},
		drawSector:function(){
			this.T.sector3D(
					this.x,
					this.y,
					this.a,
					this.b,
					this.get('startAngle'),
					this.get('endAngle'),
					this.h,
					this.get('background_color'),
					this.get('border.enable'),
					this.get('border.width'),
					this.get('border.color'),
					this.get('shadow'),
					this.get('shadow_color'),
					this.get('shadow_blur'),
					this.get('shadow_offsetx'),
					this.get('shadow_offsety'),
					this.get('counterclockwise'));
		},
		isEventValid:function(e){
			if(this.get('label.enable')){
				if(this.label.isEventValid(e).valid)
					return {valid:true};
			}
			if(!$.inEllipse(e.offsetX - this.x,e.offsetY-this.y,this.a,this.b)){
				return {valid:false};
			}
			if($.inRange(this.sA,this.eA,(2*Math.PI - $.atan2Radian(this.x,this.y,e.offsetX,e.offsetY)))){
				return {valid:true};
			}
			return {valid:false};
		},
		p2p:function(x,y,a,z){
			return {
				x:x+this.a*Math.cos(a)*z,
				y:y+this.b*Math.sin(a)*z
			};
		},
		tipInvoke:function(){
			var A = this.get('middleAngle'),
				Q  = $.quadrantd(A),
				self =  this;
			return function(w,h){
				var P = self.p2p(self.x,self.y,A,0.6);
				return {
					left:(Q>=2&&Q<=3)?(P.x - w):P.x,
					top:Q>=3?(P.y - h):P.y
				}
			}
		},
		labelInvoke:function(x,y){
			var A = this.get('middleAngle'),
				P = this.p2p(x,y,A,this.Z),
				P2 = this.p2p(x,y,A,1),
				Q  = $.quadrantd(A),
				self = this,
				ccw = this.get('counterclockwise');
				return {
					origin:{
						x:P2.x,
						y:P2.y
					},
					lineFn:function(){
						this.T.line(P2.x,P2.y+self.h/2,P.x,P.y+self.h/2,this.get('border.width')*4,this.get('border.color'),(ccw&&A<Math.PI)||(!ccw&&A>Math.PI));
					},
					labelXY:function(){
						return {
							labelx:(Q>=2&&Q<=3)?(P.x - this.width):P.x,
							labely:Q>=3?(P.y - this.height+self.h/2):P.y+self.h/2
						}
					}
				}
		},
		doConfig:function(){
			$.Sector3D.superclass.doConfig.call(this);
			
			this.a = this.get('semi_major_axis');
			this.b = this.get('semi_minor_axis');
			this.h = this.get('cylinder_height');
			
			$.Assert.gtZero(this.a);
			$.Assert.gtZero(this.b);
			
			this.pushIf('increment',$.lowTo(5,this.a/8));
			
			this.inc = Math.PI/180,ccw = this.get('counterclockwise');
			
			var toAngle = function(A){
				var t = $.atan2Radian(0,0,this.a*Math.cos(A),ccw?(-this.b*Math.sin(A)):(this.b*Math.sin(A)));
				if(!ccw&&t!=0){
					t = 2*Math.PI - t;
				}
				return t;
			}
			
			this.sA = toAngle.call(this,this.get('startAngle'));
			this.eA = toAngle.call(this,this.get('endAngle'));
			
			if(this.get('label.enable')){
				this.pushIf('label.linelength',$.lowTo(10,this.a/8));
				
				this.Z = this.get('label.linelength')/this.a+1;
				
				this.label = new $.Label(this.get('label'),this);
			}
		}
});/**
 * @overview this component use for abc
 * @component#$.Pie
 * @extend#$.Chart
 */
$.Pie = $.extend($.Chart, {
	/**
	 * initialize the context for the pie
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Pie.superclass.configure.call(this);

		this.type = 'pie';

		this.set({
			/**
			 * @cfg {Float (0~)} the pie's radius
			 */
			radius : 0,
			/**
			 * @cfg {Number} initial angle for first sector
			 */
			offsetAngle : 0,
			/**
			 * @cfg {Boolean} 是否显示百分比 (default to true)
			 */
			showpercent : true,
			/**
			 * @cfg {Number} 显示百分比精确小数点位数
			 */
			decimalsnum : 1,
			/**
			 * @cfg {String} the event's name trigger pie pop(default to
			 *      'click')
			 */
			pop_event : 'click',
			/**
			 * @cfg {Boolean}
			 */
			customize_layout : false,
			counterclockwise : false,
			/**
			 * @cfg {Boolean} if it has animate when a piece popd (default to
			 *      false)
			 */
			pop_animate : false,
			/**
			 * @cfg {Boolean} if the piece mutex,it means just one piece could
			 *      pop (default to true)
			 */
			mutex : false,
			shadow : true,
			/**
			 * @cfg {Boolean} if the apply the gradient,if set to true that will
			 *      be gradient color of each sector(default to true)
			 */
			gradient : true,
			shadow_blur : 4,
			shadow_offsetx : 0,
			shadow_offsety : 0,
			increment : undefined,
			/**
			 * @cfg {Boolean} if the label displayed (default to true)
			 */
			label : {
				enable : true,
				/**
				 * label线的长度
				 * 
				 * @memberOf {label}
				 */
				linelength : undefined,
				padding : 5
			},
			tip : {
				enable : false,
				border : {
					width : 2,
					radius : 5
				}
			}
		});

		this.registerEvent('beforeSectorAnimation', 'afterSectorAnimation');

		this.sectors = [];
	},
	doAnimation : function(t, d) {
		var s, si = 0, cs = this.offsetAngle;
		for ( var i = 0; i < this.sectors.length; i++) {
			s = this.sectors[i];
			this.fireEvent(this, 'beforeSectorAnimation', [this, s]);
			si = this.animationArithmetic(t, 0, s.get('totalAngle'), d);
			s.push('startAngle', cs);
			s.push('endAngle', cs + si);
			cs += si;
			s.drawSector();
			this.fireEvent(this, 'afterSectorAnimation', [this, s]);
		}
	},
	doConfig : function() {
		$.Pie.superclass.doConfig.call(this);
		$.Assert.gtZero(this.total, 'this.total');

		var endAngle = startAngle = this.offsetAngle = $.angle2Radian(this.get('offsetAngle')), d = this.data,r=this.get('radius');
		/**
		 * calculate pie chart's angle
		 */
		for ( var i = 0; i < d.length; i++) {
			endAngle += (2 * d[i].value / this.total) * Math.PI;
			if (i == (d.length - 1)) {
				endAngle = 2 * Math.PI + this.offsetAngle;
			}
			d[i].startAngle = startAngle;
			d[i].endAngle = endAngle;
			d[i].totalAngle = endAngle - startAngle;
			d[i].middleAngle = (startAngle + endAngle) / 2;
			startAngle = endAngle;
		}

		/**
		 * calculate pie chart's radius
		 */
		if (r <= 0 || r > this.get('minDistance') / 2) {
			r = this.push('radius', this.get('minDistance') / 2);
		}
		/**
		 * calculate pie chart's increment
		 */
		this.pushIf('increment', $.lowTo(5, r / 8));

		/**
		 * calculate pie chart's alignment
		 */
		if (this.get('align') == 'left') {
			this.push('originx', r + this.get('l_originx') + this.get('offsetx'));
		} else if (this.get('align') == 'right') {
			this.push('originx', this.get('r_originx') - r + this.get('offsetx'));
		} else {
			this.push('originx', this.get('centerx') + this.get('offsetx'));
		}
		this.push('originy', this.get('centery') + this.get('offsety'));

		this.sector_config = $.clone(['originx', 'originy', 'pop_event', 'customize_layout', 'counterclockwise', 'pop_animate', 'mutex', 'shadow_blur', 'shadow_offsetx',
				'shadow_offsety', 'increment', 'gradient', 'color_factor', 'label', 'tip', 'border'], this.options);

	}

});/**
 * @overview this component use for abc
 * @component#@chart#$.Pie2D
 * @extend#$.Pie
 */
$.Pie2D = $.extend($.Pie, {
	/**
	 * initialize the context for the pie2d
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Pie2D.superclass.configure.call(this);

		this.type = 'pie2d';

		this.dataType = 'simple';

		this.set({});

		this.registerEvent();
	},
	doConfig : function() {
		$.Pie2D.superclass.doConfig.call(this);
		
		var t, lt, tt, Le = this.get('label.enable'), Te = this.get('tip.enable'),d = this.data,scs = this.sector_config;
		
		scs.radius = this.get('radius');
		
		for ( var i = 0; i < d.length; i++) {

			t = d[i].name + (this.get('showpercent') ? $.toPercent(d[i].value / this.total, this.get('decimalsnum')) : '');

			if (Le) {
				lt = this.fireEvent(this, 'parseLabelText', [d[i], i]);
				scs.label.text = $.isString(lt) ? lt : t;
			}
			if (Te) {
				tt = this.fireEvent(this, 'parseTipText', [d[i], i]);
				scs.tip.text = $.isString(tt) ? tt : t;
			}
			scs.startAngle = d[i].startAngle;
			scs.middleAngle = d[i].middleAngle;
			scs.endAngle = d[i].endAngle;
			scs.background_color = d[i].color;

			this.sectors.push(new $.Sector2D(scs, this));
		}
		this.pushComponent(this.sectors);
	}
});	/**
	 * @overview this component use for abc
	 * @component#@chart#$.Pie3D
	 * @extend#$.Pie
	 */
	$.Pie3D = $.extend($.Pie,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Pie3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the legend's type
			 */
			this.type = 'pie3d';
			this.dimension = $._3D;
			this.dataType = 'simple';
			
			this.set({
				 /**
				 * @cfg {Float} {range:(0~90]} z轴旋转角度
				 */
				 zRotate:45,
				 yHeight:30
			});
			
			this.registerEvent(
				'beforeDrawRow',
				'drawRow'
			);
		},
		doConfig:function(){
			$.Pie3D.superclass.doConfig.call(this);
			
			this.push('zRotate',$.between(0,90,90-this.get('zRotate')));
			
			var t,lt,tt;
			this.sector_config.semi_major_axis = this.get('radius');
			this.sector_config.semi_minor_axis = this.get('radius')*this.get('zRotate')/90;
			this.sector_config.cylinder_height = this.get('yHeight')*Math.cos($.angle2Radian(this.get('zRotate')));
			
			var t,lt,tt,Le = this.get('label.enable'),Te = this.get('tip.enable');
			for(var i=0;i<this.data.length;i++){
				t = this.data[i].name+(this.get('showpercent')?$.toPercent(this.data[i].value/this.total,this.get('decimalsnum')):'');
				if(Le){
					lt = this.fireEvent(this,'parseLabelText',[this.data[i],i]);
					this.sector_config.label.text = $.isString(lt)?lt:t;
				}
				if(Te){
					tt = this.fireEvent(this,'parseTipText',[this.data[i],i]);
					this.sector_config.tip.text = $.isString(tt)?tt:t;
				}
				this.sector_config.startAngle = this.data[i].startAngle;
				this.sector_config.middleAngle = this.data[i].middleAngle;
				this.sector_config.endAngle = this.data[i].endAngle;
				this.sector_config.background_color = this.data[i].color;
				
				this.sectors.push(new $.Sector3D(this.sector_config,this));
			}
			this.pushComponent(this.sectors);
			
		}
});	/**
	 * @overview this component use for abc
	 * @component#$.Column
	 * @extend#$.Chart
	 */
	$.Column = $.extend($.Chart,{
		/**
		 * initialize the context for the Column
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			$.Column.superclass.configure.call(this);
			
			this.type = 'column';
			
			this.set({
				coordinate:{},
				hiswidth:undefined,
				shadow:true,
				text_space:6,
				/**
				  *@cfg {String} 
				  * Available value are:
				  * @Option 'left'
				  * @Option 'right'
			 	 */
				keduAlign:'left',
				/**
				 *@cfg {Object} 
				 *@extend $.Chart
				 *@see $.Chart#label
				 */
				label:{
					padding:5
				},
				/**
				 *@cfg {Boolean} 
				 */
				customize_layout:false,
				rectangle:{}
			});
			
			this.registerEvent(
				'rectangleover',
				'rectanglemouseout',
				'rectangleclick',
				'parseValue',
				'parseText',
				'beforeRectangleAnimation',
				'afterRectangleAnimation'
				
			);
			
			this.rectangles = [];
			this.labels = [];
		},
		doAnimation:function(t,d){
			var r,h;
			this.coo.draw();
			for(var i=0;i<this.rectangles.length;i++){
				r = this.rectangles[i]; 
				this.fireEvent(this,'beforeRectangleAnimation',[this,r]);
				h = Math.ceil(this.animationArithmetic(t,0,r.height,d));
				r.push('originy',r.y+(r.height-h));
				r.push('height',h);
				this.labels[i].draw();
				r.drawRectangle();
				this.fireEvent(this,'afterRectangleAnimation',[this,r]);
			}
		},
		doConfig:function(){
			$.Column.superclass.doConfig.call(this);
			
			/**
			 * apply the coordinate feature
			 */
			$.Interface.coordinate.call(this);
			/**
			 * quick config to all rectangle
			 */
			$.applyIf(this.get('rectangle'),$.clone(['label','tip','border'],this.options));
			
			/**
			 * register event
			 */
			this.on('rectangleover',function(e,r){
				this.T.css("cursor","pointer");
				
			}).on('rectanglemouseout',function(e,r){
				this.T.css("cursor","default");
			});
			
		}
		
});	/**
	 * @overview this component use for abc
	 * @component#@chart#$.Column2D
	 * @extend#$.Column
	 */
	$.Column2D = $.extend($.Column,{ 
		/**
		 * initialize the context for the Column2D
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Column2D.superclass.configure.call(this);
			
			this.type = 'column2d';
			this.dataType = 'simple';
			
			this.set({
				coordinate:{grid_color:'#c4dede',background_color:'#FEFEFE'}
			});
		},
		doConfig:function(){
			$.Column2D.superclass.doConfig.call(this);
			
			var L = this.data.length,
				W = this.get('coordinate.width'),
				hw = this.pushIf('hiswidth',W/(L*2+1));
			
			
			if(hw*L>W){
				hw = this.push('hiswidth',W/(L*2+1));
			}
			
			//the space of two column
			this.push('hispace',(W - hw*L)/(L+1));
			
			//use option create a coordinate
			this.coo = $.Interface.coordinate2d.call(this);
			
			this.pushComponent(this.coo,true);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				bs = this.coo.get('brushsize'),
				H = this.coo.get('height'),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				gw = hw+this.get('hispace'),
				t,h,text,value;
				
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.width',hw);
			
			for(var i=0;i<L;i++){
				text = this.data[i].name;
				value = this.data[i].value;
				t = text+":"+value;
				h = (this.data[i].value-S.start)*H/S.distance;
				
				if(Le){
					this.push('rectangle.label.text',this.fireString(this,'parseLabelText',[this.data[i],i],t));
				}
				
				if(Te){
					this.push('rectangle.tip.text',this.fireString(this,'parseTipText',[this.data[i],i],t));
				}
				
				text = this.fireString(this,'parseText',[this.data[i],i],text);
				value = this.fireString(this,'parseValue',[this.data[i],i],value);
				
				/**
				 * x = this.x + space*(i+1) + width*i
				 */
				this.push('rectangle.originx',this.x+this.get('hispace')+i*gw);
				/**
				 * y = this.y + brushsize + h
				 */
				this.push('rectangle.originy',this.y + H - h - bs);
				this.push('rectangle.value',value);
				this.push('rectangle.height',h);
				this.push('rectangle.background_color',this.data[i].color);
				this.push('rectangle.id',i);
				this.rectangles.push(new $.Rectangle2D(this.get('rectangle'),this));
				this.labels.push(new $.Text({
					id:i,
					text:text,
					originx:this.x + this.get('hispace')+gw*i+hw/2,
	 				originy:this.y+H+this.get('text_space')
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
			
		}
		
});	/**
	 * @overview this component use for abc
	 * @component#@chart#$.Column3D
	 * @extend#$.Column
	 */
	$.Column3D = $.extend($.Column,{
		/**
		 * initialize the context for the Column3D 
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Column3D.superclass.configure.call(this);
			
			this.type = 'column3d';
			this.dataType = 'simple';
			this.dimension = $._3D;
			
			this.set({
				xAngle:60,
				yAngle:20,
				/**
				 * 矩形z轴的深度系数-宽度为参照物
				 */
				zScale:1,
				/**
				 * 坐标z轴的底座深度系数-宽度为参照物 must ge 1
				 */
				bottom_scale:1.4
			});
		},
		doConfig:function(){
			$.Column3D.superclass.doConfig.call(this);
			
			var L = this.data.length,W = this.get('coordinate.width'),
			hw = this.pushIf('hiswidth',W/(L*2+1));
			/**
			 * common config
			 */
			if(this.get('bottom_scale')<1){
				hw = this.push('bottom_scale',1);
			}
			
			if(hw*L>W){
				this.push('hiswidth',W/(L*2+1));
			}
			
			this.push('zHeight',hw*this.get('zScale'));
			
			this.push('hispace',(W - hw*L)/(L+1));
			
			/**
			 * initialize coordinate
			 */
			this.push('coordinate.xAngle_',this.get('xAngle_'));
			this.push('coordinate.yAngle_',this.get('yAngle_'));
			
			//the Coordinate' Z is same as long as the column's
			this.push('coordinate.zHeight',this.get('zHeight')*this.get('bottom_scale'));
			
			//use option create a coordinate
			this.coo = $.Interface.coordinate3d.call(this);
			
			this.pushComponent(this.coo,true);
			
			/**
			 * initialize rectangles
			 */
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				zh = this.get('zHeight')*(this.get('bottom_scale')-1)/2*this.get('yAngle_'),
				t,lt,tt,h,text,value,
				gw = hw+this.get('hispace'),
				H = this.coo.get('height');
			
			
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.xAngle_',this.get('xAngle_'));
			this.push('rectangle.yAngle_',this.get('yAngle_'));
			this.push('rectangle.width',hw);
			
			for(var i=0;i<L;i++){
				text = this.data[i].name;
				value = this.data[i].value;
				t = text+":"+value;
				h = (this.data[i].value-S.start)*H/S.distance;
				
				if(Le){
					this.push('rectangle.label.text',this.fireString(this,'parseLabelText',[this.data[i],i],t));
				}
				
				if(Te){
					this.push('rectangle.tip.text',this.fireString(this,'parseTipText',[this.data[i],i],t));
				}
				
				text = this.fireString(this,'parseText',[this.data[i],i],text);
				value = this.fireString(this,'parseValue',[this.data[i],i],value);
				
				/**
				 * x = this.x + space*(i+1) + width*i
				 */
				this.push('rectangle.originx',this.x+this.get('hispace')+i*gw);//+this.get('xAngle_')*hw/2
				/**
				 * y = this.y + brushsize + h
				 */
				this.push('rectangle.originy',this.y +(H-h)-zh);
				this.push('rectangle.text',text);
				this.push('rectangle.value',value);
				this.push('rectangle.height',h);
				this.push('rectangle.background_color',this.data[i].color);
				this.push('rectangle.id',i);
				
				this.rectangles.push(new $.Rectangle3D(this.get('rectangle'),this));
				this.labels.push(new $.Text({
					id:i,
					text:text,
					originx:this.x + this.get('hispace')+gw*i+hw/2,
	 				originy:this.y+H+this.get('text_space')
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
			
			
			
			
		}
		
});	/**
	 * @overview this component use for abc
	 * @component#@chart#$.ColumnMulti2D
	 * @extend#$.Column
	 */
	$.ColumnMulti2D = $.extend($.Column,{
		/**
		 * initialize the context for the ColumnMulti2D
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.ColumnMulti2D.superclass.configure.call(this);
			
			this.type = 'columnmulti2d';
			this.dataType = 'complex';
			
			this.set({});
			
			//this.registerEvent();
			this.columns = [];
		},
		doAnimation:function(t,d){
			var r,h;
			this.coo.draw();
			for(var i=0;i<this.labels.length;i++){
				this.labels[i].draw();
			}
			for(var i=0;i<this.rectangles.length;i++){
				r = this.rectangles[i]; 
				this.fireEvent(this,'beforeRectangleAnimation',[this,r]);
				h = Math.ceil(this.animationArithmetic(t,0,r.height,d));
				r.push('originy',r.y+(r.height-h));
				r.push('height',h);
				r.drawRectangle();
				this.fireEvent(this,'afterRectangleAnimation',[this,r]);
			}
		},
		doConfig:function(){
			$.ColumnMulti2D.superclass.doConfig.call(this);
			
			var L = this.data.length,
				KL= this.columnKeys.length,
				W = this.get('coordinate.width'),
				H = this.get('coordinate.height'),
				total = KL*L,
				bw = this.pushIf('hiswidth',W/(KL+1+total));
			
			if(bw*total>W){
				bw = this.push('hiswidth',W/(KL+1+total));
			}
			
			this.push('hispace',(W - bw*total)/(KL+1));
			
			//use option create a coordinate
			this.coo = $.Interface.coordinate2d.call(this);
						
			this.pushComponent(this.coo,true);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				bs = this.coo.get('brushsize'),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				gw = this.data.length*bw+this.get('hispace'),
				item,t,lt,tt,h,text,value;
			
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.width',bw);
			
			for(var i=0;i<this.columns.length;i++){
				item  = this.columns[i].item;
				text = this.fireString(this,'parseText',[this.columns[i],i],this.columns[i].name);
				
				for(var j=0;j<item.length;j++){
					h = (item[j].value-S.start)*H/S.distance;
					
					t = item[j].name+":"+item[j].value;
					if(Le)
						this.push('rectangle.label.text',this.fireString(this,'parseLabelText',[item[j],i],t));
					
					if(Te)
						this.push('rectangle.tip.text',this.fireString(this,'parseTipText',[item[j],i],t));
					
					value = this.fireString(this,'parseValue',[item[j],i],item[j].value);
					
					/**
					 * x = this.x + space*(i+1) + width*(j+i*length)
					 */
					this.push('rectangle.originx',this.x + this.get('hispace')+j*bw+i*gw);//+this.get('xAngle_')*bw/2
					/**
					 * y = this.y + brushsize + h
					 */
					this.push('rectangle.originy',this.y + H - h - bs);
					//this.push('rectangle.text',text);
					this.push('rectangle.value',value);
					this.push('rectangle.height',h);
					this.push('rectangle.background_color',item[j].color);
					this.push('rectangle.id',i+'-'+j);
					
					this.rectangles.push(new $.Rectangle2D(this.get('rectangle'),this));
				}
				this.labels.push(new $.Text({
					id:i,
					text:text,
					originx:this.x +this.get('hispace')*0.5+(i+0.5)*gw,
	 				originy:this.get('originy')+H+this.get('text_space')
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
		}
		
});
	/**
	 * @overview this component use for abc
	 * @component#$.Bar
	 * @extend#$.Chart
	 */
	$.Bar = $.extend($.Chart,{
		/**
		 * initialize the context for the bar
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Bar.superclass.configure.call(this);
			
			this.type = 'bar';
			
			this.set({
				coordinate:{},
				barheight:undefined,
				shadow:true,
				text_space:6,
				/**
				  *@cfg {String} 
				  * Available value are:
				  * @Option 'top,'bottom'
			 	 */
				keduAlign:'bottom',
				/**
				 *@cfg {Object} 
				 *@extend $.Chart
				 *@see $.Chart#label
				 */
				label:{
					padding:5
				},
				/**
				 *@cfg {Boolean} 
				 */
				customize_layout:false,
				rectangle:{}
			});
			
			this.registerEvent(
					'rectangleover',
					'rectanglemouseout',
					'rectangleclick',
					'parseValue',
					'parseText',
					'beforeRectangleAnimation',
					'afterRectangleAnimation'
					
				);
				
			this.rectangles = [];
			this.labels = [];
		},
		doAnimation:function(t,d){
			var r;
			this.coo.draw();
			for(var i=0;i<this.rectangles.length;i++){
				r = this.rectangles[i]; 
				this.fireEvent(this,'beforeRectangleAnimation',[this,r]);
				r.push('width',Math.ceil(this.animationArithmetic(t,0,r.width,d)));
				this.labels[i].draw();
				r.drawRectangle();
				this.fireEvent(this,'afterRectangleAnimation',[this,r]);
			}
		},
		doConfig:function(){
			$.Bar.superclass.doConfig.call(this);
			/**
			 * apply the coordinate feature
			 */
			$.Interface.coordinate.call(this);
			/**
			 * quick config to all rectangle
			 */
			$.applyIf(this.get('rectangle'),$.clone(['label','tip','border'],this.options));
			
			/**
			 * register event
			 */
			this.on('rectangleover',function(e,r){
				this.T.css("cursor","pointer");
				
			}).on('rectanglemouseout',function(e,r){
				this.T.css("cursor","default");
			});
		}
		
});	
	/**
	 * @overview this component use for abc
	 * @component#@chart#$.Bar2D
	 * @extend#$.Bar
	 */
	$.Bar2D = $.extend($.Bar,{
		/**
		 * initialize the context for the pie
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Bar2D.superclass.configure.call(this);
			
			this.type = 'bar2d';
			
			this.dataType = 'simple';
			
			this.set({
				coordinate:{grid_color:'#CDCDCD',background_color:'#FEFEFE'}
			});
		},
		doConfig:function(){
			$.Bar2D.superclass.doConfig.call(this);
			var L = this.data.length,
				H = this.get('coordinate.height'),
				bh = this.pushIf('barheight',H/(L*2+1));
			
			//bar's height 
			if(bh*L>H){
				bh = this.push('barheight',H/(L*2+1));
			}
			
			//the space of two bar
			this.push('barspace',(H - bh*L)/(L+1));
			
			//use option create a coordinate
			this.coo = $.Interface.coordinate2d.call(this);
			this.pushComponent(this.coo,true);
			
			
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				W = this.coo.get('width'),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				gw = bh+this.get('barspace'),
				t,w,text,value;
				
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.height',bh);
			this.push('rectangle.valueAlign','right');
			this.push('rectangle.tipAlign','right');
			this.push('rectangle.originx',this.x + this.coo.get('brushsize'));
			
			for(var i=0;i<L;i++){
				text = this.data[i].name;
				value = this.data[i].value;
				t = text+":"+value;
				
				w = (this.data[i].value-S.start)*W/S.distance;
				
				if(Le){
					this.push('rectangle.label.text',this.fireString(this,'parseLabelText',[this.data[i],i],t));
				}
				if(Te){
					this.push('rectangle.tip.text',this.fireString(this,'parseTipText',[this.data[i],i],t));
				}
				
				text = this.fireString(this,'parseText',[this.data[i],i],text);
				value = this.fireString(this,'parseValue',[this.data[i],i],value);
				
				/**
				 * y = this.y + brushsize + h
				 */
				this.push('rectangle.originy',this.y+this.get('barspace')+i*gw);
				
				this.push('rectangle.value',value);
				this.push('rectangle.width',w);
				this.push('rectangle.background_color',this.data[i].color);
				this.push('rectangle.id',i);
				
				this.rectangles.push(new $.Rectangle2D(this.get('rectangle'),this));
				
				this.labels.push(new $.Text({
					id:i,
					textAlign:'right',
					textBaseline:'middle',
					text:text,
					originx:this.x - this.get('text_space'),
	 				originy:this.y + this.get('barspace')+i*gw +bh/2
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
			
		}
		
});	/**
	 * @overview this component use for abc
	 * @component#@chart#$.BarMulti2D
	 * @extend#$.Bar
	 */
	$.BarMulti2D = $.extend($.Bar,{
			/**
			 * initialize the context for the BarMulti2D
			 */
			configure:function(){
				/**
				 * invoked the super class's  configuration
				 */
				$.BarMulti2D.superclass.configure.call(this);
				
				this.type = 'barmulti2d';
				
				this.dataType = 'complex';
				
				this.set({
					
				});
				//this.registerEvent();
				this.columns = [];
			},
			doAnimation:function(t,d){
				var r,h;
				this.coo.draw();
				for(var i=0;i<this.labels.length;i++){
					this.labels[i].draw();
				}
				for(var i=0;i<this.rectangles.length;i++){
					r = this.rectangles[i]; 
					this.fireEvent(this,'beforeRectangleAnimation',[this,r]);
					h = Math.ceil(this.animationArithmetic(t,0,r.height,d));
					r.push('originy',r.y+(r.height-h));
					r.push('height',h);
					r.drawRectangle();
					this.fireEvent(this,'afterRectangleAnimation',[this,r]);
				}
			},
			doConfig:function(){
				$.BarMulti2D.superclass.doConfig.call(this);
				
				var L = this.data.length,
					KL= this.columnKeys.length,
					W = this.get('coordinate.width'),
					H = this.get('coordinate.height'),
					total = KL*L,
					// bar's height
					bh = this.pushIf('barheight',H/(KL+1+total));
				
				if(bh*L>H){
					bh = this.push('barheight',H/(KL+1+total));
				}
				
				//the space of two bar
				this.push('barspace',(H - bh*total)/(KL+1));
				
				
				//use option create a coordinate
				this.coo = $.Interface.coordinate2d.call(this);
							
				this.pushComponent(this.coo,true);
				
				//get the max/min scale of this coordinate for calculated the height
				var S = this.coo.getScale(this.get('keduAlign')),
					Le = this.get('label.enable'),
					Te = this.get('tip.enable'),
					gw = L*bh+this.get('barspace'),
					item,t,w,text,value;
				
				/**
				 * quick config to all rectangle
				 */
				this.push('rectangle.height',bh);
				this.push('rectangle.originx',this.x + this.coo.get('brushsize'));
				this.push('rectangle.valueAlign','right');
				this.push('rectangle.tipAlign','right');
				
				for(var i=0;i<this.columns.length;i++){
					item  = this.columns[i].item;
					
					text = this.fireString(this,'parseText',[this.columns[i],i],this.columns[i].name);
					
					for(var j=0;j<item.length;j++){
						w = (item[j].value-S.start)*W/S.distance;
						t = item[j].name+":"+item[j].value;
						if(Le)
							this.push('rectangle.label.text',this.fireString(this,'parseLabelText',[item[j],i],t));
						
						if(Te)
							this.push('rectangle.tip.text',this.fireString(this,'parseTipText',[item[j],i],t));
						
						value = this.fireString(this,'parseValue',[item[j],i],item[j].value);
						
						/**
						 * y = this.y + brushsize + h
						 */
						this.push('rectangle.originy',this.y + this.get('barspace')+j*bh+i*gw);
						
						this.push('rectangle.value',value);
						this.push('rectangle.width',w);
						this.push('rectangle.background_color',item[j].color);
						this.push('rectangle.id',i+'-'+j);
						
						this.rectangles.push(new $.Rectangle2D(this.get('rectangle'),this));
					}
					this.labels.push(new $.Text({
						id:i,
						text:text,
						textAlign:'right',
						textBaseline:'middle',
						originx:this.x - this.get('text_space'),
		 				originy:this.y + this.get('barspace')*0.5+(i+0.5)*gw
					},this));
				}
				this.pushComponent(this.labels);
				this.pushComponent(this.rectangles);
			}
			
	});	/**
	 * Line ability for real-time show 
	 * @overview this component use for abc
	 * @component#$.LineSegment
	 * @extend#$.Component
	 */
	$.LineSegment = $.extend($.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.LineSegment.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'linesegment';
			
			this.set({
				 /**
				  * @cfg {Boolean} if highlight the point when Line-line intersection(default to true)
				  */
				 intersection:true,
				 /**
				 *@cfg {Boolean} if the label displayed (default to false)
				 */
				 label:false,
				 /**
				  * @cfg {String} the shape of two line segment' point(default to 'round').Only applies when intersection is true
				  * @Option 'round'
				  */
				 point_style:'round',
				 point_hollow:true,
				 /**
				  * @cfg {Number} the size of point(default size 4).Only applies when intersection is true
				  */
				 point_size:3,
				 /**
				  * @cfg {Array} the set of points to compose line segment
				  */
				 points:[],
				 keep_with_coordinate:false,
				 shadow:true,
				 shadow_blur:1,
				 shadow_offsetx:0,
				 shadow_offsety:1,
				 spacing:0,
				 coordinate:null,
				 event_range_x:0,
				 /**
				  * @cfg {Boolean} if true tip show when the mouse must enter the valid distance of axis y
				  */
				 limit_y:false,
				 /**
				 * @cfg {Number} The distance between the tip and point
				 */
				 tip_offset:2,
				 event_range_y:0,
				 area:false,
				 area_opacity:0.4,
				 tip:{
					 enable:false,
					 border:{
						width:2
					 }
				 }
			});
			
			this.label = null;
			this.tip = null;
		},
		drawLabel:function(){
			if(this.get('intersection')&&this.get('label')){
				var p = this.get('points');
				for(var i=0;i<p.length;i++){
					this.T.textStyle('center','bottom',$.getFont(this.get('fontweight'),this.get('fontsize'),this.get('font')));
					this.T.fillText(p[i].value,this.x+p[i].x,this.y-p[i].y-this.get('point_size')*3/2,false,this.get('background_color'),'lr',16);
				}
			}
		},
		drawLineSegment:function(){
			this.T.shadowOn(this.get('shadow'),this.get('shadow_color'),this.get('shadow_blur'),this.get('shadow_offsetx'),this.get('shadow_offsety'));
			var p = this.get('points');
			
			if(this.get('area')){
				var polygons = [this.x,this.y];
				for(var i=0;i<p.length;i++){
					polygons.push(this.x+p[i].x);
					polygons.push(this.y-p[i].y);
				}
				polygons.push(this.x+this.get('width'));
				polygons.push(this.y);
				var bg = this.get('light_color');
				if(this.get('gradient')){
					bg = this.T.avgLinearGradient(this.x,this.y-this.get('height'),this.x,this.y,[this.get('light_color2'),bg]);
				}
				//NEXT Config the area polygon
				this.T.polygon(bg,false,1,'',false,'',0,0,0,this.get('area_opacity'),polygons);
			}
			
			
			for(var i=0;i<p.length-1;i++){
				this.T.line(this.x+p[i].x,this.y-p[i].y,this.x+p[i+1].x,this.y-p[i+1].y,this.get('brushsize'),this.get('fill_color'),false);
			}
			
			if(this.get('intersection')){
				for(var i=0;i<p.length;i++){
					if(this.get('point_hollow')){
						this.T.round(this.x+p[i].x,this.y-p[i].y,this.get('point_size'),'#FEFEFE',this.get('brushsize'),this.get('fill_color'));
					}else{
						this.T.round(this.x+p[i].x,this.y-p[i].y,this.get('point_size'),this.get('fill_color'));
					}
				}
			}
			
			if(this.get('shadow')){
		    	this.T.shadowOff();
		    }
		},
		doDraw:function(opts){
			this.drawLineSegment();
			this.drawLabel();
		},
		isEventValid:function(e){
			return {valid:false};
		},
		tipInvoke:function(){
			var x  = this.x,
				y = this.y,
				o = this.get('tip_offset'),
				s = this.get('point_size')+o,
				self = this;
			return function(w,h,m){
				var l = m.left,t = m.top;
				l = ((self.tipPosition<3&&(m.left-w-x-o>0))||(self.tipPosition>2&&(m.left-w-x-o<0)))?l-(w+o):l+o;
				t = self.tipPosition%2==0?m.top+s:m.top-h-s;
				return {
					left:l,
					top:t
				}
			}
		},
		doConfig:function(){
			$.LineSegment.superclass.doConfig.call(this);
			$.Assert.gtZero(this.get('spacing'),'spacing');
			
			var self = this,
				sp = this.get('spacing'),
				ry = self.get('event_range_y'),
				rx = self.get('event_range_x'),
				heap = self.get('tipInvokeHeap'),
				p = self.get('points');
			self.points = p;
			
			for(var i=0;i<p.length;i++){
				p[i].width = p[i].x;
				p[i].height = p[i].y;
			}
			
			if(rx==0){
				rx = self.push('event_range_x',Math.floor(sp/2));
			}else{
				rx = self.push('event_range_x',$.between(1,Math.floor(sp/2),rx));
			}
			if(ry==0){
				ry = self.push('event_range_y',Math.floor(self.get('point_size')));
			}
			
			if(self.get('tip.enable')){
				//self use for tip coincidence
				self.on('mouseover',function(e,m){
					heap.push(self);
					self.tipPosition = heap.length;
				}).on('mouseout',function(e,m){
					heap.pop();
				});
				self.push('tip.invokeOffsetDynamic',true);
				self.tip = new $.Tip(self.get('tip'),self);
			}
			
			var c = self.get('coordinate'),
				ly = self.get('limit_y'),
				k = self.get('keep_with_coordinate'),
				valid =function(i,x,y){
					if(Math.abs(x-(self.x+p[i].x))<rx&&(!ly||(ly&&Math.abs(y-(self.y-p[i].y))<ry))){
						return true;
					}
					return false;
				},
				to = function(i){
					return {valid:true,text:p[i].value,top:self.y-p[i].y,left:self.x+p[i].x,hit:true};
				};
			
			/**
			 * override the default method
			 */
			self.isEventValid =  function(e){
				//console.time('mouseover');
				if(c&&!c.isEventValid(e).valid){
					return {valid:false};
				}
				var ii = Math.floor((e.offsetX-self.x)/sp);
				if(ii<0||ii>=(p.length-1)){
					ii = $.between(0,p.length-1,ii);
					if(valid(ii,e.offsetX,e.offsetY))
						return to(ii);
					else
						return {valid:k};	
				}
				//calculate the pointer's position will between which two point?this function can improve location speed 
				for(var i=ii;i<=ii+1;i++){
					if(valid(i,e.offsetX,e.offsetY))
						return to(i);
				}
				//console.timeEnd('mouseover');
				return {valid:k};
			}
			
			
		}
});	/**
	 * @overview this component use for abc
	 * @component#$.Line
	 * @extend#$.Chart
	 */
	$.Line = $.extend($.Chart,{
		/**
		 * initialize the context for the line
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Line.superclass.configure.call(this);
			
			this.type = 'line';
			
			this.dataType='simple';
				
			this.set({
				coordinate:{},
				/**
				  *@cfg {String} 
				  * Available value are:
				  * @Option 'left,'right'
			 	 */
				keduAlign:'left',
				/**
				  *@cfg {String} 
				  * Available value are:
				  * @Option 'top,'bottom'
			 	 */
				labelAlign:'bottom',
				labels:[],
				label_space:6,
				/**
				 *@cfg {Boolean} Can Line smooth?
				 */
				smooth:false,
				/**
				 *@cfg {Boolean} if the point are proportional space(default to true)
				 */
				proportional_spacing:true,
				/**
				 * @cfg {TypeName}  need named ???
				 */
				label_spacing:0,
				segment_style:{
					 /**
					 *@cfg {Boolean} if the label displayed (default to true)
					 */
					label:false
				},
				/**
				 *@cfg {Boolean} if the tip displayed (default to false).Note that this option only applies when showPoint = true. 
				 */
				tip:{
					enable:false
				},
				legend:{
					sign:'round-bar',
				 	sign_size:14
				},
				/**
				 *@cfg {Boolean} if the crosshair displayed (default to false). 
				 */
				crosshair:false,
				/**
				 *@cfg {Object} style of the crosshair. 
				 */
				crosshair_style:{
					width:1,
					color:'blank'
				},
				/**
				 *@cfg {Boolean} 
				 */
				customize_layout:false
			});
			
			this.registerEvent(
				'parsePoint',
				'beforeLineAnimation',
				'afterLineAnimation'
			);
			
			this.lines = [];
		},
		doConfig:function(){
			$.Line.superclass.doConfig.call(this);
			
			/**
			 * apply the coordinate feature
			 */
			$.Interface.coordinate.call(this);
			
			this.push('line_start',(this.get('coordinate.width')-this.get('coordinate.valid_width'))/2);
			this.push('line_end',this.get('coordinate.width')-this.get('line_start'));
			
			if(this.get('proportional_spacing'))
			this.push('label_spacing',this.get('coordinate.valid_width')/(this.get('maxItemSize')-1));
			
			
			this.push('segment_style.originx',this.get('originx')+this.get('line_start'));
			
			//NEXT y also has line_start and line end
			this.push('segment_style.originy',this.get('originy')+this.get('coordinate.height'));
			
			this.push('segment_style.width',this.get('coordinate.valid_width'));
			this.push('segment_style.height',this.get('coordinate.valid_height'));
			
			this.push('segment_style.limit_y',this.data.length>1);
			
			this.push('segment_style.keep_with_coordinate',true&&this.data.length==1);
			
			var single = this.data.length==1,self = this;
			
			if(this.get('coordinate.crosshair.enable')){
				this.push('coordinate.crosshair.hcross',single);
				this.push('coordinate.crosshair.invokeOffset',function(e,m){
					var r = self.lines[0].isEventValid(e);//NEXT how fire muti line?
					return r.valid?r:false;
				});
			}
			
			if(!this.get('segment_style.tip')){
				this.push('segment_style.tip',this.get('tip'));
			}else{
				this.push('segment_style.tip.wrap',this.get('tip.wrap'));
			}
			
			
		}
		
});	/**
	 * @overview this component use for abc
	 * @component#@chart#$.LineBasic2D
	 * @extend#$.Line
	 */
	$.LineBasic2D = $.extend($.Line,{
		/**
		 * initialize the context for the LineBasic2D
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.LineBasic2D.superclass.configure.call(this);
			
			this.type = 'basicline2d';
			
			this.set({
				
			});
			 
			this.registerEvent();
			
			this.tipInvokeHeap = [];
		},
		doAnimation:function(t,d){
			var l,p;
			this.coo.draw();
			for(var i=0;i<this.lines.length;i++){
				l = this.lines[i]; 
				this.fireEvent(this,'beforeLineAnimation',[this,l]);
				
				for(var j=0;j<l.points.length;j++){
					p = l.points[j];
					p.y = Math.ceil(this.animationArithmetic(t,0,p.height,d));
				}
				
				l.drawLineSegment();
				
				this.fireEvent(this,'afterLineAnimation',[this,l]);
			}
		},
		doConfig:function(){
			$.LineBasic2D.superclass.doConfig.call(this);
			
			this.coo = new $.Coordinate2D($.merge({
					kedu:[{
						 position:this.get('keduAlign'),	
						 max_scale:this.get('maxValue')
					},{
						 position:this.get('labelAlign'),	
						 scaleEnable:false,
						 start_scale:1,
						 scale:1,
						 end_scale:this.get('maxItemSize'),
						 labels:this.get('labels')
					}],
				 	axis:{
						width:[0,0,2,2]
				 	}
				},this.get('coordinate')),this);
			
			
			this.pushComponent(this.coo,true);
			
			this.push('segment_style.tip.showType','follow');
			this.push('segment_style.coordinate',this.coo);
			this.push('segment_style.tipInvokeHeap',this.tipInvokeHeap);
			
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				H=this.get('coordinate.valid_height'),
				sp=this.get('label_spacing'),
				points,x,y,
				d = this.data;
			
			for(var i=0;i<d.length;i++){
				points = [];
				for(var j=0;j<d[i].value.length;j++){
					x = sp*j;
					y = (d[i].value[j]-S.start)*H/S.distance;
					points.push($.merge({x:x,y:y,value:d[i].value[j]},this.fireEvent(this,'parsePoint',[d[i].value[j],x,y,j])));
				}
				
				this.push('segment_style.spacing',sp);
				this.push('segment_style.points',points);
				this.push('segment_style.brushsize',d[i].linewidth||1);
				this.push('segment_style.background_color',d[i].color);
				
				this.lines.push(new $.LineSegment(this.get('segment_style'),this));
			}
			this.pushComponent(this.lines);
			
						
			
		}
		
});;(function(){
	var Queue = function(T,L){
		this.T = T;
		this.line = L;
		this.direction = T.get('direction');
		this.size = T.get('queue_size');
		this.space = T.get('label_spacing');
		this.end = T.get('line_end');
	}
	
	Queue.prototype = {
		push:function(v){
			if(!$.isArray(v)){
				v = [v];
			}
			if(this.direction=='left'){
				v.reverse();
			}
			
			while(this.size<(this.line.points.length+v.length))
				this.line.points.shift();
			
			//平移
			for ( var j = 0; j < this.line.points.length; j++) {
				this.line.points[j].x += (this.space*v.length)*(this.direction=='left'?-1:1);
			}
			
			for ( var j = 0; j < v.length; j++) {
				x = this.direction=='left'?(this.end - this.space * j):(this.space * j);
				y = ($.between(this.T.S.start,this.T.S.end,v[j]) - this.T.S.start)*this.T.S.uh;
				this.line.points.push($.merge({x : x,y : y,value : v[j]},this.T.fireEvent(this.T, 'parsePoint', [v[j], x, y, j ])));
			}
		}
	}
	
	/**
	 * Line ability for real-time show 
	 * @overview this component use for abc
	 * @component#@chart#$.LineMonitor2D
	 * @extend#$.Line
	 */
	$.LineMonitor2D = $.extend($.Line,{
		/**
		 * initialize the context for the denseline2d
		 */
		configure : function(config) {
			/**
			 * invoked the super class's  configuration
			 */
			$.LineMonitor2D.superclass.configure.call(this);

			this.type = 'linemonitor2d';

			this.set({
				/**
				 * @cfg {String} the direction of line run (default 'left')
				 * Available value are:
				 * @Option 'left'
				 * @Option 'right'
				 */
				direction : 'left',
				queue_size : 10
			});
			this.registerEvent();
			
			this.queues = [];
			
		},
		createQueue:function(style){
			this.init();
			style = style || {};
			var LS = $.clone(this.get('segment_style'));
				LS.brushsize = style.linewidth || 1;
				LS.background_color = style.color || '#BDBDBD';
			var L = new $.LineSegment(LS, this);
			this.pushComponent(L);
			var queue = new Queue(this,L);
			//this.queues.push(queue);
			return queue;
		},
		doConfig : function() {
			$.LineMonitor2D.superclass.doConfig.call(this);
			
			var self = this;
			//the monitor not support the animation now
			self.push('animation',false);
			
			
			if (self.get('coordinate.crosshair.enable')) {
				self.push('coordinate.crosshair.hcross',self.data.length == 1);
				self.push('coordinate.crosshair.invokeOffset',function(e, m) {
						var r = self.lines[0].isEventValid(e);
						return r.valid ? r : false;
				});
			}
			
			self.coo = new $.Coordinate2D($.merge( {
				kedu : [ {
					position : self.get('keduAlign'),
					max_scale : self.get('maxValue')
				}, {
					position : self.get('labelAlign'),
					scaleEnable : false,
					start_scale : 1,
					scale : 1,
					end_scale : self.get('maxItemSize'),
					labels : self.get('labels')
				} ],
				axis : {
					width : [ 0, 0, 1, 1 ]
				}
			}, self.get('coordinate')), self);

			self.pushComponent(self.coo, true);
			
			self.push('label_spacing',self.get('coordinate.valid_width')/(self.get('queue_size')-1));
			
			if (!self.get('segment_style.tip')) {
				self.push('segment_style.tip', self.get('tip'));
			} else {
				self.push('segment_style.tip.wrap', self.get('tip.wrap'));
			}

			self.push('segment_style.tip.showType','follow');
			self.push('segment_style.coordinate',self.coo);
			self.push('segment_style.keep_with_coordinate',true);
			
			//get the max/min scale of this coordinate for calculated the height
			self.S = self.coo.getScale(self.get('keduAlign'));
			self.S.uh = self.get('coordinate.valid_height')/ self.S.distance;
			

		}

	});
})();	/**
	 * @overview this component use for abc
	 * @component#@chart#$.Area2D
	 * @extend#$.LineBasic2D
	 */
	$.Area2D = $.extend($.LineBasic2D,{
		/**
		 * initialize the context for the area2d
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			$.Area2D.superclass.configure.call(this);
			
			this.type = 'area2d';
			
			this.set({
				area:true,
				area_opacity:0.3
			});
			
			this.registerEvent();
			
		},
		doConfig:function(){
			/**
			 * must apply the area's config before 
			 */
			this.push('segment_style.area',true);
			this.push('segment_style.area_opacity',this.get('area_opacity'));
			
			$.Area2D.superclass.doConfig.call(this);
			
			
		}
	});})(iChart);