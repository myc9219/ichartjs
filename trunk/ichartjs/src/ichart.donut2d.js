/**
 * @overview this component use for show a donut chart
 * @component#@chart#iChart.Donut2D
 * @extend#iChart.Pie
 */
iChart.Donut2D = iChart.extend(iChart.Pie, {
	/**
	 * initialize the context for the pie2d
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Donut2D.superclass.configure.call(this);
		
		this.type = 'pie2d';
		
		this.set({
			/**
			 * @cfg {Number} Specifies the width when show a donut.If the value lt 1,It will be as a percentage,value will be radius*donutwidth.only applies when it not 0.(default to 0.3)
			 */
			donutwidth : 0.3
		});
	},
	doSector:function(){
		return  new iChart.Sector2D(this.get('sector'), this);
	},
	doConfig : function() {
		iChart.Donut2D.superclass.doConfig.call(this);
		
		var _ = this._(),d='donutwidth',r = _.r;
		/**
		 * quick config to all rectangle
		 */
		_.push('sector.radius',r)
		if(_.get(d)>0){
			if(_.get(d)<1){
				_.push(d,Math.floor(r*_.get(d)));
			}else if(_.get(d)>=r){
				_.push(d,0);
			}
			_.push('sector.donutwidth',_.get(d));
		}
		
		
		_.data.each(function(d,i){
			_.doParse(d,i);
		},_);
		
		_.components.push(_.sectors);
	}
});//@end