	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Column3D
	 * @extend#iChart.Column
	 */
	iChart.Column3D = iChart.extend(iChart.Column,{
		/**
		 * initialize the context for the Column3D 
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Column3D.superclass.configure.call(this);
			
			this.type = 'column3d';
			this.dimension = iChart._3D;
			
			this.set({
				/**
				 * @cfg {Number(0~90)} Three-dimensional rotation X in degree(angle).(default to 60)
				 */
				xAngle:60,
				/**
				 * @cfg {Number(0~90)} Three-dimensional rotation Y in degree(angle).(default to 20)
				 */
				yAngle:20,
				/**
				 * @cfg {Number} Three-dimensional z-axis deep factor.frame of reference is width.(default to 1)
				 */
				zScale:1,
				/**
				 * @cfg {Number(1~)} Three-dimensional z-axis deep factor of pedestal.frame of reference is width.(default to 1.4)
				 */
				bottom_scale:1.4
			});
		},
		doConfig:function(){
			iChart.Column3D.superclass.doConfig.call(this);
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.xAngle_',this.get('xAngle_'));
			this.push('rectangle.yAngle_',this.get('yAngle_'));
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('scaleAlign')),
				zh = this.get('zHeight')*(this.get('bottom_scale')-1)/2*this.get('yAngle_'),
				h2 = this.get('colwidth')/2,
				gw = this.get('colwidth')+this.get('hispace'),
				H = this.coo.get('height'),h;
			
			this.data.each(function(d, i) {
				h = (d.value - S.start) * H / S.distance;
				
				this.doParse(d, i, i, this.x + this.get('hispace') + i * gw, this.y +(H-h)-zh, h);
				d.reference = new iChart.Rectangle3D(this.get('rectangle'), this);
				this.rectangles.push(d.reference);
				
				this.labels.push(new iChart.Text({
					id : i,
					text : d.name,
					originx : this.x + this.get('hispace') + gw * i + h2,
					originy : this.y + H + this.get('text_space')
				}, this));
				
			}, this);
			
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
		}
		
});//@end