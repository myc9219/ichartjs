/**
 * ichartjs Library v1.0 http://www.ichartjs.com/
 * 
 * @author wanghe
 * @Copyright 2012 wanghetommy@gmail.com Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
;
(function(window) {
	var ua = navigator.userAgent.toLowerCase(), mc = function(e) {
		return e.test(ua)
	}, ts = Object.prototype.toString, isOpera = mc(/opera/), isChrome = mc(/\bchrome\b/), isWebKit = mc(/webkit/), isSafari = !isChrome && mc(/safari/), isIE = !isOpera && mc(/msie/), supportCanvas = !!document.createElement('canvas').getContext, isGecko = !isWebKit
			&& mc(/gecko/), isMobile = mc(/ipod|ipad|iphone|android/gi), arithmetic = {
		Linear : function(t, b, c, d) {
			return c * t / d + b;
		},
		Quad : {
			easeIn : function(t, b, c, d) {
				return c * (t /= d) * t + b;
			},
			easeOut : function(t, b, c, d) {
				return -c * (t /= d) * (t - 2) + b;
			},
			easeInOut : function(t, b, c, d) {
				if ((t /= d / 2) < 1)
					return c / 2 * t * t + b;
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			}
		},
		Cubic : {
			easeIn : function(t, b, c, d) {
				return c * (t /= d) * t * t + b;
			},
			easeOut : function(t, b, c, d) {
				return c * ((t = t / d - 1) * t * t + 1) + b;
			},
			easeInOut : function(t, b, c, d) {
				if ((t /= d / 2) < 1)
					return c / 2 * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t + 2) + b;
			}
		},
		Quart : {
			easeIn : function(t, b, c, d) {
				return c * (t /= d) * t * t * t + b;
			},
			easeOut : function(t, b, c, d) {
				return -c * ((t = t / d - 1) * t * t * t - 1) + b;
			},
			easeInOut : function(t, b, c, d) {
				if ((t /= d / 2) < 1)
					return c / 2 * t * t * t * t + b;
				return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
			}
		},
		Bounce : {
			easeOut : function(t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
				}
			}
		}
	};
	var iChart_ = (function(window) {
		/**
		 * spirit from jquery
		 */
		var isReady = false, readyBound = false, readyList = [], DOMContentLoaded = (function() {
			if (document.addEventListener) {
				return function() {
					document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
					ready();
				};
			} else if (document.attachEvent) {
				return function() {
					if (document.readyState === "complete") {
						document.detachEvent("onreadystatechange", DOMContentLoaded);
						ready();
					}
				};
			}
		})(), doScrollCheck = function() {
			if (isReady) {
				return;
			}
			try {
				document.documentElement.doScroll("left");
			} catch (e) {
				setTimeout(doScrollCheck, 1);
				return;
			}
			ready();
		}, ready = function() {
			if (!isReady) {
				isReady = true;
				for ( var i = 0; i < readyList.length; i++) {
					readyList[i].call(document);
				}
				readyList = [];
			}
		}, bindReady = function() {
			if (readyBound)
				return;
			readyBound = true;
			if (document.readyState === "complete") {
				return setTimeout(ready, 1);
			}
			if (document.addEventListener) {
				document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
				window.addEventListener("load", ready, false);
			} else if (document.attachEvent) {
				document.attachEvent("onreadystatechange", DOMContentLoaded);
				window.attachEvent("onload", ready);
				var toplevel = false;

				try {
					toplevel = window.frameElement == null;
				} catch (e) {
				}

				if (document.documentElement.doScroll && toplevel) {
					doScrollCheck();
				}
			}
		}, bind = function(fn) {
			bindReady();
			if (isReady)
				fn.call(document, _);
			else
				readyList.push(function() {
					return fn.call(this);
				});
		}, _ = function(selector) {
			if (!selector || selector.nodeType) {
				return selector;
			}
			if (typeof selector === "string") {
				if (selector.indexOf("#") != -1) {
					selector = selector.substring(1);
				}
				return document.getElementById(selector);
			}
			if (typeof selector === "function") {
				bind(selector);
			}
		};

		_.apply = function(d, e) {
			if (d && e && typeof e == "object") {
				for ( var a in e) {
					if (typeof e[a] != 'undefined')
						d[a] = e[a]
				}
			}
			if (!e && d) {
				var clone = {};
				for ( var a in d) {
					clone[a] = d[a]
				}
				return clone;
			}
			return d
		};

		_.apply(_, {
			version : "1.0",
			email : 'taylor@ichartjs.com',
			isEmpty : function(C, e) {
				return C === null || C === undefined || ((_.isArray(C) && !C.length)) || (!e ? C === "" : false)
			},
			isArray : function(e) {
				return ts.apply(e) === "[object Array]"
			},
			isDate : function(e) {
				return ts.apply(e) === "[object Date]"
			},
			isObject : function(e) {
				return !!e && ts.apply(e) === "[object Object]"
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
			}
		});

		/**
		 * only get the attr that target not exist
		 */
		_.applyIf = function(d, e) {
			if (d && _.isObject(e)) {
				for ( var a in e) {
					if (_.isDefined(e[a]) && !_.isDefined(d[a]))
						d[a] = e[a]
				}
			}
			if (!e && d) {
				return _.apply(d);
			}
			return d
		};
		/**
		 * there will apply a deep clone
		 */
		_.merge = function(d, e, f) {
			if (d && _.isObject(e)) {
				for ( var a in e) {
					if (_.isDefined(e[a])) {
						if (_.isObject(e[a])) {
							if (_.isObject(d[a])) {
								_.merge(d[a], e[a]);
							} else {
								d[a] = _.clone(e[a], true);
							}
						} else {
							d[a] = e[a];
						}
					}
				}
				if (_.isObject(f)) {
					return _.merge(d, f);
				}
			}
			return d;
		};
		/**
		 * clone attribute that given
		 */
		_.clone = function(a, e, deep) {
			var d = {};
			if (_.isArray(a)&& _.isObject(e)) {
				for ( var i = 0; i < a.length; i++) {
					if (deep && _.isObject(e[a[i]]))
						d[a[i]] = _.clone(e[a[i]]);
					else
						d[a[i]] = e[a[i]];
				}
			} else if (_.isObject(a)) {
				for ( var b in a) {
					// avoid recursion reference
					if (e && _.isObject(a[b])&& !(a[b] instanceof _.Painter))
						d[b] = _.clone(a[b], e);
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

		/**
		 * spirit from ext2.0
		 */
		_.extend = function() {
			var C = function(E) {
				for ( var D in E) {
					this[D] = E[D];
				}
			};
			var e = Object.prototype.constructor;
			return function(G, O) {
				var J = function() {
					G.apply(this, arguments);
				}
				var E = function() {
				}, H, D = G.prototype;
				E.prototype = D;
				H = J.prototype = new E();
				H.constructor = J;
				J.superclass = D;
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
				J.plugin_ = {};
				
				J.plugin = function(M,F) {
					if (_.isString(M) && _.isFunction(F))
						J.plugin_[M] = F;
				};
				return J;
			}
		}();

		// *******************Math************************
		var sin = Math.sin, cos = Math.cos, atan = Math.atan, tan = Math.tan, acos = Math.acos, sqrt = Math.sqrt, abs = Math.abs, pi = Math.PI, pi2 = 2 * pi, ceil = Math.ceil, round = Math.round, floor = Math.floor, max = Math.max, min = Math.min, pF = parseFloat,
		/**
		 * 如果是纯整数或者纯小数,返回靠近其最小数量级(1/5)的数 若有整数和小数,则按照整数部分确定parseInt(value)==value
		 */
		factor = function(v, f) {
			if (v == 0)
				return v;
			f = f || 5;
			if (parseInt(v) == 0) {
				return pF((v / f + "").substring(0, (v + "").length + 1));
			}
			return ceil(v / f);
		}, colors = {
			navy : 'rgb(0,0,128)',
			olive : 'rgb(128,128,0)',
			orange : 'rgb(255,165,0)',
			silver : 'rgb(192,192,192)',
			white : 'rgb(255,255,255)',
			gold : 'rgb(255,215,0)',
			lime : 'rgb(0,255,0)',
			fuchsia : 'rgb(255,0,255)',
			aqua : 'rgb(0,255,255)',
			green : 'rgb(0,128,0)',
			gray : 'rgb(80,80,80)',
			red : 'rgb(255,0,0)',
			blue : 'rgb(0,0,255)',
			pink : 'rgb(255,192,203)',
			purple : 'rgb(128,0,128)',
			yellow : 'rgb(255,255,0)',
			maroon : 'rgb(128,0,0)',
			black : 'rgb(0,0,0)',
			azure : 'rgb(240,255,255)',
			beige : 'rgb(245,245,220)',
			brown : 'rgb(165,42,42)',
			cyan : 'rgb(0,255,255)',
			darkblue : 'rgb(0,0,139)',
			darkcyan : 'rgb(0,139,139)',
			darkgrey : 'rgb(169,169,169)',
			darkgreen : 'rgb(0,100,0)',
			darkkhaki : 'rgb(189,183,107)',
			darkmagenta : 'rgb(139,0,139)',
			darkolivegreen : 'rgb(85,107,47)',
			darkorange : 'rgb(255,140,0)',
			darkorchid : 'rgb(153,50,204)',
			darkred : 'rgb(139,0,0)',
			darksalmon : 'rgb(233,150,122)',
			darkviolet : 'rgb(148,0,211)',
			indigo : 'rgb(75,0,130)',
			khaki : 'rgb(240,230,140)',
			lightblue : 'rgb(173,216,230)',
			lightcyan : 'rgb(224,255,255)',
			lightgreen : 'rgb(144,238,144)',
			lightgrey : 'rgb(211,211,211)',
			lightpink : 'rgb(255,182,193)',
			lightyellow : 'rgb(255,255,224)',
			magenta : 'rgb(255,0,255)',
			violet : 'rgb(128,0,128)'
		}, hex2Rgb = function(hex) {
			hex = hex.replace(/#/g, "").replace(/^(\w)(\w)(\w)$/, "$1$1$2$2$3$3");
			return 'rgb(' + parseInt(hex.substring(0, 2), 16) + ',' + parseInt(hex.substring(2, 4), 16) + ',' + parseInt(hex.substring(4, 6), 16) + ')';
		}, i2hex = function(N) {
			return ('0' + parseInt(N).toString(16)).slice(-2);
		}, rgb2Hex = function(rgb) {
			var m = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
			return m ? ('#' + i2hex(m[1]) + i2hex(m[2]) + i2hex(m[3])).toUpperCase() : null;
		}, c2a = function(rgb) {
			var result = /rgb\((\w*),(\w*),(\w*)\)/.exec(rgb);
			if (result) {
				return new Array(result[1], result[2], result[3]);
			}
			result = /rgba\((\w*),(\w*),(\w*),(.*)\)/.exec(rgb);
			if (result) {
				return new Array(result[1], result[2], result[3], result[4]);
			}
			throw new Error("invalid colors value '" + rgb + "'");
		}, toHsv = function(r, g, b) {
			if (_.isArray(r)) {
				g = r[1];
				b = r[2];
				r = r[0];
			}
			r = r / 255;
			g = g / 255;
			b = b / 255;
			var m = max(max(r, g), b), mi = min(min(r, g), b), dv = m - mi;
			if (dv == 0) {
				return new Array(0, 0, m);
			}
			var h;
			if (r == m) {
				h = (g - b) / dv;
			} else if (g == m) {
				h = (b - r) / dv + 2;
			} else if (b == m) {
				h = (r - g) / dv + 4;
			}
			h *= 60;
			if (h < 0)
				h += 360;
			return new Array(h, dv / m, m);
		}, toRgb = function(color) {
			color = color.replace(/\s/g, '').toLowerCase();
			// Look for rgb(255,255,255)
			if (/rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)/.exec(color)) {
				return color;
			}

			// Look for rgba(255,255,255,0.3)
			if (/rgba\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},(0(\.[0-9])?|1(\.0)?)\)/.exec(color)) {
				return color;
			}

			// Look for #a0b1c2 or #fff
			if (/#(([a-fA-F0-9]{6})|([a-fA-F0-9]{3}))/.exec(color))
				return hex2Rgb(color);
			// Look a string for green
			if (colors[color])
				return colors[color];
			throw new Error("invalid colors value '" + color + "'");
		}, hsv2Rgb = function(h, s, v, a) {
			if (_.isArray(h)) {
				a = s;
				s = h[1];
				v = h[2];
				h = h[0];
			}
			var r, g, b,
			hi = floor(h / 60) % 6,
			f = h / 60 - hi,
			p = v * (1 - s),
			q = v * (1 - s * f),
			t = v * (1 - s * (1 - f));
			switch (hi) {
				case 0 :
					r = v;
					g = t;
					b = p;
					break;
				case 1 :
					r = q;
					g = v;
					b = p;
					break;
				case 2 :
					r = p;
					g = v;
					b = t;
					break;
				case 3 :
					r = p;
					g = q;
					b = v;
					break;
				case 4 :
					r = t;
					g = p;
					b = v;
					break;
				case 5 :
					r = v;
					g = p;
					b = q;
					break;
			}
			return 'rgb' + (a ? 'a' : '') + '(' + round(r * 255) + ',' + round(g * 255) + ',' + round(b * 255) + (a ? ',' + a + ')' : ')');
		},
		// the increment of s(v) of hsv model
		s_inc = 0, v_inc = 0.14,
		/**
		 * 当目标值>0.1时:以增量iv为上限、随着目标值的减小增量减小 当目标值<=0.1时:若指定的增量大于目标值则直接返回其1/2、否则返回增量值
		 */
		inc = function(v, iv) {
			iv = iv || v_inc;
			if (v > 0.5) {
				return iv - (1 - v) / 10;
			} else if (v > 0.1) {
				return iv - 0.16 + v / 5;
			} else {
				return v > iv ? iv : v / 2;
			}
		},
		/**
		 * @method anole,make color darker or lighter
		 * @param {Boolean} d true:dark,false:light
		 * @param {Object} rgb:color
		 * @param {Number} iv 明度(0-1)
		 * @param {Number} is 纯度(0-1)
		 */
		anole = function(d, rgb, iv, is) {
			if (!rgb)
				return rgb;
			rgb = c2a(toRgb(rgb));
			var hsv = toHsv(rgb);
			hsv[1] -= is || s_inc;
			if (d) {
				hsv[2] -= inc(hsv[2], iv);
				hsv[1] = _.upTo(hsv[1], 1);
				hsv[2] = _.lowTo(hsv[2], 0);
			} else {
				hsv[2] += inc((1 - hsv[2]), iv);
				hsv[1] = _.lowTo(hsv[1], 0);
				hsv[2] = _.upTo(hsv[2], 1);
			}
			return hsv2Rgb(hsv, rgb[3]);
		};

		_.apply(_, {
			getFont : function(w, s, f) {
				return w + " " + s + "px " + f;
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
			DefineAbstract : function(M, H) {
				if (!H[M])
					throw new Error("Cannot instantiate the type '" + H.type + "'.you must implements it with method '" + M + "'.");
			},
			getAA : function(tf) {
				if (tf == 'linear')
					return arithmetic.Linear;
				if (tf == 'bounce')
					return arithmetic.Bounce.easeOut;
				if (tf == 'easeInOut' || tf == 'easeIn' || tf == 'easeOut')
					return arithmetic[_.DefaultAA][tf];
				return arithmetic.Linear;
			},
			/**
			 * simple noConflict implements
			 */
			noConflict : function() {
				return iChart_;
			},
			plugin : function(t, m, f) {
				if (_.isFunction(t))
					t.plugin(m, f);
			},
			parsePadding : function(s, d) {
				if (_.isNumber(s))
					return new Array(s, s, s, s);
				if (_.isArray(s))
					return s;
				d = d || 0;
				s = s.replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, /\s/).replace(/\s/g, ',').split(",");
				if (s.length == 1) {
					s[0] = s[1] = s[2] = s[3] = pF(s[0]) || d;
				} else if (s.length == 2) {
					s[0] = s[2] = pF(s[0]) || d;
					s[1] = s[3] = pF(s[1]) || d;
				} else if (s.length == 3) {
					s[0] = pF(s[0]) || d;
					s[1] = s[3] = pF(s[1]) || d;
					s[2] = pF(s[2]) || d;
				} else {
					s[0] = pF(s[0]) || d;
					s[1] = pF(s[1]) || d;
					s[2] = pF(s[2]) || d;
					s[3] = pF(s[3]) || d;
				}
				return s;
			},
			/**
			 * the distance of two point
			 */
			distanceP2P : function(x1, y1, x2, y2) {
				return sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
			},
			atan2Radian : function(ox, oy, x, y) {
				if (ox == x) {
					if (y > oy)
						return pi / 2;
					return pi * 3 / 2;
				}
				var q = _.quadrant(ox, oy, x, y);
				var r = atan(abs((oy - y) / (ox - x)));
				if (q == 1) {
					r = pi - r;
				} else if (q == 2) {
					r = pi + r;
				} else if (q == 3) {
					r = pi2 - r;
				}
				return r;
			},
			angle2Radian : function(a) {
				return a * pi / 180;
			},
			radian2Angle : function(r) {
				return r * 180 / pi;
			},
			/**
			 * indicate angle in which quadrant,and it different from math's concept.this will return 0 if it in first quadrant(other eg.0,1,2,3)
			 */
			quadrant : function(ox, oy, x, y) {
				if (ox < x) {
					if (oy < y) {
						return 3;
					} else {
						return 0;
					}
				} else {
					if (oy < y) {
						return 2;
					} else {
						return 1;
					}
				}
			},
			quadrantd : function(a) {
				if(a==0)return 0;
				if(a % pi2==0)return 3;
				return ceil(2 * (a % pi2) / pi)-1;
			},
			upTo : function(u, v) {
				return v > u ? u : v;
			},
			lowTo : function(l, v) {
				return v < l ? l : v;
			},
			between : function(l, u, v) {
				return v > u ? u : v < l ? l : v;
			},
			inRange : function(l, u, v) {
				return u > v && l < v;
			},
			angleInRange : function(l, u, v) {
				l = l % pi2;
				u = u % pi2;
				if (u > l) {
					return u > v && l < v;
				}
				if (u < l) {
					return v < u || v > l;
				}
				return v == u;
			},
			inRangeClosed : function(l, u, v) {
				return u >= v && l <= v;
			},
			inEllipse : function(x, y, a, b) {
				return (x * x / a / a + y * y / b / b) <= 1;
			},
			p2Point : function(x, y, a, C) {
				return {
					x : x + cos(a) * C,
					y : y + sin(a) * C
				}
			},
			/**
			 * 计算空间点坐标矢量
			 */
			vectorP2P : function(x, y, radian) {
				if (!radian) {
					y = _.angle2Radian(y);
					x = _.angle2Radian(x);
				}
				y = sin(y);
				return {
					x : y * sin(x),
					y : y * cos(x)
				}
			},
			iGather : function(k) {
				return (k || 'ichartjs') + '-' + ceil(Math.random()*10000)+new Date().getTime().toString().substring(4);
			},
			toPercent : function(v, d) {
				return (v * 100).toFixed(d) + '%';
			},
			parseFloat : function(v, d) {
				if (!_.isNumber(v)) {
					v = pF(v);
					if (!_.isNumber(v))
						throw new Error("'" + d + "'is not a valid number.");
				}
				return v;
			},
			/**
			 * 返回向上靠近一个数量级为f的数
			 */
			ceil : function(max, f) {
				return max + factor(max, f);
			},
			/**
			 * 返回向下靠近一个数量级为f的数
			 */
			floor : function(max, f) {
				return max - factor(max, f);
			},
			_2D : '2d',
			_3D : '3d',
			light : function(rgb, iv, is) {
				return anole(false, rgb, iv, is);
			},
			dark : function(rgb, iv, is) {
				return anole(true, rgb, iv, is);
			},
			fixPixel : function(v) {
				return _.isNumber(v) ? v : pF(v.replace('px', "")) || 0;
			},
			toPixel : function(v) {
				return _.isNumber(v) ? v + 'px' : _.fixPixel(v) + 'px';
			},
			emptyFn : function() {
				return true;
			},
			supportCanvas : supportCanvas,
			isOpera : isOpera,
			isWebKit : isWebKit,
			isChrome : isChrome,
			isSafari : isSafari,
			isIE : isIE,
			isGecko : isGecko,
			isMobile : isMobile,
			touch: "ontouchend" in document,
			FRAME : isMobile ? 30 : 60,
			DefaultAA : 'Cubic'
		});
		_.Assert = {
			gtZero : function(v, n) {
				_.Assert.gt(v, 0, n);
			},
			gt : function(v, c, n) {
				if (!_.isNumber(v) && v >= c)
					throw new Error(n + " required Number gt " + c + ",given:" + v);
			},
			isNumber : function(v, n) {
				if (!_.isNumber(v))
					throw new Error(n + " required Number,given:" + v);
			},
			isArray : function(v, n) {
				if (!_.isArray(v))
					throw new Error(n + " required Array,given:" + v);
			},
			isTrue : function(v, cause) {
				if (v !== true)
					throw new Error(cause);
			},
			equal : function(v1, v2, cause) {
				if (v1 !== v2)
					throw new Error(cause);
			}
		};
		/**
		 * shim layer with setTimeout fallback
		 */
		_.requestAnimFrame = (function() {
			var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
			return function(f){raf(f)}
		})();
		
		
		/**
		 * defined Event
		 */
		_.Event = {
			addEvent : function(ele, type, fn, useCapture) {
				if (ele.addEventListener)
					ele.addEventListener(type, fn, useCapture);
				else if (ele.attachEvent)
					ele.attachEvent('on' + type, fn);
				else
					ele['on' + type] = fn;
			},
			fix : function(e) {
				/**
				 * Fix event for mise
				 */
				if (typeof (e) == 'undefined') {
					e = window.event;
				}
				var E = {
						target:e.target,
						pageX : e.pageX,
						pageY : e.pageY,
						offsetX : e.offsetX,
						offsetY : e.offsetY,
						//time: new Date().getTime(),
						event:e
					};
				
				/**
				 * This is mainly for FF which doesn't provide offsetX
				 */
				if (typeof (e.offsetX) == 'undefined') {
					/**
					 * Fix target property, if necessary
					 */
					if (!e.target) {
						E.target = e.srcElement || document;
					}
					
					if(e.targetTouches){
						E.pageX = e.targetTouches[0].pageX;
						E.pageY = e.targetTouches[0].pageY;
					}
					
					/**
					 * Calculate pageX/Y if missing and clientX/Y available
					 */
					if (E.pageX == null && e.clientX != null) {
						var doc = document.documentElement, body = document.body;
						E.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
						E.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
					}
					
					/**
					 * Browser not with offsetX and offsetY
					 */
					var x = 0, y = 0, obj = e.target;
					while (obj != document.body && obj) {
						x += obj.offsetLeft;
						y += obj.offsetTop;
						obj = obj.offsetParent;
					}
					E.offsetX = E.pageX - x;
					E.offsetY = E.pageY - y;
				}
				
				E.x = E.offsetX;
				E.y = E.offsetY;
				/**
				 * Any browser that doesn't implement stopPropagation() (MSIE)
				 */
				if (!e.stopPropagation) {
					e.stopPropagation = function() {
						window.event.cancelBubble = true;
					}
				}
				
				return E;
		}
		};
		return _;

	})(window);

	/**
	 * Add useful method
	 */
	Array.prototype.each = function(f, s) {
		var j = this.length, r;
		for ( var i = 0; i < j; i++) {
			r = s ? f.call(s, this[i], i) : f(this[i], i);
			if (typeof r === "boolean" && !r) {
				break
			}
		};
	};

	Array.prototype.eachAll = function(f, s) {
		this.each(function(d, i) {
			if (iChart_.isArray(d)) {
				return d.eachAll(f, s);
			} else {
				return s ? f.call(s, d, i) : f(d, i);
			}
		}, s);
	};
	
	Array.prototype.sor = function(f) {
		var _=this,L = _.length,T; 
		for(var i = 0; i < L - 2; i++){
			for (var j = L -1; j >=1;j--) {
			　　if (f?!f(_[j],_[j - 1]):(_[j] < _[j - 1])){ 
				　　T = _[j]; 　　
					_[j] = _[j - 1]; 　　
					_[j - 1] = T; 
				} 
			} 
		} 
	};
	
	
	window.iChart = iChart_;
	if (!window.$) {
		window.$ = window.iChart;
	}
})(window);

