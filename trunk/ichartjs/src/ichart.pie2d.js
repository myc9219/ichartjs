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
		
		//this.registerEvent();
	},
	localizer:function(la){
		//此段代码需要优化,需要根据所有页面上的label的位置进行合理布局
		this.sectors.each(function(s, i) {
			var l =  s.label,
				x = l.labelx,
				y = l.labely;
			if((la.labely<y&&(y-la.labely)<la.get('height'))||(la.labely>y&&(la.labely-y)<l.get('height'))){
				if((la.labelx<x&&(x-la.labelx)<la.get('width'))||(la.labelx>x&&(la.labelx-x)<l.get('width'))){
					if(la.labely<y){
						console.log('上重合..'+la.get('text')+'==='+l.get('text'));
						la.push('labely',la.get('labely')-la.get('height')+y-la.labely-2);
						la.push('line_potins',la.get('line_potins').concat(la.get('labelx'),la.get('labely')));
					}else{
						console.log('下重合..'+la.get('text')+'==='+l.get('text'));
						la.push('labely',la.get('labely')+l.get('height')-la.labely+y+2);
						la.push('line_potins',la.get('line_potins').concat(la.get('labelx'),la.get('labely')));
					}
					la.localizer();
				}
			}
		}, this);
	},
	doSector:function(d,i){
		this.doParse(d,i);
		d.reference = new iChart.Sector2D(this.get('sector'), this);
		this.sectors.push(d.reference);
		if (this.get('label.enable')&&this.get('intellectLayout')){
			this.localizer(d.reference.label);
		}
	},
	doConfig : function() {
		iChart.Pie2D.superclass.doConfig.call(this);
		/**
		 * quick config to all rectangle
		 */
		this.push('sector.radius',this.r)
		
		this.data.each(function(d,i){
			this.doSector(d,i);
		},this);
		
		this.pushComponent(this.sectors);
	}
});//@end