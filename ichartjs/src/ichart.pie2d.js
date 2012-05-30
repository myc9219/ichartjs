/**
 * @overview this component use for abc
 * @component#@chart#iChart.Pie2D
 * @extend#iChart.Pie
 */
iChart.Pie2D = iChart.extend(iChart.Pie, {
	/**
	 * initialize the context for the pie2d
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Pie2D.superclass.configure.call(this);

		this.type = 'pie2d';

		//this.set({});
		
		this.registerEvent();
	},
	doConfig : function() {
		iChart.Pie2D.superclass.doConfig.call(this);
		/**
		 * quick config to all rectangle
		 */
		this.push('sector.radius',this.r)
		
		this.data.each(function(d,i){
			this.doParse(d,i);
			this.sectors.push(new iChart.Sector2D(this.get('sector'), this));
		},this);
		
		this.pushComponent(this.sectors);
	}
});//@end