;(function($){
/**
 * @overview This is base class of all element.All must extend this so that has ability for configuration
 * this class include some base attribute
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
	$.DefineAbstract('afterConfiguration', this);

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
		'mouseup':[],
		'touchstart':[],
		'touchmove':[],
		'touchend':[],
		'mousedown':[],
		'dblclick':[]
	};
	
	this.ignoreEvent = false;
	this.initialization = false;
	
	/**
	 * inititalize configure
	 */
	this.configure.apply(this, Array.prototype.slice.call(arguments, 1));
	
	/**
	 * clone the original config
	 */
	this.default_ = $.clone(this.options,true);
	
	/**
	 * megre customize config
	 */
	this.set(config);
	this.afterConfiguration();
}

$.Element.prototype = {
	_:function(){return this},	
	getPlugin:function(n){
		return this.constructor.plugin_[n];
	},
	set : function(c) {
		if ($.isObject(c))
			$.merge(this.options, c);
	},
	pushIf : function(name, value) {
		if (!$.isDefined(this.get(name))) {
			return this.push(name, value);
		}
		return this.get(name);
	},
	/**
	 * average write speed about 0.013ms
	 */
	push : function(name, value) {
		var A = name.split("."),L=A.length - 1,V = this.options;
		for (var i = 0; i < L; i++) {
			if (!V[A[i]])
				V[A[i]] = {};
			V = V[A[i]];
		}
		V[A[L]] = value;
		return value;
	},
	/**
	 * average read speed about 0.005ms
	 */
	get : function(name) {
		var A = name.split("."), V = this.options[A[0]];
		for (var i = 1; i < A.length; i++) {
			if (!V)
				return null;
			V = V[A[i]];
		}
		return V;
	}
}

/**
 * @overview The interface this class defined include draw and event,so the sub class has must capability to draw and aware of event. this class is a abstract class,so you should not try to initialize it.
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
			 * @cfg {Number} Specifies the default linewidth of the canvas's context in this element.(defaults to 1)
			 */
			brushsize : 1,
			/**
			 * @cfg {String} Specifies the default strokeStyle of the canvas's context in this element.(defaults to 'gray')
			 */
			strokeStyle : 'gray',
			/**
			 * @cfg {Number} Specifies the padding for this element in pixel,the same rule as css padding.(defaults to 10)
			 */
			padding : 10,
			/**
			 * @cfg {String} Specifies the font's color for this element.(defaults to 'black')
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
			 * @cfg {Boolean} True to apply the gradient.(default to false)
			 */
			gradient : false,
			/**
			 * @cfg {String} Specifies the gradient mode of background.(defaults to 'LinearGradientUpDown')
			 * @Option 'LinearGradientUpDown'
			 * @Option 'LinearGradientDownUp'
			 * @Option 'LinearGradientLeftRight'
			 * @Option 'LinearGradientRightLeft'
			 * @Option 'RadialGradientOutIn'
			 * @Option 'RadialGradientInOut'
			 */
			gradient_mode:'LinearGradientUpDown',
			/**
			 * @cfg {Number}Specifies the z-index.(default to 0)
			 */
			z_index : 0,
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
		 * @paramter $.Painter#this
		 */
		'initialize',
		/**
		 * @event Fires when this element is clicked
		 * @paramter $.Painter#this
		 * @paramter EventObject#e The click event object
		 * @paramter Object#param The additional parameter
		 */
		'click',
		/**
		 * @event Fires when the mouse move on the element
		 * @paramter $.Painter#this
		 * @paramter EventObject#e The mousemove event object
		 */
		'mousemove',
		/**
		 * @event Fires when the mouse hovers over the element
		 * @paramter $.Painter#this
		 * @paramter EventObject#e The mouseover event object
		 */
		'mouseover',
		/**
		 * @event Fires when the mouse exits the element
		 * @paramter $.Painter#this
		 * @paramter EventObject#e The mouseout event object
		 */
		'mouseout',
		/**
		 * @event Fires before the element drawing.Return false from an event handler to stop the draw.
		 * @paramter $.Painter#this
		 */
		'beforedraw',
		/**
		 * @event Fires after the element drawing when calling the draw method.
		 * @paramter $.Painter#this
		 */
		'draw');
		
		
	},
	afterConfiguration : function() {
		/**
		 * register customize event
		 */
		if ($.isObject(this.get('listeners'))) {
			for ( var e in this.get('listeners')) {
				this.on(e, this.get('listeners')[e]);
			}
		}
		this.initialize();
		
		/**
		 * fire the initialize event,this probable use to unit test
		 */
		this.fireEvent(this, 'initialize', [this]);
	},
	registerEvent : function() {
		for ( var i = 0; i < arguments.length; i++) {
			this.events[arguments[i]] = [];
		}
	},
	is3D : function() {
		return this.dimension == $._3D;
	},
	applyGradient:function(x,y,w,h){
		if(this.get('gradient')){
			this.push('f_color', this.T.gradient(x||this.x||0,y||this.y||0,w||this.get('width'),h||this.get('height'),[this.get('dark_color'), this.get('light_color')],this.get('gradient_mode')));
			this.push('light_color', this.T.gradient(x||this.x||0,y||this.y||0,w||this.get('width'),h||this.get('height'),[this.get('background_color'), this.get('light_color')],this.get('gradient_mode')));
			this.push('f_color_',this.get('f_color'));
		}
	},
	/**
	 * @method The commnd fire to draw the chart use configuration,
	 * this is a abstract method.Currently known,both <link>$.Chart</link> and <link>$.Component</link> implement this method.
	 * @return void
	 */
	draw : function(o) {
		/**
		 * fire the beforedraw event
		 */
		if (!this.fireEvent(this, 'beforedraw', [this])) {
			return this;
		}
		/**
		 * execute the commonDraw() that the subClass implement
		 */
		this.commonDraw(this,o);

		/**
		 * fire the draw event
		 */
		this.fireEvent(this, 'draw', [this]);
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
	on : function(n, fn) {
		if($.isString(n)){
			if (!this.events[n])
				console.log(n);
			this.events[n].push(fn);
		}else if($.isArray(n)){
			n.each(function(c){this.on(c, fn)},this);
		}
		return this;
	},
	doConfig : function() {
		
		var _ = this._(), p = $.parsePadding(_.get('padding')), b = _.get('border.enable'), b = b ? $.parsePadding(_.get('border.width')) : [0, 0, 0, 0], bg = _.get('background_color'), f = _.get('color_factor');
		
		_.set({
			border_top:b[0],
			border_right:b[1],
			border_bottom:b[2],
			border_left:b[3],
			hborder:b[1] + b[3],
			vborder:b[0] + b[2],
			padding_top:p[0] + b[0],
			padding_right:p[1] + b[1],
			padding_bottom:p[2] + b[2],
			padding_left:p[3] + b[3],
			hpadding:p[1] + p[3] + b[1] + b[3],
			vpadding:p[0] + p[2] + b[0] + b[2]
		});	
		
		
		if (_.get('shadow')) {
			_.push('shadow', {
				color : _.get('shadow_color'),
				blur : _.get('shadow_blur'),
				offsetx : _.get('shadow_offsetx'),
				offsety : _.get('shadow_offsety')
			});
		}
		
		_.push('fontStyle', $.getFont(_.get('fontweight'), _.get('fontsize'), _.get('font')));
		_.push('f_color', bg);
		_.push('f_color_', bg);
		_.push("light_color", $.light(bg, f));
		_.push("dark_color", $.dark(bg, f*0.8));
		_.push("light_color2", $.light(bg, f * 2));
		
		_.id = _.get('id');
		
		if(_.is3D()&&!_.get('xAngle_')){
			var P = $.vectorP2P(_.get('xAngle'),_.get('yAngle'));
			_.push('xAngle_',P.x);
			_.push('yAngle_',P.y);
		}
	}
});// @end


/**
 * 
 * @overview this component use for 画图的基类、其他组件要继承此组件
 * @component#$.Html
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
			  * @inner Specifies the width of this element in pixels.
			  */
			 width:0,
			 /**
			  * @inner Specifies the height of this element in pixels.
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
				 * @inner {Boolean} Specifies the config of Tip.For details see <link>$.Tip</link>
				 * Note:this has a extra property named 'enable',indicate whether tip available(default to false)
				 */
				tip : {
					enable : false,
					border : {
						width : 2
					}
				}
			});
			
			/**
			 * If this element can split or contain others.(default to false)
			 */
			this.atomic = false;
			/**
			 * If method draw be proxy.(default to false)
			 */
			this.proxy = false;
			this.inject(c);
			
			this.final_parameter = {};
			
			
	},
	initialize : function() {
		if (!this.ignoreEvent)
			$.DefineAbstract('isEventValid', this);
		
		$.DefineAbstract('doDraw', this);
	
		this.doConfig();
		this.initialization = true;
	},
	/**
	 * @method return the component's dimension,return hold following property
	 * @property x:the left-top coordinate-x
	 * @property y:the left-top coordinate-y
	 * @property width:the width of component,note:available there applies box model
	 * @property height:the height of component,note:available there applies box model
	 * @return object
	 */
	getDimension:function(){
		return {
			x:this.x,
			x:this.y,
			width:this.get("width"),
			height:this.get("height")
		}
	},
	doConfig : function() {
		$.Component.superclass.doConfig.call(this);
		var _ = this._();
		
		
		_.x = _.push('originx',_.get('originx')+_.get('offsetx'));
		_.y = _.push('originy',_.get('originy')+_.get('offsety'));
		
		/**
		 * if have evaluate it
		 */
		_.data = _.get('data');
		
		if (_.get('tip.enable')) {
			/**
			 * make tip's border in accord with sector
			 */
			_.pushIf('tip.border.color', _.get('f_color'));
	
			if (!$.isFunction(_.get('tip.invokeOffset')))
				/**
				 * indicate the tip must calculate position
				 */
				_.push('tip.invokeOffset', _.tipInvoke());
		}
	
	},
	isMouseOver : function(e) {
		return this.isEventValid(e);
	},
	redraw : function() {
		
		this.container.draw();
	},
	commonDraw : function(opts) {
		/**
		 * execute the doDraw() that the subClass implement
		 */
		if(!this.proxy)
		this.doDraw.call(this, opts);
	
	},
	inject : function(c) {
		if (c) {
			this.container = c;
			this.target = this.T = c.T;
		}
	}
	});
 	/**
	 * @overview this component use for abc
	 * @component#$.Tip
	 * @extend#$.Element
	 */
	$.Tip = $.extend($.Html,{
		configure:function(){
			
			/**
			 * invoked the super class's configuration
			 */
			$.Tip.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the legend's type
			 */
			this.type = 'tip';
			
			this.set({
				/**
				 * @cfg {String} Specifies the text want to disply.(default to '')
				 */
				 text:'',
				 /**
				 * @cfg {String} Specifies the tip's type.(default to 'follow') Available value are:
				 * @Option follow
				 * @Option fixed
				 */
				 showType:'follow',
				 /**
				  * @cfg {Function} Specifies Function to calculate the position.(default to null)
				  */
				 invokeOffset:null,
				 /**
				 * @cfg {Number} Specifies the duration when fadeIn/fadeOut in millisecond.(default to 300)
				 */
				 fade_duration:300,
				 /**
				 * @cfg {Number} Specifies the duration when move in millisecond.(default to 100)
				 */
				 move_duration:100,
				 /**
				 * @cfg {Boolean} if calculate the position every time (default to false)
				 */
				 invokeOffsetDynamic:false,
				 /**
				 * @cfg {String} Specifies the css of this Dom.
				 */
				 style:'textAlign:left;padding:4px 5px;cursor:pointer;backgroundColor:rgba(239,239,239,.85);fontSize:12px;color:black;',
				 /**
				 * @cfg {Object} Override the default as enable = true,radius = 5
				 */
				 border:{
					enable:true,
					radius : 5
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
					style.top = (e.y-this.height()*1.1-2)+"px";
					style.left = (e.x+2)+"px";
				}else if($.isFunction(this.get('invokeOffset'))){
					var o = this.get('invokeOffset')(this.width(),this.height(),m);
					style.top =  o.top+"px";
					style.left = o.left+"px";
				}else{
					style.top = (e.y-this.height()*1.1-2)+"px";
					style.left = (e.x+2)+"px";
				}
			}
		},
		text:function(text){
			this.dom.innerHTML = text;
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
			
			var _ = this._();
			
			_.css('position','absolute');
			_.dom.innerHTML = _.get('text');
			
			_.hidden();
			
			if(_.get('animation')){
				var m =  _.get('move_duration')/1000+'s ease-in 0s';
				_.transition('opacity '+_.get('fade_duration')/1000+'s ease-in 0s');
				_.transition('top '+m);
				_.transition('left '+m);
				_.onTransitionEnd(function(e){
					if(_.css('opacity')==0){
						_.css('visibility','hidden');
					}
				},false);
			}
			
			_.wrap.appendChild(_.dom);
			
			_.T.on('mouseover',function(c,e,m){
				_.show(e,m);	
			}).on('mouseout',function(c,e,m){
				_.hidden(e);	
			});
			
			if(_.get('showType')=='follow'){
				_.T.on('mousemove',function(c,e,m){
					if(_.T.variable.event.mouseover){
						setTimeout(function(){
							if(_.T.variable.event.mouseover)
								_.follow(e,m);
						},_.get('delay'));
					}
				});
			}
			
		}
});// @end


	/**
	 * @overview this element simulate the crosshair on the coordinate.actually this composed of some div of html. 
	 * @component#$.CrossHair
	 * @extend#$.Html
	 */
	$.CrossHair = $.extend($.Html,{
		configure:function(){
		
			/**
			 * invoked the super class's configuration
			 */
			$.CrossHair.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'crosshair';
			
			this.set({
				yAngle_ : undefined,
				/**
				 * @inner {Number} Specifies the position top,normally this will given by chart.(default to 0)
				 */
				 top:0,
				 /**
				 * @inner {Number} Specifies the position left,normally this will given by chart.(default to 0)
				 */
				 left:0,
				 /**
				 * @inner {Boolean} private use
				 */
				 hcross:true,
				  /**
				 * @inner {Boolean} private use
				 */
				 vcross:true,
				 /**
				 * @inner {Function} private use
				 */
				 invokeOffset:null,
				 /**
				 * @cfg {Number} Specifies the linewidth of the crosshair.(default to 1)
				 */
				 line_width:1,
				 /**
				 * @cfg {Number} Specifies the linewidth of the crosshair.(default to 1)
				 */
				 line_color:'#1A1A1A',
				 delay:200
			});
		},
		/**
		 * this function will implement at every target object,and this just default effect
		 */
		follow:function(e,m){
			if(this.get('invokeOffset')){
				var o = this.get('invokeOffset')(e,m);
				if(o&&o.hit){
					this.horizontal.style.top = (o.top-this.top)+"px";
					this.vertical.style.left = (o.left-this.left)+"px";
				}
			}else{
				/**
				 * set the 1px offset will make the line at the top left all the time
				 */
				this.horizontal.style.top = (e.y-this.top-1)+"px";
				this.vertical.style.left = (e.x-this.left-1)+"px";
			}
		},
		beforeshow:function(e,m){
			this.follow(e,m);
		},
		initialize:function(){
			$.CrossHair.superclass.initialize.call(this);
			
			var _ = this._();
			
			_.top = $.fixPixel(_.get('top'));
			_.left = $.fixPixel(_.get('left'));
			
			_.dom = document.createElement("div");
			
			_.dom.style.zIndex=_.get('index');
			_.dom.style.position="absolute";
			/**
			 * set size zero make integration with vertical and horizontal
			 */
			_.dom.style.width= $.toPixel(0);
			_.dom.style.height=$.toPixel(0);
			_.dom.style.top=$.toPixel(_.get('top'));
			_.dom.style.left=$.toPixel(_.get('left'));
			_.css('visibility','hidden');
			
			_.horizontal = document.createElement("div");
			_.vertical = document.createElement("div");
			
			_.horizontal.style.width= $.toPixel(_.get('width'));
			_.horizontal.style.height= $.toPixel(_.get('line_width'));
			_.horizontal.style.backgroundColor = _.get('line_color');
			_.horizontal.style.position="absolute";
			
			_.vertical.style.width= $.toPixel(_.get('line_width'));
			_.vertical.style.height = $.toPixel(_.get('height'));
			_.vertical.style.backgroundColor = _.get('line_color');
			_.vertical.style.position="absolute";
			_.dom.appendChild(_.horizontal);
			_.dom.appendChild(_.vertical);
			
			if(_.get('shadow')){
				_.dom.style.boxShadow = _.get('shadowStyle');
			}
			
			_.wrap.appendChild(_.dom);
			
			_.T.on('mouseover',function(c,e,m){
				_.show(e,m);	
			}).on('mouseout',function(c,e,m){
				_.hidden(e,m);	
			}).on('mousemove',function(c,e,m){
				_.follow(e,m);
			});
			
		}
});// @end

/**
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
			/**
			 * @cfg {Array} Required,The datasource of Legend.Normally,this will given by chart.(default to undefined)
			 */
			data : undefined,
			/**
			 * @cfg {Number} Specifies the width.Note if set to 'auto' will be fit the actual width.(default to 'auto')
			 */
			width : 'auto',
			/**
			 * @cfg {Number/String} Specifies the number of column.(default to 1) Note:If set to 'max',the list will be lie on the property row
			 */
			column : 1,
			/**
			 * @cfg {Number/String} Specifies the number of column.(default to 'max') Note:If set to 'max',the list will be lie on the property column
			 */
			row : 'max',
			/**
			 * @cfg {Number} Specifies the limited width.Normally,this will given by chart.(default to 0)
			 */
			maxwidth : 0,
			/**
			 * @cfg {Number} Specifies the lineheight when text display multiline.(default to 16)
			 */
			line_height : 16,
			/**
			 * @cfg {String} Specifies the shape of legend' sign (default to 'square') Available value are：
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
			 * @cfg {Number} the distance of legend' sign and text (default to 5)
			 */
			sign_space : 5,
			/**
			 * @cfg {Number} Specifies the space between the sign and text.(default to 5)
			 */
			legend_space : 5,
			
			z_index : 1009,
			/**
			 * @cfg {Boolean} If true the text's color will accord with sign's.(default to false)
			 */
			text_with_sign_color : false,
			/**
			 * @cfg {String} Specifies the horizontal position of the legend in chart.(defaults to 'right').Available value are:
			 * @Option 'left'
			 * @Option 'center' Only applies when valign = 'top|bottom'
			 * @Option 'right'
			 */
			align : 'right',

			/**
			 * @cfg {String} this property specifies the vertical position of the legend in an module (defaults to 'middle'). Available value are:
			 * @Option 'top'
			 * @Option 'middle' Only applies when align = 'left|right'
			 * @Option 'bottom'
			 */
			valign : 'middle'
		});

		/**
		 * this element support boxMode
		 */
		this.atomic = true;

		this.registerEvent(
		/**
		 * @event Fires when parse this element'data.Return text value will override existing.
		 * @paramter $.Chart#this
		 * @paramter string#text the text will display
		 * @paramter int#i the index of data
		 * @return string
		 */
		'parse',
		/**
		 * @event Fires after raw was drawed
		 * @paramter $.Chart#this
		 * @paramter int#i the index of legend
		 */
		'drawRaw',
		/**
		 * @event Fires after a cell was drawed
		 * @paramter $.Chart#this
		 */
		'drawCell');

	},
	drawCell : function(x, y, text, color,n) {
		var s = this.get('sign_size'),f = this.getPlugin('sign');
		if(!f||!f.call(this,this.T,n,x + s / 2,y + s / 2,s,color)){
			if (n == 'round') {
				this.T.round(x + s / 2, y + s / 2, s / 2, color);
			} else if (n == 'round-bar') {
				this.T.box(x, y + s * 5 / 12, s, s / 6, 0, color);
				this.T.round(x + s / 2, y + s / 2, s / 4, color);
			} else if (n == 'square-bar') {
				this.T.box(x, y + s * 5 / 12, s, s / 6, 0, color);
				this.T.box(x + s / 4, y + s / 4, s / 2, s / 2, 0, color);
			} else {
				this.T.box(x, y, s, s, 0, color);
			}
		}
		
		var textcolor = this.get('color');

		if (this.get('text_with_sign_color')) {
			textcolor = color;
		}
		this.T.fillText(text, x + this.get('signwidth'), y + s / 2, this.get('textwidth'), textcolor);

	},
	drawRow : function(suffix, x, y) {
		var d;
		for ( var j = 0; j < this.get('column'); j++) {
			d = this.data[suffix];
			if (suffix < this.data.length) {
				this.fireEvent(this, 'drawCell', [this,d]);
				this.drawCell(x, y, d.text, d.color,d.sign || this.get('sign'));
				d.x = x;
				d.y = y;
			}
			x += this.columnwidth[j] + this.get('signwidth') + this.get('legend_space');
			suffix++;
		}
	},
	isEventValid : function(e) {
		var r = {
			valid : false
		},_ = this._();
		if (e.x > this.x && e.x < (_.x + _.width) && e.y > _.y && e.y < (_.y + _.height)) {
			_.data.each(function(d, i) {
				if (e.x > d.x && e.x < (d.x + d.width + _.get('signwidth')) && e.y > d.y && e.y < (d.y + _.get('line_height'))) {
					r = {
						valid : true,
						index : i,
						target : d
					}
				}
			}, _);
		}
		return r;
	},
	doDraw : function() {
		this.push('border.radius',5);
		this.T.box(this.x, this.y, this.width, this.height, this.get('border'), this.get('f_color'), false, this.get('shadow'));

		this.T.textStyle('left', 'middle', $.getFont(this.get('fontweight'), this.get('fontsize'), this.get('font')));

		var x = this.x + this.get('padding_left'), y = this.y + this.get('padding_top'), text, c = this.get('column'), r = this.get('row');

		for ( var i = 0; i < r; i++) {
			this.drawRow(i * c, x, y);
			y += this.get('line_height');
			this.fireEvent(this, 'drawRaw', [this, i * c]);
		}
	},
	doConfig : function() {
		$.Legend.superclass.doConfig.call(this);
		
		var _ = this._(),ss = _.get('sign_size'), g = _.container;

		_.T.textFont(_.get('fontStyle'));

		_.push('signwidth', (ss + _.get('sign_space')));

		if (_.get('line_height') < ss) {
			_.push('line_height', ss + ss / 5);
		}

		/**
		 * if the position is incompatible,rectify it.
		 */
		if (_.get('align') == 'center' && _.get('valign') == 'middle') {
			_.push('valign', 'top');
		}

		/**
		 * if this position incompatible with container,rectify it.
		 */
		if (g.get('align') == 'left') {
			if (_.get('valign') == 'middle') {
				_.push('align', 'right');
			}
		}

		var suffix = 0, maxwidth = w = _.get('width'), width = 0, wauto = (w == 'auto'), c = $.isNumber(_.get('column')), r = $.isNumber(_.get('row')), L = _.data.length, d, h;
		
		if (!c && !r)
			c = 1;
		
		if (c && !r)
			_.push('row', Math.ceil(L / _.get('column')));
		if (!c && r)
			_.push('column', Math.ceil(L / _.get('row')));

		c = _.get('column');
		r = _.get('row');

		if (L > r * c) {
			r += Math.ceil((L - r * c) / c);
			_.push('row', r);
		}

		_.columnwidth = new Array(c);

		if (wauto) {
			maxwidth = 0;
		}

		/**
		 * calculate the width each item will used
		 */
		_.data.each(function(d, i) {
			$.merge(d, _.fireEvent(_, 'parse', [_, d.name, i]));
			d.text = d.text || d.name;
			d.width = _.T.measureText(d.text);
		}, _);

		/**
		 * calculate the each column's width it will used
		 */
		for ( var i = 0; i < c; i++) {
			width = 0;
			suffix = i;
			while (suffix < L) {
				width = Math.max(width, _.data[suffix].width);
				suffix += c;
			}
			_.columnwidth[i] = width;
			maxwidth += width;
		}

		if (wauto) {
			w = _.push('width', maxwidth + _.get('hpadding') + _.get('signwidth') * c + (c - 1) * _.get('legend_space'));
		}

		if (w > _.get('maxwidth')) {
			w = _.push('width', _.get('maxwidth'));
		}

		_.push('textwidth', w - _.get('hpadding') - _.get('signwidth'));

		_.width = w;
		_.height = h = _.push('height', r * _.get('line_height') + _.get('vpadding'));

		if (_.get('valign') == 'top') {
			_.y = g.get('t_originy');
		} else if (_.get('valign') == 'bottom') {
			_.y = g.get('b_originy') - h;
		} else {
			_.y = g.get('centery') - h / 2;
		}

		if (_.get('align') == 'left') {
			_.x = g.get('l_originx');
		} else if (_.get('align') == 'center') {
			_.x = g.get('centerx') - _.get('textwidth') / 2;
		} else {
			_.x = g.get('r_originx') - w;
		}

		_.x = _.push('originx', _.x + _.get('offsetx'));
		_.y = _.push('originy', _.y + _.get('offsety'));

	}
});/** @end */

