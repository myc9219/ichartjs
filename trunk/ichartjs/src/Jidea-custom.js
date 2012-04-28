	/**
	 * @overview this component use for abc
	 * @component#Jidea.Custom
	 * @extend#Jidea.Component
	 */
	Jidea.Custom = Jidea.extend(Jidea.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Custom.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'custom';
			
			this.configuration({
				drawFn:Jidea.emptyFn,
				eventValid:null	
			});
			
			this.registerEvent();
			
		},
		doDraw:function(opts){
			this.get('drawFn').call(this,opts);
		},
		isEventValid:function(e){
			if(Jidea.isFunction(this.get('eventValid')))
			return this.get('eventValid').call(this,e);
			return {valid:false};
		},
		doConfig:function(){
			Jidea.Custom.superclass.doConfig.call(this);
		}
});