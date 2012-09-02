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
			var _ =  this,A =  _.get('middleAngle'),Q  = iChart.quadrantd(A);
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
			var _ = this,ccw = _.get('counterclockwise'),mA = _.get('middleAngle');
			
			_.a = _.get('semi_major_axis');
			_.b = _.get('semi_minor_axis');
			_.h = _.get('cylinder_height');
			
			iChart.Assert.gtZero(_.a);
			iChart.Assert.gtZero(_.b);
			
			_.pushIf('increment',iChart.lowTo(5,_.a/8));
			
			var toAngle = function(A){
				var t = iChart.atan2Radian(0,0,_.a*Math.cos(A),ccw?(-_.b*Math.sin(A)):(_.b*Math.sin(A)));
				if(!ccw&&t!=0){
					t = 2*Math.PI - t;
				}
				return t;
			},
			inc = this.get('increment');
			
			_.sA = toAngle.call(_,_.get('startAngle'));
			_.eA = toAngle.call(_,_.get('endAngle'));
			_.mA = toAngle.call(_,mA);
			
			_.push('inc_x',inc * Math.cos(2 * Math.PI -_.mA));
			_.push('inc_y',inc * Math.sin(2 * Math.PI - _.mA));
			
			if(_.get('label.enable')){
				_.pushIf('label.linelength',iChart.lowTo(10,_.a/8));
				_.Z = _.get('label.linelength')/_.a+1;
				var Q  = iChart.quadrantd(mA),
				P = _.p2p(_.x,_.y,mA,_.Z),
				P2 = _.p2p(_.x,_.y,mA,1);
				
				_.push('label.originx',P2.x);
				_.push('label.originy',P2.y);
				_.push('label.quadrantd',Q);
				
				_.push('label.line_potins',[P2.x,P2.y,P.x,P.y]);
				_.push('label.line_globalComposite',(ccw&&mA<Math.PI)||(!ccw&&mA>Math.PI));
				_.push('label.labelx',P.x);
				_.push('label.labely',P.y);
				
				_.label = new iChart.Label(_.get('label'),_);
			}
		}
});//@end