/**
 * @overview this component use for abc
 * @component#$.Label
 * @extend#$.Component
 */
$.Label = $.extend($.Component, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Label.superclass.configure.apply(this, arguments);

		/**
		 * indicate the legend's type
		 */
		this.type = 'legend';

		this.set({
			/**
			 * @cfg {String} Specifies the text of this label,Normally,this will given by chart.(default to '').
			 */
			text : '',
			/**
			 * @cfg {Number} Specifies the lineheight when text display multiline.(default to 12).
			 */
			line_height : 12,
			/**
			 * @cfg {Number} Specifies the thickness of line in pixel.(default to 1).
			 */
			line_thickness:1,
			/**
			 * @cfg {String} Specifies the shape of legend' sign (default to 'square').Available value are：
			 * @Option 'round'
			 * @Option 'square'
			 */
			sign : 'square',
			/**
			 * @cfg {Number} Specifies the size of legend' sign in pixel.(default to 12)
			 */
			sign_size : 12,
			/**
			 * @cfg {Number} Override the default as 2 in pixel.
			 */
			padding : '2 5',
			/**
			 * @cfg {Number} Override the default as 2 in pixel.
			 */
			offsety : 2,
			/**
			 * @cfg {Number} Specifies the space between the sign and text.(default to 5)
			 */
			sign_space : 5,
			/**
			 * @cfg {Number} Override the default as '#efefef'.
			 */
			background_color : '#efefef',
			/**
			 * @cfg {Boolean} If true the text's color will accord with sign's.(default to false)
			 */
			text_with_sign_color : false
		});

		/**
		 * this element support boxMode
		 */
		this.atomic = true;

		this.registerEvent();

	},
	isEventValid : function(e) {
		return {
			valid : $.inRange(this.labelx,this.labelx + this.get('width'), e.x) && $.inRange(this.labely, this.labely + this.get('height'), e.y)
		};
	},
	text : function(text) {
		if (text)
			this.push('text', text);
		this.push('width',this.T.measureText(this.get('text')) + this.get('hpadding') + this.get('sign_size') + this.get('sign_space'));
	},
	localizer:function(){
		var Q =  this.get('quadrantd');
		this.labelx = (Q>=1&&Q<=2)?(this.get('labelx') - this.get('width')):this.get('labelx');
        this.labely = Q>=2?(this.get('labely') - this.get('height')):this.get('labely');
	},
	doDraw : function() {
		var _ = this._();
		
		_.localizer();
		
		var p = _.get('line_potins'),ss = _.get('sign_size'),
		x = _.labelx + _.get('padding_left'),
		y = _.labely +_.get('padding_top');
		
		_.T.lines(p,_.get('line_thickness'), _.get('border.color'),_.get('line_globalComposite'));
		
		_.T.box(_.labelx, _.labely, _.get('width'), _.get('height'), _.get('border'), _.get('f_color'), false, _.get('shadow'), _.get('shadow_color'), _.get('shadow_blur'), _.get('shadow_offsetx'), _.get('shadow_offsety'));
		
		_.T.textStyle('left', 'top', _.get('fontStyle'));
		
		var textcolor = _.get('color');
		if (_.get('text_with_sign_color')) {
			textcolor = _.get('scolor');
		}
		if (_.get('sign') == 'square') {
			_.T.box(x, y, ss, ss,0,_.get('scolor'));
		} else {
			_.T.round(x + ss / 2, y + ss / 2, ss / 2, _.get('scolor'));
		}
		_.T.fillText(_.get('text'), x + ss + _.get('sign_space'), y, _.get('textwidth'), textcolor);
	},
	doConfig : function() {
		$.Label.superclass.doConfig.call(this);
		var _ = this._();
		_.T.textFont($.getFont(_.get('fontweight'), _.get('fontsize'), _.get('font')));
		
		if(_.get('fontsize')>_.get('line_height')){
			_.push('line_height',_.get('fontsize'));
		}
		
		_.push('height',_.get('line_height') + _.get('vpadding'));
		
		_.text();
		
		_.localizer();
		

	}
});// @end

	/**
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
				/**
				 * @cfg {String} Specifies the text want to disply.(default to '')
				 */
				text:'',
				/**
				 * @cfg {String} there has two layers of meaning,when width is 0,Specifies the textAlign of html5.else this is the alignment of box.(default to 'center')
				 * when width is 0,Available value are:
				 * @Option start
				 * @Option end
				 * @Option left
				 * @Option right
				 * @Option center
				 * when width is not 0,Available value are:
				 * @Option left
				 * @Option right
				 * @Option center
				 */
				textAlign:'center',
				background_color : 0,
				/**
				 * @cfg {String} Specifies the textBaseline of html5.(default to 'top')
				 * Available value are:
				 * @Option top
				 * @Option hanging
				 * @Option middle
				 * @Option alphabetic
				 * @Option ideographic
				 * @Option bottom
				 */
				textBaseline:'top',
				/**
				 * @cfg {Object} Here,specify as false by default
				 */
				border : {
					enable : false
				},
				/**
				 * @cfg {Number} Specifies the maxwidth of text in pixels,if given 0 will not be limited.(default to 0)
				 */
				width:0,
				/**
				 * @cfg {Number} Specifies the maxheight of text in pixels,if given 0 will not be limited(default to 0)
				 */
				height:0,
				/**
				 * @cfg {String} Specifies the writing-mode of text.(default to 'lr') .
				 * Available value are:
				 * @Option 'lr'
				 */
				writingmode : 'lr',
				/**
				 * @cfg {Number} Specifies the lineheight when text display multiline.(default to 16).
				 */
				line_height : 16
			});
			
			this.registerEvent();
			
			/**
			 * indicate this component not need support event
			 */
			this.ignoreEvent = true;
		},
		doDraw:function(opts){
			if(this.get('box_feature'))
			this.T.box(this.x,this.y,this.get('width'),this.get('height'),this.get('border'),this.get('f_color'));
			if(this.get('text')!='')
			this.T.text(this.get('text'),this.get('textx'),this.get('texty'),this.get('width'),this.get('color'),this.get('textAlign'),this.get('textBaseline'),this.get('fontStyle'),0,0,this.get('shadow'));
		},
		doConfig:function(){
			$.Text.superclass.doConfig.call(this);
			var _ = this._(),x = _.x,y=_.y,w=_.get('width'),h=_.get('height'),a=_.get('textAlign');
			x+=(a=='center'?w/2:(a=='right'?w:0));
			if(h){
				y+=h/2;
				_.push('textBaseline','middle');
			}
			_.push('textx',x);
			_.push('texty',y);
			_.push('box_feature',w&&h);
			
			_.applyGradient();
			
		}
});
;
(function($) {

	var inc = Math.PI / 90, PI = Math.PI, ceil = Math.ceil, floor = Math.floor, PI2 = 2 * Math.PI, max = Math.max, min = Math.min, sin = Math.sin, cos = Math.cos, fd = function(w, c) {
		return w == 1 ? (floor(c) + 0.5) : Math.round(c);
	}, getCurvePoint = function(seg, point, i, smo) {
		var x = point.x, y = point.y, lp = seg[i - 1], np = seg[i + 1], lcx, lcy, rcx, rcy;
		if (i < seg.length - 1) {
			var lastY = lp.y, nextY = np.y, c;
			lcx = (smo * x + lp.x) / (smo + 1);
			lcy = (smo * y + lastY) / (smo + 1);
			rcx = (smo * x + np.x) / (smo + 1);
			rcy = (smo * y + nextY) / (smo + 1);

			c = ((rcy - lcy) * (rcx - x)) / (rcx - lcx) + y - rcy;
			lcy += c;
			rcy += c;

			if (lcy > lastY && lcy > y) {
				lcy = max(lastY, y);
				rcy = 2 * y - lcy;
			} else if (lcy < lastY && lcy < y) {
				lcy = min(lastY, y);
				rcy = 2 * y - lcy;
			}
			if (rcy > nextY && rcy > y) {
				rcy = max(nextY, y);
				lcy = 2 * y - rcy;
			} else if (rcy < nextY && rcy < y) {
				rcy = min(nextY, y);
				lcy = 2 * y - rcy;
			}
			point.rcx = rcx;
			point.rcy = rcy;
		}
		return [lp.rcx || lp.x, lp.rcy || lp.y, lcx || x, lcy || y, x, y];
	},
	pF = function(n){
		return $.isNumber(n)?n:$.parseFloat(n,n);
	},
	simple = function(c) {
		var M=0,V=0,MI,ML=0,n='minValue',x='maxValue';
		this.total = 0;
		c.each(function(d,i){
			V  = d.value;
			if($.isArray(V)){
				var T = 0;
				ML = V.length>ML?V.length:ML;
				for(var j=0;j<V.length;j++){
					V[j] = pF(V[j]);
					T+=V[j];
					if(!MI)
					MI = V;
					M = V[j]>M?V[j]:M;
					MI = V[j]<MI?V[j]:MI;
				}
				d.total = T;
			}else{
				V = pF(V);
				d.value = V;
				this.total+=V;
				M = V>M?V:M;
				if(!MI)
					MI = V;
				MI = V<MI?V:MI;
			}
		},this);
		
		if(this.get(n)){
			MI = this.get(n)<MI?this.get(n):MI;
		}
		
		if(this.get(x)){
			M = this.get(x)<M?this.get(x):M;
		}
		
		if($.isArray(this.get('data_labels'))){
			ML = this.get('data_labels').length>ML?this.get('data_labels').length:ML;
		}
		
		this.push('maxItemSize',ML);
		this.push(n,MI);
		this.push(x,M);
		
	},
	complex = function(c){
		this.data_labels = this.get('data_labels');
		var M=0,MI=0,V,d,L=this.data_labels.length;
		this.columns = [];this.total = 0;
		for(var i=0;i<L;i++){
			var item = [];
			for(var j=0;j<c.length;j++){
				d = c[j];
				V = d.value[i];
				V =  pF(V,V);
				d.value[i] = V;
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
				name:this.data_labels[i],
				item:item
			});
		}
		this.push('minValue',MI); 
		this.push('maxValue',M);
	};
	
	/**
	 * @private support an improved API for drawing in canvas
	 */
	function Cans(c) {
		if (typeof c === "string")
			c = $(c);
		if (!c || !c['tagName'] || c['tagName'].toLowerCase() != 'canvas')
			throw new Error("there not a canvas element");

		this.canvas = c;
		this.c = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}

	Cans.prototype = {
		getContext:function(){
			return this.c;
		},		
		css : function(a, s) {
			if ($.isDefined(s))
				this.canvas.style[a] = s;
			else
				return this.canvas.style[a];
		},
		/**
		 * draw ellipse API
		 */
		ellipse : function(x, y, a, b, s, e, c, bo, bow, boc, sw, ccw, a2r, last) {
			var angle = s, ccw = !!ccw, a2r = !!a2r;
			this.save().gCo(last).strokeStyle(bo,bow, boc).shadowOn(sw).fillStyle(c).moveTo(x, y).beginPath();
			
			if (a2r)
				this.moveTo(x, y);
			
			while (angle <= e) {
				this.lineTo(x + a * cos(angle), y + (ccw ? (-b * sin(angle)) : (b * sin(angle))));
				angle += inc;
			}
			return this.lineTo(x + a * cos(e), y + (ccw ? (-b * sin(e)) : (b * sin(e)))).closePath().stroke(bo).fill(c).restore();
		},
		/**
		 * arc
		 */
		arc : function(x, y, r, dw, s, e, c, b, bw, bc, sw, ccw, a2r, last) {
			var ccw = !!ccw, a2r = !!a2r&&!dw;
			this.save().gCo(last).strokeStyle(b,bw,bc).shadowOn(sw).fillStyle(c).beginPath();
			
			if(dw){
				this.moveTo(x+cos(s)*(r-dw),y+sin(s)*(r-dw)).lineTo(x+cos(s)*r,y+sin(s)*r);
				this.c.arc(x, y, r, s, e,ccw);
				this.lineTo(x+cos(e)*(r-dw),y+sin(e)*(r-dw));
				this.c.arc(x, y, r-dw, e, s,!ccw);
			}else{
				this.c.arc(x, y, r, s, e, ccw);
			}
			
			if (a2r)
				this.lineTo(x, y);
			return this.closePath().fill(c).stroke(b).restore();
		},
		/**
		 * draw sector
		 */
		sector : function(x, y, r, dw,s, e, c, b, bw, bc, sw, ccw) {
			if (sw)
				this.arc(x, y, r, dw, s, e, c,0,0,0,sw,ccw, true, true);
			return this.arc(x, y, r, dw, s, e, c, b, bw, bc, false, ccw, true);
		},
		sector3D : function() {
			var x0, y0, sPaint = function(x, y, a, b, s, e, ccw, h, c) {
				var q1 = $.quadrantd(s),q2 = $.quadrantd(e);
				if((q1==2||q1==3)&&(q2==2||q2==3))return;
				
				var Lo = function(A, h) {
					this.lineTo(x + a * cos(A), y + (h || 0) + (ccw ? (-b * sin(A)) : (b * sin(A))));
				};
				
				s = ccw && e > PI && s < PI ? PI : s;
				e = !ccw && s < PI && e > PI ? PI : e;
				
				var angle = s;
				this.fillStyle($.dark(c)).moveTo(x + a * cos(s), y + (ccw ? (-b * sin(s)) : (b * sin(s)))).beginPath();
				while (angle <= e) {
					Lo.call(this, angle);
					angle = angle + inc;
				}
				Lo.call(this, e);
				this.lineTo(x + a * cos(e), (y + h) + (ccw ? (-b * sin(e)) : (b * sin(e))));
				angle = e;
				while (angle >= s) {
					Lo.call(this, angle, h);
					angle = angle - inc;
				}
				Lo.call(this, s, h);
				this.lineTo(x + a * cos(s), y + (ccw ? (-b * sin(s)) : (b * sin(s)))).closePath().fill(true);
			}, layerDraw = function(x, y, a, b, ccw, h, A, c) {
				var x0 = x + a * cos(A);
				var y0 = y + h + (ccw ? (-b * sin(A)) : (b * sin(A)));
				this.moveTo(x, y).beginPath().fillStyle(c).lineTo(x, y + h).lineTo(x0, y0).lineTo(x0, y0 - h).lineTo(x, y).closePath().fill(true);
			}, layerPaint = function(x, y, a, b, s, e, ccw, h, c) {
				var ds = ccw ? (s < PI / 2 || s > 1.5 * PI) : (s > PI / 2 && s < 1.5 * PI), de = ccw ? (e > PI / 2 && e < 1.5 * PI) : (e < PI / 2 || e > 1.5 * PI);
				if (!ds && !de)
					return false;
				c = $.dark(c);
				if (ds)
					layerDraw.call(this, x, y, a, b, ccw, h, s, c);
				if (de)
					layerDraw.call(this, x, y, a, b, ccw, h, e, c);
			};
			var s3 = function(x, y, a, b, s, e, h, c, bo, bow, boc, sw, ccw, isw) {
				/**
				 * paint bottom layer
				 */
				this.ellipse(x, y + h, a, b, s, e, c, bo, bow, boc, sw, ccw, true);
				/**
				 * paint inside layer
				 */
				layerPaint.call(this, x, y, a, b, s, e, ccw, h, c);

				/**
				 * paint top layer
				 */
				this.ellipse(x, y, a, b, s, e, c, bo, bow, boc, false, ccw, true);
				/**
				 * paint outside layer
				 */
				sPaint.call(this, x, y, a, b, s, e, ccw, h, c);
				return this;
			}
			s3.layerPaint = layerPaint;
			s3.sPaint = sPaint;
			s3.layerDraw = layerDraw;
			return s3;
		}(),
		textStyle : function(a, l, f) {
			return this.textAlign(a).textBaseline(l).textFont(f);
		},
		strokeStyle : function(b,w, c, j) {
			if(b){
				if (w)
					this.c.lineWidth = w;
				if (c)
					this.c.strokeStyle = c;
				if (j)
					this.c.lineJoin = j;
			}
			return this;
		},
		globalAlpha : function(v) {
			if (v)
				this.c.globalAlpha = v;
			return this;
		},
		fillStyle : function(c) {
			if (c)
				this.c.fillStyle = c;
			return this;
		},
		arc2 : function(x1, y1, x2, y2, radius) {
			this.c.arcTo(x1, y1, x2, y2, radius);
			return this;
		},
		textAlign : function(a) {
			if (a)
				this.c.textAlign = a;
			return this;
		},
		textBaseline : function(l) {
			if (l)
				this.c.textBaseline = l;
			return this;
		},
		textFont : function(font) {
			if (font)
				this.c.font = font;
			return this;
		},
		shadowOn : function(s) {
			if (s) {
				this.c.shadowColor = s.color;
				this.c.shadowBlur = s.blur;
				this.c.shadowOffsetX = s.offsetx;
				this.c.shadowOffsetY = s.offsety;
			}
			return this;
		},
		shadowOff : function() {
			this.c.shadowColor = 'white';
			this.c.shadowBlur = this.c.shadowOffsetX = this.c.shadowOffsetY = 0;
			return this;
		},
		gradient : function(x, y, w, h, c,m) {
			m = m.toLowerCase();
			var x0=x,y0=y,f=!m.indexOf("linear");
			m = m.substring(14);
			if(f){
				switch(m)
			   　　{
			　　   case 'updown':
			 　　    y0+=h;
			 　　    break;
			　　   case 'downup':
			　　    y+=h;
			　　     break;
			   	 case 'leftright':
			 　　    x0+=w;
			 　　    break;
			　　   case 'rightleft':
				  x+=w;
			　　     break;
			　　   default:
			　　     return c[0];
			　　   }
				return this.avgLinearGradient(x,y,x0,y0,c);
			}else{
				x+=w/2;
				y+=h/2;
				if(m=='outin'){
					c.reverse();
				}
				return this.avgRadialGradient(x,y,0,x,y,(w>h?h:w)*0.8,c);
			}
		},
		avgLinearGradient : function(xs, ys, xe, ye, c) {
			var g = this.createLinearGradient(xs, ys, xe, ye);
			for ( var i = 0; i < c.length; i++)
				g.addColorStop(i / (c.length - 1), c[i]);
			return g;
		},
		createLinearGradient : function(xs, ys, xe, ye) {
			return this.c.createLinearGradient(xs, ys, xe, ye);
		},
		avgRadialGradient : function(xs, ys, rs, xe, ye, re, c) {
			var g = this.createRadialGradient(xs, ys, rs, xe, ye, re);
			for ( var i = 0; i < c.length; i++)
				g.addColorStop(i / (c.length - 1), c[i]);
			return g;
		},
		createRadialGradient : function(xs, ys, rs, xe, ye, re) {
			return this.c.createRadialGradient(xs, ys, rs, xe, ye, re);
		},
		text : function(t, x, y, max, color, align, line, font, mode, h,sw) {
			return this.save().textStyle(align, line, font).fillText(t, x, y, max, color, mode, h,sw).restore();
		},
		fillText : function(t, x, y, max, color, mode, h,sw) {
			t = t + "";
			max = max || false;
			mode = mode || 'lr';
			h = h || 16;
			this.save().fillStyle(color).shadowOn(sw);
			var T = t.split(mode == 'tb' ? "" : "\n");
			T.each(function(t) {
				try {
					if (max)
						this.c.fillText(t, x, y, max);
					else
						this.c.fillText(t, x, y);
					y += h;
				} catch (e) {
					console.log(e.message + '[' + t + ',' + x + ',' + y + ']');
				}
			}, this);
			
			return this.restore();
		},
		measureText : function(text) {
			return this.c.measureText(text).width;
		},
		moveTo : function(x, y) {
			x = x || 0;
			y = y || 0;
			this.c.moveTo(x, y);
			return this;
		},
		lineTo : function(x, y) {
			x = x || 0;
			y = y || 0;
			this.c.lineTo(x, y);
			return this;
		},
		save : function() {
			this.c.save();
			return this;
		},
		restore : function() {
			this.c.restore();
			return this;
		},
		beginPath : function() {
			this.c.beginPath();
			return this;
		},
		closePath : function() {
			this.c.closePath();
			return this;
		},
		stroke : function(s) {
			if(s)
			this.c.stroke();
			return this;
		},
		fill : function(f) {
			if(f)
			this.c.fill();
			return this;
		},
		/**
		 * can use cube3D instead of this?
		 */
		cube : function(x, y, xv, yv, width, height, zdeep, bg, b, bw, bc, sw) {
			x = fd(bw, x);
			y = fd(bw, y);
			zdeep = (zdeep && zdeep > 0) ? zdeep : width;
			var x1 = x + zdeep * xv, y1 = y - zdeep * yv;
			x1 = fd(bw, x1);
			y1 = fd(bw, y1);
			/**
			 * styles -> top-front-right
			 */
			if (sw) {
				this.polygon(bg, b, bw, bc, sw, false, [x, y, x1, y1, x1 + width, y1, x + width, y]);
				this.polygon(bg, b, bw, bc, sw, false, [x, y, x, y + height, x + width, y + height, x + width, y]);
				this.polygon(bg, b, bw, bc, sw, false, [x + width, y, x1 + width, y1, x1 + width, y1 + height, x + width, y + height]);
			}
			/**
			 * clear the shadow on the body
			 */
			this.polygon($.dark(bg), b, bw, bc, false, false, [x, y, x1, y1, x1 + width, y1, x + width, y]);
			this.polygon(bg, b, bw, bc, false, false, [x, y, x, y + height, x + width, y + height, x + width, y]);
			this.polygon($.dark(bg), b, bw, bc, false, false, [x + width, y, x1 + width, y1, x1 + width, y1 + height, x + width, y + height]);
			return this;
		},
		/**
		 * cube3D
		 * 
		 * @param {Number}
		 *            x 左下角前面x坐标
		 * @param {Number}
		 *            y 左下角前面y坐标
		 * @param {Number}
		 *            rotatex x旋转值,默认角度为单位
		 * @param {Number}
		 *            rotatey y旋转值,默认角度为单位
		 * @param {Number}
		 *            width 宽度
		 * @param {Number}
		 *            height 高度
		 * @param {Number}
		 *            zh z轴长
		 * @param {Number}
		 *            border 边框
		 * @param {Number}
		 *            linewidth
		 * @param {String}
		 *            bcolor
		 * @param {Array}
		 *            styles 立方体各个面样式,包含:{alpha,color},共六个面
		 * @return this
		 */
		cube3D : function(x, y, rotatex, rotatey, angle, w, h, zh, b, bw, bc, styles) {
			/**
			 * styles -> 下底-底-左-右-上-前
			 */
			x = fd(bw, x);
			y = fd(bw, y);
			zh = (!zh || zh == 0) ? w : zh;

			if (angle) {
				var P = $.vectorP2P(rotatex, rotatey);
				rotatex = x + zh * P.x, rotatey = y - zh * P.y;
			} else {
				rotatex = x + zh * rotatex, rotatey = y - zh * rotatey;
			}

			while (styles.length < 6)
				styles.push(false);

			rotatex = fd(bw, rotatex);
			rotatey = fd(bw, rotatey);

			var side = [];

			if (rotatey < 0) {
				if ($.isObject(styles[4]))
					side.push($.applyIf({
						points : [x, y - h, rotatex, rotatey - h, rotatex + w, rotatey - h, x + w, y - h]
					}, styles[4]));
			} else {
				if ($.isObject(styles[0]))
					side.push($.applyIf({
						points : [x, y, rotatex, rotatey, rotatex + w, rotatey, x + w, y]
					}, styles[0]));
			}

			if ($.isObject(styles[1]))
				side.push($.applyIf({
					points : [rotatex, rotatey, rotatex, rotatey - h, rotatex + w, rotatey - h, rotatex + w, rotatey]
				}, styles[1]));

			if ($.isObject(styles[2]))
				side.push($.applyIf({
					points : [x, y, x, y - h, rotatex, rotatey - h, rotatex, rotatey]
				}, styles[2]));

			if ($.isObject(styles[3]))
				side.push($.applyIf({
					points : [x + w, y, x + w, y - h, rotatex + w, rotatey - h, rotatex + w, rotatey]
				}, styles[3]));

			if (rotatey < 0) {
				if ($.isObject(styles[0]))
					side.push($.applyIf({
						points : [x, y, rotatex, rotatey, rotatex + w, rotatey, x + w, y]
					}, styles[0]));
			} else {
				if ($.isObject(styles[4]))
					side.push($.applyIf({
						points : [x, y - h, rotatex, rotatey - h, rotatex + w, rotatey - h, x + w, y - h]
					}, styles[4]));
			}

			if ($.isObject(styles[5]))
				side.push($.applyIf({
					points : [x, y, x, y - h, x + w, y - h, x + w, y]
				}, styles[5]));
			
			side.each(function(s) {
				this.polygon(s.color, b, bw, bc, s.shadow, s.alpha, s.points);
			}, this);
			
			return this;
		},
		polygon : function(bg, b, bw, bc, sw, alpham, points) {
			if (points.length < 2)
				return;
			this.save().strokeStyle(b,bw, bc).beginPath().fillStyle(bg).globalAlpha(alpham).shadowOn(sw).moveTo(points[0], points[1]);
			for ( var i = 2; i < points.length; i += 2) {
				this.lineTo(points[i], points[i + 1]);
			}
			return this.closePath().stroke(b).fill(bg).restore();
		},
		lines : function(p, w, c, last) {
			if (p.length < 4)
				return this;
			this.save().gCo(last).beginPath().strokeStyle(true,w, c).moveTo(fd(w, p[0]), fd(w, p[1]));
			for ( var i = 2; i < p.length - 1; i += 2) {
				this.lineTo(fd(w, p[i]), fd(w, p[i + 1]));
			}
			return this.stroke(true).restore();
		},
		bezierCurveTo : function(r) {
			this.c.bezierCurveTo(r[0], r[1], r[2], r[3], r[4], r[5]);
			return this;
		},
		lineArray : function(p, w, c, smooth, smo) {
			if (p.length < 2)
				return this;
			this.strokeStyle(true,w, c).moveTo(fd(w, p[0].x), fd(w, p[0].y));
			if (smooth) {
				for ( var i = 1; i < p.length; i++)
					this.bezierCurveTo(getCurvePoint(p, p[i], i, smo));
			} else {
				for ( var i = 1; i < p.length; i++)
					this.lineTo(fd(w, p[i].x), fd(w, p[i].y));
			}
			return this.stroke(true);
		},
		manyLine : function(p, w, c, smooth, smo) {
			var T = [],Q  = false;
			p.each(function(p0){
				if(p0.ignored&&Q){
					this.lineArray(T, w, c, smooth, smo);
					T = [];
					Q = false;
				}else{
					T.push(p0);
					Q = true;
				}
			},this);
		},
		line : function(x1, y1, x2, y2, w, c, last) {
			if (!w || w == 0)
				return this;
			this.save().gCo(last);
			return this.beginPath().strokeStyle(true,w, c).moveTo(fd(w, x1), fd(w, y1)).lineTo(fd(w, x2), fd(w, y2)).stroke(true).restore();
		},
		round : function(x, y, r, c, bw, bc) {
			return this.arc(x, y, r,0, 0, PI2, c, !!bc, bw, bc);
		},
		fillRect : function(x, y, w, h) {
			this.c.fillRect(x, y, w, h);
			return this;
		},
		translate : function(x, y) {
			this.c.translate(x, y);
			return this;
		},
		clearRect : function(x, y, w, h) {
			x = x || 0;
			y = y || 0;
			w = w || this.width;
			h = h || this.height;
			this.c.clearRect(x, y, w, h);
			return this;
		},
		gCo : function(l) {
			if(l)
			return this.gCO(l);
			return this;
		},
		gCO : function(l) {
			this.c.globalCompositeOperation = l ? "destination-over" : "source-over";
			return this;
		},
		box : function(x, y, w, h, b, bg, shadow, last) {
			b = b || {
				enable : 0
			}
			if (b.enable) {
				var j = b.width, c = b.color, r = b.radius, f = $.isNumber(j);
				j = $.parsePadding(j);
				w -= (j[1] + j[3]) / 2;
				h -= (j[0] + j[2]) / 2;
				x += (j[3] / 2);
				y += (j[0] / 2);
				x = floor(x);
				y = floor(y);
				j = f ? j[0] : j;
				r = (!f || r == 0 || r == '0') ? 0 : $.parsePadding(r);
			}
			
			this.save().shadowOn(shadow).gCo(last).fillStyle(bg).strokeStyle(f,j, c);

			/**
			 * draw a round corners border
			 */
			if (r) {
				
				this.beginPath().moveTo(x+r[0], fd(j, y)).lineTo(x+w - r[1], fd(j, y)).arc2(x+w, fd(j, y), x+w, y+r[1], r[1]).lineTo(fd(j, x+w), y+h - r[2]).arc2(fd(j, x+w), y+h, x+w - r[2], y+h, r[2]).lineTo(x+r[3], fd(j, y+h)).arc2(x, fd(j, y+h), x, y+h - r[3], r[3]).lineTo(fd(j,x), y+r[0]).arc2(fd(j,x),
						y, x+r[0], y, r[0]).closePath().fill(bg).stroke(j);
			} else {
				if (!b.enable || f) {
					if (b.enable)
						this.c.strokeRect(x, y, fd(j, w), fd(j, h));
					if (bg)
						this.fillRect(x, y, w, h);
				} else {
					if (bg) {
						this.beginPath().moveTo(floor(x+j[3] / 2), floor(y+j[0] / 2)).lineTo(ceil(x+w - j[1] / 2), y+j[0] / 2).lineTo(ceil(x+w - j[1] / 2), ceil(y+h - j[2] / 2)).lineTo(floor(x+j[3] / 2), ceil(y+h - j[2] / 2)).lineTo(floor(x+j[3] / 2), floor(y+j[0] / 2)).closePath().fill(bg);
					}
					if (j) {
						c = $.isArray(c) ? c : [c, c, c, c];
						this.line(x+w, y+j[0] / 2, x+w, y+h - j[0] / 2, j[1], c[1], 0).line(x, y+j[0] / 2, x, y+h - j[0] / 2, j[3], c[3], 0).line(floor(x-j[3] / 2),y, x+w + j[1] / 2, y, j[0], c[0], 0).line(floor(x-j[3] / 2), y+h, x+w + j[1] / 2, y+h, j[2], c[2], 0);
					}
				}

			}
			return this.restore();
		},
		toImageURL : function(g) {
			return this.canvas.toDataURL(g || "image/png");
		},
		addEvent : function(type, fn, useCapture) {
			$.Event.addEvent(this.canvas, type, fn, useCapture);
		}
	}

	/**
	 * @overview this component use for abc
	 * @component#$.Chart
	 * @extend#$.Painter
	 */
	$.Chart = $.extend($.Painter, {
		/**
		 * @cfg {TypeName}
		 */
		configure : function() {
			/**
			 * invoked the super class's configuration
			 */
			$.Chart.superclass.configure.apply(this, arguments);

			/**
			 * indicate the element's type
			 */
			this.type = 'chart';

			this.set({
				render : '',
				/**
				 * @cfg {Array} Required,The datasource of Chart.must be not empty.
				 */
				data : [],
				/**
				 * @cfg {Number} Specifies the width of this canvas
				 */
				width : undefined,
				/**
				 * @cfg {Number} Specifies the height of this canvas
				 */
				height : undefined,
				/**
				 * @cfg {String} Specifies the default lineJoin of the canvas's context in this element.(defaults to 'round')
				 */
				lineJoin : 'round',
				/**
				 * @cfg {String} this property specifies the horizontal alignment of chart in an module (defaults to 'center') Available value are:
				 * @Option 'left'
				 * @Option 'center'
				 * @Option 'right'
				 */
				align : 'center',
				/**
				 * @cfg {Boolean} If true mouse change to a pointer when a mouseover fired.only available when use PC.(defaults to true)
				 */
				default_mouseover_css : true,
				/**
				 * @cfg {Boolean} If true ignore the event touchmove.only available when support touchEvent.(defaults to false)
				 */
				turn_off_touchmove : false,
				/**
				 * @cfg {Boolean} Specifies as true to display with percent.(default to false)
				 */
				showpercent : false,
				/**
				 * @cfg {Number} Specifies the number of decimal when use percent.(default to 1)
				 */
				decimalsnum : 1,
				/**
				 * @cfg {Object/String} Specifies the config of Title details see <link>$.Text</link>,If given a string,it will only apply the text.note:If the text is empty,then will not display
				 */
				title : {
					text : '',
					fontweight : 'bold',
					/**
					 * Specifies the font-size in pixels of title.(default to 20)
					 */
					fontsize : 20,
					/**
					 * Specifies the height of title will be take.(default to 30)
					 */
					height : 30
				},
				/**
				 * @cfg {Object/String}Specifies the config of subtitle details see <link>$.Text</link>,If given a string,it will only apply the text.note:If the title or subtitle'text is empty,then will not display
				 */
				subtitle : {
					text : '',
					fontweight : 'bold',
					/**
					 * Specifies the font-size in pixels of title.(default to 16)
					 */
					fontsize : 16,
					/**
					 * Specifies the height of title will be take.(default to 20)
					 */
					height : 20
				},
				/**
				 * @cfg {Object/String}Specifies the config of footnote details see <link>$.Text</link>,If given a string,it will only apply the text.note:If the text is empty,then will not display
				 */
				footnote : {
					text : '',
					/**
					 * Specifies the font-color of footnote.(default to '#5d7f97')
					 */
					color : '#5d7f97',
					textAlign : 'right',
					/**
					 * Specifies the height of title will be take.(default to 20)
					 */
					height : 20
				},
				/**
				 * @inner {String} Specifies how align footnote horizontally Available value are:
				 * @Option 'left'
				 * @Option 'center'
				 * @Option 'right'
				 */
				footnote_align : 'right',
				/**
				 * @inner {String} Specifies how align title horizontally Available value are:
				 * @Option 'left'
				 * @Option 'center'
				 * @Option 'right'
				 */
				title_align : 'center',
				/**
				 * @inner {String} Specifies how align title vertically Available value are:
				 * @Option 'top'
				 * @Option 'middle' Only applies when title_writingmode = 'tb'
				 * @Option 'bottom'
				 */
				title_valign : 'top',
				/**
				 * @cfg {Boolean} If true element will have a animation when show, false to skip the animation.(default to false)
				 */
				animation : false,
				/**
				 * @Function {Function} the custom funtion for animation.(default to null)
				 */
				doAnimation : null,
				/**
				 * @cfg {String} (default to 'ease-in-out') Available value are:
				 * @Option 'easeIn'
				 * @Option 'easeOut'
				 * @Option 'easeInOut'
				 * @Option 'linear'
				 */
				animation_timing_function : 'easeInOut',
				/**
				 * @cfg {Number} Specifies the duration when animation complete in millisecond.(default to 1000)
				 */
				duration_animation_duration : 1000,
				/**
				 * @cfg {Number} Specifies the chart's z_index.override the default as 999 to make it at top layer.(default to 999)
				 */
				z_index:999,
				/**
				 * @cfg {Object}Specifies the config of Legend.For details see <link>$.Legend</link> Note:this has a extra property named 'enable',indicate whether legend available(default to false)
				 */
				legend : {
					enable : false
				},
				/**
				 * @cfg {Object} Specifies the config of Tip.For details see <link>$.Tip</link> Note:this has a extra property named 'enable',indicate whether tip available(default to false)
				 */
				tip : {
					enable : false
				}
			});

			/**
			 * register the common event
			 */
			this.registerEvent(
			/**
			 * @event Fires when parse this tip's data.Return value will override existing. Only valid when tip is available
			 * @paramter Object#data this tip's data item
			 * @paramter int#i the index of data
			 */
			'parseTipText',
			/**
			 * @event Fires before this element Animation.Only valid when <link>animation</link> is true
			 * @paramter $.Chart#this
			 */
			'beforeAnimation',
			/**
			 * @event Fires when this element Animation finished.Only valid when <link>animation</link> is true
			 * @paramter $.Chart#this
			 */
			'afterAnimation', 'animating');

			this.T = null;
			this.RENDERED = false;
			this.animationed = false;
			this.data = [];
			this.plugins = [];
			this.oneways = [];
			this.total = 0;
		},
		toImageURL : function() {
			return this.T.toImageURL();
		},
		segmentRect : function() {
			this.T.clearRect(this.get('l_originx'), this.get('t_originy'), this.get('client_width'), this.get('client_height'));
		},
		resetCanvas : function() {
			this.T.box(this.get('l_originx'), this.get('t_originy'), this.get('client_width'), this.get('client_height'),0,this.get('f_color'),0,true);
		},
		animation : function(_) {
			/**
			 * clear the part of canvas
			 */
			_.segmentRect();
			
			/**
			 * doAnimation of implement
			 */
			_.doAnimation(_.variable.animation.time, _.duration);
			/**
			 * fill the background
			 */
			_.resetCanvas();
			if (_.variable.animation.time < _.duration) {
				_.variable.animation.time++;
				$.requestAnimFrame(function() {
					_.animation(_);
				});
			} else {
				$.requestAnimFrame(function() {
					_.variable.animation.time = 0;
					_.animationed = true;
					_.draw();
					_.processAnimation = false;
					_.fireEvent(_, 'afterAnimation', [_]);
				});
			}
		},
		runAnimation : function() {
			this.fireEvent(this, 'beforeAnimation', [this]);
			this.animation(this);
		},
		doSort:function(){
			this.components.sor(function(p, q){return ($.isArray(p)?(p.zIndex||0):p.get('z_index'))>($.isArray(q)?(q.zIndex||0):q.get('z_index'))});
		},
		commonDraw : function(_) {
			$.Assert.isTrue(_.RENDERED, _.type + ' has not rendered.');
			$.Assert.isTrue(_.initialization, _.type + ' has initialize failed.');
			$.Assert.gtZero(_.data.length, _.type + '\'s data is empty.');
			
			/**
			 * console.time('Test for draw');
			 */
			if (!_.redraw) {
				_.doSort();
				_.oneways.eachAll(function(o) {o.draw()});
			}
			_.redraw = true;
			
			if (!_.animationed && _.get('animation')) {
				_.runAnimation();
				return;
			}
			
			_.segmentRect();

			_.components.eachAll(function(c) {
				c.draw();
			});
			
			_.resetCanvas();
			/**
			 * console.timeEnd('Test for draw');
			 */

		},
		/**
		 * @method register the customize component
		 * @paramter <link>$.Text</link>#component 
		 * @return void
		 */
		plugin : function(c) {
			c.inject(this);
			this.components.push(c);
			this.plugins(c);
		},
		/**
		 * @method return the title,return undefined if unavailable
		 * @return <link>$.Text</link>#the title object
		 */
		getTitle:function(){
			return this.title;
		},
		/**
		 * @method return the subtitle,return undefined if unavailable
		 * @return <link>$.Text</link>#the subtitle object
		 */
		getSubTitle:function(){
			return this.subtitle;
		},
		/**
		 * @method return the footnote,return undefined if unavailable
		 * @return <link>$.Text</link>#the footnote object
		 */
		getFootNote:function(){
			return this.footnote;
		},
		/**
		 * @method return the main Drawing Area's dimension,return following property:
		 * x:the left-top coordinate-x
		 * y:the left-top coordinate-y
		 * width:the width of drawing area
		 * height:the height of drawing area
		 * @return Object#contains dimension info
		 */
		getDrawingArea:function(){
			return {
				x:this.get("l_originx"),
				x:this.get("t_originy"),
				width:this.get("client_width"),
				height:this.get("client_height")
			}
		},
		/**
		 * @method set up the chart by latest configruation
		 * @return void
		 */
		setUp:function(){
			this.redraw = false;
			this.T.clearRect();
			this.initialization = false;
			this.initialize();
		},
		create : function(_,shell) {
			/**
			 * did default should to calculate the size of warp?
			 */
			_.width = _.pushIf('width', 400);
			_.height = _.pushIf('height', 300);
			_.canvasid = $.iGather(_.type);
			_.shellid = "shell-"+_.canvasid;
			
			var H = [];
			H.push("<div id='");
			H.push(_.shellid);
			H.push("' style='width:");
			H.push(_.width);
			H.push("px;height:");
			H.push(_.height);
			H.push("px;padding:0px;margin:0px;overflow:hidden;position:relative;'>");
			H.push("<canvas id= '");
			H.push(_.canvasid);
			H.push("'  width='");
			H.push(_.width);
			H.push("' height='");
			H.push(_.height);
			H.push("'><p>Your browser does not support the canvas element</p></canvas></div>");
			/**
			 * also use appendChild()
			 */
			shell.innerHTML = H.join("");
			
			_.shell = $(_.shellid);
			/**
			 * the base canvas wrap for draw
			 */
			_.T = _.target = new Cans(_.canvasid);
			
			_.RENDERED = true;
		},
		initialize : function() {
			
			var _ = this._(),d = _.get('data');
			/**
			 * create dom
			 */
			if (!_.RENDERED) {
				var r = _.get('render');
				if (typeof r == "string" && $(r))
					_.create(_,$(r));
				else if (typeof r == 'object')
					_.create(_,r);
			}
			/**
			 * set up
			 */
			if (d.length > 0 && _.RENDERED && !_.initialization) {
				if(_.dataType=='simple'){
					simple.call(_,d);
				}else if(_.dataType=='complex'){
					complex.call(_,d);
				}
				_.data = d;
				_.doConfig();
				_.initialization = true;
			}
		},
		/**
		 * this method only invoked once
		 */
		oneWay:function(_){
			
			var E = _.variable.event, mCSS = !$.touch&&_.get('default_mouseover_css'), O, AO,events = $.touch?['touchstart','touchmove']:['click','mousemove'];
			
			events.each(function(it) {
				_.T.addEvent(it, function(e) {
					if (_.processAnimation)
						return;
					if(e.targetTouches&&e.targetTouches.length!=1){
						return;
					}
					_.fireEvent(_, it, [_, $.Event.fix(e)]);
				}, false);
			});
			
			_.on(events[0], function(_, e) {
				_.components.eachAll(function(C) {
					if (!C.ignoreEvent) {
						var M = C.isMouseOver(e);
						if (M.valid){
							E.click = true;
							C.fireEvent(C,'click', [C, e, M]);
						}
					}
				});
				if(E.click){
					e.event.preventDefault();
					E.click = false;
				}
			});
			
			if(!$.touch||!_.get('turn_off_touchmove'))
			_.on(events[1], function(_, e) {
				O = AO = false;
				_.components.eachAll(function(cot) {
					if (!cot.ignoreEvent) {
						var cE = cot.variable.event, M = cot.isMouseOver(e);
						if (M.valid) {
							O = true;
							AO = AO || cot.atomic;
							if (!E.mouseover) {
								E.mouseover = true;
								_.fireEvent(_, 'mouseover', [cot,e, M]);
							}
							
							if (mCSS && AO) {
								_.T.css("cursor", "pointer");
							}
							
							if (!cE.mouseover) {
								cE.mouseover = true;
								cot.fireEvent(cot, 'mouseover', [cot,e, M]);
							}
							cot.fireEvent(cot, 'mousemove', [cot,e, M]);
							if(M.stop){
								return false;
							}
						} else {
							if (cE.mouseover) {
								cE.mouseover = false;
								cot.fireEvent(cot, 'mouseout', [cot,e, M]);
							}
						}
					}
				});
				
				if(E.mouseover){
					e.event.preventDefault();
					if (mCSS && !AO) {
						_.T.css("cursor", "default");
					}
					if (!O && E.mouseover) {
						E.mouseover = false;
						_.fireEvent(_, 'mouseout', [_,e]);
					}
				}
			});
			_.oneWay = $.emptyFn;
		},
		doConfig : function() {
			
			$.Chart.superclass.doConfig.call(this);
			
			var _ = this._();
			
			$.Assert.isArray(_.data);
				
			_.T.strokeStyle(true,_.get('brushsize'), _.get('strokeStyle'), _.get('lineJoin'));

			_.processAnimation = _.get('animation');
			
			_.duration = ceil(_.get('duration_animation_duration') * $.FRAME / 1000);
			if($.isFunction(_.get('doAnimation'))){
				_.doAnimation = _.get('doAnimation');
			}
			_.variable.animation = {
				type : 0,
				time : 0,
				queue : []
			};
			
			_.components = [];
			_.oneways = [];
			
			/**
			 * push the background in it
			 */
			_.oneways.push(new $.Custom({
				drawFn:function(){
					_.T.box(0, 0, _.width, _.height, _.get('border'), _.get('f_color'),0,true);
				}
			}));
			
			/**
			 * make sure hold the customize plugin 
			 */
			_.plugins.each(function(o){
				_.components.push(o);
			});
			
			_.applyGradient();
			
			_.animationArithmetic = $.getAA(_.get('animation_timing_function'));
			
			/**
			_.on('afterAnimation', function() {
				var N = _.variable.animation.queue.shift();
				if (N) {
					_[N.handler].apply(_, N.arguments);
				}
			});
			*/
			
			_.oneWay(_);
			
			_.push('r_originx', _.width - _.get('padding_right'));
			_.push('b_originy', _.height - _.get('padding_bottom'));

			var H = 0, l = _.push('l_originx', _.get('padding_left')), t = _.push('t_originy', _.get('padding_top')), w = _.push('client_width', (_.get('width') - _.get('hpadding'))), h;

			if ($.isString(_.get('title'))) {
				_.push('title', $.applyIf({
					text : _.get('title')
				}, _.default_.title));
			}
			if ($.isString(_.get('subtitle'))) {
				_.push('subtitle', $.applyIf({
					text : _.get('subtitle')
				}, _.default_.subtitle));
			}
			if ($.isString(_.get('footnote'))) {
				_.push('footnote', $.applyIf({
					text : _.get('footnote')
				}, _.default_.footnote));
			}

			if (_.get('title.text') != '') {
				var st = _.get('subtitle.text') != '';
				H = st ? _.get('title.height') + _.get('subtitle.height') : _.get('title.height');
				t = _.push('t_originy', t + H);
				_.push('title.originx', l);
				_.push('title.originy', _.get('padding_top'));
				_.push('title.width', w);
				_.title = new $.Text(_.get('title'), _);
				_.oneways.push(_.title);
				if (st) {
					_.push('subtitle.originx', l);
					_.push('subtitle.originy', _.get('title.originy') + _.get('title.height'));
					_.push('subtitle.width', w);
					_.subtitle = new $.Text(_.get('subtitle'), _);
					_.oneways.push(_.subtitle);
				}
			}

			if (_.get('footnote.text') != '') {
				var g = _.get('footnote.height');
				H += g;
				_.push('b_originy', _.get('b_originy') - g);
				_.push('footnote.originx', l);
				_.push('footnote.originy', _.get('b_originy'));
				_.push('footnote.width', w);
				_.footnote = new $.Text(_.get('footnote'), _);
				_.oneways.push(_.footnote);
			}

			h = _.push('client_height', (_.get('height') - _.get('vpadding') - H));

			_.push('minDistance', min(w, h));
			_.push('maxDistance', max(w, h));
			_.push('minstr', w < h ? 'width' : 'height');

			_.push('centerx', l + w / 2);
			_.push('centery', t + h / 2);
			
			_.push('communal_option',['shadow', 'shadow_color', 'shadow_blur', 'shadow_offsetx', 'shadow_offsety','tip']);
			
			
			/**
			 * legend
			 */
			if (_.get('legend.enable')) {
				_.legend = new $.Legend($.apply({
					maxwidth : w,
					data : _.data
				}, _.get('legend')), _);
				
				_.components.push(_.legend);
			}
			/**
			 * tip's wrap
			 */
			if (_.get('tip.enable')) {
				_.push('tip.wrap', _.shell);
			}

		}
	});
})($);
// @end

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
				/**
				 * @cfg {Function} Specifies the customize function.(default to emptyFn)
				 */
				drawFn:$.emptyFn,
				/**
				 * @cfg {Function} Specifies the customize event valid function.(default to undefined)
				 */
				eventValid:undefined	
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
});
/**
 * @overview this is inner use for axis
 * @component#$.Scale
 * @extend#$.Component
 */
