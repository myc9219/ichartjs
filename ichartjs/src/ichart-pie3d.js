	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Pie3D
	 * @extend#iChart.Pie
	 */
	iChart.Pie3D = iChart.extend(iChart.Pie,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Pie3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the legend's type
			 */
			this.type = 'pie3d';
			this.dimension = iChart.Math._3D;
			this.dataType = 'simple';
			
			this.set({
				 /**
				 * @cfg {Float} {range:(0~90]} z轴旋转角度
				 */
				 zRotate:45,
				 yHeight:30
			});
			
			this.registerEvent(
				'beforeDrawRow',
				'drawRow'
			);
		},
		doConfig:function(){
			iChart.Pie3D.superclass.doConfig.call(this);
			this.push('zRotate',iChart.Math.between(0,90,90-this.get('zRotate')));
			
			var t,lt,tt;
			this.sector_config.semi_major_axis = this.get('radius');
			this.sector_config.semi_minor_axis = this.get('radius')*this.get('zRotate')/90;
			this.sector_config.cylinder_height = this.get('yHeight')*Math.cos(iChart.Math.angleToRadian(this.get('zRotate')));
			
			var t,lt,tt,Le = this.get('label.enable'),Te = this.get('tip.enable');
			for(var i=0;i<this.data.length;i++){
				t = this.data[i].name+(this.get('showpercent')?iChart.Math.toPercent(this.data[i].value/this.total,this.get('decimalsnum')):'');
				if(Le){
					lt = this.fireEvent(this,'parseLabelText',[this.data[i],i]);
					this.sector_config.label.text = iChart.isString(lt)?lt:t;
				}
				if(Te){
					tt = this.fireEvent(this,'parseTipText',[this.data[i],i]);
					this.sector_config.tip.text = iChart.isString(tt)?tt:t;
				}
				this.sector_config.startAngle = this.data[i].startAngle;
				this.sector_config.middleAngle = this.data[i].middleAngle;
				this.sector_config.endAngle = this.data[i].endAngle;
				this.sector_config.background_color = this.data[i].color;
				
				this.sectors.push(new iChart.Sector3D(this.sector_config,this));
			}
			this.pushComponent(this.sectors);
			
		}
});