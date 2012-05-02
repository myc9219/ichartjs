	/**
	 * @overview this component use for abc
	 * @component#iChart.Sector2D
	 * @extend#iChart.Sector
	 */
	iChart.Sector2D = iChart.extend(iChart.Sector,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Sector2D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'sector2d';
			
			this.configuration({
				radius:0
			});
			
			this.registerEvent(
				'beforepop',
				'analysing',
				'drawRow'
			);
		},
		drawSector:function(){
			this.target.sector(
					this.x,
					this.y,
					this.r,
					this.get('startAngle'),
					this.get('endAngle'),
					this.get('fill_color'),
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
			if((this.r)<iChart.Math.distanceP2P(this.x,this.y,e.offsetX,e.offsetY)){
				return {valid:false};
			}
			/**
			 * 与x轴正方向形成的夹角、x轴逆时针的角度、并转换弧度参照 
			 */
			if(iChart.Math.angleInRange(this.get('startAngle'),this.get('endAngle'),(2*Math.PI - iChart.Math.atanToRadian(this.x,this.y,e.offsetX,e.offsetY)))){
				return {valid:true};
			}
			return {valid:false};
		},
		tipInvoke:function(){
			var A = this.get('middleAngle'),
				Q  = iChart.Math.quadrantd(A),
				self = this,
				r = this.get('radius');
			return function(w,h){
				var P = iChart.Math.pToPoint(self.x,self.y,A,r*0.8);
				return {
					left:(Q>=2&&Q<=3)?(P.x - w):P.x,
					top:Q>=3?(P.y - h):P.y
				}
			}
		},
		labelInvoke:function(x,y){
			var A = this.get('middleAngle');
			var P = iChart.Math.pToPoint(x,y,A,this.r + this.get('label.linelength'));
			var P2 = iChart.Math.pToPoint(x,y,A,this.r/2);
			var Q  = iChart.Math.quadrantd(A);
			return {
				origin:{
					x:P2.x,
					y:P2.y
				},
				lineFn:function(){
					this.target.line(P2.x,P2.y,P.x,P.y,this.get('border.width'),this.get('border.color'));
				},
				labelXY:function(){
					return {
						labelx:(Q>=2&&Q<=3)?(P.x - this.width):P.x,
						labely:Q>=3?(P.y - this.height):P.y
					}
				}
			}
		},
		doConfig:function(){
			iChart.Sector2D.superclass.doConfig.call(this);
			
			this.r = this.get('radius');
			iChart.Assert.gtZero(this.r);
			
			
			if(this.get('gradient')){
				this.push('fill_color',this.target.avgRadialGradient(this.x,this.y,0,this.x,this.y,this.r,[this.get('light_color'),this.get('dark_color')]));
			}
			
//			this.final_parameter['radius'] = this.r;
//			this.final_parameter['fill_color'] = this.get('fill_color');
			
			if(!this.get('increment'))
				this.push('increment',iChart.Math.lowTo(5,this.r/8));
			
			if(this.get('label.enable')){
				if(!this.get('label.linelength')){
					this.push('label.linelength',iChart.Math.lowTo(10,this.r/8));
				}
				this.label = new iChart.Label(this.get('label'),this);
			}
		}
});