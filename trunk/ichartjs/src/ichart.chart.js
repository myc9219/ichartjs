;
(function($) {

	var inc = Math.PI / 90, PI = Math.PI, PI2 = 2 * Math.PI, sin = Math.sin, cos = Math.cos, fd = function(w, c) {
		return w <= 1 ? (Math.floor(c) + 0.5) : Math.floor(c);
	};
	/**
	 * @private support an improved API for drawing in canvas
	 */
	function Cans(c) {
		if (typeof c === "string")
			c = document.getElementById(c);
		if (!c || !c['tagName'] || c['tagName'].toLowerCase() != 'canvas')
			throw new Error("there not a canvas element");

		this.canvas = c;
		this.c = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}

	Cans.prototype = {
		css : function(a, s) {
			if ($.isDefined(s))
				this.canvas.style[a] = s;
			else
				return this.canvas.style[a];
		},
		/*
		 * it seem not improve the speed isPointInPathArc:function(x,y,radius,s,e,color,ccw,a2r,x0,y0){ var angle = s,x0,y0,ccw=!!ccw,a2r=!!a2r; if(!a2r) this.c.moveTo(x,y); this.c.beginPath(); if(a2r) this.c.moveTo(x,y); this.c.arc(x,y,radius,s,e,ccw); this.c.lineTo(x,y); return
		 * this.c.isPointInPath(x0,y0); }, /* /** draw arc API @param {Number} x 圆心x @param {Number} y 圆心y @param {Number} r 半径 @param {Number} s 起始弧度 @param {Number} e 结束弧度 @param {String} c fill color @param {Boolean} b border enable @param {Number} bw border's width @param
		 * {String} bc border's color @param {Boolean} sw shadow enable @param {String} swc shadow color @param {Number} swb shadow blur @param {Number} swx shadow's offsetx @param {Number} swy shadow's offsety @param {Boolean} ccw 方向 @param {Boolean} a2r 是否连接圆心 @param {Boolean}
		 * last 是否置于最底层 @return this
		 */
		/**
		 * arc
		 */
		arc : function(x, y, r, s, e, c, b, bw, bc, sw, swc, swb, swx, swy, ccw, a2r, last) {
			var x0, y0, ccw = !!ccw, a2r = !!a2r;
			this.c.save();
			if (!!last)
				this.c.globalCompositeOperation = "destination-over";
			if (b)
				this.strokeStyle(bw, bc);
			this.shadowOn(sw, swc, swb, swx, swy).fillStyle(c);
			this.c.moveTo(x, y);
			this.c.beginPath();
			this.c.arc(x, y, r, s, e, ccw);
			if (a2r)
				this.c.lineTo(x, y);
			this.c.closePath();
			this.c.fill();
			if (b)
				this.c.stroke();
			this.c.restore();
			return this;
		},
		/**
		 * draw ellipse API
		 */
		ellipse : function(x, y, a, b, s, e, c, bo, bow, boc, sw, swc, swb, swx, swy, ccw, a2r, last) {
			var angle = s, ccw = !!ccw, a2r = !!a2r;
			this.c.save();
			if (!!last)
				this.c.globalCompositeOperation = "destination-over";
			if (b)
				this.strokeStyle(bow, boc);
			this.shadowOn(sw, swc, swb, swx, swy).fillStyle(c);

			this.c.moveTo(x, y);
			this.c.beginPath();
			if (a2r)
				this.c.moveTo(x, y);

			while (angle <= e) {
				this.c.lineTo(x + a * cos(angle), y + (ccw ? (-b * sin(angle)) : (b * sin(angle))));
				angle += inc;
			}
			this.c.lineTo(x + a * cos(e), y + (ccw ? (-b * sin(e)) : (b * sin(e))));
			this.c.closePath();
			if (b)
				this.c.stroke();
			this.c.fill();
			this.c.restore();
			return this;
		},
		/**
		 * draw sector
		 */
		sector : function(x, y, r, s, e, c, b, bw, bc, sw, swc, swb, swx, swy, ccw) {
			if (sw) {
				/**
				 * fixed Chrome and Opera bug
				 */
				this.arc(x, y, r, s, e, c, b, bw, bc, sw, swc, swb, swx, swy, ccw, true);
				this.arc(x, y, r, s, e, c, b, bw, bc, false, swc, swb, swx, swy, ccw, true);
			} else {
				this.arc(x, y, r, s, e, c, b, bw, bc, false, 0, 0, 0, 0, ccw, true);
			}
			return this;
		},
		sector3D : function() {
			var x0, y0, sPaint = function(x, y, a, b, s, e, ccw, h, color) {
				if ((ccw && e <= PI) || (!ccw && s >= PI))
					return false;
				var Lo = function(A, h) {
					this.c.lineTo(x + a * cos(A), y + (h || 0) + (ccw ? (-b * sin(A)) : (b * sin(A))));
				};
				s = ccw && e > PI && s < PI ? PI : s;
				e = !ccw && s < PI && e > PI ? PI : e;
				var angle = s;
				this.c.fillStyle = $.dark(color);
				this.c.moveTo(x + a * cos(s), y + (ccw ? (-b * sin(s)) : (b * sin(s))));
				this.c.beginPath();
				while (angle <= e) {
					Lo.call(this, angle);
					angle = angle + inc;
				}
				Lo.call(this, e);
				this.c.lineTo(x + a * cos(e), (y + h) + (ccw ? (-b * sin(e)) : (b * sin(e))));
				angle = e;
				while (angle >= s) {
					Lo.call(this, angle, h);
					angle = angle - inc;
				}
				Lo.call(this, s, h);
				this.c.lineTo(x + a * cos(s), y + (ccw ? (-b * sin(s)) : (b * sin(s))));
				this.c.closePath();
				this.c.fill();
			}, layerDraw = function(x, y, a, b, ccw, h, A, color) {
				this.c.moveTo(x, y);
				this.c.beginPath();
				this.c.fillStyle = $.dark(color);
				this.c.lineTo(x, y + h);
				var x0 = x + a * cos(A);
				var y0 = y + h + (ccw ? (-b * sin(A)) : (b * sin(A)));
				this.c.lineTo(x0, y0);
				this.c.lineTo(x0, y0 - h);
				this.c.lineTo(x, y);
				this.c.closePath();
				this.c.fill();
			}, layerPaint = function(x, y, a, b, s, e, ccw, h, color) {
				var ds = ccw ? (s < PI / 2 || s > 1.5 * PI) : (s > PI / 2 && s < 1.5 * PI), de = ccw ? (e > PI / 2 && e < 1.5 * PI) : (e < PI / 2 || e > 1.5 * PI);
				if (!ds && !de)
					return false;
				if (ds)
					layerDraw.call(this, x, y, a, b, ccw, h, s, color);
				if (de)
					layerDraw.call(this, x, y, a, b, ccw, h, e, color);
			};
			return function(x, y, a, b, s, e, h, c, bo, bow, boc, sw, swc, swb, swx, swy, ccw, isw) {
				/**
				 * browser opera has bug when use destination-over and shadow
				 */
				sw = sw && !$.isOpera;
				this.c.save();
				this.c.globalCompositeOperation = "destination-over";
				this.c.fillStyle = c;
				/**
				 * paint inside layer
				 */
				layerPaint.call(this, x, y, a, b, s, e, ccw, h, c);
				/**
				 * paint bottom layer
				 */
				this.ellipse(x, y + h, a, b, s, e, c, bo, bow, boc, sw, swc, swb, swx, swy, ccw, true);
				this.c.globalCompositeOperation = "source-over";

				/**
				 * paint top layer var g = this.avgRadialGradient(x,y,0,x,y,a,[$.light(c,0.1),$.dark(c,0.05)]);
				 */
				this.ellipse(x, y, a, b, s, e, c, bo, bow, boc, false, swc, swb, swx, swy, ccw, true);
				/**
				 * paint outside layer
				 */
				sPaint.call(this, x, y, a, b, s, e, ccw, h, c);

				this.c.restore();
				return this;
			}
		}(),
		textStyle : function(a, l, f) {
			return this.textAlign(a).textBaseline(l).textFont(f);
		},
		strokeStyle : function(w, c, j) {
			if (w)
				this.c.lineWidth = w;
			if (c)
				this.c.strokeStyle = c;
			if (j)
				this.c.lineJoin = j;
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
		shadowOn : function(s, c, b, x, y) {
			if ($.isString(s)) {
				y = x;
				x = b;
				b = c;
				c = s;
				c = true;
			}
			if (s) {
				this.c.shadowColor = c;
				this.c.shadowBlur = b;
				this.c.shadowOffsetX = x;
				this.c.shadowOffsetY = y;
			}
			return this;
		},
		shadowOff : function() {
			this.c.shadowColor = 'white';
			this.c.shadowBlur = this.c.shadowOffsetX = this.c.shadowOffsetY = 0;
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
		fillText : function(t, x, y, max, color, mode, lineheight) {
			t = t + "";
			max = max || false;
			mode = mode || 'lr';
			lineheight = lineheight || 16;
			this.fillStyle(color);
			var T = t.split(mode == 'tb' ? "" : "\n");
			T.each(function(t) {
				if (max)
					this.c.fillText(t, x, y, max);
				else
					this.c.fillText(t, x, y);
				y += lineheight;
			}, this);
			return this;
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
		stroke : function() {
			this.c.stroke();
			return this;
		},
		fill : function() {
			this.c.fill();
			return this;
		},
		text : function(text, x, y, max, color, align, line, font, mode, lineheight) {
			this.c.save();
			this.textStyle(align, line, font);
			this.fillText(text, x, y, max, color, mode, lineheight);
			this.c.restore();
			return this;
		},
		/**
		 * can use cube3D instead of this?
		 */
		cube : function(x, y, xv, yv, width, height, zdeep, bg, b, bw, bc, sw, swc, swb, swx, swy) {
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
				this.polygon(bg, b, bw, bc, sw, swc, swb, swx, swy, false, [x, y, x1, y1, x1 + width, y1, x + width, y]);
				this.polygon(bg, b, bw, bc, sw, swc, swb, swx, swy, false, [x, y, x, y + height, x + width, y + height, x + width, y]);
				this.polygon(bg, b, bw, bc, sw, swc, swb, swx, swy, false, [x + width, y, x1 + width, y1, x1 + width, y1 + height, x + width, y + height]);
			}
			/**
			 * clear the shadow on the body
			 */
			this.polygon($.dark(bg), b, bw, bc, false, swc, swb, swx, swy, false, [x, y, x1, y1, x1 + width, y1, x + width, y]);
			this.polygon(bg, b, bw, bc, false, swc, swb, swx, swy, false, [x, y, x, y + height, x + width, y + height, x + width, y]);
			this.polygon($.dark(bg), b, bw, bc, false, swc, swb, swx, swy, false, [x + width, y, x1 + width, y1, x1 + width, y1 + height, x + width, y + height]);
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
				this.polygon(s.color, b, bw, bc, s.shadow, s.shadowColor, s.blur, s.sx, s.sy, s.alpha, s.points);
			}, this);

			return this;
		},
		/**
		 * polygon
		 * 
		 * @param {Object}
		 *            border
		 * @param {Object}
		 *            linewidth
		 * @param {Object}
		 *            bcolor
		 * @param {Object}
		 *            bgcolor
		 * @param {Object}
		 *            alpham
		 * @param {Object}
		 *            points
		 * @memberOf {TypeName}
		 * @return {TypeName}
		 */
		polygon : function(bg, b, bw, bc, sw, swc, swb, swx, swy, alpham, points) {
			if (points.length < 2)
				return;
			this.c.save();
			this.strokeStyle(bw, bc);
			this.c.beginPath();
			this.fillStyle(bg).globalAlpha(alpham).shadowOn(sw, swc, swb, swx, swy).moveTo(points[0], points[1]);
			for ( var i = 2; i < points.length; i += 2)
				this.lineTo(points[i], points[i + 1]);
			this.c.closePath();
			if (b)
				this.c.stroke();
			this.c.fill();
			this.c.restore();
			return this;
		},
		line : function(x1, y1, x2, y2, w, c, last) {
			if (!w || w == 0)
				return this;
			this.c.save();
			if (!!last)
				this.c.globalCompositeOperation = "destination-over";

			x1 = fd(w, x1);
			y1 = fd(w, y1);
			x2 = fd(w, x2);
			y2 = fd(w, y2);

			this.c.beginPath();
			this.strokeStyle(w, c).moveTo(x1, y1).lineTo(x2, y2).c.stroke();
			this.c.closePath();
			this.c.restore();
			return this;
		},
		round : function(x, y, r, c, bw, bc) {
			this.c.beginPath();
			this.c.fillStyle = c;
			this.c.arc(x, y, r, 0, PI2, false);
			this.c.closePath();
			this.c.fill();
			if (bw) {
				this.c.lineWidth = bw;
				this.c.strokeStyle = bc || '#010101';
				this.c.stroke();
			}
			return this;
		},
		backgound : function(x, y, w, h, bgcolor) {
			this.c.save();
			this.c.globalCompositeOperation = "destination-over";
			this.c.translate(x, y);
			this.c.beginPath();
			this.c.fillStyle = bgcolor;
			this.c.fillRect(0, 0, w, h);
			this.c.restore();
			return this;
		},
		rectangle : function(x, y, w, h, bgcolor, border, linewidth, bcolor, sw, swc, swb, swx, swy) {
			this.c.save();
			x = fd(linewidth, x);
			y = fd(linewidth, y);
			this.c.translate(x, y);
			this.c.beginPath();
			this.c.fillStyle = bgcolor;
			this.shadowOn(sw, swc, swb, swx, swy);
			if (border && $.isNumber(linewidth)) {
				this.c.lineWidth = linewidth;
				this.c.strokeStyle = bcolor;
				this.c.strokeRect(0, 0, w, h);
			}

			this.c.fillRect(0, 0, w, h);

			if (border && $.isArray(linewidth)) {
				this.c.strokeStyle = bcolor;
				this.line(0, 0, w, 0, linewidth[0], bcolor);
				this.line(w, 0, w, h, linewidth[1], bcolor);
				this.line(0, h, w, h, linewidth[2], bcolor);
				this.line(0, 0, 0, h, linewidth[3], bcolor);
			}
			this.c.restore();
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
		drawBorder : function(x, y, w, h, line, color, round, bgcolor, last, shadow, scolor, blur, offsetx, offsety) {
			this.c.save();
			var x0 = fd(line, x);
			var y0 = fd(line, y);
			if (x0 != x) {
				x = x0;
				w -= 1;
			}
			if (y0 != y) {
				y = y0;
				h -= 1;
			}
			this.c.translate(x, y);
			this.c.lineWidth = line;
			this.c.strokeStyle = color;

			if (!!last) {
				this.c.globalCompositeOperation = "destination-over";
			}
			if (bgcolor) {
				this.c.fillStyle = bgcolor;
			}

			round = round == 0 ? 0 : $.parseBorder(round);

			/**
			 * draw a round corners border
			 */
			if ($.isArray(round)) {
				this.c.beginPath();
				this.c.moveTo(round[0], 0);
				this.c.lineTo(w - round[1], 0);
				this.c.arcTo(w, 0, w, round[1], round[1]);
				this.c.lineTo(w, h - round[2]);
				this.c.arcTo(w, h, w - round[2], h, round[2]);
				this.c.lineTo(round[3], h);
				this.c.arcTo(0, h, 0, h - round[3], round[3]);
				this.c.lineTo(0, round[0]);
				this.c.arcTo(0, 0, round[0], 0, round[0]);
				this.c.closePath();
				this.shadowOn(shadow, scolor, blur, offsetx, offsety);
				if (bgcolor) {
					this.c.fill();
				}
				if (shadow)
					this.shadowOff();
				this.c.globalCompositeOperation = "source-over";

				this.c.stroke();
			} else {
				/**
				 * draw a rectangular border
				 */
				this.shadowOn(shadow, scolor, blur, offsetx, offsety);
				if (bgcolor) {
					this.c.fillRect(0, 0, w, h);
				}
				if (shadow)
					this.shadowOff();
				this.c.strokeRect(0, 0, w, h);
			}
			this.c.restore();
			return this;
		},
		toImageURL : function() {
			return this.canvas.toDataURL("image/png");
		},
		addEvent : function(type, fn, useCapture) {
			$.Event.addEvent(this.canvas, type, fn, useCapture);
		}

	}

	/**
	 * @overview this component use for abc
	 * @component#iChart.Chart
	 * @extend#iChart.Painter
	 */
	iChart.Chart = iChart.extend(iChart.Painter, {
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
				data : [],
				/**
				 * @cfg {Number} the width of this canvas
				 */
				width : undefined,
				/**
				 * @cfg {Number} the height of this canvas
				 */
				height : undefined,
				/**
				 * @cfg {String} this property specifies the horizontal alignment of chart in an module (defaults to 'center') Available value are:
				 * @Option 'left'
				 * @Option 'center'
				 * @Option 'right'
				 */
				align : 'center',
				/**
				 * @cfg {Boolean} indicate if the chart clear segment of canvas(defaults to true)
				 */
				segmentRect : true,
				/**
				 * @cfg {String} if the title is empty,then will not display (default to '')
				 */
				title : '',
				/**
				 * @cfg {String} Specifies how align title horizontally Available value are:
				 * @Option 'left'
				 * @Option 'center'
				 * @Option 'right'
				 */
				title_align : 'center',
				/**
				 * @cfg {String} Specifies how align title vertically Available value are:
				 * @Option 'top'
				 * @Option 'middle' Only applies when title_writingmode = 'tb'
				 * @Option 'bottom'
				 */
				title_valign : 'top',
				/**
				 * @cfg {String} Specifies the writing-mode of title.(default to 'lr') Available value are:
				 * @Option 'lr,'tb'
				 */
				title_writingmode : 'lr',
				/**
				 * @cfg {String} Specifies the font of title.(default to 'Verdana')
				 */
				title_font : 'Verdana',
				/**
				 * @cfg {String} Specifies the font-weight of title.(default to 'bold')
				 */
				title_fontweight : 'bold',
				/**
				 * @cfg {Number} Specifies the font-size in pixels of title.(default to 20)
				 */
				title_fontsize : 20,
				/**
				 * @cfg {String} Specifies the font-color of title.(default to 'black')
				 */
				title_color : 'black',
				/**
				 * @cfg {Number} Specifies the height of title will be use.(default to 25)
				 */
				title_height : 25,
				/**
				 * @cfg {Boolean} if true element will has a animation when show, false to skip the animation.(default to false)
				 */
				animation : false,
				/**
				 * @inner {Function} the custom funtion for animation
				 */
				doAnimationFn : $.emptyFn,
				/**
				 * @cfg {String} (default to 'ease-in-out') Available value are:
				 * @Option 'easeIn'
				 * @Option 'easeOut'
				 * @Option 'easeInOut'
				 * @Option 'linear'
				 */
				animation_timing_function : 'easeInOut',
				/**
				 * @cfg {Number}
				 */
				duration_animation_duration : 1600,
				/**
				 * @cfg {Boolean} if the legend displayed (default to false)
				 */
				legend : {
					enable : false
				},
				/**
				 * @cfg {Boolean} if the tip enabled (default to false)
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
			 * @event Fires when parse this element'data.Return value will override existing.
			 * @paramter iChart.Chart#this
			 * @paramter Object#data this element'data item
			 * @paramter int#i the index of data
			 */
			'parseData',
			/**
			 * @event Fires when parse this tip's data.Return value will override existing. Only valid when tip is available
			 * @paramter iChart.Chart#this
			 * @paramter Object#data this tip's data item
			 * @paramter int#i the index of data
			 */
			'parseTipText',
			/**
			 * @event Fires when parse this label's data.Return value will override existing. Only valid when label is available
			 * @paramter iChart.Chart#this
			 * @paramter Object#data this label's data item
			 * @paramter int#i the index of data
			 */
			'parseLabelText',
			/**
			 * @event Fires before this element Animation.Only valid when <link>animation</link> is true
			 * @paramter iChart.Chart#this
			 */
			'beforeAnimation',
			/**
			 * @event Fires when this element Animation finished.Only valid when <link>animation</link> is true
			 * @paramter iChart.Chart#this
			 */
			'afterAnimation', 'animating');

			this.T = null;
			this.rendered = false;

			this.animationed = false;

			this.components = [];
			this.total = 0;

		},
		pushComponent : function(c, b) {
			if ($.isArray(c)) {
				if (!!b)
					this.components = c.concat(this.components);
				else
					this.components = this.components.concat(c);
			} else {
				if (!!b)
					this.components = [c].concat(this.components);
				else
					this.components.push(c);
			}

		},
		plugin : function(c, b) {
			this.init();
			c.inject(this);
			this.pushComponent(c, b);
		},
		toImageURL : function() {
			return this.T.toImageURL();
		},
		segmentRect : function() {
			this.T.clearRect(this.get('l_originx'), this.get('t_originy'), this.get('client_width'), this.get('client_height'));
		},
		resetCanvas : function() {
			this.T.backgound(this.get('l_originx'), this.get('t_originy'), this.get('client_width'), this.get('client_height'), this.get('background_color'));
		},
		animation : function() {
			return function(_) {
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
					setTimeout(function() {
						_.animation(_)
					}, $.INTERVAL)
				} else {

					setTimeout(function() {
						_.variable.animation.time = 0;
						_.animationed = true;
						_.draw();
						_.processAnimation = false;
						_.fireEvent(this, 'afterAnimation', [this]);
					}, $.INTERVAL);
				}
			}
		}(),
		doAnimation : function(t, d) {
			this.get('doAnimationFn').call(this, t, d);
		},
		commonDraw : function() {
			$.Assert.isTrue(this.rendered, this.type + ' has not rendered.');
			$.Assert.isTrue(this.initialization, this.type + ' has initialize failed.');
			$.Assert.gtZero(this.data.length, this.type + '\'data is empty.');

			/**
			 * console.time('Test for draw');
			 */

			if (!this.redraw) {
				this.title();
				if (this.get('border.enable')) {
					this.T.drawBorder(0, 0, this.width, this.height, this.get('border.width'), this.get('border.color'), this.get('border.radius'), this.get('background_color'), true);
				} else {
					this.T.backgound(0, 0, this.width, this.height, this.get('background_color'));
				}
			}
			this.redraw = true;

			if (!this.animationed && this.get('animation')) {
				this.fireEvent(this, 'beforeAnimation', [this]);
				this.animation(this);
				return;
			}

			this.segmentRect();

			for ( var i = 0; i < this.components.length; i++) {
				this.components[i].draw();
			}

			this.resetCanvas();
			/**
			 * console.timeEnd('Test for draw');
			 */

		},
		/**
		 * Draw the title when title not empty
		 */
		title : function() {
			if (this.get('title') == '')
				return;
			if (this.get('title_writingmode') == 'tb') {

			} else {
				if (this.get('title_align') == 'left') {
					this.push('title_originx', this.get('padding_left'));
				} else if (this.get('title_align') == 'right') {
					this.push('title_originx', this.width - this.get('padding_right'));
				} else {
					this.push('title_originx', this.get('client_width') / 2);
				}
				this.T.textAlign(this.get('title_align'));
				if (this.get('title_valign') == 'bottom') {
					this.push('title_originy', this.height - this.get('padding_bottom'));
				} else {
					this.push('title_originy', this.get('padding_top'));
				}
				this.T.textBaseline(this.get('title_valign'));

			}
			this.T.textFont($.getFont(this.get('title_fontweight'), this.get('title_fontsize'), this.get('title_font')));
			this.T.fillText(this.get('title'), this.get('title_originx'), this.get('title_originy'), this.get('client_width'), this.get('title_color'));
		},
		/**
		 * @method Add item(s) into the Chart at the given index or not.. This method accepts either a single object of data config or a array of items's config
		 * @paramter data#Object/Array the data's config
		 * @paramter index#int The start index at which to add the item.
		 * @paramter animate#boolean if has a animation when drawing
		 * @return void
		 */
		addItem:function(data,index,animate){
			
			
			
		},
		create : function(shell) {
			/**
			 * default should to calculate the size of warp?
			 */
			this.width = this.push('width', this.get('width') || 400);
			this.height = this.push('height', this.get('height') || 300);
			var style = "width:" + this.width + "px;height:" + this.height + "px;padding:0px;overflow:hidden;position:relative;";

			var id = $.iGather(this.type);
			this.shellid = $.iGather(this.type + "-shell");
			var html = "<div id='" + this.shellid + "' style='" + style + "'>" + "<canvas id= '" + id + "'  width='" + this.width + "' height=" + this.height + "'>" + "<p>Your browser does not support the canvas element</p>" + "</canvas>" + "</div>";
			/**
			 * also use appendChild()
			 */
			shell.innerHTML = html;

			this.element = document.getElementById(id);
			this.shell = document.getElementById(this.shellid);
			/**
			 * the base canvas wrap for draw
			 */
			this.T = this.target = new Cans(this.element);

			this.rendered = true;
		},
		render : function(id) {
			this.push('render', id);
		},
		initialize : function() {
			if (!this.rendered) {
				var r = this.get('render');
				if (typeof r == "string" && document.getElementById(r))
					this.create(document.getElementById(r));
				else if (typeof r == 'object')
					this.create(r);
			}
			
			if (this.get('data').length > 0 && this.rendered && !this.initialization) {
				this.data = this.get('data');
				$.Interface.parser.call(this);
				this.doConfig();
				this.initialization = true;
			}
		},
		doConfig : function() {
			$.Chart.superclass.doConfig.call(this);
			/**
			 * for compress
			 */
			var _ = this, E = _.variable.event, register = function() {
				['click', 'dblclick', 'mousemove'].each(function(it) {
					_.T.addEvent(it, function(e) {
						_.fireEvent(_, it, [_, $.Event.fix(e)]);
					}, false);
				});
			}

			$.Interface._3D.call(_);

			_.T.strokeStyle(_.get('brushsize'), _.get('strokeStyle'), _.get('lineJoin'));

			if (_.get('animation')) {
				_.processAnimation = _.get('animation');
				_.duration = Math.ceil(_.get('duration_animation_duration') * $.FRAME / 1000);
				_.variable.animation = {
					time : 0
				};
				_.animationArithmetic = $.getAnimationArithmetic(_.get('animation_timing_function'));
				_.on('afterAnimation', function() {
					register();
				});
			} else {
				register();
			}

			_.on('click', function(_, e) {
				/**
				 * console.time('Test for click');
				 */
				_.components.each(function(c) {
					if (!c.preventEvent) {
						var M = c.isMouseOver(e);
						if (M.valid)
							c.fireEvent(c, 'click', [c, e, M]);
					}
				});
				/**
				 * console.timeEnd('Test for click');
				 */
			});

			_.on('mousemove', function(_, e) {
				var O = false;
				_.components.each(function(cot) {
					if (!cot.preventEvent) {
						var cE = cot.variable.event, M = cot.isMouseOver(e);
						if (M.valid) {
							O = true;
							if (!E.mouseover) {
								E.mouseover = true;
								_.T.css("cursor", "pointer");
								_.fireEvent(_, 'mouseover', [e]);
							}
							if (!cE.mouseover) {
								cE.mouseover = true;
								cot.fireEvent(cot, 'mouseover', [e, M]);
							}
							cot.fireEvent(cot, 'mousemove', [e, M]);
						} else {
							if (cE.mouseover) {
								cE.mouseover = false;
								cot.fireEvent(cot, 'mouseout', [e, M]);
							}
						}
					}
				});

				if (!O && E.mouseover) {
					E.mouseover = false;
					_.T.css("cursor", "default");
					_.fireEvent(_, 'mouseout', [e]);
				}
			});
			$.Assert.isArray(_.data);

			_.push('l_originx', _.get('padding_left'));
			_.push('r_originx', _.width - _.get('padding_right'));
			_.push('t_originy', _.get('padding_top'));
			_.push('b_originy', _.height - _.get('padding_bottom'));

			var offx = 0, offy = 0;

			if (_.get('title') != '') {
				/**
				 * 竖直排列
				 */
				if (_.get('title_writingmode') == 'tb') {
					offx = _.get('title_height');
					if (_.get('title_align') == 'left') {
						_.push('l_originx', _.get('l_originx') + _.get('title_height'));
					} else {
						_.push('r_originx', _.width - _.get('l_originx') - _.get('title_height'));
					}
				} else {
					/**
					 * 横向排列
					 */
					offy = _.get('title_height');

					if (_.get('title_align') == 'left') {
						_.push('title_originx', _.get('padding_left'));
					} else if (_.get('title_align') == 'right') {
						_.push('title_originx', _.width - _.get('padding_right'));
					} else {
						_.push('title_originx', _.get('client_width') / 2);
					}
					if (_.get('title_valign') == 'bottom') {
						_.push('title_originy', _.height - _.get('padding_bottom'));
						_.push('b_originy', _.height - _.get('b_originy') - _.get('title_height'));
					} else {
						_.push('t_originy', _.get('t_originy') + _.get('title_height'));
						_.push('title_originy', _.get('padding_top'));
					}
				}
			}

			_.push('client_width', (_.get('width') - _.get('hpadding') - offx));
			_.push('client_height', (_.get('height') - _.get('vpadding') - offy));

			_.push('minDistance', Math.min(_.get('client_width'), _.get('client_height')));
			_.push('maxDistance', Math.max(_.get('client_width'), _.get('client_height')));
			_.push('minstr', _.get('client_width') < _.get('client_height') ? 'width' : 'height');

			_.push('centerx', _.get('l_originx') + _.get('client_width') / 2);
			_.push('centery', _.get('t_originy') + _.get('client_height') / 2);
			/*
			 * if(_.get('border.enable')){ var round = $.parseBorder(_.get('border.radius')); _.push('radius_top',round[0]); _.push('radius_right',round[1]); _.push('radius_bottom',round[2]); _.push('radius_left',round[3]); }
			 */

			/**
			 * legend
			 */
			if (_.get('legend.enable')) {
				_.legend = new $.Legend($.apply({
					maxwidth : _.get('client_width'),
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
})(iChart);
//@end
