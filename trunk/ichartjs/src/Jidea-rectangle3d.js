	/**
	 * @overview this component use for abc
	 * @component#Jidea.Rectangle3D
	 * @extend#Jidea.Rectangle
	 */
	Jidea.Rectangle3D = Jidea.extend(Jidea.Rectangle,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Rectangle3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'rectangle3d';
			this.dimension = Jidea.Math._3D;
			
			this.configuration({
				zHeight:undefined,
				xAngle:60,//有范围限制
				yAngle:20,//有范围限制
				xAngle_:undefined,
				yAngle_:undefined,
				magic:false,
				shadow_blur:4,
				shadow_offsetx:2
			});
			
			this.registerEvent(
				'beforepop',
				'analysing',
				'drawRow'
			);
			
		},
		drawValue:function(){
			if(this.get('value')!='')
			this.target.text(this.get('value'),this.centerX,this.topCenterY + this.get('value_space'),false,this.get('color'),'center','top',this.get('fontStyle'));
		},
		drawRectangle:function(){
			this.target.cube(
				this.get('originx'),
				this.get('originy'),
				this.get('xAngle_'),
				this.get('yAngle_'),
				this.get('width'),
				this.get('height'),
				this.get('zHeight'),
				this.get('fill_color'),
				this.get('border.enable'),
				this.get('border.width'),
				this.get('light_color'),
				this.get('shadow'),
				this.get('shadow_color'),
				this.get('shadow_blur'),
				this.get('shadow_offsetx'),
				this.get('shadow_offsety')
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
			Jidea.Rectangle3D.superclass.doConfig.call(this);
			
			if(!this.get('zHeight')){
				this.push("zHeight",this.get('width'));
			}
			this.centerX=this.x+this.get('width')/2;
			
			this.topCenterX=this.x+(this.get('width')+this.get('width')*this.get('xAngle_'))/2;
			
			this.topCenterY=this.y-this.get('width')*this.get('yAngle_')/2;
			
			this.preventEvent = this.get('magic');
			
			
		}
});