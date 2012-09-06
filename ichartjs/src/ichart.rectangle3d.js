	/**
	 * @overview this component use for abc
	 * @component#iChart.Rectangle3D
	 * @extend#iChart.Rectangle
	 */
	iChart.Rectangle3D = iChart.extend(iChart.Rectangle,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Rectangle3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'rectangle3d';
			this.dimension = iChart._3D;
			
			this.set({
				/**
				 * @cfg {Number} Specifies Three-dimensional z-axis deep in pixels.Normally,this will given by chart.(default to undefined)
				 */
				zHeight:undefined,
				/**
				 * @cfg {Number} Three-dimensional rotation X in degree(angle).socpe{0-90}.Normally,this will given by chart.(default to 60)
				 */
				xAngle:60,
				/**
				 * @cfg {Number} Three-dimensional rotation Y in degree(angle).socpe{0-90}.Normally,this will given by chart.(default to 20)
				 */
				yAngle:20,
				xAngle_:undefined,
				yAngle_:undefined,
				/**
				 * @cfg {Number} Override the default as 2
				 */
				shadow_offsetx:2
			});
			
		},
		drawValue:function(){
			if(this.get('value')!='')
			this.T.text(this.get('value'),this.centerX,this.topCenterY + this.get('value_space'),false,this.get('color'),'center','top',this.get('fontStyle'));
		},
		drawRectangle:function(){
			this.T.cube(
				this.get('originx'),
				this.get('originy'),
				this.get('xAngle_'),
				this.get('yAngle_'),
				this.get('width'),
				this.get('height'),
				this.get('zHeight'),
				this.get('f_color'),
				this.get('border.enable'),
				this.get('border.width'),
				this.get('light_color'),
				this.get('shadow')
			);
		},
		isEventValid:function(e){
			return {valid:!this.preventEvent&&e.offsetX>this.x&&e.offsetX<(this.x+this.get('width'))&&e.offsetY<this.y+this.get('height')&&e.offsetY>this.y};
		},
		tipInvoke:function(){
			var self = this;
			return function(w,h){
				return {
					left:self.topCenterX - w/2,
					top:self.topCenterY - h
				}
			}
		},
		doConfig:function(){
			iChart.Rectangle3D.superclass.doConfig.call(this);
			
			this.pushIf("zHeight",this.get('width'));
			
			this.centerX=this.x+this.get('width')/2;
			
			this.topCenterX=this.x+(this.get('width')+this.get('width')*this.get('xAngle_'))/2;
			
			this.topCenterY=this.y-this.get('width')*this.get('yAngle_')/2;
			
		}
});//@end