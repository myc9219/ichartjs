	/**
	 * @overview this component use for abc
	 * @component#@chart#Jidea.Pie3D
	 * @extend#Jidea.Pie
	 */
	Jidea.Pie3D = Jidea.extend(Jidea.Pie,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Pie3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the legend's type
			 */
			this.type = 'pie3d';
			this.dimension = Jidea.Math._3D;
			this.dataType = 'simple';
			
			this.configuration({
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
			Jidea.Pie3D.superclass.doConfig.call(this);
			this.push('zRotate',Jidea.Math.between(0,90,90-this.get('zRotate')));
			
			var t,lt,tt;
			this.sector_config.semi_major_axis = this.get('radius');
			this.sector_config.semi_minor_axis = this.get('radius')*this.get('zRotate')/90;
			this.sector_config.cylinder_height = this.get('yHeight')*Math.cos(Jidea.Math.angleToRadian(this.get('zRotate')));
			
			var t,lt,tt,Le = this.get('label.enable'),Te = this.get('tip.enable');
			for(var i=0;i<this.data.length;i++){
				t = this.data[i].name+(this.get('showpercent')?Jidea.Math.toPercent(this.data[i].value/this.total,this.get('decimalsnum')):'');
				if(Le){
					lt = this.fireEvent(this,'parseLabelText',[this.data[i],i]);
					this.sector_config.label.text = Jidea.isString(lt)?lt:t;
				}
				if(Te){
					tt = this.fireEvent(this,'parseTipText',[this.data[i],i]);
					this.sector_config.tip.text = Jidea.isString(tt)?tt:t;
				}
				this.sector_config.startAngle = this.data[i].startAngle;
				this.sector_config.middleAngle = this.data[i].middleAngle;
				this.sector_config.endAngle = this.data[i].endAngle;
				this.sector_config.background_color = this.data[i].color;
				
				this.sectors.push(new Jidea.Sector3D(this.sector_config,this));
			}
			this.pushComponent(this.sectors);
			
		}
});