$.Scale = $.extend($.Component, {
	configure : function() {

		/**
		 * invoked the super class's configuration
		 */
		$.Scale.superclass.configure.apply(this, arguments);

		/**
		 * indicate the component's type
		 */
		this.type = 'scale';

		this.set({
			/**
			 * @cfg {String} Specifies alignment of this scale.(default to 'left')
			 */
			position : 'left',
			/**
			 * @cfg {String} the axis's type(default to 'h') Available value are:
			 * @Option 'h' :horizontal
			 * @Option 'v' :vertical
			 */
			which : 'h',
			/**
			 * @inner {Number}
			 */
			distance : undefined,
			/**
			 * @cfg {Number} Specifies the start coordinate scale value.(default to 0)
			 */
			start_scale : 0,
			/**
			 * @cfg {Number} Specifies the end coordinate scale value.Note either this or property of max_scale must be has the given value.(default to undefined)
			 */
			end_scale : undefined,
			/**
			 * @inner {Number} Specifies the chart's minimal value
			 */
			min_scale : undefined,
			/**
			 * @inner {Number} Specifies the chart's maximal value
			 */
			max_scale : undefined,
			/**
			 * @cfg {Number} Specifies the space of two scale.Note either this or property of scale_share must be has the given value.(default to undefined)
			 */
			scale_space : undefined,
			/**
			 * @cfg {Number} Specifies the number of scale on axis.(default to 5)
			 */
			scale_share : 5,
			/**
			 * @cfg {Boolean} True to display the scale line.(default to true)
			 */
			scale_enable : true,
			/**
			 * @cfg {Number} Specifies the size of brush(context.linewidth).(default to 1)
			 */
			scale_size : 1,
			/**
			 * @cfg {Number} Specifies the width(length) of scale.(default to 4)
			 */
			scale_width : 4,
			/**
			 * @cfg {String} Specifies the color of scale.(default to 4)
			 */
			scale_color : '#333333',
			/**
			 * @cfg {String} Specifies the align against axis.(default to 'center') When the property of which set to 'h',Available value are:
			 * @Option 'left'
			 * @Option 'center'
			 * @Option 'right' When the property of which set to 'v', Available value are:
			 * @Option 'top'
			 * @Option 'center'
			 * @Option 'bottom'
			 */
			scaleAlign : 'center',
			/**
			 * @cfg {Array} the customize labels
			 */
			labels : [],
			/**
			 * @cfg {Boolean} True to Indicate the grid is accord with scale
			 */
			scale2grid : true,
			/**
			 * @cfg {Number} Specifies the lineheight when text display multiline.(default to 16)
			 */
			text_height : 16,
			/**
			 * @cfg {Number} Specifies the distance to scale.(default to 4)
			 */
			text_space : 4,
			/**
			 * @cfg {String} Specifies the align against axis.(default to 'left' or 'bottom' in v mode) When the property of which set to 'h',Available value are:
			 * @Option 'left'
			 * @Option 'right' When the property of which set to 'v', Available value are:
			 * @Option 'top'
			 * @Option 'bottom'
			 */
			textAlign : 'left',
			/**
			 * @cfg {Number} Specifies the number of decimal.this will change along with scale.(default to 0)
			 */
			decimalsnum : 0,
			/**
			 * @inner {String} the style of overlapping(default to 'none') Available value are:
			 * @Option 'square'
			 * @Option 'round'
			 * @Option 'none'
			 */
			join_style : 'none',
			/**
			 * @inner {Number}
			 */
			join_size : 2
		});

		this.registerEvent(
		/**
		 * @event Fires the event when parse text、you can return a object like this:{text:'',textX:100,textY:100} to override the given.
		 * @paramter string#text item's text
		 * @paramter int#textX coordinate-x of item's text
		 * @paramter int#textY coordinate-y of item's text
		 * @paramter int#index item's index
		 */
		'parseText');

		this.items = [];
		this.number = 0;

	},
	isEventValid : function(e) {
		return {
			valid : false
		};
	},
	/**
	 * 按照从左自右,从上至下原则
	 */
	doDraw : function() {
		var _ = this._(), x = 0, y = 0, x0 = 0, y0 = 0, tx = 0, ty = 0, w = _.get('scale_width'), w2 = w / 2, sa = _.get('scaleAlign'), ta = _.get('textAlign'), ts = _.get('text_space');
		if (_.isH) {
			if (sa == 'top') {
				y = -w;
			} else if (sa == 'center') {
				y = -w2;
				y0 = w2;
			} else {
				y0 = w;
			}
			_.T.textAlign('center');
			if (ta == 'top') {
				ty = -ts;
				_.T.textBaseline('bottom');
			} else {
				ty = ts;
				_.T.textBaseline('top');
			}
		} else {
			if (sa == 'left') {
				x = -w;
			} else if (sa == 'center') {
				x = -w2;
				x0 = w2;
			} else {
				x0 = w;
			}
			_.T.textBaseline('middle');
			if (ta == 'right') {
				_.T.textAlign('left');
				tx = ts;
			} else {
				_.T.textAlign('right');
				tx = -ts;
			}
		}
		/**
		 * 将上述的配置部分转移到config中?
		 */

		/**
		 * individuation text?
		 */
		_.T.textFont(_.get('fontStyle'));

		_.items.each(function(item) {
			if (_.get('scale_enable'))
				_.T.line(item.x + x, item.y + y, item.x + x0, item.y + y0, _.get('scale_size'), _.get('scale_color'), false);

			_.T.fillText(item.text, item.textX + tx, item.textY + ty, false, _.get('color'), 'lr', _.get('text_height'));
		});

	},
	doConfig : function() {
		$.Scale.superclass.doConfig.call(this);
		$.Assert.isNumber(this.get('distance'), 'distance');

		var _ = this._(), customL = _.get('labels').length, min_s = _.get('min_scale'), max_s = _.get('max_scale'), s_space = _.get('scale_space'), e_scale = _.get('end_scale'), start_scale = _.get('start_scale');

		if (customL > 0) {
			_.number = customL - 1;
		} else {
			$.Assert.isTrue($.isNumber(max_s) || $.isNumber(e_scale), 'max_scale&end_scale');
			/**
			 * end_scale must greater than maxScale
			 */
			if (!e_scale || e_scale < max_s) {
				e_scale = _.push('end_scale', $.ceil(max_s));
			}

			/**
			 * startScale must less than minScale
			 */
			if (start_scale > min_s) {
				_.push('start_scale', $.floor(min_s));
			}

			if (s_space && s_space < e_scale - start_scale) {
				_.push('scale_share', (e_scale - start_scale) / s_space);
			}

			/**
			 * value of each scale
			 */
			if (!s_space || s_space > e_scale - start_scale) {
				s_space = _.push('scale', (e_scale - start_scale) / _.get('scale_share'));
			}

			_.number = _.get('scale_share');

			if (s_space < 1 && _.get('decimalsnum') == 0) {
				var dec = s_space;
				while (dec < 1) {
					dec *= 10;
					_.push('decimalsnum', _.get('decimalsnum') + 1);
				}
			}

		}

		/**
		 * the real distance of each scale
		 */
		_.push('distanceOne', _.get('valid_distance') / _.number);

		var text, maxwidth = 0, x, y;

		_.T.textFont(_.get('fontStyle'));
		_.push('which', _.get('which').toLowerCase());
		_.isH = _.get('which') == 'h';
		/**
		 * 有效宽度仅对水平刻度有效、有效高度仅对垂直高度有效
		 */
		for ( var i = 0; i <= _.number; i++) {
			text = customL ? _.get('labels')[i] : (s_space * i + start_scale).toFixed(_.get('decimalsnum'));
			x = _.isH ? _.get('valid_x') + i * _.get('distanceOne') : _.x;
			y = _.isH ? _.y : _.get('valid_y') + _.get('distance') - i * _.get('distanceOne');
			_.items.push($.merge({
				text : text,
				x : x,
				y : y,
				textX : x,
				textY : y
			}, _.fireEvent(_, 'parseText', [text, x, y, i])));
			maxwidth = Math.max(maxwidth, _.T.measureText(text));
		}

		/**
		 * what does follow code doing?
		 */
		_.left = _.right = _.top = _.bottom = 0;
		var ts = _.get('text_space'), ta = _.get('textAlign'), sa = _.get('scaleAlign'), w = _.get('scale_width'), w2 = w / 2;

		if (_.isH) {
			if (sa == 'top') {
				_.top = w;
			} else if (sa == 'center') {
				_.top = w2;
			} else {
				_.top = 0;
			}
			_.bottom = w - _.top;
			if (ta == 'top') {
				_.top += _.get('text_height') + ts;
			} else {
				_.bottom += _.get('text_height') + ts;
			}
		} else {
			if (sa == 'left') {
				_.left = w;
			} else if (sa == 'center') {
				_.left = w2;
			} else {
				_.left = 0;
			}
			_.right = w - _.left;
			if (ta == 'left') {
				_.left += maxwidth + ts;
			} else {
				_.right += maxwidth + ts;
			}
		}
	}
});

