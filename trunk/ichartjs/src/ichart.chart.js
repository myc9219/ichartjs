;
(function($) {

	var PI = Math.PI, inc = PI / 90,inc2 = inc/2, ceil = Math.ceil, floor = Math.floor, PI2 = 2 * PI, max = Math.max, min = Math.min, sin = Math.sin, cos = Math.cos, fd = function(w, c) {
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
		
		if($.isArray(this.get('labels'))){
			ML = this.get('labels').length>ML?this.get('labels').length:ML;
		}
		
		this.push('maxItemSize',ML);
		this.push(n,MI);
		this.push(x,M);
		
	},
	complex = function(c){
		this.labels = this.get('labels');
		var M=0,MI=0,V,d,L=this.labels.length;
		this.columns = [];this.total = 0;
		for(var i=0;i<L;i++){
			var item = [];
			for(var j=0;j<c.length;j++){
				d = c[j];
				V = d.value[i];
				if(!V)continue;
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
				name:this.labels[i],
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
		text : function(t, x, y, max, color, align, line, font, mode, h,sw,ro) {
			if(t=='')return this;
			return this.save().textStyle(align, line, font).fillText(t, x, y, max, color, mode, h,sw,ro).restore();
		},
		fillText : function(t, x, y, max, color, mode, h,sw,ro) {
			t = t.toString();
			max = max || false;
			mode = mode || 'lr';
			h = h || 16;
			this.save().fillStyle(color).translate(x,y).rotate(inc2*ro).shadowOn(sw);
			var T = t.split(mode == 'tb' ? "" : "\n");
			T.each(function(t) {
				try {
					if (max)
						this.c.fillText(t, 0,0, max);
					else
						this.c.fillText(t, 0, 0);
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
			if (p.length < 4||!w)
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
			if (p.length < 2||!w)
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
		rotate : function(r) {
			this.c.rotate(r);
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
	 * the public method,inner use
	 */
	$.taylor = {
		light:function(_,e){
			e.highlight = false;
			_.on('mouseover',function(){
				e.highlight = true;
				_.redraw();
			}).on('mouseout',function(){
				e.highlight = false;
				_.redraw();
			}).on('beforedraw',function(){
				_.push('f_color',e.highlight?_.get('light_color'):_.get('f_color_'));
				return true;
			});
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
			/**
			 * indicate the data structure
			 */
			this.dataType = 'simple';

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
			 * @paramter int#value the value of item
			 * @paramter int#i the index of item
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
			_.doAnimation(_.variable.animation.time, _.duration,_);
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
			this.components.sor(function(p, q){
				return ($.isArray(p)?(p.zIndex||0):p.get('z_index'))>($.isArray(q)?(q.zIndex||0):q.get('z_index'))});
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
			_.components.each(function(c) {
				//console.log(c.type+","+(c.zIndex||c.get('z_index')));
			});
			
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
		 * @paramter <link>iChart.Custom</link>#component 
		 * @return void
		 */
		plugin : function(c) {
			c.inject(this);
			this.components.push(c);
			this.plugins(c);
		},
		/**
		 * @method return the title,return undefined if unavailable
		 * @return <link>iChart.Text</link>#the title object
		 */
		getTitle:function(){
			return this.title;
		},
		/**
		 * @method return the subtitle,return undefined if unavailable
		 * @return <link>iChart.Text</link>#the subtitle object
		 */
		getSubTitle:function(){
			return this.subtitle;
		},
		/**
		 * @method return the footnote,return undefined if unavailable
		 * @return <link>iChart.Text</link>#the footnote object
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
			_.width = _.pushIf(_.W, 400);
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
					var M = C.isMouseOver(e);
					if (M.valid){
						E.click = true;
						C.fireEvent(C,'click', [C, e, M]);
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
								//console.log(cot.type+"mouseover");
								cE.mouseover = true;
								cot.fireEvent(cot, 'mouseover', [cot,e, M]);
							}
							cot.fireEvent(cot, 'mousemove', [cot,e, M]);
							if(M.stop){
								return false;
							}
						} else {
							if (cE.mouseover) {
								//console.log(cot.type+"mouseout");
								cE.mouseover = false;
								cot.fireEvent(cot, 'mouseout', [cot,e, M]);
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
		getPercent:function(v){
			return this.get('showpercent') ? iChart.toPercent(v / this.total, this.get('decimalsnum')) : v;
		},
		doActing:function(_,d,o,i,t){
			var f=!!_.get('communal_acting');
			/**
			 * store or restore the option
			 */
			_.push(f?'sub_option':'communal_acting',iChart.clone(_.get(f?'communal_acting':'sub_option'),true));
			/**
			 * merge the option
			 */
			iChart.merge(_.get('sub_option'),d);
			
			/**
			 * merge specific option
			 */
			iChart.merge(_.get('sub_option'),o);
			
			/**
			 * prevent there no property background_color,use coloe instead
			 */
			_.pushIf('sub_option.background_color', d.color);
			
			if (_.get('sub_option.tip.enable')){
				_.push('sub_option.tip.text', _.fireString(_, 'parseTipText', [d,d.value,i],(t || (d.name + ' ' +_.getPercent(d.value)))));
			}
			
		},
		doConfig : function() {
			
			$.Chart.superclass.doConfig.call(this);
			
			var _ = this._();
			
			$.Assert.isArray(_.data);
				
			_.T.strokeStyle(true,_.get('brushsize'), _.get('strokeStyle'), _.get('lineJoin'));

			_.processAnimation = _.get('animation');
			
			/**
			 * for store the option of each item in chart
			 */
			_.push('communal_acting',0);
			
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
			_.oneways.push(new iChart.Custom({
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

			var H = 0, l = _.push('l_originx', _.get('padding_left')), t = _.push('t_originy', _.get('padding_top')), w = _.push('client_width', (_.get(_.W) - _.get('hpadding'))), h;

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
			_.push('minstr', w < h ? _.W : 'height');

			_.push('centerx', l + w / 2);
			_.push('centery', t + h / 2);
			
			/**
			 * clone config to sub_option
			 */
			iChart.applyIf(_.get('sub_option'), iChart.clone(['shadow', 'shadow_color', 'shadow_blur', 'shadow_offsetx', 'shadow_offsety','tip'], _.options));
				
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
			_.push('sub_option.tip.wrap', _.shell);
			
		}
	});
})(iChart);
/**
 * @end
 */

