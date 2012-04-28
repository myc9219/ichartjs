	/**
	 * @overview this component use for abc
	 * @component#Jidea.Area2D
	 * @extend#Jidea.LineBasic2D
	 */
	Jidea.Area2D = Jidea.extend(Jidea.LineBasic2D,{
		/**
		 * initialize the context for the area2d
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Area2D.superclass.configure.call(this);
			
			this.type = 'area2d';
			
			this.configuration({
				area:true,
				area_opacity:0.3
			});
			this.registerEvent();
			
		},
		doConfig:function(){
			/**
			 * must apply the area's config before 
			 */
			this.push('segment_style.area',true);
			this.push('segment_style.area_opacity',this.get('area_opacity'));
			
			Jidea.Area2D.superclass.doConfig.call(this);
			
			
			
			
			
			
			
		}
		
});