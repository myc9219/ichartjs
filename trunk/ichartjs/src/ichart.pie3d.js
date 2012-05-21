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
			this.dataType = 'simple';
			
			this.set({
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
			iChart.Pie3D.superclass.doConfig.call(this);
			
			this.push('zRotate',iChart.between(0,90,90-this.get('zRotate')));
			
			this.push('sector.semi_major_axis',this.r);
			this.push('sector.semi_minor_axis',this.r*this.get('zRotate')/90);
			this.push('sector.cylinder_height',this.get('yHeight')*Math.cos(iChart.angle2Radian(this.get('zRotate'))));
			this.push('sector.semi_major_axis',this.r);
			
			this.data.each(function(d,i){
				this.doParse(d,i);
				this.sectors.push(new iChart.Sector3D(this.get('sector'),this));
			},this);
			
			this.pushComponent(this.sectors);
			
		}
});//@end