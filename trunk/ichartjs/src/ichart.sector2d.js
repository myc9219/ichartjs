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
			
			this.set({
				/**
				 * @cfg {Float (0~)} Specifies the sector's radius.Normally,this will given by chart.(default to 0)
				 */
				radius:0
			});
			
		},
		drawSector:function(){
			this.T.sector(
					this.x,
					this.y,
					this.r,
					this.get('startAngle'),
					this.get('endAngle'),
					this.get('f_color'),
					this.get('border.enable'),
					this.get('border.width'),
					this.get('border.color'),
					this.get('shadow'),
					this.get('counterclockwise'));
		},
		isEventValid:function(e){
			if(this.label&&this.label.isEventValid(e).valid)
				return {valid:true};
				
			if((this.r)<iChart.distanceP2P(this.x,this.y,e.offsetX,e.offsetY)){
				return {valid:false};
			}
			/**
			 * 与x轴正方向形成的夹角、x轴逆时针的角度、并转换弧度参照 
			 */
			if(iChart.angleInRange(this.get('startAngle'),this.get('endAngle'),(2*Math.PI - iChart.atan2Radian(this.x,this.y,e.offsetX,e.offsetY)))){
				return {valid:true};
			}
			return {valid:false};
		},
		tipInvoke:function(){
			var _ = this;
			return function(w,h){
				var P = iChart.p2Point(this.x,this.y,this.get('middleAngle'),this.r*0.8),Q  = iChart.quadrantd(this.get('middleAngle'));
				return {
					left:(Q>=2&&Q<=3)?(P.x - w):P.x,
					top:Q>=3?(P.y - h):P.y
				}
			}
		},
		doConfig:function(){
			iChart.Sector2D.superclass.doConfig.call(this);
			
			this.r = this.get('radius');
			iChart.Assert.gtZero(this.r);
			
			
			if(this.get('gradient')){
				this.push('f_color',this.T.avgRadialGradient(this.x,this.y,0,this.x,this.y,this.r,[this.get('light_color'),this.get('dark_color')]));
			}
			this.pushIf('increment',iChart.lowTo(5,this.r/10));
			
			var A = this.get('middleAngle'),inc = this.get('increment');
			this.push('inc_x',inc * Math.cos(2 * Math.PI -A));
			this.push('inc_y',inc * Math.sin(2 * Math.PI - A));
			
			if(this.get('label.enable')){
				this.pushIf('label.linelength',iChart.lowTo(10,this.r/8));
				Q  = iChart.quadrantd(A),
				
				P2 = iChart.p2Point(this.x,this.y,A,this.r/2);
			
				this.push('label.originx',P2.x);
				this.push('label.originy',P2.y);
				this.push('label.quadrantd',Q);
				
				var P = iChart.p2Point(this.x,this.y,A,this.r + this.get('label.linelength'));
				this.push('label.line_potins',[P2.x,P2.y,P.x,P.y]);
				this.push('label.labelx',P.x);
				this.push('label.labely',P.y);
				
				this.label = new iChart.Label(this.get('label'),this);
			}
		}
});//@end