/**
 * @end
 */
$.Coordinate = {
	coordinate_ : function() {
		var _ = this._();
		if (_.is3D()) {
			_.push('coordinate.xAngle_', _.get('xAngle_'));
			_.push('coordinate.yAngle_', _.get('yAngle_'));
			/**
			 * the Coordinate' Z is same as long as the column's
			 */
			_.push('coordinate.zHeight', _.get('zHeight') * _.get('bottom_scale'));
			return new $.Coordinate3D($.apply({
				scale : {
					position : _.get('scaleAlign'),
					scaleAlign : _.get('scaleAlign'),
					max_scale : _.get('maxValue'),
					min_scale : _.get('minValue')
				}
			}, _.get('coordinate')), _);
		} else {
			return new $.Coordinate2D($.apply({
				scale : {
					position : _.get('scaleAlign'),
					max_scale : _.get('maxValue'),
					min_scale : _.get('minValue')
				}
			}, _.get('coordinate')), _);
		}
	},
	coordinate : function() {
		/**
		 * calculate chart's measurement
		 */
		var _ = this._(), f = 0.9, _w = _.get('client_width'), _h = _.get('client_height'), w = _.pushIf('coordinate.width', Math.floor(_w * f)), h = _.pushIf('coordinate.height', Math.floor(_h * f));

		if (h > _h) {
			h = _.push('coordinate.height', _h * f);
		}
		if (w > _w) {
			w = _.push('coordinate.width', _w * f);
		}
		if (_.is3D()) {
			h = _.push('coordinate.height', h - (_.get('coordinate.pedestal_height') || 22) - (_.get('coordinate.board_deep') || 20));
		}

		/**
		 * calculate chart's alignment
		 */
		if (_.get('align') == 'left') {
			_.push('originx', _.get('l_originx'));
		} else if (_.get('align') == 'right') {
			_.push('originx', _.get('r_originx') - w);
		} else {
			_.push('originx', _.get('centerx') - w / 2);
		}

		_.push('originx', _.get('originx') + _.get('offsetx'));
		_.push('originy', _.get('centery') - h / 2 + _.get('offsety'));

		if (!_.get('coordinate.valid_width') || _.get('coordinate.valid_width') > w) {
			_.push('coordinate.valid_width', w);
		}

		if (!_.get('coordinate.valid_height') || _.get('coordinate.valid_height') > h) {
			_.push('coordinate.valid_height', h);
		}

		/**
		 * originx for short
		 */
		_.x = _.get('originx');
		/**
		 * originy for short
		 */
		_.y = _.get('originy');

		_.push('coordinate.originx', _.x);
		_.push('coordinate.originy', _.y);
	}
}
/**
 * @overview this component use for abc
 * @component#$.Coordinate2D
 * @extend#$.Component
 */
$.Coordinate2D = $
		.extend(
				$.Component,
				{
					configure : function() {
						/**
						 * invoked the super class's configurationuration
						 */
						$.Coordinate2D.superclass.configure.apply(this, arguments);

						/**
						 * indicate the component's type
						 */
						this.type = 'coordinate2d';

						this.set({
							/**
							 * @inner {Number}
							 */
							sign_size : 12,
							/**
							 * @inner {Number}
							 */
							sign_space : 5,
							/**
							 * @cfg {Array} the option for scale.For details see <link>$.Scale</link>
							 */
							scale : [],
							/**
							 * @cfg {Number} Specifies the valid width,less than the width of coordinate.(default same as width)
							 */
							valid_width : undefined,
							/**
							 * @cfg {Number} Specifies the valid height,less than the height of coordinate.(default same as height)
							 */
							valid_height : undefined,
							/**
							 * @cfg {Number} Specifies the linewidth of the grid.(default to 1)
							 */
							grid_line_width : 1,
							/**
							 * @cfg {String} Specifies the color of the grid.(default to '#dbe1e1')
							 */
							grid_color : '#dbe1e1',
							/**
							 * @cfg {Boolean} True to display grid line.(default to true)
							 */
							gridlinesVisible : true,
							/**
							 * @cfg {Boolean} indicate whether the grid is accord with scale,on the premise of grids is not specify. this just give a convenient way bulid grid for default.and actual value depend on scale's scale2grid
							 */
							scale2grid : true,
							/**
							 * @cfg {Object} this is grid config for custom.there has two valid property horizontal and vertical.the property's sub property is: way:the manner calculate grid-line (default to 'share_alike') Available property are:
							 * @Option share_alike
							 * @Option given_value value: when property way apply to 'share_alike' this property mean to the number of grid's line. when apply to 'given_value' this property mean to the distance each grid line(unit:pixel) . code will like: { horizontal: {
							 *         way:'share_alike', value:10 } vertical: { way:'given_value', value:40 } }
							 */
							grids : undefined,
							/**
							 * @cfg {Boolean} If True the grid line will be ignored when gird and axis overlap.(default to true)
							 */
							ignoreOverlap : true,
							/**
							 * @cfg {Boolean} If True the grid line will be ignored when gird and coordinate's edge overlap.(default to false)
							 */
							ignoreEdge : false,
							/**
							 * @inner {String} Specifies the label on x-axis
							 */
							xlabel : '',
							/**
							 * @inner {String} Specifies the label on y-axis
							 */
							ylabel : '',
							/**
							 * @cfg {Boolean} If True the grid background-color will be alternate.(default to true)
							 */
							alternate_color : true,
							/**
							 * @cfg {String} Specifies the direction apply alternate color.(default to 'v')Available value are:
							 * @Option 'h' horizontal
							 * @Option 'v' vertical
							 */
							alternate_direction : 'v',
							/**
							 * @cfg {float(0.01 - 0.5)} Specifies the factor make color dark alternate_color,relative to background-color,the bigger the value you set,the larger the color changed.(defaults to '0.01')
							 */
							alternate_color_factor : 0.01,
							/**
							 * @cfg {Object} Specifies config crosshair.(default enable to false).For details see <link>$.CrossHair</link> Note:this has a extra property named 'enable',indicate whether crosshair available(default to false)
							 */
							crosshair : {
								enable : false
							},
							/**
							 * @cfg {Number} Required,Specifies the width of this coordinate.(default to undefined)
							 */
							width : undefined,
							/**
							 * @cfg {Number} Required,Specifies the height of this coordinate.(default to undefined)
							 */
							height : undefined,

							z_index : -1,
							/**
							 * @cfg {Object} Specifies style for axis of this coordinate. Available property are:
							 * @Option enable {Boolean} True to display the axis.(default to true)
							 * @Option color {String} Specifies the color of each axis.(default to '#666666')
							 * @Option width {Number/Array} Specifies the width of each axis, If given the a array,there must be have have 4 element, like this:[1,0,0,1](top-right-bottom-left).(default to 1)
							 */
							axis : {
								enable : true,
								color : '#666666',
								width : 1
							}
						});

						this.registerEvent();

						this.scale = [];
						this.gridlines = [];
					},
					getScale : function(p) {
						for ( var i = 0; i < this.scale.length; i++) {
							var k = this.scale[i];
							if (k.get('position') == p) {
								return {
									start : k.get('start_scale'),
									end : k.get('end_scale'),
									distance : k.get('end_scale') - k.get('start_scale')
								};
							}
						}
						return {
							start : 0,
							end : 0,
							distance : 0
						};
					},
					isEventValid : function(e) {
						return {
							valid : e.x > this.x && e.x < (this.x + this.get('width')) && e.y < this.y + this.get('height') && e.y > this.y
						};
					},
					doDraw : function(opts) {
						var _ = this._();
						_.T.box(_.x, _.y, _.get('width'), _.get('height'), 0, _.get('f_color'));
						if (_.get('alternate_color')) {
							var x, y, f = false, axis = [0, 0, 0, 0], c = $.dark(_.get('background_color'), _.get('alternate_color_factor'));
							if (_.get('axis.enable')) {
								axis = _.get('axis.width');
							}
						}

						var glw = _.get('grid_line_width'), v = _.get('alternate_direction') == 'v';

						_.gridlines.each(function(g) {
							g.x1 = Math.round(g.x1);
							g.y1 = Math.round(g.y1);
							g.x2 = Math.round(g.x2);
							g.y2 = Math.round(g.y2);
							if (_.get('alternate_color')) {
								if (f) {
									if (v)
										_.T.box(g.x1 + axis[3], g.y1 + glw, g.x2 - g.x1 - axis[3] - axis[1], y - g.y1 - glw, 0, c);
									else
										_.T.box(x + glw, g.y2 + axis[0], g.x1 - x, g.y1 - g.y2 - axis[0] - axis[2], 0, c);
								}
								x = g.x1;
								y = g.y1;
								f = !f;
							}
							_.T.line(g.x1, g.y1, g.x2, g.y2, glw, _.get('grid_color'));
						});

						_.T.box(_.x, _.y, _.get('width'), _.get('height'), _.get('axis'), false, _.get('shadow'));

						_.scale.each(function(s) {
							s.draw()
						});
					},
					doConfig : function() {
						$.Coordinate2D.superclass.doConfig.call(this);

						var _ = this._();

						$.Assert.isNumber(_.get('width'), 'width');
						$.Assert.isNumber(_.get('height'), 'height');

						/**
						 * this element not atomic because it is a container,so this is a particular case.
						 */
						_.atomic = false;

						/**
						 * apply the gradient color to f_color
						 */
						if (_.get('gradient') && $.isString(_.get('f_color'))) {
							_.push('f_color', _.T.avgLinearGradient(_.x, _.y, _.x, _.y + _.get('height'), [_.get('dark_color'), _.get('light_color')]));
						}

						if (_.get('axis.enable')) {
							var aw = _.get('axis.width');
							if (!$.isArray(aw))
								_.push('axis.width', [aw, aw, aw, aw]);
						}

						if (_.get('crosshair.enable')) {
							_.push('crosshair.wrap', _.container.shell);
							_.push('crosshair.height', _.get('height'));
							_.push('crosshair.width', _.get('width'));
							_.push('crosshair.top', _.y);
							_.push('crosshair.left', _.x);

							_.crosshair = new $.CrossHair(_.get('crosshair'), _);
						}

						var jp, cg = !!(_.get('gridlinesVisible') && _.get('grids')), // custom grid
					hg = cg && !!_.get('grids.horizontal'), vg = cg && !!_.get('grids.vertical'), h = _.get('height'), w = _.get('width'), vw = _.get('valid_width'), vh = _.get('valid_height'), k2g = _.get('gridlinesVisible') && _.get('scale2grid') && !(hg && vg), sw = (w - vw) / 2, sh = (h - vh) / 2, axis = _
							.get('axis.width');

					if (!$.isArray(_.get('scale'))) {
						if ($.isObject(_.get('scale')))
							_.push('scale', [_.get('scale')]);
						else
							_.push('scale', []);
					}
					_.get('scale').each(function(kd, i) {
						jp = kd['position'];
						jp = jp || 'left';
						jp = jp.toLowerCase();
						kd['originx'] = _.x;
						kd['originy'] = _.y;
						kd['valid_x'] = _.x + sw;
						kd['valid_y'] = _.y + sh;
						kd['position'] = jp;
						// calculate coordinate,direction,distance
							if (jp == 'top') {
								kd['which'] = 'h';
								kd['distance'] = w;
								kd['valid_distance'] = vw;
							} else if (jp == 'right') {
								kd['which'] = 'v';
								kd['distance'] = h;
								kd['valid_distance'] = vh;
								kd['originx'] += w;
								kd['valid_x'] += vw;
							} else if (jp == 'bottom') {
								kd['which'] = 'h';
								kd['distance'] = w;
								kd['valid_distance'] = vw;
								kd['originy'] += h;
								kd['valid_y'] += vh;
							} else {
								kd['which'] = 'v';
								kd['distance'] = h;
								kd['valid_distance'] = vh;
							}
							_.scale.push(new $.Scale(kd, _.container));
						}, _);

					var iol = _.push('ignoreOverlap', _.get('ignoreOverlap') && _.get('axis.enable') || _.get('ignoreEdge'));

					if (iol) {
						if (_.get('ignoreEdge')) {
							var ignoreOverlap = function(w, x, y) {
								return w == 'v' ? (y == _.y) || (y == _.y + h) : (x == _.x) || (x == _.x + w);
							}
						} else {
							var ignoreOverlap = function(wh, x, y) {
								return wh == 'v' ? (y == _.y && axis[0] > 0) || (y == (_.y + h) && axis[2] > 0) : (x == _.x && axis[3] > 0) || (x == (_.x + w) && axis[1] > 0);
							}
						}
					}

					if (k2g) {
						var scale, x, y, p;
						for ( var i = 0; i < _.scale.length; i++) {
							scale = _.scale[i];
							p = scale.get('position');
							// disable,given specfiy grid will ignore scale2grid
							if ($.isFalse(scale.get('scale2grid')) || hg && scale.get('which') == 'v' || vg && scale.get('which') == 'h') {
								continue;
							}
							x = y = 0;
							if (p == 'top') {
								y = h;
							} else if (p == 'right') {
								x = -w;
							} else if (p == 'bottom') {
								y = -h;
							} else {
								x = w;
							}
							for ( var j = 0; j < scale.items.length; j++) {
								if (iol)
									if (ignoreOverlap.call(_, scale.get('which'), scale.items[j].x, scale.items[j].y))
										continue;
								_.gridlines.push({
									x1 : scale.items[j].x,
									y1 : scale.items[j].y,
									x2 : scale.items[j].x + x,
									y2 : scale.items[j].y + y
								});
							}
						}
					}
					if (vg) {
						var gv = _.get('grids.vertical');
						$.Assert.gtZero(gv['value'], 'value');
						var d = w / gv['value'], n = gv['value'];
						if (gv['way'] == 'given_value') {
							n = d;
							d = gv['value'];
							d = d > w ? w : d;
						}

						for ( var i = 0; i <= n; i++) {
							if (iol)
								if (ignoreOverlap.call(_, 'h', _.x + i * d, _.y))
									continue;
							_.gridlines.push({
								x1 : _.x + i * d,
								y1 : _.y,
								x2 : _.x + i * d,
								y2 : _.y + h
							});
						}
					}
					if (hg) {
						var gh = _.get('grids.horizontal');
						$.Assert.gtZero(gh['value'], 'value');
						var d = h / gh['value'], n = gh['value'];
						if (gh['way'] == 'given_value') {
							n = d;
							d = gh['value'];
							d = d > h ? h : d;
						}

						for ( var i = 0; i <= n; i++) {
							if (iol)
								if (ignoreOverlap.call(_, 'v', _.x, _.y + i * d))
									continue;
							_.gridlines.push({
								x1 : _.x,
								y1 : _.y + i * d,
								x2 : _.x + w,
								y2 : _.y + i * d
							});
						}
					}
				}
				});
