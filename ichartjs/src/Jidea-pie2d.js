	/**
	 * @overview this component use for abc
	 * @component#Jidea.Pie2D
	 * @extend#Jidea.Pie
	 */
	Jidea.Pie2D = Jidea.extend(Jidea.Pie,{
		/**
		 * initialize the context for the pie2d
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Pie2D.superclass.configure.call(this);
			
			this.type = 'pie2d';
			
			this.dataType = 'simple';
			
			this.configuration({});
			
			this.registerEvent();
		},
		doConfig:function(){
			Jidea.Pie2D.superclass.doConfig.call(this);
			
			this.sector_config.radius = this.get('radius');
			
			
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
				
				this.sectors.push(new Jidea.Sector2D(this.sector_config,this));
			}
			this.pushComponent(this.sectors);
		}
});