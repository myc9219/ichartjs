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
		/**
		 * arc
		 */
		arc : function(x, y, r, s, e, c, b, bw, bc, sw, swc, swb, swx, swy, ccw, a2r, last) {
			var x0, y0, ccw = !!ccw, a2r = !!a2r;
			this.save();
			if (!!last)
				this.c.globalCompositeOperation = "destination-over";
			if (b)
				this.strokeStyle(bw, bc);
			this.shadowOn(sw, swc, swb, swx, swy).fillStyle(c);
			this.moveTo(x, y).beginPath();
			this.c.arc(x, y, r, s, e, ccw);
			if (a2r)
				this.lineTo(x, y);
			this.closePath().fill();
			if (b)
				this.stroke();
			return this.restore();
		},
		/**
		 * draw ellipse API
		 */
		ellipse : function(x, y, a, b, s, e, c, bo, bow, boc, sw, swc, swb, swx, swy, ccw, a2r, last) {
			var angle = s, ccw = !!ccw, a2r = !!a2r;
			this.save();
			if (!!last)
				this.c.globalCompositeOperation = "destination-over";
			if (b)
				this.strokeStyle(bow, boc);
			this.shadowOn(sw, swc, swb, swx, swy).fillStyle(c).moveTo(x, y).beginPath();
			
			if (a2r)
				this.moveTo(x, y);

			while (angle <= e) {
				this.lineTo(x + a * cos(angle), y + (ccw ? (-b * sin(angle)) : (b * sin(angle))));
				angle += inc;
			}
			this.lineTo(x + a * cos(e), y + (ccw ? (-b * sin(e)) : (b * sin(e)))).closePath();
			if (b)
				this.stroke();
			return this.fill().restore();
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
					this.lineTo(x + a * cos(A), y + (h || 0) + (ccw ? (-b * sin(A)) : (b * sin(A))));
				};
				s = ccw && e > PI && s < PI ? PI : s;
				e = !ccw && s < PI && e > PI ? PI : e;
				var angle = s;
				this.fillStyle($.dark(color)).moveTo(x + a * cos(s), y + (ccw ? (-b * sin(s)) : (b * sin(s)))).beginPath();
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
				this.lineTo(x + a * cos(s), y + (ccw ? (-b * sin(s)) : (b * sin(s)))).closePath().fill();
			}, layerDraw = function(x, y, a, b, ccw, h, A, color) {
				var x0 = x + a * cos(A);
				var y0 = y + h + (ccw ? (-b * sin(A)) : (b * sin(A)));
				this.moveTo(x, y).beginPath().fillStyle($.dark(color)).lineTo(x, y + h).lineTo(x0, y0).lineTo(x0, y0 - h).lineTo(x, y).closePath().fill();
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
				this.save().fillStyle(c)
				this.c.globalCompositeOperation = "destination-over";
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

				return this.restore();;
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
				try {
				if (max)
					this.c.fillText(t, x, y, max);
				else
					this.c.fillText(t, x, y);
				y += lineheight;
				} catch (e) {
					console.log(e.message+'['+t+','+x+','+y+']');
				}
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
			this.save();
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
			this.save()
			.strokeStyle(bw, bc)
			.beginPath()
			.fillStyle(bg)
			.globalAlpha(alpham)
			.shadowOn(sw, swc, swb, swx, swy)
			.moveTo(points[0], points[1]);
			for ( var i = 2; i < points.length; i += 2)
				this.lineTo(points[i], points[i + 1]);
			this.closePath();
			if (b)
				this.stroke();
			this.fill().restore();
			return this;
		},
		lines : function(p, w, c, last) {
			if(p.length<4)return this;
			this.save();
			if (!!last)
				this.c.globalCompositeOperation = "destination-over";
			this.beginPath().strokeStyle(w, c).moveTo(fd(w,p[0]),fd(w,p[1]));
			for ( var i = 2; i < p.length - 1; i+=2) {
				this.lineTo(fd(w,p[i]),fd(w,p[i+1]));                
			}
			return this.stroke().restore();
		},
		line : function(x1, y1, x2, y2, w, c, last) {
			if (!w || w == 0)
				return this;
			this.save();
			if (!!last)
				this.c.globalCompositeOperation = "destination-over";
			return this.beginPath().strokeStyle(w, c).moveTo(fd(w, x1), fd(w, y1)).lineTo(fd(w, x2), fd(w, y2)).stroke().restore();
		},
		round : function(x, y, r, c, bw, bc) {
			return this.arc(x, y, r, 0, PI2, c, !!bc, bw, bc);
		},
		fillRect:function(x, y, w, h){
			this.c.fillRect(x, y, w, h);
			return this;
		},
		translate:function(x, y){
			this.c.translate(x, y);
			return this;
		},
		backgound : function(x, y, w, h, bgcolor) {
			this.save();
			this.c.globalCompositeOperation = "destination-over";
			return this.translate(x, y).beginPath().fillStyle(bgcolor).fillRect(0, 0, w, h).restore();
		},
		rectangle : function(x, y, w, h, bgcolor, border, linewidth, bcolor, sw, swc, swb, swx, swy) {
			this.save().translate(fd(linewidth, x), fd(linewidth, y)).beginPath().fillStyle(bgcolor).shadowOn(sw, swc, swb, swx, swy);
			if (border && $.isNumber(linewidth)) {
				this.strokeStyle(linewidth,bcolor);
				this.c.strokeRect(0, 0, w, h);
			}
			
			if(bgcolor)
			this.fillRect(0, 0, w, h);

			if (border && $.isArray(linewidth)) {
				this.strokeStyle(null,bcolor)
				.line(0, 0, w, 0, linewidth[0], bcolor)
				.line(w, 0, w, h, linewidth[1], bcolor)
				.line(0, h, w, h, linewidth[2], bcolor)
				.line(0, 0, 0, h, linewidth[3], bcolor);
			}
			return this.restore();
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
			this.save();
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
			this.translate(x, y).strokeStyle(line,color);
			if (!!last) {
				this.c.globalCompositeOperation = "destination-over";
			}
			if (bgcolor) {
				this.fillStyle(bgcolor);
			}

			round = round == 0 ? 0 : $.parseBorder(round);

			/**
			 * draw a round corners border
			 */
			if ($.isArray(round)) {
				this.beginPath()
				.moveTo(round[0], 0)
				.lineTo(w - round[1], 0);
				this.c.arcTo(w, 0, w, round[1], round[1]);
				this.lineTo(w, h - round[2]);
				this.c.arcTo(w, h, w - round[2], h, round[2]);
				this.lineTo(round[3], h);
				this.c.arcTo(0, h, 0, h - round[3], round[3]);
				this.lineTo(0, round[0]);
				this.c.arcTo(0, 0, round[0], 0, round[0]);
				this.closePath().shadowOn(shadow, scolor, blur, offsetx, offsety);
				if (bgcolor) {
					this.fill();
				}
				if (shadow)
					this.shadowOff();
				this.c.globalCompositeOperation = "source-over";

				this.stroke();
			} else {
				/**
				 * draw a rectangular border
				 */
				this.shadowOn(shadow, scolor, blur, offsetx, offsety);
				if (bgcolor) {
					this.fillRect(0, 0, w, h);
				}
				if (shadow)
					this.shadowOff();
				this.c.strokeRect(0, 0, w, h);
			}
			return this.restore();
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
				 * @cfg {Boolean} If true mouse change to a pointer when a mouseover fired.(defaults to true)
				 */
				default_mouseover_css : true,
				/**
				 * @cfg {Boolean} Indicate if the chart clear segment of canvas(defaults to true)
				 */
				segmentRect : true,
				/**
				 * @cfg {Boolean} Specifies as true to display with percent.(default to false)
				 */
				showpercent : false,
				/**
				 * @cfg {Number} Specifies the number of decimal when use percent.(default to 1)
				 */
				decimalsnum : 1,
				/**
				 * @cfg {Object/String} Specifies the config of Title details see <link>iChart.Text</link>,If given a string,it will only apply the text.note:If the text is empty,then will not display
				 */
				title : {
					text:'',
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
				 * @cfg {Object/String}Specifies the config of subtitle details see <link>iChart.Text</link>,If given a string,it will only apply the text.note:If the title or subtitle'text is empty,then will not display
				 */
				subtitle : {
					text:'',
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
				 * @cfg {Object/String}Specifies the config of footnote details see <link>iChart.Text</link>,If given a string,it will only apply the text.note:If the text is empty,then will not display
				 */
				footnote : {
					text:'',
					/**
					 * Specifies the font-color of footnote.(default to '#5d7f97')
					 */
					color : '#5d7f97',
					/**
					 * Specifies the height of title will be take.(default to 20)
					 */
					height : 20
				},
				/**
				 * @cfg {String} Specifies how align footnote horizontally Available value are:
				 * @Option 'left'
				 * @Option 'center'
				 * @Option 'right'
				 */
				footnote_align : 'right',
				/**
				 * @cfg {String} Specifies how align title horizontally Available value are:
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
				 * @cfg {Number} Specifies the duration when animation complete in millisecond.(default to 1000)
				 */
				duration_animation_duration : 1000,
				/**
				 * @cfg {Object}Specifies the config of Legend.For details see <link>iChart.Legend</link> Note:this has a extra property named 'enable',indicate whether legend available(default to false)
				 */
				legend : {
					enable : false
				},
				/**
				 * @cfg {Object} Specifies the config of Tip.For details see <link>iChart.Tip</link> Note:this has a extra property named 'enable',indicate whether tip available(default to false)
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
			 * @paramter Object#data this tip's data item
			 * @paramter int#i the index of data
			 */
			'parseTipText',
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
			this.data = [];
			this.components = [];
			this.total = 0;

		},
		pushComponent : function(c, b) {
			if (!!b)
				this.components.unshift(c);
			else
				this.components.push(c);;
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
			var _;
			return function() {
				if(!_)_ = this;
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
					requestAnimFrame(_.animation);
				} else {
					requestAnimFrame(function() {
						_.variable.animation.time = 0;
						_.animationed = true;
						_.draw();
						_.processAnimation = false;
						_.fireEvent(_, 'afterAnimation', [_]);
					});
				}
			}
		}(),
		doAnimation : function(t, d) {
			this.get('doAnimationFn').call(this, t, d);
		},
		/**
		 * the common config
		 */
		add : function(data, index, animate) {
			if (this.processAnimation) {
				this.variable.animation.queue.push({
					handler : 'add',
					arguments : [data, index, animate]
				});
				return false;
			}
			$.isNumber(index)
			index = $.between(0, this.data.length, index);
			data = $.Interface.parser.call(this, data, index);

			if (this.get('legend.enable')) {
				this.legend.calculate(this.data, data);
			}

			return data;
		},
		commonDraw : function() {
			$.Assert.isTrue(this.rendered, this.type + ' has not rendered.');
			$.Assert.isTrue(this.initialization, this.type + ' has initialize failed.');
			$.Assert.gtZero(this.data.length, this.type + '\'data is empty.');

			/**
			 * console.time('Test for draw');
			 */

			if (!this.redraw) {
				if(this.title){
					this.title.draw();
				}
				if(this.subtitle){
					this.subtitle.draw();
				}
				if(this.footnote){
					this.footnote.draw();
				}
				
				if (this.get('border.enable')) {
					this.T.drawBorder(0, 0, this.width, this.height, this.get('border.width'), this.get('border.color'), this.get('border.radius'), this.get('background_color'), true);
				} else {
					this.T.backgound(0, 0, this.width, this.height, this.get('background_color'));
				}
			}
			this.redraw = true;

			if (!this.animationed && this.get('animation')) {
				this.fireEvent(this, 'beforeAnimation', [this]);
				this.animation();
				return;
			}

			this.segmentRect();

			this.components.eachAll(function(c, i) {
				c.draw();
			}, this);

			this.resetCanvas();
			/**
			 * console.timeEnd('Test for draw');
			 */

		},
		create : function(shell) {
			/**
			 * default should to calculate the size of warp?
			 */
			this.width = this.pushIf('width', 400);
			this.height = this.pushIf('height', 300);

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
				$.Interface.parser.call(this, this.get('data'));
				this.doConfig();
				this.initialization = true;
			}
		},
		doConfig : function() {
			$.Chart.superclass.doConfig.call(this);

			/**
			 * for compress
			 */
			var _ = this, E = _.variable.event, mCSS = _.get('default_mouseover_css'), O, AO;

			$.Assert.isArray(_.data);
			
			$.Interface._3D.call(_);

			_.T.strokeStyle(_.get('brushsize'), _.get('strokeStyle'), _.get('lineJoin'));

			_.processAnimation = _.get('animation');

			_.duration = Math.ceil(_.get('duration_animation_duration') * $.FRAME / 1000);
			
			_.variable.animation = {
				type : 0,
				time : 0,
				queue : []
			};

			_.animationArithmetic = $.getAnimationArithmetic(_.get('animation_timing_function'));

			_.on('afterAnimation', function() {
				var N = _.variable.animation.queue.shift();
				if (N) {
					_[N.handler].apply(_, N.arguments);
				}
			});

			['click', 'dblclick', 'mousemove'].each(function(it) {
				_.T.addEvent(it, function(e) {
					if (_.processAnimation)
						return;
					_.fireEvent(_, it, [_, $.Event.fix(e)]);
				}, false);
			});

			_.on('click', function(_, e) {
				/**
				 * console.time('Test for click');
				 */
				_.components.eachAll(function(c) {
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
				O = AO = false;
				_.components.eachAll(function(cot) {
					if (!cot.preventEvent) {
						var cE = cot.variable.event, M = cot.isMouseOver(e);
						if (M.valid) {
							O = true;
							AO = AO || cot.atomic;
							if (!E.mouseover) {
								E.mouseover = true;
								_.fireEvent(_, 'mouseover', [e]);
							}

							if (mCSS && AO) {
								_.T.css("cursor", "pointer");
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

				if (mCSS && !AO && E.mouseover) {
					_.T.css("cursor", "default");
				}

				// console.log(O+":"+E.mouseover);
					if (!O && E.mouseover) {
						E.mouseover = false;
						_.fireEvent(_, 'mouseout', [e]);
					}
				});

			_.push('l_originx', _.get('padding_left'));
			_.push('r_originx', _.width - _.get('padding_right'));
			_.push('t_originy', _.get('padding_top'));
			_.push('b_originy', _.height - _.get('padding_bottom'));
			_.push('client_width', (_.get('width') - _.get('hpadding')));
			var H = 0;
			if($.isString(_.get('title'))){
				_.push('title',{
					text:_.get('title'),
					fontweight : 'bold',
					fontsize : 20,
					height : 30
				});
			}
			if($.isString(_.get('subtitle'))){
				_.push('subtitle',{
					text:_.get('subtitle'),
					fontweight : 'bold',
					fontsize : 16,
					height : 20
				});
			}
			if($.isString(_.get('footnote'))){
				_.push('footnote',{
					text:_.get('footnote'),
					color : '#5d7f97',
					height : 20
				});
			}
			
			if (_.get('title.text') != '') {
				var st = _.get('subtitle.text') != '';
				H = st ? _.get('title.height') + _.get('subtitle.height') : _.get('title.height');
				if (_.get('title_align') == 'left') {
					_.push('title.originx', _.get('padding_left'));
				} else if (_.get('title_align') == 'right') {
					_.push('title.originx', _.width - _.get('padding_right'));
				} else {
					_.push('title.originx', _.get('padding_left')+_.get('client_width') / 2);
				}
				
				_.push('t_originy', _.get('t_originy') + H);
				
				this.push('title.textAlign', this.get('title_align'));
				this.push('title.originy', this.get('padding_top'));
				this.push('title.textBaseline', 'top');
				this.title = new $.Text(this.get('title'), this);
				if (st) {
					_.push('subtitle.originx', _.get('title.originx'));
					_.push('subtitle.originy', _.get('title.originy')+_.get('title.height'));
					_.push('subtitle.textAlign', _.get('title_align'));
					_.push('subtitle.textBaseline', 'top');
					this.subtitle = new $.Text(this.get('subtitle'), this);
				}
			}
			
			if (_.get('footnote.text') != '') {
				var fh = _.get('footnote.height');
				H +=fh;
				
				_.push('b_originy', _.get('b_originy') - fh);
				
				if (_.get('footnote_align') == 'left') {
					_.push('footnote.originx', _.get('padding_left'));
				} else if (_.get('footnote_align') == 'right') {
					_.push('footnote.originx', _.width - _.get('padding_right'));
				} else {
					_.push('footnote.originx', _.get('padding_left')+_.get('client_width') / 2);
				}
				
				this.push('footnote.textAlign', this.get('footnote_align'));
				this.push('footnote.originy', this.get('b_originy'));
				this.push('footnote.textBaseline', 'top');
				
				this.footnote = new $.Text(this.get('footnote'), this);
				
			}
			
			_.push('client_height', (_.get('height') - _.get('vpadding') - H));
			
			_.push('minDistance', Math.min(_.get('client_width'), _.get('client_height')));
			_.push('maxDistance', Math.max(_.get('client_width'), _.get('client_height')));
			_.push('minstr', _.get('client_width') < _.get('client_height') ? 'width' : 'height');

			_.push('centerx', _.get('l_originx') + _.get('client_width') / 2);
			_.push('centery', _.get('t_originy') + _.get('client_height') / 2);

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
// @end