/**
 * @end
 */
/**
 * @overview this component use for abc
 * @component#$.Coordinate3D
 * @extend#$.Coordinate2D
 */
$.Coordinate3D = $.extend($.Coordinate2D, {
	configure : function() {
		/**
		 * invoked the super class's configurationuration
		 */
		$.Coordinate3D.superclass.configure.apply(this, arguments);

		/**
		 * indicate the component's type
		 */
		this.type = 'coordinate3d';
		this.dimension = $._3D;

		this.set({
			/**
			 * @cfg {Number} Three-dimensional rotation X in degree(angle).socpe{0-90},Normally, this will accord with the chart.(default to 60)
			 */
			xAngle : 60,
			/**
			 * @cfg {Number} Three-dimensional rotation Y in degree(angle).socpe{0-90},Normally, this will accord with the chart.(default to 20)
			 */
			yAngle : 20,
			xAngle_ : undefined,
			yAngle_ : undefined,
			/**
			 * @cfg {Number} Required,Specifies the z-axis deep of this coordinate,Normally, this will given by chart.(default to 0)
			 */
			zHeight : 0,
			/**
			 * @cfg {Number} Specifies pedestal height of this coordinate.(default to 22)
			 */
			pedestal_height : 22,
			/**
			 * @cfg {Number} Specifies board deep of this coordinate.(default to 20)
			 */
			board_deep : 20,
			/**
			 * @cfg {Boolean} Override the default as true
			 */
			gradient : true,
			/**
			 * @cfg {float} Override the default as 0.18.
			 */
			color_factor : 0.18,
			/**
			 * @cfg {Boolean} Override the default as true.
			 */
			ignoreEdge : true,
			/**
			 * @cfg {Boolean} Override the default as false.
			 */
			alternate_color : false,
			/**
			 * @cfg {String} Override the default as '#7a8d44'.
			 */
			grid_color : '#7a8d44',
			/**
			 * @cfg {String} Override the default as '#d6dbd2'.
			 */
			background_color : '#d6dbd2',
			/**
			 * @cfg {Number} Override the default as 4.
			 */
			shadow_offsetx : 4,
			/**
			 * @cfg {Number} Override the default as 2.
			 */
			shadow_offsety : 2,
			/**
			 * @cfg {Array} Specifies the style of board(wall) of this coordinate. the array length must be 3 and each object option has two property. Available property are:
			 * @Option color the color of wall
			 * @Option alpha the opacity of wall
			 */
			wall_style : [],
			/**
			 * @cfg {Boolean} Override the default as axis.enable = false.
			 */
			axis : {
				enable : false
			}
		});
	},
	doDraw : function(opts) {
		var _ = this._(), w = _.get('width'), h = _.get('height'), xa = _.get('xAngle_'), ya = _.get('yAngle_'), zh = _.get('zHeight'), offx = xa * zh, offy = ya * zh;
		/**
		 * bottom
		 */
		_.T.cube3D(_.x, _.y + h + _.get('pedestal_height'), xa, ya, false, w, _.get('pedestal_height'), zh * 3 / 2, _.get('axis.enable'), _.get('axis.width'), _.get('axis.color'), _.get('bottom_style'));
		/**
		 * board_style
		 */
		_.T.cube3D(_.x + _.get('board_deep') * xa, _.y + h - _.get('board_deep') * ya, xa, ya, false, w, h, zh, _.get('axis.enable'), _.get('axis.width'), _.get('axis.color'), _.get('board_style'));

		_.T.cube3D(_.x, _.y + h, xa, ya, false, w, h, zh, _.get('axis.enable'), _.get('axis.width'), _.get('axis.color'), _.get('wall_style'));
		
		_.gridlines.each(function(g) {
			_.T.line(g.x1, g.y1, g.x1 + offx, g.y1 - offy, _.get('grid_line_width'), _.get('grid_color'));
			_.T.line(g.x1 + offx, g.y1 - offy, g.x2 + offx, g.y2 - offy, _.get('grid_line_width'), _.get('grid_color'));
		});

		_.scale.each(function(s) {
			s.draw()
		});
	},
	doConfig : function() {
		$.Coordinate3D.superclass.doConfig.call(this);

		var _ = this._(), ws = _.get('wall_style'), bg = _.get('background_color'), c = $.dark(bg, 0.1), c1 = _.get('dark_color'), h = _.get('height'), w = _.get('width');

		if (ws.length < 3) {
			ws = _.push('wall_style', [{
				color : c
			}, {
				color : bg
			}, {
				color : c
			}]);
		}

		var dark = ws[0].color;

		/**
		 * 右-前
		 */
		_.push('bottom_style', [{
			shadow : _.get('shadow')
		}, false, false, {
			color : dark
		}, {
			color : dark
		}, {
			color : dark
		}]);

		/**
		 * 上-右
		 */
		_.push('board_style', [false, false, false, {
			color : dark
		}, {
			color : bg
		}, false]);
		/**
		 * 下底-底-左-右-上-前
		 */
		if (_.get('gradient')) {
			var offx = _.get('xAngle_') * _.get('zHeight'), offy = _.get('yAngle_') * _.get('zHeight'), bs = _.get('bottom_style');
			if ($.isString(ws[0].color)) {
				ws[0].color = _.T.avgLinearGradient(_.x, _.y + h, _.x + w, _.y + h, [dark, c1]);
			}
			if ($.isString(ws[1].color)) {
				ws[1].color = _.T.avgLinearGradient(_.x + offx, _.y - offy, _.x + offx, _.y + h - offy, [c1, _.get('light_color')]);
			}
			if ($.isString(ws[2].color)) {
				ws[2].color = _.T.avgLinearGradient(_.x, _.y, _.x, _.y + h, [bg, c1]);
			}
			bs[5].color = _.T.avgLinearGradient(_.x, _.y + h, _.x, _.y + h + _.get('pedestal_height'), [bg, c]);
		}

	}
});
/*
 * @end
 */


	/**
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
				/**
				 * @cfg {Number} Specifies the width of this element in pixels,Normally,this will given by chart.(default to 0)
				 */
				width:0,
				/**
				 * @cfg {Number} Specifies the height of this element in pixels,Normally,this will given by chart.(default to 0)
				 */
				height:0,
				/**
				 * @cfg {Number} the distance of column's edge and value in pixels.(default to 4)
				 */
				value_space:4,
				/**
				 * @cfg {String} Specifies the text of this element,Normally,this will given by chart.(default to '')
				 */
				value:'',
				/**
				 * @cfg {String} Specifies the name of this element,Normally,this will given by chart.(default to '')
				 */
				name:'',
				/**
				 * @cfg {String} Specifies the tip alignment of chart(defaults to 'top').Available value are:
				 * @Option 'left'
				 * @Option 'right'
				 * @Option 'top'
				 * @Option 'bottom'
				 */
				tipAlign:'top',
				/**
				 * @cfg {String} Specifies the value's text alignment of chart(defaults to 'top') Available value are:
				 * @Option 'left'
				 * @Option 'right'
				 * @Option 'top'
				 * @Option 'bottom'
				 */
				valueAlign:'top',
				/**
				 * @inner
				 */
				textAlign:'center',
				/**
				 * @inner
				 */
				textBaseline:'top',
				/**
				 * @cfg {Number} Override the default as 3
				 */
				shadow_blur:3,
				/**
				 * @cfg {Number} Override the default as -1
				 */
				shadow_offsety:-1
			});
			
			/**
			 * this element support boxMode
			 */
			this.atomic = true;
			
			this.registerEvent(
					/**
					 * @event Fires when draw label's text.Return text will override existing text.
					 * @paramter $.Rectangle#rect
					 * @paramter string#text the current label's text
					 */
					'drawText');
			
		},
		doDraw:function(opts){
			this.drawRectangle();
			this.drawValue();
		},
		doConfig:function(){
			$.Rectangle.superclass.doConfig.call(this);
			$.Assert.gtZero(this.get('width'),'width');
			var _ = this._(),v = _.variable.event;
			
			_.width = _.get('width');
			_.height = _.get('height');
			
			_.push('centerx',_.x + _.width/2);
			_.push('centery',_.y + _.height/2);
			
			if(_.get('tip.enable')){
				if(_.get('tip.showType')!='follow'){
					_.push('tip.invokeOffsetDynamic',false);
				}
				_.tip = new $.Tip(_.get('tip'),_);
			}
			
			v.highlight = false;
			
			_.on('mouseover',function(){
				//console.time('mouseover');
				v.highlight = true;
				_.redraw();
				v.highlight = false;
				//console.timeEnd('mouseover');
			}).on('mouseout',function(){
				//console.time('mouseout');
				v.highlight = false;
				_.redraw();
				//console.timeEnd('mouseout');
			});
			
			_.on('beforedraw',function(){
				_.push('f_color',v.highlight?_.get('light_color'):_.get('f_color_'));
				return true;
			});
		}
});
	/**
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
				/**
				 * @cfg {Number} Override the default as -2
				 */
				shadow_offsety:-2
			});
			
		},
		drawValue:function(){
			if(this.get('value')!=''){
				this.T.text(this.fireString(this, 'drawText', [this, this.get('value')], this.get('value')),this.get('value_x'),this.get('value_y'),false,this.get('color'),this.get('textAlign'),this.get('textBaseline'),this.get('fontStyle'));
			}
		},
		drawRectangle:function(){
			this.T.box(
				this.get('originx'),
				this.get('originy'),
				this.get('width'),
				this.get('height'),
				this.get('border'),
				this.get('f_color'),
				this.get('shadow'));
		},
		isEventValid:function(e){
			return {valid:e.x>this.x&&e.x<(this.x+this.width)&&e.y<(this.y+this.height)&&e.y>(this.y)};
		},
		tipInvoke:function(){
			var _ = this;
			/**
			 * base on event?
			 */
			return function(w,h){
				return {
					left:_.tipX(w,h),
					top:_.tipY(w,h)
				}
			}
		},
		doConfig:function(){
			$.Rectangle2D.superclass.doConfig.call(this);
			var _ = this,tipAlign = _.get('tipAlign'),valueAlign=_.get('valueAlign');
			if(tipAlign=='left'||tipAlign=='right'){
				_.tipY = function(w,h){return _.get('centery') - h/2;};
			}else{
				_.tipX = function(w,h){return _.get('centerx') -w/2;};
			}
			
			if(tipAlign=='left'){
				_.tipX = function(w,h){return _.x - _.get('value_space') -w;};
			}else if(tipAlign=='right'){
				_.tipX = function(w,h){return _.x + _.width + _.get('value_space');};
			}else if(tipAlign=='bottom'){
				_.tipY = function(w,h){return _.y  +_.height+3;};
			}else{
				_.tipY = function(w,h){return _.y  - h -3;};
			}
			
			_.applyGradient();
			
			if(valueAlign=='left'){
				_.push('textAlign','right');
				_.push('value_x',_.x - _.get('value_space'));
				_.push('value_y',_.get('centery'));
			}else if(valueAlign=='right'){
				_.push('textAlign','left');
				_.push('textBaseline','middle');
				_.push('value_x',_.x + _.width + _.get('value_space'));
				_.push('value_y',_.get('centery'));
			}else if(valueAlign=='bottom'){
				_.push('value_x',_.get('centerx'));
				_.push('value_y',_.y  + _.height + _.get('value_space'));
				_.push('textBaseline','top');
			}else{
				_.push('value_x',_.get('centerx'));
				_.push('value_y',_.y  - _.get('value_space'));
				_.push('textBaseline','bottom');
			}
			
			_.valueX = _.get('value_x');
			_.valueY = _.get('value_y');
		}
});
	/**
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
				/**
				 * @cfg {Number} Specifies Three-dimensional z-axis deep in pixels.Normally,this will given by chart.(default to undefined)
				 */
				zHeight:undefined,
				/**
				 * @cfg {Number} Three-dimensional rotation X in degree(angle).socpe{0-90}.Normally,this will given by chart.(default to 60)
				 */
				xAngle:60,
				/**
				 * @cfg {Number} Three-dimensional rotation Y in degree(angle).socpe{0-90}.Normally,this will given by chart.(default to 20)
				 */
				yAngle:20,
				xAngle_:undefined,
				yAngle_:undefined,
				/**
				 * @cfg {Number} Override the default as 2
				 */
				shadow_offsetx:2
			});
			
		},
		drawValue:function(){
			if(this.get('value')!='')
			this.T.text(this.get('value'),this.get('centerx'),this.topCenterY + this.get('value_space'),false,this.get('color'),'center','top',this.get('fontStyle'));
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
				this.get('f_color'),
				this.get('border.enable'),
				this.get('border.width'),
				this.get('light_color'),
				this.get('shadow')
			);
		},
		isEventValid:function(e){
			return {valid:e.x>this.x&&e.x<(this.x+this.get('width'))&&e.y<this.y+this.get('height')&&e.y>this.y};
		},
		tipInvoke:function(){
			var _ = this._();
			return function(w,h){
				return {
					left:_.topCenterX - w/2,
					top:_.topCenterY - h
				}
			}
		},
		doConfig:function(){
			$.Rectangle3D.superclass.doConfig.call(this);
			var _ = this._();
			_.pushIf("zHeight",_.get('width'));
			
			_.topCenterX=_.x+(_.get('width')+_.get('width')*_.get('xAngle_'))/2;
			
			_.topCenterY=_.y-_.get('width')*_.get('yAngle_')/2;
			
		}
});
/**
 * @overview this component use for abc
 * @component#$.Sector
 * @extend#$.Component
 */
