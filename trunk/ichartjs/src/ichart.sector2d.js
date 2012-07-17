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
				var P = iChart.p2Point(_.x,_.y,_.get('middleAngle'),_.r*0.8),Q  = iChart.quadrantd(_.get('middleAngle'));
				return {
					left:(Q>=2&&Q<=3)?(P.x - w):P.x,
					top:Q>=3?(P.y - h):P.y
				}
			}
		},
		labelInvoke:function(L){
			var A = this.get('middleAngle'),
				Q  = iChart.quadrantd(A),
				P2 = iChart.p2Point(this.x,this.y,A,this.r/2);
			this.label.push('originx',P2.x);
			this.label.push('originy',P2.y);
			this.label.push('quadrantd',Q);
			
			if(this.get('label.intellect')){
				
				
			}
			
			var P = iChart.p2Point(this.x,this.y,A,this.r + L);
			
			this.label.push('line_potins',[P2.x,P2.y,P.x,P.y]);
			this.label.push('labelx',P.x);
			this.label.push('labely',P.y);
		},
		doConfig:function(){
			iChart.Sector2D.superclass.doConfig.call(this);
			
			this.r = this.get('radius');
			iChart.Assert.gtZero(this.r);
			
			
			if(this.get('gradient')){
				this.push('fill_color',this.T.avgRadialGradient(this.x,this.y,0,this.x,this.y,this.r,[this.get('light_color'),this.get('dark_color')]));
			}
			
			this.pushIf('increment',iChart.lowTo(5,this.r/8));
			
			if(this.get('label.enable')){
				this.pushIf('label.linelength',iChart.lowTo(10,this.r/8));
				this.label = new iChart.Label(this.get('label'),this);
				this.labelInvoke(this.get('label.linelength'));
			}
		}
});//@end