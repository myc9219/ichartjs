	/**
	 * @overview this component use for abc
	 * @component#iChart.Rectangle2D
	 * @extend#iChart.Rectangle
	 */
	iChart.Rectangle2D = iChart.extend(iChart.Rectangle,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Rectangle2D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'rectangle2d';
			
			this.set({
				/**
				 * @cfg {Number} Override the default as -2
				 */
				shadow_offsety:-2
			});
			
		},
		drawRectangle:function(){
			this.T.box(
				this.get('originx'),
				this.get('originy'),
				this.get('width'),
				this.get('height'),
				this.get('border'),
				this.get('f_color'),
				this.get('shadow'));
		},
		isEventValid:function(e){
			return {valid:e.x>this.x&&e.x<(this.x+this.width)&&e.y<(this.y+this.height)&&e.y>(this.y)};
		},
		tipInvoke:function(){
			var _ = this;
			/**
			 * base on event?
			 */
			return function(w,h){
				return {
					left:_.tipX(w,h),
					top:_.tipY(w,h)
				}
			}
		},
		doConfig:function(){
			iChart.Rectangle2D.superclass.doConfig.call(this);
			var _ = this,tipAlign = _.get('tipAlign');
			if(tipAlign=='left'||tipAlign=='right'){
				_.tipY = function(w,h){return _.get('centery') - h/2;};
			}else{
				_.tipX = function(w,h){return _.get('centerx') -w/2;};
			}
			
			if(tipAlign=='left'){
				_.tipX = function(w,h){return _.x - _.get('value_space') -w;};
			}else if(tipAlign=='right'){
				_.tipX = function(w,h){return _.x + _.width + _.get('value_space');};
			}else if(tipAlign=='bottom'){
				_.tipY = function(w,h){return _.y  +_.height+3;};
			}else{
				_.tipY = function(w,h){return _.y  - h -3;};
			}
			
			_.applyGradient();
			
			
		}
});
/**
 *@end
 */	