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
		
		var t, lt, tt, Le = this.get('label.enable'), Te = this.get('tip.enable'),d = this.data,scs = this.sector_config;
		
		scs.radius = this.get('radius');
		
		for ( var i = 0; i < d.length; i++) {

			t = d[i].name + (this.get('showpercent') ? iChart.toPercent(d[i].value / this.total, this.get('decimalsnum')) : '');

			if (Le) {
				lt = this.fireEvent(this, 'parseLabelText', [d[i], i]);
				scs.label.text = iChart.isString(lt) ? lt : t;
			}
			if (Te) {
				tt = this.fireEvent(this, 'parseTipText', [d[i], i]);
				scs.tip.text = iChart.isString(tt) ? tt : t;
			}
			scs.startAngle = d[i].startAngle;
			scs.middleAngle = d[i].middleAngle;
			scs.endAngle = d[i].endAngle;
			scs.background_color = d[i].color;

			this.sectors.push(new iChart.Sector2D(scs, this));
		}
		this.pushComponent(this.sectors);
	}
});