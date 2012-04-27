;(function($){

var inc = Math.PI/90,PI = Math.PI,PI2 = 2*Math.PI,sin=Math.sin,cos=Math.cos;
 
/**
 * @private support an improved API for drawing in canvas
 */
function Cans(c){
	if (typeof c === "string")
        c = document.getElementById(c);
	if(!c||!c['tagName']||c['tagName'].toLowerCase()!='canvas'){
		throw new Error("there not a canvas element;can't use it");
	}
	this.canvas = c;
	
	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
}

Cans.prototype = {
	css:function(attr,style){
		if($.isDefined(style)){
			this.canvas.style[attr] = style;
		}else{
			return this.canvas.style[attr];
		}
	},
	isPointInPathArc:function(x,y,radius,s,e,color,ccw,a2r,x0,y0){
		var angle = s,x0,y0,ccw=!!ccw,a2r=!!a2r;
			if(!a2r)
			this.ctx.moveTo(x,y);
			this.ctx.beginPath();
			if(a2r)
			this.ctx.moveTo(x,y);
			this.ctx.arc(x,y,radius,s,e,ccw);
			this.ctx.lineTo(x,y);
			return this.ctx.isPointInPath(x0,y0);
	},
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
		this.ctx.save();
		this.fillStyle(c);
		if(!!last)//&&!$.isOpera
			this.ctx.globalCompositeOperation = "destination-over";
		if(b)
		this.strokeStyle(bw,bc);
		
		this.shadowOn(sw,swc,swb,swx,swy);
		
		this.ctx.moveTo(x,y);
		this.ctx.beginPath();
		
		this.ctx.arc(x,y,r,s,e,ccw);
		if(a2r){
			this.ctx.lineTo(x,y);
		}
		this.ctx.closePath();
		
	    this.ctx.fill();   
	    if(b)
	    this.ctx.stroke();
	    this.ctx.restore();
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
			this.ctx.save();
			if(!!last)
			this.ctx.globalCompositeOperation = "destination-over";
			if(b)
			this.strokeStyle(bow,boc);
			this.shadowOn(sw,swc,swb,swx,swy);
			
			this.ctx.moveTo(x,y);
			this.ctx.beginPath();
			if(a2r){
				this.ctx.moveTo(x,y);
			}
			this.fillStyle(c);
			
			while(angle<=e){
				this.ctx.lineTo(x+a*cos(angle),y+(ccw?(-b*sin(angle)):(b*sin(angle))));
				angle+=inc;
			}
			this.ctx.lineTo(x+a*cos(e),y+(ccw?(-b*sin(e)):(b*sin(e))));
			this.ctx.closePath();
			if(b)
			this.ctx.stroke();
			this.ctx.fill();
			this.ctx.restore();
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
				this.ctx.lineTo(x+a*cos(A),y+(h||0)+(ccw?(-b*sin(A)):(b*sin(A))));
			};
			s = ccw&&e>PI&&s<PI?PI:s;
			e = !ccw&&s<PI&&e>PI?PI:e;
			var angle = s;
			this.ctx.fillStyle = $.Math.dark(color);
			this.ctx.moveTo(x+a*cos(s),y+(ccw?(-b*sin(s)):(b*sin(s))));
			this.ctx.beginPath();
			while(angle<=e){
				Lo.call(this,angle);
				angle=angle+inc;
			}
			Lo.call(this,e);
			this.ctx.lineTo(x+a*cos(e),(y+h)+(ccw?(-b*sin(e)):(b*sin(e))));
			angle = e;
			while(angle>=s){
				Lo.call(this,angle,h);
				angle=angle-inc;
			}
			Lo.call(this,s,h);
			this.ctx.lineTo(x+a*cos(s),y+(ccw?(-b*sin(s)):(b*sin(s))));
			this.ctx.closePath();
			this.ctx.fill();
		},
		layerDraw = function(x,y,a,b,ccw,h,A,color){
			this.ctx.moveTo(x,y);
			this.ctx.beginPath();
			this.ctx.fillStyle = $.Math.dark(color);
			this.ctx.lineTo(x,y+h);
			var x0 = x+a*cos(A);
			var y0 = y+h+(ccw?(-b*sin(A)):(b*sin(A)));
			this.ctx.lineTo(x0,y0);
			this.ctx.lineTo(x0,y0-h);
			this.ctx.lineTo(x,y);
			this.ctx.closePath();
			this.ctx.fill();
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
			this.ctx.save();
			this.ctx.globalCompositeOperation = "destination-over";
			this.ctx.fillStyle = c;
			//paint inside layer
			layerPaint.call(this,x,y,a,b,s,e,ccw,h,c);
			//paint bottom layer
			this.ellipse(x,y+h,a,b,s,e,c,bo,bow,boc,sw,swc,swb,swx,swy,ccw,true);
			this.ctx.globalCompositeOperation = "source-over";
			
			//paint top layer
			//var g = this.avgRadialGradient(x,y,0,x,y,a,[$.Math.light(c,0.1),$.Math.dark(c,0.05)]);
			this.ellipse(x,y,a,b,s,e,c,bo,bow,boc,false,swc,swb,swx,swy,ccw,true);
			//paint outside layer
			sPaint.call(this,x,y,a,b,s,e,ccw,h,c);
			
			this.ctx.restore();
			return this;
		}
	}(),
	textStyle:function(align,line,font){
		return this.textAlign(align).textBaseline(line).textFont(font);
	},
	strokeStyle:function(w,c,j){
		if(w)
		this.ctx.lineWidth = w;
		if(c)
		this.ctx.strokeStyle = c;
		if(j)
		this.ctx.lineJoin = j;
		return this;
	},
	globalAlpha:function(v){
		if(v)
		this.ctx.globalAlpha = v;
		return this;
	},
	fillStyle:function(c){
		if(c)
		this.ctx.fillStyle = c;
		return this;
	},
	textAlign:function(align){
		if(align)
		this.ctx.textAlign =align;
		return this;
	},
	textBaseline:function(line){
		if(line)
		this.ctx.textBaseline =line;
		return this;
	},
	textFont:function(font){
		if(font)
		this.ctx.font = font;
		return this;
	},
	shadowOn:function(s,c,b,x,y){
		if($.isString(s)){
			y = x;x = b;b = c;c = s;c = true;
		}
		if(s){
			this.ctx.shadowColor = c; 
			this.ctx.shadowBlur = b;
			this.ctx.shadowOffsetX = x;   
			this.ctx.shadowOffsetY = y; 
		}
		return this;
	},
	shadowOff:function(){
		this.ctx.shadowColor = 'white'; 
		this.ctx.shadowBlur = this.ctx.shadowOffsetX= this.ctx.shadowOffsetY = 0;
	},
	avgLinearGradient:function(xs,ys,xe,ye,c){
		var g = this.createLinearGradient(xs, ys, xe, ye);
		for(var i =0;i<c.length;i++	)
			g.addColorStop(i/(c.length-1),c[i]);   
		return g;
	},
	createLinearGradient:function(xs, ys, xe, ye){
		return this.ctx.createLinearGradient(xs, ys, xe, ye);    
	},
	avgRadialGradient:function(xs, ys,rs,xe, ye,re,c){
		var g = this.createRadialGradient(xs,ys,rs,xe,ye,re);
		for(var i =0;i<c.length;i++	)
			g.addColorStop(i/(c.length-1),c[i]);   
		return g;
	},
	createRadialGradient:function(xs, ys,rs,xe, ye,re){
		return this.ctx.createRadialGradient(xs, ys,rs,xe, ye,re);    
	},
	fillText:function(text,x,y,maxwidth,color,mode,lineheight){
		text = text+"";
		maxwidth = maxwidth || false;
		mode = mode || 'lr'; 
		lineheight = lineheight || 16;
		this.fillStyle(color);
		var T = text.split(mode=='tb'?"":"\n");
		for(var i =0;i<T.length;i++){
			if(maxwidth){
				this.ctx.fillText(T[i],x,y,maxwidth);
			}else{
				this.ctx.fillText(T[i],x,y);
			}
			y+=lineheight;
		}
		return this;
	},
	measureText:function(text){
		return this.ctx.measureText(text).width;
	},
	moveTo:function(x,y){
		x = x||0;
		y = y ||0;
		this.ctx.moveTo(x,y);
		return this;
	},
	lineTo:function(x,y){
		x = x||0;
		y = y ||0;
		this.ctx.lineTo(x,y);
		return this;
	},
	save:function(){this.ctx.save();return this;},
	restore:function(){this.ctx.restore();return this;},
	beginPath:function(){
		this.ctx.beginPath();
		return this;
	},
	closePath:function(){
		this.ctx.closePath();
		return this;
	},
	stroke:function(){
		this.ctx.stroke();
		return this;
	},
	fill:function(){
		this.ctx.fill();
		return this;
	},
	text:function(text,x,y,maxwidth,color,align,line,font,mode,lineheight){
		this.ctx.save();
		this.textStyle(align,line,font);
		this.fillText(text,x,y,maxwidth,color,mode,lineheight);
		this.ctx.restore();
		return this;
	},
	//can use cube3D instead of this?
	cube:function(x,y,xv,yv,width,height,zdeep,bg,b,bw,bc,sw,swc,swb,swx,swy){
		x = $.Math.fixDeckle(bw,x);
		y = $.Math.fixDeckle(bw,y);
		zdeep = (zdeep&&zdeep>0)?zdeep:width;
		var x1=x+zdeep*xv,y1=y-zdeep*yv;
		x1 = $.Math.fixDeckle(bw,x1);
		y1 = $.Math.fixDeckle(bw,y1);
		//styles -> top-front-right
		if(sw){
			this.polygon(bg,b,bw,bc,sw,swc,swb,swx,swy,false,[x,y,x1,y1,x1+width,y1,x+width,y]);
			this.polygon(bg,b,bw,bc,sw,swc,swb,swx,swy,false,[x,y,x,y+height,x+width,y+height,x+width,y]);
			this.polygon(bg,b,bw,bc,sw,swc,swb,swx,swy,false,[x+width,y,x1+width,y1,x1+width,y1+height,x+width,y+height]);
		}
		/**
		 * clear the shadow on the body
		 */
		this.polygon($.Math.dark(bg),b,bw,bc,false,swc,swb,swx,swy,false,[x,y,x1,y1,x1+width,y1,x+width,y]);
		this.polygon(bg,b,bw,bc,false,swc,swb,swx,swy,false,[x,y,x,y+height,x+width,y+height,x+width,y]);
		this.polygon($.Math.dark(bg),b,bw,bc,false,swc,swb,swx,swy,false,[x+width,y,x1+width,y1,x1+width,y1+height,x+width,y+height]);
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
		x = $.Math.fixDeckle(bw,x);
		y = $.Math.fixDeckle(bw,y);
		//Deep of Z'axis
		if(!zh||zh==0)
			zh = w;
		
		if(angle){
			var P = $.Math.vectorP2P(rotatex,rotatey);
				rotatex=x+zh*P.x,
				rotatey=y-zh*P.y;
		}else{
			rotatex=x+zh*rotatex,
			rotatey=y-zh*rotatey;
		}
		
		while(styles.length<6)
			styles.push(false);
		
		rotatex = $.Math.fixDeckle(bw,rotatex);
		rotatey = $.Math.fixDeckle(bw,rotatey);
		
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
		this.ctx.save();
		this.strokeStyle(bw,bc);
		this.ctx.beginPath();
		this.fillStyle(bg)
			.globalAlpha(alpham)
			.shadowOn(sw,swc,swb,swx,swy)
			.moveTo(points[0],points[1]);
		
		for(var i=2;i<points.length;i+=2){
			this.lineTo(points[i],points[i+1]);
		}
		this.ctx.closePath();
		if(b){
			this.ctx.stroke();
		}
		this.ctx.fill();
		this.ctx.restore();
		return this;
	},
	line:function(x1,y1,x2,y2,w,c,last){
		if(!w||w==0)return this;
		this.ctx.save();
		if(!!last)
			this.ctx.globalCompositeOperation = "destination-over";
		
		x1 = $.Math.fixDeckle(w,x1);
		y1 = $.Math.fixDeckle(w,y1);
		x2 = $.Math.fixDeckle(w,x2);
		y2 = $.Math.fixDeckle(w,y2);
		
		this.ctx.beginPath();
		this.strokeStyle(w,c).moveTo(x1,y1).lineTo(x2,y2).ctx.stroke();
		this.ctx.closePath();
		this.ctx.restore();
		return this;
	},
	round:function(x,y,r,c,bw,bc){
		this.ctx.beginPath();
		this.ctx.fillStyle = c;
		this.ctx.arc(x, y, r, 0, PI2, false);
		this.ctx.closePath();
		this.ctx.fill();
		if(bw){
			this.ctx.lineWidth = bw;
			this.ctx.strokeStyle = bc || '#010101';
			this.ctx.stroke();
		}
		return this;
	},
	backgound:function(x,y,w,h,bgcolor){
		this.ctx.save();
		this.ctx.globalCompositeOperation = "destination-over";
		this.ctx.translate(x,y);
		this.ctx.beginPath();
		this.ctx.fillStyle = bgcolor;
		this.ctx.fillRect(0,0,w,h);
		this.ctx.restore();
		return this;
	},
	rectangle:function(x,y,w,h,bgcolor,border,linewidth,bcolor,sw,swc,swb,swx,swy){
		this.ctx.save();
		x = $.Math.fixDeckle(linewidth,x);
		y = $.Math.fixDeckle(linewidth,y);
		this.ctx.translate(x,y);
		this.ctx.beginPath();
		this.ctx.fillStyle = bgcolor;
		this.shadowOn(sw,swc,swb,swx,swy);
		if(border&&$.isNumber(linewidth)){
			this.ctx.lineWidth = linewidth;
			this.ctx.strokeStyle = bcolor;
			this.ctx.strokeRect(0,0,w,h);
		}
		
		this.ctx.fillRect(0,0,w,h);
		
		if(border&&$.isArray(linewidth)){
			this.ctx.strokeStyle = bcolor;
			this.line(0,0,w,0,linewidth[0],bcolor);
			this.line(w,0,w,h,linewidth[1],bcolor);
			this.line(0,h,w,h,linewidth[2],bcolor);
			this.line(0,0,0,h,linewidth[3],bcolor);
		}
		this.ctx.restore();
		return this;
	},
	clearRect:function(x,y,w,h){
		x = x || 0;
		y = y || 0;
		w = w || this.width;
		h = h || this.height;
		this.ctx.clearRect(x, y, w, h); 
		return this;
	},
	drawBorder:function(x,y,w,h,line,color,round,bgcolor,last,shadow,scolor,blur,offsetx,offsety){
		this.ctx.save();
		var x0 = $.Math.fixDeckle(line,x);
		var y0 = $.Math.fixDeckle(line,y);
		if(x0!=x){
			x = x0;w -=1;
		}
		if(y0!=y){
			y = y0;h -=1;
		}
		this.ctx.translate(x,y);
		this.ctx.lineWidth = line;
		this.ctx.strokeStyle = color;
		
		if(!!last){
			this.ctx.globalCompositeOperation = "destination-over";
		}
		if(bgcolor){
			this.ctx.fillStyle = bgcolor;
		}
		if($.isArray(round)){//draw a round corners border
			this.ctx.beginPath();
			this.ctx.moveTo(round[0],0);
			this.ctx.lineTo(w-round[1],0);
			this.ctx.arcTo(w,0,w,round[1],round[1]);
			this.ctx.lineTo(w,h-round[2]);
			this.ctx.arcTo(w,h,w-round[2],h,round[2]);
			this.ctx.lineTo(round[3],h);
			this.ctx.arcTo(0,h,0,h-round[3],round[3]);
			this.ctx.lineTo(0,round[0]);
			this.ctx.arcTo(0,0,round[0],0,round[0]);
			this.ctx.closePath();
			this.shadowOn(shadow,scolor,blur,offsetx,offsety);
			if(bgcolor){
				this.ctx.fill();
			}
			if(shadow)
			this.shadowOff();
			this.ctx.globalCompositeOperation = "source-over";
			
			this.ctx.stroke();
		}else{//draw a rectangular border	
			this.shadowOn(shadow,scolor,blur,offsetx,offsety);
			if(bgcolor){
				this.ctx.fillRect(0,0,w,h);
			}
			if(shadow)
			this.shadowOff();
			this.ctx.strokeRect(0,0,w,h);
		}
		this.ctx.restore();
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
 * @author wanghe
 * @component#Jidea.Chart
 * @extend#Jidea.Painter
 */
$.Chart = $.extend($.Painter,{
		/**
		 * @cfg {TypeName} 
		 */
		configure:function(){
			/**
			 * indicate the module's type
			 */
			this.type = 'chart';
			
			this.configuration({
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
				 title_lineheight:25,
				 showpercent:true,
				 decimalsnum:1,
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
				 },
				 border:{
					radius:5
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
			
			this.target = null;
			this.rendered = false;
			this.autoInitialized = false;
			
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
			return this.target.toImageURL();
		},
		segmentRect:function(){
			this.target.clearRect(this.get('l_originx'),this.get('t_originy'),this.get('client_width'),this.get('client_height'));
		},
		resetCanvas:function(){
			this.target.backgound(
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
				this.drawTitle();
				if(this.get('border.enable')){
					this.target.drawBorder(0,0,this.width,this.height,this.get('border.width'),this.get('border.color'),this.get('border.radius')==0?0:$.Math.parseBorder(this.get('border.radius')),this.get('background_color'),true);
				}else{
					this.target.backgound(0,0,this.width,this.height,this.get('background_color'));
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
		drawTitle:function(){
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
				this.target.textAlign(this.get('title_align'));
				if(this.get('title_valign')=='bottom'){
					this.push('title_originy',this.height-this.get('padding_bottom'));
				}else{
					this.push('title_originy',this.get('padding_top'));	
				}
				this.target.textBaseline(this.get('title_valign'));
				
			}
			this.target.textFont($.getFont(this.get('title_fontweight'),this.get('title_fontsize'),this.get('title_font')));
			this.target.fillText(this.get('title'),this.get('title_originx'),this.get('title_originy'),this.get('client_width'),this.get('title_color'));
		},
		create:function(shell){
			//默认的要计算为warp的div
			this.width =  this.push('width',this.get('width')||400);
			this.height = this.push('height',this.get('height')||300);
			var style = "width:"+this.width+"px;height:"+this.height+"px;padding:0px;overflow:hidden;position:relative;";
			
			
			
			var id = $.Math.iGather(this.type);
			this.shellid = $.Math.iGather(this.type+"-shell");
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
			this.target = new Cans(this.element);
			
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
			
			if(this.get('debug')){
				this.on('beforedraw',function(e){
					this.START_RUN_TIME = new Date().getTime();
					return true;
				});
				
				this.on('draw',function(e){
					this.END_RUN_TIME = new Date().getTime();
					this.RUN_TIME_COST = this.END_RUN_TIME - this.START_RUN_TIME;
				});
				
			}
			
			if(this.get('animation')){
				this.processAnimation = this.get('animation');
				this.duration = Math.ceil(this.get('duration_animation_duration')*$.FRAME/1000);
				this.variable.animation = {time:0};
				this.animationArithmetic = $.getAnimationArithmetic(this.get('animation_timing_function'));
			}
			
			if(this.is3D()){
				$.Interface._3D.call(this);
			}
			
			this.target.strokeStyle(this.get('brushsize'),this.get('strokeStyle'),this.get('lineJoin'));
			
			var self = this;
			
			this.target.addEvent('click',function(e){self.fireEvent(self,'click',[$.Event.fix(e)]);},false);
			
			this.target.addEvent('mousemove',function(e){self.fireEvent(self,'mousemove',[$.Event.fix(e)]);},false);
			
			this.on('click',function(e){
				if(this.processAnimation)return;
				//console.time('Test for click');
				var cot;
				for(var i = 0;i < this.components.length;i++){
					cot = this.components[i];
					if(cot.preventEvent)continue;
					var M = cot.isMouseOver(e);
					if(M.valid)
						this.components[i].fireEvent(cot,'click',[e,M]);
				}
				//console.timeEnd('Test for click');
			});
			
			this.on('mousemove',function(e){
				if(this.processAnimation)return;
				//console.time('Test for doMouseMove');
				var O = false;
				for(var i = 0;i < this.components.length;i++){
					var cot;
					cot = this.components[i];
					if(cot.preventEvent)continue;
					var M = cot.isMouseOver(e);
					if(M.valid){
						O = true;
						if(!this.variable.event.mouseover){
							this.variable.event.mouseover = true;
							this.target.css("cursor","pointer");
							this.fireEvent(this,'mouseover',[e]);
						}
						if(!cot.variable.event.mouseover){
							cot.variable.event.mouseover = true;
							cot.fireEvent(cot,'mouseover',[e,M]);
						}
						cot.fireEvent(cot,'mousemove',[e,M]);
					}else{
						if(cot.variable.event.mouseover){
							cot.variable.event.mouseover = false;
							cot.fireEvent(cot,'mouseout',[e,M]);
						}
					}
				}
				
				if(!O&&this.variable.event.mouseover){
					this.variable.event.mouseover = false;
					this.target.css("cursor","default");
					this.fireEvent(this,'mouseout',[e]);
				}
				//console.timeEnd('Test for doMouseMove');
			});
			$.Assert.isArray(this.data);
			
			this.push('l_originx',this.get('padding_left'));
			this.push('r_originx',this.width - this.get('padding_right'));
			this.push('t_originy',this.get('padding_top'));
			this.push('b_originy',this.height-this.get('padding_bottom'));
					
			var offx = 0,offy=0;
			
			if(this.get('title')!=''){
				if(this.get('title_writingmode')=='tb'){//竖直排列
					offx = this.get('title_height');
					if(this.get('title_align')=='left'){
						this.push('l_originx',this.get('l_originx')+this.get('title_height'));
					}else{
						this.push('r_originx',this.width-this.get('l_originx')-this.get('title_height'));
					}
				}else{//横向排列
					offy = this.get('title_height');
					
					if(this.get('title_align')=='left'){
						this.push('title_originx',this.get('padding_left'));
					}else if(this.get('title_align')=='right'){
						this.push('title_originx',this.width-this.get('padding_right'));
					}else{
						this.push('title_originx',this.get('client_width')/2);//goto midline
					}	
					if(this.get('title_valign')=='bottom'){
						this.push('title_originy',this.height-this.get('padding_bottom'));
						this.push('b_originy',this.height-this.get('b_originy')-this.get('title_height'));
					}else{
						this.push('t_originy',this.get('t_originy')+this.get('title_height'));
						this.push('title_originy',this.get('padding_top'));	
					}
				}
			}	
			
			this.push('client_width',(this.get('width') - this.get('padding_left') - this.get('padding_right')-offx));
			this.push('client_height',(this.get('height') - this.get('padding_top') - this.get('padding_bottom')-offy));
			
			this.push('minDistance',Math.min(this.get('client_width'),this.get('client_height')));
			this.push('maxDistance',Math.max(this.get('client_width'),this.get('client_height')));
			this.push('minstr',this.get('client_width')<this.get('client_height')?'width':'height');
			
			this.push('centerx',this.get('l_originx')+this.get('client_width')/2);
			this.push('centery',this.get('t_originy')+this.get('client_height')/2);
			
			if(this.get('border.enable')){
				var round = $.Math.parseBorder(this.get('border.radius'));
				this.push('radius_top',round[0]);
				this.push('radius_right',round[1]);
				this.push('radius_bottom',round[2]);
				this.push('radius_left',round[3]);
			}
			
			/**
			 * legend
			 */
			if(this.get('legend.enable')){
				this.legend = new $.Legend($.apply({
				 	 maxwidth:this.get('client_width'),
				 	 data:this.data
				},this.get('legend')),this);
				
				this.components.push(this.legend);
			}
			/**
			 * tip's wrap
			 */
			if(this.get('tip.enable')){
				this.push('tip.wrap',this.shell);
			}
			
		},
		setData:function(d) { 
			this.data = d;
		}
});
})(Jidea);
