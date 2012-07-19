	/**
	 * @overview this component use for abc
	 * @component#iChart.Sector3D
	 * @extend#iChart.Sector
	 */
	iChart.Sector3D = iChart.extend(iChart.Sector,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Sector3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'sector3d';
			this.dimension = iChart._3D;
			
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
			if(!iChart.inEllipse(e.offsetX - this.x,e.offsetY-this.y,this.a,this.b)){
				return {valid:false};
			}
			if(iChart.inRange(this.sA,this.eA,(2*Math.PI - iChart.atan2Radian(this.x,this.y,e.offsetX,e.offsetY)))){
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
				Q  = iChart.quadrantd(A),
				_ =  this;
			return function(w,h){
				var P = _.p2p(_.x,_.y,A,0.6);
				return {
					left:(Q>=2&&Q<=3)?(P.x - w):P.x,
					top:Q>=3?(P.y - h):P.y
				}
			}
		},
		doConfig:function(){
			iChart.Sector3D.superclass.doConfig.call(this);
			
			this.a = this.get('semi_major_axis');
			this.b = this.get('semi_minor_axis');
			this.h = this.get('cylinder_height');
			
			iChart.Assert.gtZero(this.a);
			iChart.Assert.gtZero(this.b);
			
			this.pushIf('increment',iChart.lowTo(5,this.a/8));
			
			this.inc = Math.PI/180,ccw = this.get('counterclockwise');
			
			var toAngle = function(A){
				var t = iChart.atan2Radian(0,0,this.a*Math.cos(A),ccw?(-this.b*Math.sin(A)):(this.b*Math.sin(A)));
				if(!ccw&&t!=0){
					t = 2*Math.PI - t;
				}
				return t;
			}
			this.sA = toAngle.call(this,this.get('startAngle'));
			this.eA = toAngle.call(this,this.get('endAngle'));
			
			if(this.get('label.enable')){
				this.pushIf('label.linelength',iChart.lowTo(10,this.a/8));
				this.Z = this.get('label.linelength')/this.a+1;
				var A = this.get('middleAngle'),
				Q  = iChart.quadrantd(A),
				
				P = this.p2p(this.x,this.y,A,this.Z),
				P2 = this.p2p(this.x,this.y,A,1),
				ccw = this.get('counterclockwise');
				
				this.push('label.originx',P2.x);
				this.push('label.originy',P2.y);
				this.push('label.quadrantd',Q);
				
				this.push('label.line_potins',[P2.x,P2.y+this.h/2,P.x,P.y+this.h/2]);
				this.push('label.line_globalComposite',(ccw&&A<Math.PI)||(!ccw&&A>Math.PI));
				this.push('label.labelx',P.x);
				this.push('label.labely',P.y+this.h/2);
				
				this.label = new iChart.Label(this.get('label'),this);
			}
		}
});//@end