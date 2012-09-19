;
(function($) {

	var inc = Math.PI / 90, PI = Math.PI, ceil = Math.ceil, floor = Math.floor, PI2 = 2 * Math.PI, max = Math.max, min = Math.min, sin = Math.sin, cos = Math.cos, fd = function(w, c) {
		return w == 1 ? (floor(c) + 0.5) : Math.round(c);
	}, getCurvePoint = function(seg, point, i, smo) {
		var x = point.x, y = point.y, lp = seg[i - 1], np = seg[i + 1], lcx, lcy, rcx, rcy;
		// find out control points
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
		this.push('total',this.total);
		
	},
	complex = function(c){
		this.data_labels = this.get('data_labels');
		var M=0,MI=0,V,d,L=this.data_labels.length;
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
		this.push('total',this.total);
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
				 * paint top layer var g = this.avgRadialGradient(x,y,0,x,y,a,[$.light(c,0.1),$.dark(c,0.05)]);
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
			return this.closePath().stroke(b).fill(true).restore();
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
			
			this.save().translate(x, y).shadowOn(shadow).gCo(last).fillStyle(bg).strokeStyle(f,j, c);

			/**
			 * draw a round corners border
			 */
			if (r) {
				this.beginPath().moveTo(r[0], fd(j, 0)).lineTo(w - r[1], fd(j, 0)).arc2(w, fd(j, 0), w, r[1], r[1]).lineTo(fd(j, w), h - r[2]).arc2(fd(j, w), h, w - r[2], h, r[2]).lineTo(r[3], fd(j, h)).arc2(0, fd(j, h), 0, h - r[3], r[3]).lineTo(fd(j, 0), r[0]).arc2(fd(j, 0),
						0, r[0], 0, r[0]).closePath().fill(bg).stroke(j);
			} else {
				if (!b.enable || f) {
					if (b.enable)
						this.c.strokeRect(0, 0, fd(j, w), fd(j, h));
					if (bg)
						this.fillRect(0, 0, w, h);
				} else {
					if (bg) {
						this.beginPath().moveTo(floor(j[3] / 2), floor(j[0] / 2)).lineTo(ceil(w - j[1] / 2), j[0] / 2).lineTo(ceil(w - j[1] / 2), ceil(h - j[2] / 2)).lineTo(floor(j[3] / 2), ceil(h - j[2] / 2)).lineTo(floor(j[3] / 2), floor(j[0] / 2)).closePath().fill(true);
					}
					if (j) {
						c = $.isArray(c) ? c : [c, c, c, c];
						this.line(w, j[0] / 2, w, h - j[0] / 2, j[1], c[1], 0).line(0, j[0] / 2, 0, h - j[0] / 2, j[3], c[3], 0).line(floor(-j[3] / 2), 0, w + j[1] / 2, 0, j[0], c[0], 0).line(floor(-j[3] / 2), h, w + j[1] / 2, h, j[2], c[2], 0);
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
				 * @cfg {Object/String}Specifies the config of subtitle details see <link>iChart.Text</link>,If given a string,it will only apply the text.note:If the title or subtitle'text is empty,then will not display
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
				 * @cfg {Object/String}Specifies the config of footnote details see <link>iChart.Text</link>,If given a string,it will only apply the text.note:If the text is empty,then will not display
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
				z_index:999,
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
		plugin : function(c) {
			c.inject(this);
			this.components.push(c);
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
				requestAnimFrame(function() {
					_.animation(_);
				});
			} else {
				requestAnimFrame(function() {
					_.variable.animation.time = 0;
					_.animationed = true;
					_.draw();
					_.processAnimation = false;
					_.fireEvent(_, 'afterAnimation', [_]);
				});
			}
		},
		doAnimation : function(t, d) {
			this.get('doAnimationFn').call(this, t, d);
		},
		doSort:function(){
			this.components.sor(function(p, q){return ($.isArray(p)?(p.zIndex||0):p.get('z_index'))>($.isArray(q)?(q.zIndex||0):q.get('z_index'))});
		},
		commonDraw : function() {
			$.Assert.isTrue(this.rendered, this.type + ' has not rendered.');
			$.Assert.isTrue(this.initialization, this.type + ' has initialize failed.');
			$.Assert.gtZero(this.data.length, this.type + '\'s data is empty.');
			
			/**
			 * console.time('Test for draw');
			 */

			if (!this.redraw) {
				this.doSort();
				if (this.title) {
					this.title.draw();
				}
				if (this.subtitle) {
					this.subtitle.draw();
				}
				if (this.footnote) {
					this.footnote.draw();
				}
				this.T.box(0, 0, this.width, this.height, this.get('border'), this.get('f_color'),0,true);
			}
			this.redraw = true;

			if (!this.animationed && this.get('animation')) {
				this.fireEvent(this, 'beforeAnimation', [this]);
				this.animation(this);
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
			var _ = this._(),d = _.get('data');
			if (!_.rendered) {
				var r = _.get('render');
				if (typeof r == "string" && document.getElementById(r))
					_.create(document.getElementById(r));
				else if (typeof r == 'object')
					_.create(r);
			}
			
			if (d.length > 0 && _.rendered && !_.initialization) {
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
		doConfig : function() {
			$.Chart.superclass.doConfig.call(this);

			var _ = this._(), E = _.variable.event, mCSS = _.get('default_mouseover_css'), O, AO;

			$.Assert.isArray(_.data);
				
			_.T.strokeStyle(true,_.get('brushsize'), _.get('strokeStyle'), _.get('lineJoin'));

			_.processAnimation = _.get('animation');

			_.duration = ceil(_.get('duration_animation_duration') * $.FRAME / 1000);

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
							if(M.stop){
								return false;
							}
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
				if (st) {
					_.push('subtitle.originx', l);
					_.push('subtitle.originy', _.get('title.originy') + _.get('title.height'));
					_.push('subtitle.width', w);
					_.subtitle = new $.Text(_.get('subtitle'), _);
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
})(iChart);
// @end
