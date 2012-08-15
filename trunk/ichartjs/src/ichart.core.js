/**
 * ichartjs  Library v1.0
 * http://www.ichartjs.cn/
 * Copyright 2012 wanghetommy@gmail.com
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0 
 */
;(function(window){
var ua = navigator.userAgent.toLowerCase(),
	mc = function(e) {
		return e.test(ua)
	},ts = Object.prototype.toString,
        docMode = document.documentMode,
        isOpera = mc(/opera/),
        isChrome = mc(/\bchrome\b/),
        isWebKit = mc(/webkit/),
        isSafari = !isChrome && mc(/safari/),
        isIE = !isOpera && mc(/msie/),
        supportCanvas = !!document.createElement('canvas').getContext,
        isGecko = !isWebKit && mc(/gecko/),
        isFF = isGecko&&mc(/firefox/),
        isMobile = mc(/ipod|ipad|iphone|android/gi),
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
		/**
		 * 如果是纯整数或者纯小数,返回靠近其最小数量级(1/5)的数
		 * 若有整数和小数,则按照整数部分确定parseInt(value)==value
		 */
		factor = function(v,f){
			if(v==0)return v;
			f = f || 5;
			if(parseInt(v)==0){
				return parseFloat((v/f+"").substring(0,(v+"").length+1));
			}
			return Math.ceil(v/f);
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
			gray:'rgb(80,80,80)',
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
			 * obtain the Dom Document 
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
			/**
			 * simple noConflict implements
			 */
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
			 */
			quadrant:function (ox,oy,x,y){
				if(ox<x){if(oy<y){return 3;}else{return 0;}}else{if(oy<y){return 2;}else{return 1;}}
			},
			quadrantd:function(a){
				return ceil(2*(a%(pi*2))/pi);
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
				return (v*100).toFixed(d)+'%';
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
			 * 返回向上靠近一个数量级为f的数
			 */
			ceil:function(max,f){
				return max+factor(max,f);
			},
			/**
			 * 返回向下靠近一个数量级为f的数
			 */
			floor:function(max,f){
				return max-factor(max,f);
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
			isIE : isIE,
			isGecko : isGecko,
			isFF:isFF,
			isLinux : isLinux,
			isMobile : isMobile,
			isWindows : isWindows,
			isMac : isMac,
			/**
			 * static variable
			 */
			FRAME:isMobile?24:54,
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
		 * shim layer with setTimeout fallback
		 */
	    window.requestAnimFrame = (function(){
	      return  window.requestAnimationFrame       || 
	              window.webkitRequestAnimationFrame || 
	              window.mozRequestAnimationFrame    || 
	              window.oRequestAnimationFrame      || 
	              window.msRequestAnimationFrame     || 
	              function( callback ){
	                window.setTimeout(callback, 1000 / 60);
	              };
	    })();
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


/**
 * Add useful method
 */
Array.prototype.each = function(f,s)
{
	var j = this.length,r;for(var i=0;i<j;i++){r=s?f.call(s,this[i],i):f(this[i],i);if(typeof r === "boolean" && !r){break}};
};
Array.prototype.eachAll = function(f,s)
{
	this.each(function(d,i){if(iChart_.isArray(d)){d.eachAll(f, s);}else{s?f.call(s,d,i):f(d,i);}},s);
};
window.iChart = iChart_;
if(!window.$){
	window.$ = window.iChart;
}
})(window);