$.Sector = $.extend($.Component, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Sector.superclass.configure.apply(this, arguments);

		/**
		 * indicate the component's type
		 */
		this.type = 'sector';

		this.set({
			/**
			 * @cfg {String} Specifies the value of this element,Normally,this will given by chart.(default to '')
			 */
			value:'',
			/**
			 * @cfg {String} Specifies the name of this element,Normally,this will given by chart.(default to '')
			 */
			name:'',
			/**
			 * @inner {Boolean} True to make sector counterclockwise.(default to false)
			 */
			counterclockwise : false,
			/**
			 * @cfg {Number} Specifies the start angle of this sector.Normally,this will given by chart.(default to 0)
			 */
			startAngle : 0,
			/**
			 * @cfg {Number} middleAngle = (endAngle - startAngle)/2.Normally,this will given by chart.(default to 0)
			 */
			middleAngle : 0,
			/**
			 * @cfg {Number} Specifies the end angle of this sector.Normally,this will given by chart.(default to 0)
			 */
			endAngle : 0,
			/**
			 * @cfg {Number} Specifies total angle of this sector,totalAngle = (endAngle - startAngle).Normally,this will given by chart.(default to 0)
			 */
			totalAngle : 0,
			/**
			 * @cfg {String} the event's name trigger pie bound(default to 'click').
			 */
			bound_event : 'click',
			/**
			 * @cfg {Boolean} True to bound this sector.(default to false)
			 */
			expand : false,
			/**
			 * @cfg {Number} Specifies the width when show a donut.only applies when it not 0.(default to 0)
			 */
			donutwidth : 0,
			/**
			 * @cfg {Boolean} If true means just one piece could bound at same time.(default to false)
			 */
			mutex : false,
			/**
			 * @cfg {Number} Specifies the offset when bounded.Normally,this will given by chart.(default to undefined)
			 */
			increment : undefined,
			/**
			 * @cfg {String} Specifies the gradient mode of background.(defaults to 'RadialGradientOutIn')
			 * @Option 'RadialGradientOutIn'
			 * @Option 'RadialGradientInOut'
			 */
			gradient_mode:'RadialGradientOutIn',
			/**
			 * @cfg {Object} Specifies the config of label.For details see <link>$.Label</link>
			 * Note:this has a extra property named 'enable',indicate whether label available(default to true)
			 */
			label : {
				enable : true
			}
		});

		/**
		 * this element support boxMode
		 */
		this.atomic = true;

		this.registerEvent('changed');

		this.label = null;
		this.tip = null;
	},
	bound : function() {
		if (!this.expanded)
			this.toggle();
	},
	rebound : function() {
		if (this.expanded)
			this.toggle();
	},
	toggle : function() {
		this.fireEvent(this, this.get('bound_event'), [this]);
	},
	/**
	 * @method return the sector's dimension,return hold following property
	 * @property x:the x-coordinate of the center of the sector
	 * @property y:the y-coordinate of the center of the sector
	 * @property startAngle:The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
	 * @property endAngle:the ending angle, in radians
	 * @property middleAngle:the middle angle, in radians
	 * @return object
	 */
	getDimension:function(){
		return {
			x:this.x,
			x:this.y,
			startAngle:this.get("startAngle"),
			middleAngle:this.get("middleAngle"),
			endAngle:this.get("endAngle")
		}
	},
	doDraw : function(opts) {
		this.drawSector();
		if (this.label) {
			/**
			 * draw the labels
			 */
			this.label.draw();
		}
	},
	labelInvoke:function(f){
		var A = this.get('middleAngle'),l=this.label;
		x = this.get('inc_x')*f,
		y = -this.get('inc_y')*f;
		
		l.push('originx',l.get('originx')+x);
		l.push('originy',l.get('originy')+y);
		l.push('labelx',l.get('labelx')+x);
		l.push('labely',l.get('labely')+y);
		var p =[];
		l.get('line_potins').each(function(v, i){
			p.push(i%2==0?(v+x):(v+y));
		},l);
		l.push('line_potins',p);
	},
	doConfig : function() {
		$.Sector.superclass.doConfig.call(this);

		var _ = this._(),v = _.variable.event;

		_.push('totalAngle', _.get('endAngle') - _.get('startAngle'));


		if(_.get('label.enable')){
			_.pushIf('label.border.color',_.get('border.color'));
			/**
			 * make the label's color in accord with sector
			 */
			_.push('label.scolor', _.get('f_color'));
		}
		_.variable.event.status = _.expanded = _.get('expand');

		if (_.get('tip.enable')) {
			if (_.get('tip.showType') != 'follow') {
				_.push('tip.invokeOffsetDynamic', false);
			}
			_.tip = new $.Tip(_.get('tip'), _);
		}

		v.poped = false;

		_.on(_.get('bound_event'), function() {
			// console.profile('Test for pop');
				//console.time('Test for pop');
				v.poped = true;
				_.expanded = !_.expanded;
				_.redraw();
				v.poped = false;
				 //console.timeEnd('Test for pop');
				// console.profileEnd('Test for pop');
			});
		
		_.on('mouseover',function(){
			v.highlight = true;
			_.redraw();
			v.highlight = false;
		}).on('mouseout',function(){
			v.highlight = false;
			_.redraw();
		});
		
		_.on('beforedraw', function() {
			_.push('f_color',v.highlight?_.get('light_color'):_.get('f_color_'));
			_.x = _.get('originx');
			_.y = _.get('originy');
			if (v.status != _.expanded) {
				_.fireEvent(_, 'changed', [_, _.expanded]);
				if(_.get('label.enable'))
				_.labelInvoke((_.expanded?1:-1));
			}
			v.status = _.expanded;
			if (_.expanded) {
				if (_.get('mutex') && !v.poped) {
					_.expanded = false;
				} else {
					_.x += _.get('inc_x');
					_.y -= _.get('inc_y');
				}
			}
			return true;
		});

	}
});// @end

	/**
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
				/**
				 * @cfg {Float (0~)} Specifies the sector's radius.Normally,this will given by chart.(default to 0)
				 */
				radius:0
			});
			
		},
		drawSector:function(){
			this.T.sector(
					this.x,
					this.y,
					this.r,
					this.get('donutwidth'),
					this.get('startAngle'),
					this.get('endAngle'),
					this.get('f_color'),
					this.get('border.enable'),
					this.get('border.width'),
					this.get('border.color'),
					this.get('shadow'),
					this.get('counterclockwise'));
		},
		
		isEventValid:function(e){
			if(this.label&&this.label.isEventValid(e).valid)
				return {valid:true};
			var r = $.distanceP2P(this.x,this.y,e.x,e.y),b=this.get('donutwidth');	
			if(this.r<r||(b&&(this.r-b)>r)){
				return {valid:false};
			}
			if($.angleInRange(this.get('startAngle'),this.get('endAngle'),(2*Math.PI - $.atan2Radian(this.x,this.y,e.x,e.y)))){
				return {valid:true};
			}
			return {valid:false};
		},
		tipInvoke:function(){
			var _ = this;
			return function(w,h){
				var P = $.p2Point(this.x,this.y,this.get('middleAngle'),this.r*0.8),Q  = $.quadrantd(this.get('middleAngle'));
				return {
					left:(Q>=2&&Q<=3)?(P.x - w):P.x,
					top:Q>=3?(P.y - h):P.y
				}
			}
		},
		doConfig:function(){
			$.Sector2D.superclass.doConfig.call(this);
			var _ = this._();
			_.r = _.get('radius');
			
			$.Assert.gtZero(_.r);
			
			if(_.get('donutwidth')>_.r){
				_.push('donutwidth',0);
			}
			
			_.applyGradient(_.x-_.r,_.y-_.r,2*_.r,2*_.r);
			
			_.pushIf('increment',$.lowTo(5,_.r/10));
			
			var A = _.get('middleAngle'),inc = _.get('increment');
			_.push('inc_x',inc * Math.cos(2 * Math.PI -A));
			_.push('inc_y',inc * Math.sin(2 * Math.PI - A));
			
			if(_.get('label.enable')){
				_.pushIf('label.linelength',$.lowTo(10,_.r/8));
				Q  = $.quadrantd(A),
				
				P2 = $.p2Point(_.x,_.y,A,_.get('donutwidth')?_.r - _.get('donutwidth')/2:_.r/2);
				
				_.push('label.originx',P2.x);
				_.push('label.originy',P2.y);
				_.push('label.quadrantd',Q);
				
				var P = $.p2Point(_.x,_.y,A,_.r + _.get('label.linelength'));
				_.push('label.line_potins',[P2.x,P2.y,P.x,P.y]);
				_.push('label.labelx',P.x);
				_.push('label.labely',P.y);
				
				_.label = new $.Label(_.get('label'),_);
			}
		}
});
	/**
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
				 * @cfg {Number}  Specifies major semiaxis of ellipse.Normally,this will given by chart.(default to 0)
				 */
				semi_major_axis:0,
				/**
				 * @cfg {Number} Specifies minor semiaxis of ellipse.Normally,this will given by chart.(default to 0)
				 */
				semi_minor_axis:0,
				/**
				 * @cfg {Float (0~)} Specifies the sector's height(thickness).Normally,this will given by chart.(default to 0)
				 */
				cylinder_height:0
			});
			
			
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
					this.get('f_color'),
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
			if(!$.inEllipse(e.x - this.x,e.y-this.y,this.a,this.b)){
				return {valid:false};
			}
			if($.angleInRange(this.sA,this.eA,(2*Math.PI - $.atan2Radian(this.x,this.y,e.x,e.y)))){
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
			var _ =  this,A =  _.get('middleAngle'),Q  = $.quadrantd(A);
			return function(w,h){
				var P = _.p2p(_.x,_.y,A,0.6);
				return {
					left:(Q>=2&&Q<=3)?(P.x - w):P.x,
					top:Q>=3?(P.y - h):P.y
				}
			}
		},
		doConfig:function(){
			$.Sector3D.superclass.doConfig.call(this);
			var _ = this._(),ccw = _.get('counterclockwise'),mA = _.get('middleAngle');
			
			_.a = _.get('semi_major_axis');
			_.b = _.get('semi_minor_axis');
			_.h = _.get('cylinder_height');
			
			$.Assert.gtZero(_.a);
			$.Assert.gtZero(_.b);
			
			_.pushIf('increment',$.lowTo(5,_.a/8));
			
			var toAngle = function(A){
				var t = $.atan2Radian(0,0,_.a*Math.cos(A),ccw?(-_.b*Math.sin(A)):(_.b*Math.sin(A)));
				if(!ccw&&t!=0){
					t = 2*Math.PI - t;
				}
				return t;
			},
			
			inc = _.get('increment');
			
			_.sA = toAngle.call(_,_.get('startAngle'));
			_.eA = toAngle.call(_,_.get('endAngle'));
			_.mA = toAngle.call(_,mA);
			
			_.push('inc_x',inc * Math.cos(2 * Math.PI -_.mA));
			_.push('inc_y',inc * Math.sin(2 * Math.PI - _.mA));
			
			if(_.get('label.enable')){
				_.pushIf('label.linelength',$.lowTo(10,_.a/8));
				_.Z = _.get('label.linelength')/_.a+1;
				var Q  = $.quadrantd(mA),
				P = _.p2p(_.x,_.y,mA,_.Z),
				P2 = _.p2p(_.x,_.y,mA,1);
				
				_.push('label.originx',P2.x);
				_.push('label.originy',P2.y);
				_.push('label.quadrantd',Q);
				
				_.push('label.line_potins',[P2.x,P2.y,P.x,P.y]);
				_.push('label.line_globalComposite',(ccw&&mA<Math.PI)||(!ccw&&mA>Math.PI));
				_.push('label.labelx',P.x);
				_.push('label.labely',P.y);
				
				_.label = new $.Label(_.get('label'),_);
			}
		}
});
/**
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
		this.dataType = 'simple';

		this.set({
			/**
			 * @cfg {Float (0~)} Specifies the pie's radius.(default to calculate by the size of chart)
			 */
			radius : 0,
			/**
			 * @cfg {Number} initial angle for first sector
			 */
			offsetAngle : 0,
			/**
			 * @cfg {String} the event's name trigger pie pop(default to 'click')
			 */
			bound_event : 'click',
			/**
			 * @inner {Boolean} True to make sector counterclockwise.(default to false)
			 */
			counterclockwise : false,
			/**
			 * @cfg {Boolean} 当与其他label有位置冲突时自动浮动其位置.(default to true).
			 */
			intellectLayout : true,
			/**
			 * @cfg {Number} Specifies the distance in pixels when two label is incompatible with each other.(default 8),
			 */
			layout_distance : 8,
			/**
			 * @inner {Boolean} if it has animate when a piece popd (default to false)
			 */
			pop_animate : false,
			/**
			 * @cfg {Boolean} Specifies as true it means just one piece could pop (default to false)
			 */
			mutex : false,
			/**
			 * @cfg {Number} Specifies the length when sector bounded.(default to 1/8 radius,and minimum is 5),
			 */
			increment : undefined,
			/**
			 * @cfg {Object} Specifies the config of label.For details see <link>$.Label</link> Note:this has a extra property named 'enable',indicate whether label available(default to true)
			 */
			label : {
				enable : true
			},
			/**
			 * @cfg {Object} option of sector.Note,Pie2d depend on Sector2d and pie3d depend on Sector3d.For details see <link>$.Sector</link>
			 */
			sector : {}
		});

		this.registerEvent(
		/**
		 * @event Fires when this element' sector bounded
		 * @paramter <link>$.Sector2d</link>#sector
		 * @paramter string#name
		 * @paramter int#index
		 */
		'bound',
		/**
		 * @event Fires when this element' sector rebounded
		 * @paramter <link>$.Sector2d</link>#sector
		 * @paramter string#name
		 * @paramter int#index
		 */
		'rebound',
		/**
		 * @event Fires when parse this label's data.Return value will override existing. Only valid when label is available
		 * @paramter Object#data this label's data item
		 * @paramter string#text the current tip's text
		 * @paramter int#i the index of data
		 */
		'parseLabelText');

	},
	/**
	 * @method Toggle sector bound or rebound by a specific index.
	 * @paramter int#i the index of sector
	 * @return void
	 */
	toggle : function(i) {
		this.data[i || 0].reference.toggle();
	},
	/**
	 * @method bound sector by a specific index.
	 * @paramter int#i the index of sector
	 * @return void
	 */
	bound : function(i) {
		this.data[i || 0].reference.bound();
	},
	/**
	 * @method rebound sector by a specific index.
	 * @paramter int#i the index of sector
	 * @return void
	 */
	rebound : function(i) {
		this.data[i || 0].reference.rebound();
	},
	/**
	 * @method Returns an array containing all sectors of this pie
	 * @return Array#the collection of sectors
	 */
	getSectors : function() {
		return this.sectors;
	},
	doAnimation : function(t, d) {
		var s, si = 0, cs = this.oA;
		this.data.each(function(D, i) {
			s = D.reference;
			si = this.animationArithmetic(t, 0, s.get('totalAngle'), d);
			s.push('startAngle', cs);
			s.push('endAngle', cs + si);
			cs += si;
			if (!this.is3D())
				s.drawSector();
		}, this);
		if (this.is3D()) {
			this.proxy.drawSector();
		}
	},
	localizer : function(la) {
		var d = this.get('layout_distance');
		/**
		 * the code not optimization,need to enhance so that the label can fit the continar
		 */
		this.sectors.each(function(s, i) {
			var l = s.label, x = l.labelx, y = l.labely;
			if ((la.labely <= y && (y - la.labely) < la.get('height')) || (la.labely > y && (la.labely - y) < l.get('height'))) {
				if ((la.labelx < x && (x - la.labelx) < la.get('width')) || (la.labelx > x && (la.labelx - x) < l.get('width'))) {
					var q = la.get('quadrantd');
					if ((q == 1 || q == 2)) {
						/**
						 * console.log('upper..'+la.get('text')+'==='+l.get('text'));
						 */
						la.push('labely', la.get('labely') - la.get('height') + y - la.labely - d);
						la.push('line_potins', la.get('line_potins').concat(la.get('labelx'), la.get('labely')));
					} else {
						/**
						 * console.log('lower..'+la.get('text')+'==='+l.get('text'));
						 */
						la.push('labely', la.get('labely') + l.get('height') - la.labely + y + d);
						la.push('line_potins', la.get('line_potins').concat(la.get('labelx'), la.get('labely')));
					}
					la.localizer();
				}
			}
		}, this);
	},
	doParse : function(d, i) {
		var _ = this, t = d.name + (_.get('showpercent') ? ' ' + $.toPercent(d.value / _.total, _.get('decimalsnum')) : d.value);
		if (_.get('label.enable')) {
			_.push('sector.label.text', _.fireString(_, 'parseLabelText', [d, i], t));
		}
		if (_.get('tip.enable'))
			_.push('sector.tip.text', _.fireString(_, 'parseTipText', [d, i], t));

		_.push('sector.id', i);
		_.push('sector.value', d.value);
		_.push('sector.name', d.name);
		_.push('sector.listeners.changed', function(se, st, i) {
			_.fireEvent(_, st ? 'bound' : 'rebound', [_, se.get('name')]);
		});
		_.push('sector.startAngle', d.startAngle);
		_.push('sector.middleAngle', d.middleAngle);
		_.push('sector.endAngle', d.endAngle);
		_.push('sector.background_color', d.color);

		d.reference = this.doSector(d);

		this.sectors.push(d.reference);

		if (this.get('label.enable') && this.get('intellectLayout')) {
			this.localizer(d.reference.label);
		}
	},
	doConfig : function() {
		$.Pie.superclass.doConfig.call(this);
		$.Assert.gtZero(this.total, 'this.total');
		
		var _ = this._(),r = _.get('radius'), f = _.get('label.enable') ? 0.35 : 0.44;
		
		_.sectors = [];
		_.sectors.zIndex = _.get('z_index');

		_.oA = $.angle2Radian(_.get('offsetAngle'));
		
		//If 3D,let it bigger
		if (_.is3D())
			f += 0.06;
		
		f = _.get('minDistance') * f;
		
		var eA = _.oA, sA = eA, L = _.data.length;
		
		_.data.each(function(d, i) {
			eA += (2 * d.value / _.total) * Math.PI;
			if (i == (L - 1)) {
				eA = 2 * Math.PI + _.oA;
			}
			d.startAngle = sA;
			d.endAngle = eA;
			d.totalAngle = eA - sA;
			d.middleAngle = (sA + eA) / 2;
			sA = eA;
		}, _);
		
		
		/**
		 * calculate pie chart's radius
		 */
		if (r <= 0 || r > f) {
			r = _.push('radius', Math.floor(f));
		}
		
		_.r = r;
		
		/**
		 * calculate pie chart's alignment
		 */
		if (_.get('align') == 'left') {
			_.push('originx', r + _.get('l_originx') + _.get('offsetx'));
		} else if (_.get('align') == 'right') {
			_.push('originx', _.get('r_originx') - r + _.get('offsetx'));
		} else {
			_.push('originx', _.get('centerx') + _.get('offsetx'));
		}
		_.push('originy', _.get('centery') + _.get('offsety'));

		$.apply(_.get('sector'), $.clone(_.get('communal_option').concat(['originx', 'originy', 'bound_event', 'customize_layout', 'counterclockwise', 'mutex', 'increment', 'label']), _.options));
		
	}
});
/** @end */

/**
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

	},
	doSector:function(){
		return  new $.Sector2D(this.get('sector'), this);
	},
	doConfig : function() {
		$.Pie2D.superclass.doConfig.call(this);
		/**
		 * quick config to all rectangle
		 */
		this.push('sector.radius',this.r)
		
		this.data.each(function(d,i){
			this.doParse(d,i);
		},this);
		
		this.components.push(this.sectors);
	}
});
/**
 * @overview this component use for abc
 * @component#@chart#$.Pie3D
 * @extend#$.Pie
 */
$.Pie3D = $.extend($.Pie, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Pie3D.superclass.configure.apply(this, arguments);

		/**
		 * indicate the legend's type
		 */
		this.type = 'pie3d';
		this.dimension = $._3D;

		this.set({
			/**
			 * @cfg {Number} Three-dimensional rotation Z in degree(angle).socpe{0-90}.(default to 45)
			 */
			zRotate : 45,
			/**
			 * @cfg {Number} Specifies the pie's thickness in pixels.(default to 30)
			 */
			yHeight : 30
		});

	},
	doSector : function(d) {
		this.push('sector.cylinder_height', (d.height ? d.height * Math.cos($.angle2Radian(this.get('zRotate'))) : this.get('cylinder_height')));
		var s = new $.Sector3D(this.get('sector'), this);
		s.proxy = true;
		return s;
	},
	doConfig : function() {
		$.Pie3D.superclass.doConfig.call(this);
		var _ = this, z = _.get('zRotate');
		_.push('zRotate', $.between(0, 90, 90 - z));
		_.push('cylinder_height', _.get('yHeight') * Math.cos($.angle2Radian(z)));
		_.push('sector.semi_major_axis', _.r);
		_.push('sector.semi_minor_axis', _.r * z / 90);
		_.push('sector.semi_major_axis', _.r);
		_.push('sector.originy',_.get('originy')-_.get('yHeight')/2);
		
		_.data.each(function(d, i) {
			_.doParse(d, i);
		}, _);

	
	var layer = [],L=[],PI = Math.PI,PI2=PI*2,a = PI/2,b = PI*1.5,c = _.get('counterclockwise'),
	abs = function(n,f){
		n = Math.abs(n-f);
		return n>PI?PI2-n:n;
	},t='startAngle',d='endAngle';
	
	
	_.proxy = new $.Custom({
			z_index:_.get('z_index')+1,
			drawFn : function() {
				this.drawSector();
				/**
				 * draw the labels
				 */
				if (_.get('label.enable')) {
					L=[];
					_.sectors.each(function(s) {
						if(s.expanded){
							L.push(s.label);
						}else{
							s.label.draw();
						}
					});
					L.each(function(l) {
						l.draw();
					});
					
				}
			}
	});
	
	_.proxy.drawSector = function(){
		/**
		 * paint bottom layer
		 */
		_.sectors.each(function(s, i) {
			_.T.ellipse(s.x, s.y + s.h, s.a, s.b, s.get(t), s.get(d), s.get('f_color'), s.get('border.enable'), s.get('border.width'), s.get('border.color'), s.get('shadow'), c, true);
		}, _);
		
		layer = [];
		var s,e;
		/**
		 * sort layer
		 */
		_.sectors.each(function(f, i) {
			f.sPaint = false;
			s = f.get(t);e = f.get(d),fc = $.dark(f.get('background_color'));
			if(c ? (s < a || s > b) : (s > a && s < b)){
				layer.push({g:s,x:f.x,y:f.y,a:f.a,b:f.b,color:fc,h:f.h,F:f});
			}
			if(c ? (e > a && e < b) : (e < a || e > b)){
				layer.push({g:e,x:f.x,y:f.y,a:f.a,b:f.b,color:fc,h:f.h,F:f});
			}
		}, _);
		
		/**
		 * realtime sort
		 */
		layer.sor(function(p, q){return ((abs(p.g,b) - abs(q.g,b))>0)});
		
		/**
		 * paint inside layer
		 */
		layer.each(function(f, i) {
			_.T.sector3D.layerDraw.call(_.T, f.x, f.y, f.a+0.5, f.b+0.5, c, f.h, f.g, f.color);
			if(!f.F.sPaint){
				_.T.sector3D.sPaint.call(_.T, f.F.x, f.F.y, f.F.a, f.F.b, f.F.get(t), f.F.get(d), false, f.F.h, f.color);
				f.F.sPaint = true;
			}
		}, _);
		
		/**
		 * paint outside layer
		 */
		_.sectors.each(function(s, i) {
			if(!s.sPaint)
			_.T.sector3D.sPaint.call(_.T, s.x, s.y, s.a, s.b, s.get(t), s.get(d), false, s.h, s.get('f_color'));
		}, _);
		
		/**
		 * paint top layer
		 */
		_.sectors.each(function(s, i) {
			_.T.ellipse(s.x, s.y, s.a, s.b, s.get(t), s.get(d), s.get('f_color'), s.get('border.enable'), s.get('border.width'), s.get('border.color'), false, false, true);
		}, _);
	}
	
	_.components.push(_.sectors);
	_.components.push(_.proxy);
}
});// @end

/**
 * @overview this component use for show a donut chart
 * @component#@chart#$.Donut2D
 * @extend#$.Pie
 */
$.Donut2D = $.extend($.Pie, {
	/**
	 * initialize the context for the pie2d
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Donut2D.superclass.configure.call(this);
		
		this.type = 'pie2d';
		
		this.set({
			/**
			 * @cfg {Number} Specifies the width when show a donut.If the value lt 1,It will be as a percentage,value will be radius*donutwidth.only applies when it not 0.(default to 0.3)
			 */
			donutwidth : 0.3
		});
	},
	doSector:function(){
		return  new $.Sector2D(this.get('sector'), this);
	},
	doConfig : function() {
		$.Donut2D.superclass.doConfig.call(this);
		
		var _ = this._(),d='donutwidth',r = _.r;
		/**
		 * quick config to all rectangle
		 */
		_.push('sector.radius',r)
		if(_.get(d)>0){
			if(_.get(d)<1){
				_.push(d,Math.floor(r*_.get(d)));
			}else if(_.get(d)>=r){
				_.push(d,0);
			}
			_.push('sector.donutwidth',_.get(d));
		}
		
		
		_.data.each(function(d,i){
			_.doParse(d,i);
		},_);
		
		_.components.push(_.sectors);
	}
});
/**
 * @overview this component use for abc
 * @component#$.Column
 * @extend#$.Chart
 */
$.Column = $.extend($.Chart, {
	/**
	 * initialize the context for the Column
	 */
	configure : function(config) {
		/**
		 * invoked the super class's configuration
		 */
		$.Column.superclass.configure.call(this);

		this.type = 'column';
		this.dataType = 'simple';
		this.set({
			/**
			 * @cfg {Object} the option for coordinate. see <link>$.Coordinate2D</link>
			 */
			coordinate : {},
			/**
			 * @cfg {Number} the width of each column(default to calculate according to coordinate's width)
			 */
			colwidth : undefined,
			/**
			 * @cfg {Number} the distance of column's bottom and text(default to 6)
			 */
			text_space : 6,
			/**
			 * @cfg {String} the align of scale(default to 'left') Available value are:
			 * @Option 'left'
			 * @Option 'right'
			 */
			scaleAlign : 'left',
			/**
			 * @cfg {Object} option of rectangle.see <link>$.Rectangle</link>
			 */
			rectangle : {}
		});

		this.registerEvent();

	},
	doAnimation : function(t, d) {
		var _ = this._(), h;
		_.coo.draw();
		_.labels.each(function(l){
			l.draw();
		});
		_.rectangles.each(function(r){
			h = Math.ceil(_.animationArithmetic(t, 0, r.height, d));
			r.push('originy', r.y + (r.height - h));
			r.push('height', h);
			r.drawRectangle();
		});
	},
	/**
	 * @method Returns the coordinate of this element.
	 * @return $.Coordinate2D
	 */
	getCoordinate:function(){
		return this.coo;
	},
	doParse : function(_,d, i, id, x, y, h) {
		var t = (_.get('showpercent') ? $.toPercent(d.value / _.total, _.get('decimalsnum')) : d.value);
		if (_.get('tip.enable'))
			_.push('rectangle.tip.text', _.fireString(_, 'parseTipText', [d,d.value,i],d.name + ' '+t));
		
		_.set({
			rectangle:{
				id:id,
				name:d.name,
				value:t,
				background_color:d.color,
				originx:x,
				originy:y,
				height:h
			}
		});	
	},
	doConfig : function() {
		$.Column.superclass.doConfig.call(this);
		
		var _ = this._(),c = 'colwidth',z = 'z_index';
		
		_.rectangles = [];
		_.labels = [];
			
		/**
		 * apply the coordinate feature
		 */
		$.Coordinate.coordinate.call(_);
		
		_.rectangles.zIndex = _.get(z);
		
		_.labels.zIndex = _.get(z) + 1;
		
		
		if (_.dataType == 'simple') {
			var L = _.data.length, W = _.get('coordinate.width'), hw = _.pushIf(c, W / (L * 2 + 1));

			if (hw * L > W) {
				hw = _.push(c, W / (L * 2 + 1));
			}
			
			/**
			 * the space of two column
			 */
			_.push('hispace', (W - hw * L) / (L + 1));

		}

		if (_.is3D()) {
			_.push('zHeight', _.get(c) * _.get('zScale'));
		}
		
		/**
		 * use option create a coordinate
		 */
		_.coo = $.Coordinate.coordinate_.call(_);

		_.components.push(_.coo);
		
		/**
		 * quick config to all rectangle
		 */
		$.applyIf(_.get('rectangle'), $.clone(_.get('communal_option'), _.options));
		
		_.push('rectangle.width', _.get(c));
	}

});// @end

/**
 * @overview this component use for abc
 * @component#@chart#$.Column2D
 * @extend#$.Column
 */
