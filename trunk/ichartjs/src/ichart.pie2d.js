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

		this.dataType = 'simple';

		this.set({});

		this.registerEvent();
	},
	doConfig : function() {
		iChart.Pie2D.superclass.doConfig.call(this);
		
		var t, lt, tt, Le = this.get('label.enable'), Te = this.get('tip.enable'),scs = this.sector_config;
		
		scs.radius = this.get('radius');
		
		this.data.each(function(d,i){
			t = d.name + (this.get('showpercent') ? iChart.toPercent(d.value / this.total, this.get('decimalsnum')) : '');
			
			if (Le) {
				scs.label.text = this.fireString(this,'parseLabelText',[d,i],t);
			}
			
			if (Te) {
				scs.tip.text = this.fireString(this,'parseTipText',[d,i],t);
			}
			
			scs.startAngle = d.startAngle;
			scs.middleAngle = d.middleAngle;
			scs.endAngle = d.endAngle;
			scs.background_color = d.color;

			this.sectors.push(new iChart.Sector2D(scs, this));
		},this);
		
		this.pushComponent(this.sectors);
	}
});