;(function(){

var sin = Math.sin, cos = Math.cos, tan = Math.tan,
		acos = Math.acos, sqrt = Math.sqrt, abs = Math.abs,
		pi = Math.PI, pi2 = 2*Math.PI,ceil=Math.ceil,
		parseParam =  function(s,d) {
					if(Jidea.isNumber(s))
						return new Array(s,s,s,s);
					s = s.trim().replace(/\s{2,}/g,/\s/).replace(/\s/g,',').split(",");
					if(s.length==1){
						s[0] = s[1] = s[2] = s[3] = parseFloat(s[0])||d;
					}else if(s.length==2){
						s[0] = s[2] = parseFloat(s[0])||d;
						s[1] = s[3] = parseFloat(s[1])||d;
					}else if(s.length==3){
						s[0] = parseFloat(s[0])||d;
						s[1] = s[3] = parseFloat(s[1])||d;
						s[2] = parseFloat(s[2])||d;
					}else{
						s[0] = parseFloat(s[0])||d;
						s[1] = parseFloat(s[1])||d;
						s[2] = parseFloat(s[2])||d;
						s[3] = parseFloat(s[3])||d;
					}
				return s;
		},
		factor = function(v){
			if(v==0)return v;
			var f = v/10,i=0;
				while(f<1){
					f *= 10;
					i++;
				}
				while(f/10>1){
					f /= 10;
					i--;
				}
				f = Math.floor(f);
				while(i>0){
					f /=10;
					i--;
				}
				while(i<0){
					f *=10;
					i++;
				}
			return f;
		},
		innerColor  = ["navy","olive","silver","gold","lime","fuchsia","aqua","green","red","blue","pink","purple","yellow","maroon","black","gray","white"],	
		colors = {
			aqua:'rgb(0,255,255)',
			azure:'rgb(240,255,255)',
			beige:'rgb(245,245,220)',
			black:'rgb(0,0,0)',
			blue:'rgb(0,0,255)',
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
			fuchsia:'rgb(255,0,255)',
			gold:'rgb(255,215,0)',
			green:'rgb(0,128,0)',
			indigo:'rgb(75,0,130)',
			khaki:'rgb(240,230,140)',
			lightblue:'rgb(173,216,230)',
			lightcyan:'rgb(224,255,255)',
			lightgreen:'rgb(144,238,144)',
			lightgrey:'rgb(211,211,211)',
			lightpink:'rgb(255,182,193)',
			lightyellow:'rgb(255,255,224)',
			lime:'rgb(0,255,0)',
			magenta:'rgb(255,0,255)',
			maroon:'rgb(128,0,0)',
			navy:'rgb(0,0,128)',
			olive:'rgb(128,128,0)',
			orange:'rgb(255,165,0)',
			pink:'rgb(255,192,203)',
			purple:'rgb(128,0,128)',
			violet:'rgb(128,0,128)',
			red:'rgb(255,0,0)',
			silver:'rgb(192,192,192)',
			white:'rgb(255,255,255)',
			yellow:'rgb(255,255,0)',
			transparent: 'rgb(255,255,255)'
		},
		hexToRgb = function(hex) {
			hex = hex.replace(/#/g,"").replace(/^(\w)(\w)(\w)$/,"$1$1$2$2$3$3");
			return  'rgb(' + parseInt(hex.substring(0, 2), 16) + ','
					+ parseInt(hex.substring(2, 4), 16) + ','
					+ parseInt(hex.substring(4, 6), 16) + ')';
		},
		rgbToHex=function(rgb) {
			var matches = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
			if (!matches) {
				return;
			}
			return ('#' + Jidea.Math.iToHex(matches[1]) + Jidea.Math.iToHex(matches[2]) + Jidea.Math.iToHex(matches[3])).toUpperCase();
		},
		iToHex=function (N) {
			return ('0'+parseInt(N).toString(16)).slice(-2);
		},
		round = Math.round,
		floor=Math.floor,
		//the increment of s(v) of hsv model
		s_inc = 0,
		v_inc = 0.14,
		/**
		 * 当目标值>0.1时:以增量iv为上限、随着目标值的减小增量减小
		 * 当目标值<=0.1时:若指定的增量大于目标值则直接返回其1/2、否则返回增量值
		 */
		increament = function(v,iv){
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
			rgb = Jidea.Math.cToArray(Jidea.Math.toRgb(rgb));
			var hsv = Jidea.Math.toHsv(rgb);
			hsv[1] -=is||s_inc;
			if(d){
				hsv[2] -=increament(hsv[2],iv);
				hsv[1] = Jidea.Math.upTo(hsv[1],1);
				hsv[2] = Jidea.Math.lowTo(hsv[2],0);
			}else{
				hsv[2] +=increament((1-hsv[2]),iv);
				hsv[1] = Jidea.Math.lowTo(hsv[1],0);
				hsv[2] = Jidea.Math.upTo(hsv[2],1);
			}
			return Jidea.Math.hsvToRgb(hsv,rgb[3]);
		};
		
		Jidea.Math = {
			parseBorder:function(s,d) {
				return parseParam(s,d);	
			},
			parsePadding:function(s,d) {
				return parseParam(s,d);	
			},
			/**
			 * the distance of two point
			 * @param {Number} x1
			 * @param {Number} y1
			 * @param {Number} x2
			 * @param {Number} y2
			 * @return {Number} 
			 */
			distanceP2P:function(x1,y1,x2,y2){
				return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
			},
			/**
			 * the angle of two line that two point and x-axis positive direction,anticlockwise
			 * @param {Number} ox
			 * @param {Number} oy
			 * @param {Number} x
			 * @param {Number} y
			 * @return {Number} 
			 */
			atanToAngle:function(ox,oy,x,y){
				if(ox==x){
					if(y>oy)return 90;
					return 270;
				}
				var quadrant = Jidea.Math.quadrant(ox,oy,x,y);
				var angle = Jidea.Math.radianToAngle(Math.atan(Math.abs((oy-y)/(ox-x))));
				if(quadrant==1){
					angle = 180 - angle;
				}else if(quadrant==2){
					angle = 180 + angle;
				}else if(quadrant==3){
					angle = 360 - angle;
				}
				return angle;
			},
			atanToRadian:function(ox,oy,x,y){
				if(ox==x){
					if(y>oy)return Math.PI/2;
					return Math.PI*3/2;
				}
				var quadrant = Jidea.Math.quadrant(ox,oy,x,y);
				var radian = Math.atan(Math.abs((oy-y)/(ox-x)));
				if(quadrant==1){
					radian = Math.PI - radian;
				}else if(quadrant==2){
					radian = Math.PI + radian;
				}else if(quadrant==3){
					radian = 2*Math.PI - radian;
				}
				return radian;
			},
			angleToRadian:function(angle){
				return angle*Math.PI/180;
			},
			radianToAngle:function(radian){
				return radian*180/Math.PI;
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
			quadrantd:function(angle){
				angle = 2*(angle%(Math.PI*2));
				return ceil(angle/Math.PI);
			},
			upTo:function (u,v){
				return v>u?u:v;
			},
			lowTo:function (low,value){
				return value<low?low:value;
			},
			between:function(low,up,value){
				return Jidea.Math.lowTo(low,Jidea.Math.upTo(up,value));
			},
			inRange:function(low,up,value){
				return up>value&&low<value;
			},
			angleInRange:function(low,up,value){
				low = low%pi2;
				up  =  up%pi2;
				if(up>low){
					return up>value&&low<value;
				}
				if(up<low){
					return value <up || value >low;
				}
				return value ==up;
			},
			inRangeClosed:function(low,up,value){
				return up>=value&&low<=value;
			},
			inEllipse:function(x,y,a,b){
				return (x*x/a/a+y*y/b/b)<=1;
			},
			pToPoint:function(x,y,a,C){
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
//				var L = Math.sin(Jidea.Math.angleToRadian(y)),
//					A = Jidea.Math.angleToRadian(x);
//				return {
//					x:L*Math.sin(A),
//					y:L*Math.cos(A)
//				}
				if(!radian){
					y = Jidea.Math.angleToRadian(y);
					x = Jidea.Math.angleToRadian(x);
				}
				y = Math.sin(y);
				return {
					x:y*Math.sin(x),
					y:y*Math.cos(x)
				}
			},
			fixDeckle:function(w,c){
				return w<=1?(Math.floor(c)+0.5):Math.floor(c);
			},
			iGather : function(P){
				return (P||'magic') + '-'+new Date().getTime().toString();
			},
			toPercent:function(v,d){
				return '('+(v*100).toFixed(d)+'%)';
			},
			parseFloat:function(v,d){
				if(!Jidea.isNumber(v)){
					v = parseFloat(v);
					if(!Jidea.isNumber(v)){
						throw new Error("'"+d+"'is not a valid number.");
					}
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
			toRgb:function (color) {
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
					return hexToRgb(color);
				if(colors[color])
					return colors[color];
				throw new Error("invalid colors value '"+color+"'");
			},
			light:function (rgb,iv,is) {
				return anole(false,rgb,iv,is);
			},
			dark:function (rgb,iv,is) {
				return anole(true,rgb,iv,is);				
			},
			cToArray:function(rgb){
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
			toHsv:function(r,g,b){
				if(Jidea.isArray(r)){
					g = r[1];
					b = r[2];
					r = r[0];
				}
				r = r/255;
				g = g/255;
				b = b/255;
				var max  = Math.max(Math.max(r,g),b),
					min  = Math.min(Math.min(r,g),b),
					dv = max - min;
				if(dv == 0){
					return new Array(0,0,max);
				}
				var h;
				if(r==max){
					h = (g-b)/dv;
				}else if(g==max){
					h = (b-r)/dv + 2;
				}else if(b==max){
					h = (r-g)/dv + 4;
				}
				h*=60;
				if(h<0)h+=360;
				return new Array(h,dv/max,max);
			},
			hsvToRgb:function(h,s,v,a){
				if(Jidea.isArray(h)){
					a = s;
					s = h[1];
					v = h[2];
					h = h[0];
				}
				var r,g,b,hi,f;
					hi = floor(h/60)%6;//5
					f = h/60 - hi;//0
					p = v*(1-s);//0
				    q = v*(1-s*f);//0.8		 v:1
				    t = v*(1-s*(1-f));//0    v://0.8
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
			fixPixel: function(v) {
				return Jidea.isNumber(v)?v:parseFloat(v.replace('px',""))||0 ;
			},
			toPixel: function(v) {
				return Jidea.isNumber(v)?v+'px':Jidea.Math.fixPixel(v)+'px';
			}
		}
})();