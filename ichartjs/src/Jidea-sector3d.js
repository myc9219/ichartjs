	/**
	 * @overview this component use for abc
	 * @component#Jidea.Sector3D
	 * @extend#Jidea.Sector
	 */
	Jidea.Sector3D = Jidea.extend(Jidea.Sector,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Sector3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'sector3d';
			this.dimension = Jidea.Math._3D;
			
			this.configuration({
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
			this.target.sector3D(
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
			if(!Jidea.Math.inEllipse(e.offsetX - this.x,e.offsetY-this.y,this.get('semi_major_axis'),this.get('semi_minor_axis'))){
				return {valid:false};
			}
			if(Jidea.Math.inRange(this.sA,this.eA,(2*Math.PI - Jidea.Math.atanToRadian(this.x,this.y,e.offsetX,e.offsetY)))){
				return {valid:true};
			}
			return {valid:false};
		},
		p2p:function(x,y,a,z){
			return {
				x:x+this.get('semi_major_axis')*Math.cos(a)*z,
				y:y+this.get('semi_minor_axis')*Math.sin(a)*z
			};
		},
		tipInvoke:function(){
			var A = this.get('middleAngle'),
				Q  = Jidea.Math.quadrantd(A),
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
				Q  = Jidea.Math.quadrantd(A),
				self = this,
				ccw = this.get('counterclockwise');
				return {
					origin:{
						x:P2.x,
						y:P2.y
					},
					lineFn:function(){
						this.target.line(P2.x,P2.y+self.h/2,P.x,P.y+self.h/2,this.get('border.width')*4,this.get('border.color'),(ccw&&A<Math.PI)||(!ccw&&A>Math.PI));
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
			Jidea.Sector3D.superclass.doConfig.call(this);
			
			Jidea.Assert.gtZero(this.get('semi_major_axis'));
			Jidea.Assert.gtZero(this.get('semi_minor_axis'));
			
			this.a = this.get('semi_major_axis');
			this.b = this.get('semi_minor_axis');
			this.h = this.get('cylinder_height');
			
			
			if(!this.get('increment'))
				this.push('increment',Jidea.Math.lowTo(5,this.a/8));
			
			this.inc = Math.PI/180,ccw = this.get('counterclockwise');
			
			var toAngle = function(A){
				var t = Jidea.Math.atanToRadian(0,0,this.a*Math.cos(A),ccw?(-this.b*Math.sin(A)):(this.b*Math.sin(A)));
				if(!ccw&&t!=0){
					t = 2*Math.PI - t;
				}
				return t;
			}
			
			this.sA = toAngle.call(this,this.get('startAngle'));
			this.eA = toAngle.call(this,this.get('endAngle'));
			
			if(this.get('label.enable')){
				if(!this.get('label.linelength')){
					this.push('label.linelength',Jidea.Math.lowTo(10,this.a/8));
				}
				
				this.Z = this.get('label.linelength')/this.a+1;
				
				this.label = new Jidea.Label(this.get('label'),this);
			}
		}
});