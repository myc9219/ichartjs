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
					this.get('donutwidth'),
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
			var r = iChart.distanceP2P(this.x,this.y,e.x,e.y),b=this.get('donutwidth');	
			if(this.r<r||(b&&(this.r-b)>r)){
				return {valid:false};
			}
			if(iChart.angleInRange(this.get('startAngle'),this.get('endAngle'),(2*Math.PI - iChart.atan2Radian(this.x,this.y,e.x,e.y)))){
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
			var _ = this._();
			_.r = _.get('radius');
			
			iChart.Assert.gtZero(_.r);
			
			if(_.get('donutwidth')>_.r){
				_.push('donutwidth',0);
			}
			
			if(_.get('gradient')){
				_.push('f_color',_.T.avgRadialGradient(_.x,_.y,0,_.x,_.y,_.r,[_.get('light_color'),_.get('dark_color')]));
			}
			_.pushIf('increment',iChart.lowTo(5,_.r/10));
			
			var A = _.get('middleAngle'),inc = _.get('increment');
			_.push('inc_x',inc * Math.cos(2 * Math.PI -A));
			_.push('inc_y',inc * Math.sin(2 * Math.PI - A));
			
			if(_.get('label.enable')){
				_.pushIf('label.linelength',iChart.lowTo(10,_.r/8));
				Q  = iChart.quadrantd(A),
				
				P2 = iChart.p2Point(_.x,_.y,A,_.get('donutwidth')?_.r - _.get('donutwidth')/2:_.r/2);
				
				_.push('label.originx',P2.x);
				_.push('label.originy',P2.y);
				_.push('label.quadrantd',Q);
				
				var P = iChart.p2Point(_.x,_.y,A,_.r + _.get('label.linelength'));
				_.push('label.line_potins',[P2.x,P2.y,P.x,P.y]);
				_.push('label.labelx',P.x);
				_.push('label.labely',P.y);
				
				_.label = new iChart.Label(_.get('label'),_);
			}
		}
});//@end