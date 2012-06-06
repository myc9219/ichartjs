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
			this.dimension = iChart._3D;
			
			this.set({
				/**
				 * @cfg {Number} Three-dimensional rotation Z in degree(angle).socpe{0-90}.(default to 45)
				 */
				 zRotate:45,
				 /**
				 * @cfg {Number} Specifies the pie's thickness in pixels.(default to 30)
				 */
				 yHeight:30
			});
			
			this.registerEvent(
				'beforeDrawRow',
				'drawRow'
			);
		},
		doSector:function(d,i){
			this.doParse(d,i);
			d.reference = new iChart.Sector3D(this.get('sector'), this);
			this.sectors.push(d.reference);
		},
		doConfig:function(){
			iChart.Pie3D.superclass.doConfig.call(this);
			
			this.push('zRotate',iChart.between(0,90,90-this.get('zRotate')));
			
			this.push('sector.semi_major_axis',this.r);
			this.push('sector.semi_minor_axis',this.r*this.get('zRotate')/90);
			this.push('sector.cylinder_height',this.get('yHeight')*Math.cos(iChart.angle2Radian(this.get('zRotate'))));
			this.push('sector.semi_major_axis',this.r);
			
			this.data.each(function(d,i){
				this.doSector(d,i);
			},this);
			
			this.pushComponent(this.sectors);
			
		}
});//@end