$.Column2D = $.extend($.Column, {
	/**
	 * initialize the context for the Column2D
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Column2D.superclass.configure.call(this);

		this.type = 'column2d';
		
	},
	doConfig : function() {
		$.Column2D.superclass.doConfig.call(this);
		/**
		 * get the max/min scale of this coordinate for calculated the height
		 */
		var _ = this._(),S = _.coo.getScale(_.get('scaleAlign')), bs = _.coo.get('brushsize'), H = _.coo.get('height'), h2 = _.get('colwidth') / 2, gw = _.get('colwidth') + _.get('hispace'), h;
		
		_.data.each(function(d, i) {
			h = (d.value - S.start) * H / S.distance;
			_.doParse(_,d, i, i, _.x + _.get('hispace') + i * gw, _.y + H - h - bs, h);
			
			d.reference = new $.Rectangle2D(_.get('rectangle'), _);
			_.rectangles.push(d.reference);
			
			_.labels.push(new $.Text({
				id : i,
				text : d.name,
				originx : _.x + _.get('hispace') + gw * i + h2,
				originy : _.y + H + _.get('text_space')
			}, _));

		}, _);

		_.components.push(_.labels);
		_.components.push(_.rectangles);
	}

});// @end

	/**
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
			this.dimension = $._3D;
			
			this.set({
				/**
				 * @cfg {Number(0~90)} Three-dimensional rotation X in degree(angle).(default to 60)
				 */
				xAngle:60,
				/**
				 * @cfg {Number(0~90)} Three-dimensional rotation Y in degree(angle).(default to 20)
				 */
				yAngle:20,
				/**
				 * @cfg {Number} Three-dimensional z-axis deep factor.frame of reference is width.(default to 1)
				 */
				zScale:1,
				/**
				 * @cfg {Number(1~)} Three-dimensional z-axis deep factor of pedestal.frame of reference is width.(default to 1.4)
				 */
				bottom_scale:1.4
			});
		},
		doConfig:function(){
			$.Column3D.superclass.doConfig.call(this);
			
			//get the max/min scale of this coordinate for calculated the height
			var _ = this._(),S = _.coo.getScale(_.get('scaleAlign')),
				zh = _.get('zHeight')*(_.get('bottom_scale')-1)/2*_.get('yAngle_'),
				h2 = _.get('colwidth')/2,
				gw = _.get('colwidth')+_.get('hispace'),
				H = _.coo.get('height'),h;
			
			/**
			 * quick config to all rectangle
			 */
			_.push('rectangle.xAngle_',_.get('xAngle_'));
			_.push('rectangle.yAngle_',_.get('yAngle_'));
			
			_.data.each(function(d, i) {
				h = (d.value - S.start) * H / S.distance;
				
				_.doParse(_,d, i, i, _.x + _.get('hispace') + i * gw, _.y +(H-h)-zh, h);
				d.reference = new $.Rectangle3D(_.get('rectangle'), _);
				_.rectangles.push(d.reference);
				
				_.labels.push(new $.Text({
					id : i,
					text : d.name,
					originx : _.x + _.get('hispace') + gw * i + h2,
					originy : _.y + H + _.get('text_space')
				}, _));
				
			}, _);
			
			_.components.push(_.labels);
			_.components.push(_.rectangles);
		}
		
});
	/**
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
			
			//this.set({});
			
			//this.registerEvent();
			this.columns = [];
		},
		doRectangle : function(d, i, id, x, y, h) {
			this.doParse(d, i, id, x, y, h);
			d.reference = new $.Rectangle2D(this.get('rectangle'), this);
			this.rectangles.push(d.reference);
		},
		doConfig:function(){
			$.ColumnMulti2D.superclass.doConfig.call(this);
			
			var _ = this._(),
				L = _.data.length,
				KL= _.data_labels.length,
				W = _.get('coordinate.width'),
				H = _.get('coordinate.height'),
				total = KL*L,
				bw = _.pushIf('colwidth',W/(KL+1+total));
			
			if(bw*total>W){
				bw = _.push('colwidth',W/(KL+1+total));
			}
			
			_.push('hispace',(W - bw*total)/(KL+1));
			
			//get the max/min scale of this coordinate for calculated the height
			var S = _.coo.getScale(_.get('scaleAlign')),
				bs = _.coo.get('brushsize'),
				gw = _.data.length*bw+_.get('hispace'),
				h;
			
			/**
			 * quick config to all rectangle
			 */
			_.push('rectangle.width',bw);
			
			_.columns.each(function(column, i) {
				
				column.item.each(function(d, j) {
					h = (d.value - S.start) * H / S.distance;
					_.doParse(_,d, j, i+'-'+j, _.x + _.get('hispace')+j*bw+i*gw, _.y + H - h - bs, h);
					d.reference = new $.Rectangle2D(_.get('rectangle'), this);
					_.rectangles.push(d.reference);
					
				}, _);
				
				_.labels.push(new $.Text({
					id:i,
					text:column.name,
					originx:_.x +_.get('hispace')*0.5+(i+0.5)*gw,
	 				originy:_.get('originy')+H+_.get('text_space')
				},_));
				
			}, _);
			
			_.components.push(_.labels);
			_.components.push(_.rectangles);
		}
});
/**
 * @overview this component use for abc
 * @component#$.Bar
 * @extend#$.Chart
 */
$.Bar = $.extend($.Chart, {
	/**
	 * initialize the context for the bar
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Bar.superclass.configure.call(this);

		this.type = 'bar';
		this.dataType = 'simple';
		this.set({
			/**
			 * @cfg {Object} Specifies the option for coordinate.For details see <link>$.Coordinate2D</link>
			 */
			coordinate : {
				alternate_direction : 'h'
			},
			/**
			 * @cfg {Number} Specifies the width of each bar(default to calculate according to coordinate's height)
			 */
			barheight : undefined,
			/**
			 * @cfg {Number} Specifies the distance of bar's bottom and text(default to 6)
			 */
			text_space : 6,
			/**
			 * @cfg {String} Specifies the align of scale(default to 'bottom') Available value are:
			 * @Option 'top,'bottom'
			 */
			scaleAlign : 'bottom',
			/**
			 * @cfg {Object} option of rectangle.see <link>$.Rectangle</link>
			 */
			rectangle : {}
		});

		this.registerEvent();

	},
	doParse : function(_,d, i, id, x, y, w) {
		var t = (_.get('showpercent') ? $.toPercent(d.value / _.total, _.get('decimalsnum')) : d.value);
		
		if (_.get('tip.enable'))
			_.push('rectangle.tip.text', _.fireString(_, 'parseTipText', [d, d.value, i], d.name + ' ' + t));
		
		_.set({
			rectangle:{
				id:id,
				name:d.name,
				value:t,
				background_color:d.color,
				originy:y,
				width:w
			}
		});	
	},
	doAnimation : function(t, d) {
		this.coo.draw();
		this.labels.each(function(l, i) {
			l.draw();
		}, this);

		this.rectangles.each(function(r, i) {
			r.push('width', Math.ceil(this.animationArithmetic(t, 0, r.width, d)));
			r.drawRectangle();
		}, this);
	},
	doConfig : function() {
		$.Bar.superclass.doConfig.call(this);
		
		var _ = this._(),b = 'barheight',z = 'z_index';
		/**
		 * Apply the coordinate feature
		 */
		$.Coordinate.coordinate.call(_);
		
		_.rectangles = [];
		
		_.labels = [];
		
		_.rectangles.zIndex = _.get(z);
		
		_.labels.zIndex = _.get(z) + 1;

		if (_.dataType == 'simple') {

			var L = _.data.length, H = _.get('coordinate.height'), bh = _.pushIf(b, H / (L * 2 + 1));
			/**
			 * bar's height
			 */
			if (bh * L > H) {
				bh = _.push(b, H / (L * 2 + 1));
			}
			/**
			 * the space of two bar
			 */
			_.push('barspace', (H - bh * L) / (L + 1));
		}

		if (_.is3D()) {

		}
		/**
		 * use option create a coordinate
		 */
		_.coo = $.Coordinate.coordinate_.call(_);
		
		_.components.push(_.coo);

		/**
		 * Quick config to all rectangle
		 */
		$.applyIf(_.get('rectangle'), $.clone(_.get('communal_option'), _.options));
		
		/**
		 * quick config to all rectangle
		 */
		_.push('rectangle.height', bh);
		_.push('rectangle.valueAlign', 'right');
		_.push('rectangle.tipAlign', 'right');
		_.push('rectangle.originx', _.x + _.coo.get('brushsize'));

	}

});// @end

	
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
			
		},
		doConfig:function(){
			$.Bar2D.superclass.doConfig.call(this);
			
			/**
			 * get the max/min scale of this coordinate for calculated the height
			 */
			var _ = this._(),
				S = _.coo.getScale(_.get('scaleAlign')),
				W = _.coo.get('width'),
				h2 = _.get('barheight')/2,
				gw = _.get('barheight')+_.get('barspace');
			
			_.data.each(function(d, i) {
				_.doParse(_,d, i, i, 0, _.y+_.get('barspace')+i*gw, (d.value - S.start) * W / S.distance);
				d.reference = new $.Rectangle2D(_.get('rectangle'), _);
				_.rectangles.push(d.reference);
				
				_.labels.push(new $.Text({
					id:i,
					textAlign:'right',
					textBaseline:'middle',
					text:d.name,
					originx:_.x - _.get('text_space'),
	 				originy:_.y + _.get('barspace')+i*gw +h2
				},_));
			}, _);
			
			_.components.push(_.labels);
			_.components.push(_.rectangles);
		}
		
});
	/**
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
				
				this.columns = [];
			},
			doConfig:function(){
				$.BarMulti2D.superclass.doConfig.call(this);
				
				var _ = this._(),L = _.data.length,
					KL= _.data_labels.length,
					W = _.coo.get('width'),
					H = _.coo.get('height'),
					b = 'barheight',
					s = 'barspace',
					total = KL*L,
					/**
					 * bar's height
					 */
					bh = _.pushIf(b,H/(KL+1+total));
				if(bh*L>H){
					bh = _.push(b,H/(KL+1+total));
				}
				/**
				 * the space of two bar
				 */
				_.push(s,(H - bh*total)/(KL+1));
				/**
				 * get the max/min scale of this coordinate for calculated the height
				 */
				var S = _.coo.getScale(_.get('scaleAlign')),
					gw = L*bh+_.get(s),
					h2 = _.get(b)/2,
					w;
				_.push('rectangle.height',bh);
				_.columns.each(function(column, i) {
					column.item.each(function(d, j) {
						w = (d.value - S.start) * W / S.distance;
						_.doParse(_,d, j, i+'-'+j, _.x + _.get('hispace')+j*bh+i*gw,_.y + _.get(s)+j*bh+i*gw, w);
						d.reference = new $.Rectangle2D(_.get('rectangle'), _);
						_.rectangles.push(d.reference);
					}, _);
					
					_.labels.push(new $.Text({
						id:i,
						text:column.name,
						textAlign:'right',
						textBaseline:'middle',
						originx:_.x - _.get('text_space'),
		 				originy:_.y + _.get(s)*0.5+(i+0.5)*gw
					},_));
					
				}, _);
				
				_.components.push(_.labels);
				_.components.push(_.rectangles);
			}
			
	});
/**
 * Line ability for real-time show
 * 
 * @overview this component use for abc
 * @component#$.LineSegment
 * @extend#$.Component
 */
$.LineSegment = $.extend($.Component, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.LineSegment.superclass.configure.apply(this, arguments);

		/**
		 * indicate the component's type
		 */
		this.type = 'linesegment';

		this.set({
			/**
			 * @cfg {Boolean} If true there show a point when Line-line intersection(default to true)
			 */
			intersection : true,
			/**
			 * @cfg {Boolean} if the label displayed (default to false)
			 */
			label : false,
			/**
			 * @cfg {String} Specifies the shape of two line segment' point(default to 'round').Only applies when intersection is true Available value are:
			 * @Option 'round'
			 */
			sign : 'round',
			/**
			 * @cfg {Boolean} If true the centre of point will be hollow.(default to true)
			 */
			hollow : true,
			/**
			 * @cfg {String} Specifies the bgcolor when hollow applies true.(default to '#FEFEFE')
			 */
			hollow_color : '#FEFEFE',
			/**
			 * @cfg {Boolean} If true Line will smooth.(default to false)
			 */
			smooth : false,
			/**
			 * @cfg {Number} Specifies smoothness of line will be.(default to 1.5)
			 * 1 means control points midway between points, 2 means 1/3 from the point,formula is 1/(smoothing + 1) from the point
			 */
			smoothing : 1.5,
			/**
			 * @cfg {Number} Specifies the size of point.(default size 6).Only applies when intersection is true
			 */
			point_size : 6,
			/**
			 * @inner {Array} the set of points to compose line segment
			 */
			points : [],
			/**
			 * @inner {Boolean} If true the event accord width coordinate.(default to false)
			 */
			keep_with_coordinate : false,
			/**
			 * @cfg {Number} Override the default as 1
			 */
			shadow_blur : 1,
			/**
			 * @cfg {Number} Override the default as 1
			 */
			shadow_offsety : 1,
			/**
			 * @inner {Number} Specifies the space between two point
			 */
			point_space : 0,
			/**
			 * @inner {Object} reference of coordinate
			 */
			coordinate : null,
			/**
			 * @cfg {Number} Specifies the valid range of x-direction.(default to 0)
			 */
			event_range_x : 0,
			/**
			 * @cfg {Boolean} If true tip show when the mouse must enter the valid distance of axis y.(default to false)
			 */
			limit_y : false,
			/**
			 * @cfg {Number} Specifies the space between the tip and point.(default to 2)
			 */
			tip_offset : 2,
			/**
			 * @cfg {Number} Specifies the valid range of y-direction.(default to 0)
			 */
			event_range_y : 0
		});

		this.label = null;
		this.tip = null;
		this.ignored_ = false;
	},
	drawSegment : function() {
		var _ = this._(),p = _.get('points'),b=_.get('f_color'),h=_.get('brushsize');
		_.T.shadowOn(_.get('shadow'));
		if (_.get('area')) {
			var polygons = [_.x, _.y];
			p.each(function(q){
				polygons.push(q.x);
				polygons.push(q.y);
			});
			
			polygons.push(_.x + _.get('width'));
			polygons.push(_.y);
			
			_.T.polygon(_.get('light_color2'), false, 1, '', false,_.get('area_opacity'), polygons);
		}
		
		_.T[_.ignored_?"manyLine":"lineArray"](p,h, b, _.get('smooth'), _.get('smoothing'));
		
		if (_.get('intersection')) {
			var f = _.getPlugin('sign'),s=_.get('point_size'),j=_.get('hollow_color');
			p.each(function(q,i){
				if(!q.ignored){
					if(!f||!f.call(_,_.T,_.get('sign'),q.x, q.y,s,b)){
						if (_.get('hollow')) {
							_.T.round(q.x, q.y, s*3/8,_.get('hollow_color'),s/4,b);
						} else {
							_.T.round(q.x, q.y, s/2,b);
						}
					}
				}
			},_);
		}

		if (_.get('shadow')) {
			_.T.shadowOff();
		}
	},
	doDraw : function(opts) {
		this.drawSegment();
		if (this.get('intersection') && this.get('label')) {
			this.get('points').each(function(q,i){
				if(!q.ignored){
					this.T.text(q.value, q.x, q.y - this.get('point_size') * 3 / 2, false, this.get('f_color'), 'center', 'bottom', this.get('fontStyle'));
				}
			},this);
		}
	},
	isEventValid : function(e) {
		return {
			valid : false
		};
	},
	tipInvoke : function() {
		var x = this.x, y = this.y, o = this.get('tip_offset'), s = this.get('point_size') + o, _ = this;
		return function(w, h, m) {
			var l = m.left, t = m.top;
			l = ((_.tipPosition < 3 && (m.left - w - x - o > 0)) || (_.tipPosition > 2 && (m.left - w - x - o < 0))) ? l - (w + o) : l + o;
			t = _.tipPosition % 2 == 0 ? m.top + s : m.top - h - s;
			return {
				left : l,
				top : t
			}
		}
	},
	doConfig : function() {
		$.LineSegment.superclass.doConfig.call(this);
		$.Assert.gtZero(this.get('point_space'), 'point_space');

		var _ = this, sp = this.get('point_space'), ry = _.get('event_range_y'), rx = _.get('event_range_x'), heap = _.get('tipInvokeHeap'), p = _.get('points');

		for ( var i = 0; i < p.length; i++) {
			p[i].x_ = p[i].x;
			p[i].y_ = p[i].y;
			if(p[i].ignored)this.ignored_ = true;
		}

		if (rx == 0) {
			rx = _.push('event_range_x', Math.floor(sp / 2));
		} else {
			rx = _.push('event_range_x', $.between(1, Math.floor(sp / 2), rx));
		}
		if (ry == 0) {
			ry = _.push('event_range_y', Math.floor(_.get('point_size')/2));
		}

		if (_.get('tip.enable')) {
			/**
			 * _ use for tip coincidence
			 */
			_.on('mouseover', function(c,e, m) {
				heap.push(_);
				_.tipPosition = heap.length;
			}).on('mouseout', function(c,e, m) {
				heap.pop();
			});
			_.push('tip.invokeOffsetDynamic', true);
			_.tip = new $.Tip(_.get('tip'), _);
		}

		var c = _.get('coordinate'), ly = _.get('limit_y'), k = _.get('keep_with_coordinate'), valid = function(p0, x, y) {
			if (!p0.ignored&&Math.abs(x - (p0.x)) < rx && (!ly || (ly && Math.abs(y - (p0.y)) < ry))) {
				return true;
			}
			return false;
		}, to = function(i) {
			return {
				valid : true,
				text : p[i].text,
				value : p[i].value,
				top : p[i].y,
				left : p[i].x,
				i:i,
				hit : true
			};
		};
		/**
		 * override the default method
		 */
		_.isEventValid = function(e) {
			// console.time('mouseover');
			if (c && !c.isEventValid(e).valid) {
				return {
					valid : false
				};
			}
			var ii = Math.floor((e.x - _.x) / sp);
			if (ii < 0 || ii >= (p.length - 1)) {
				ii = $.between(0, p.length - 1, ii);
				if (valid(p[ii], e.x, e.y))
					return to(ii);
				else
					return {
						valid : k
					};
			}
			// calculate the pointer's position will between which two point?this function can improve location speed
			for ( var i = ii; i <= ii + 1; i++) {
				if (valid(p[i], e.x, e.y))
					return to(i);
			}
			// console.timeEnd('mouseover');
			return {
				valid : k
			};
		}

	}
});// @end

/**
 * @overview this component use for abc
 * @component#$.Line
 * @extend#$.Chart
 */
$.Line = $.extend($.Chart, {
	/**
	 * initialize the context for the line
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		$.Line.superclass.configure.call(this);

		this.type = 'line';

		this.dataType = 'simple';

		this.set({
			/**
			 * @cfg {Object} the option for coordinate
			 */
			coordinate : {
				axis:{
					width:[0,0,2,2]
			 	}
			},
			/**
			 * @cfg {Object} Specifies config crosshair.(default enable to false).For details see <link>$.CrossHair</link>
			 * Note:this has a extra property named 'enable',indicate whether crosshair available(default to false)
			 */
			crosshair : {
				enable : false
			},
			/**
			 * @cfg {String} the align of scale.(default to 'left') Available value are:
			 * @Option 'left'
			 * @Option 'right'
			 */
			scaleAlign : 'left',
			/**
			 * @cfg {String} the align of label.(default to 'bottom') Available value are:
			 * @Option 'top,'bottom'
			 */
			labelAlign : 'bottom',
			/**
			 * @cfg {Array} the array of labels close to the axis
			 */
			data_labels : [],
			/**
			 * @cfg {Number} the distance of column's bottom and text.(default to 6)
			 */
			label_space : 6,
			/**
			 * @cfg {Boolean} if the point are proportional space.(default to true)
			 */
			proportional_spacing : true,
			/**
			 * @inner {Number} the space of each label
			 */
			label_spacing : 0,
			/**
			 * @cfg {Object} the option for linesegment.
			 * For details see <link>$.LineSegment</link>
			 */
			segment : {},
			/**
			 * {Object} the option for legend.
			 */
			legend : {
				sign : 'round-bar',
				sign_size : 14
			}
		});

		this.registerEvent(
		/**
		 * @event Fires when parse this element'data.Return value will override existing.
		 * @paramter object#data the data of one linesegment
		 * @paramter object#v the point's value
		 * @paramter int#x coordinate-x of point
		 * @paramter int#y coordinate-y of point
		 * @paramter int#index the index of point
		 * @return Object object Detail:
		 * @property text the text of point
		 * @property x coordinate-x of point
		 * @property y coordinate-y of point
		 */
		'parsePoint');

	},
	/**
	 * @method Returns the coordinate of this element.
	 * @return $.Coordinate2D
	 */
	getCoordinate:function(){
		return this.coo;
	},
	doConfig : function() {
		$.Line.superclass.doConfig.call(this);
		var _ = this._(),s=_.data.length == 1;
		
		/**
		 * apply the coordinate feature
		 */
		$.Coordinate.coordinate.call(_);
		
		_.lines = [];
		
		_.lines.zIndex = _.get('z_index');
		_.push('line_start', (_.get('coordinate.width') - _.get('coordinate.valid_width')) / 2);
		_.push('line_end', _.get('coordinate.width') - _.get('line_start'));

		if (_.get('proportional_spacing'))
			_.push('label_spacing', _.get('coordinate.valid_width') / (_.get('maxItemSize') - 1));
		
		_.push('segment.originx', _.get('originx') + _.get('line_start'));

		/**
		 * y also has line_start and line end
		 */
		_.push('segment.originy', _.get('originy') + _.get('coordinate.height'));

		_.push('segment.width', _.get('coordinate.valid_width'));
		_.push('segment.height', _.get('coordinate.valid_height'));

		_.push('segment.limit_y', !s);

		_.pushIf('segment.keep_with_coordinate', s);

		
		if(_.get('crosshair.enable')){
			_.push('coordinate.crosshair', _.get('crosshair'));
			_.push('coordinate.crosshair.hcross',s);
			_.push('coordinate.crosshair.invokeOffset', function(e, m) {
				var r = _.lines[0].isEventValid(e);
					//console.log(r);
					/**
					 * TODO how fire muti line?
					 */
					return r.valid ? r : false;
				});
		}
		
		/**
		 * quick config to all linesegment
		 */
		$.applyIf(_.get('segment'), $.clone(_.get('communal_option').concat('area_opacity'), _.options));
	}

});// @end

	/**
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
			
			 
			this.tipInvokeHeap = [];
		},
		doAnimation:function(t,d){
			var l,ps,p;
			this.coo.draw();
			for(var i=0;i<this.lines.length;i++){
				l = this.lines[i]; 
				p = l.get('points');
				for(var j=0;j<p.length;j++){
					p[j].y = l.y - Math.ceil(this.animationArithmetic(t,0,l.y-p[j].y_,d));
				}
				l.drawSegment();
			}
		},
		doConfig:function(){
			$.LineBasic2D.superclass.doConfig.call(this);
			var _ = this._();
			
			_.coo = new $.Coordinate2D($.merge({
					scale:[{
						 position:_.get('scaleAlign'),	
						 max_scale:_.get('maxValue')
					},{
						 position:_.get('labelAlign'),	
						 scaleEnable:false,
						 start_scale:1,
						 scale:1,
						 end_scale:_.get('maxItemSize'),
						 labels:_.get('data_labels')
					}]
				},_.get('coordinate')),_);
			
			_.components.push(_.coo);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = _.coo.getScale(_.get('scaleAlign')),
				H=_.get('coordinate.valid_height'),
				sp=_.get('label_spacing'),
				points,x,y,
				ox=_.get('segment.originx'),
				oy=_.get('segment.originy'),
				p;
			
			_.push('segment.tip.showType','follow');
			_.push('segment.coordinate',_.coo);
			_.push('segment.tipInvokeHeap',_.tipInvokeHeap);
			_.push('segment.point_space',sp);
			
			_.data.each(function(d,i){
				points = [];
				d.value.each(function(v,j){
					x = sp*j;
					y = (v-S.start)*H/S.distance;
					p = {x:ox+x,y:oy-y,value:v,text:v};
					$.merge(p,_.fireEvent(_,'parsePoint',[d,v,x,y,j]))
					if (_.get('tip.enable'))
						p.text = _.fireString(_,'parseTipText',[d,v,j],v);
					points.push(p);
				},_);	
				
				_.push('segment.points',points);
				_.push('segment.brushsize',d.linewidth||1);
				_.push('segment.background_color',d.color);
				
				_.lines.push(new $.LineSegment(_.get('segment'),_));
			},this);
			_.components.push(_.lines);
			
		}
		
});
	/**
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
				/**
				 * @cfg {Float} Specifies the opacity of this area.(default to 0.3)
				 */
				area_opacity:0.3
			});
			
		},
		doConfig:function(){
			/**
			 * must apply the area's config before 
			 */
			this.push('segment.area',true);
			$.Area2D.superclass.doConfig.call(this);
			
			
		}
	});
})(iChart);