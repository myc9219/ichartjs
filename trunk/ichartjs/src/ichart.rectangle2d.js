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
		drawValue:function(){
			if(this.get('value')!=''){
				this.T.text(this.fireString(this, 'drawLabelText', [this, this.get('value')], this.get('value')),this.get('value_x'),this.get('value_y'),false,this.get('color'),this.get('textAlign'),this.get('textBaseline'),this.get('fontStyle'));
			}
		},
		drawRectangle:function(){
			this.T.rectangle(
				this.get('originx'),
				this.get('originy'),
				this.get('width'),
				this.get('height'),
				this.get('fill_color'),
				this.get('border.enable'),
				this.get('border.width'),
				this.get('border.color'),
				this.get('shadow'),
				this.get('shadow_color'),
				this.get('shadow_blur'),
				this.get('shadow_offsetx'),
				this.get('shadow_offsety'));
		},
		isEventValid:function(e){
			return {valid:e.offsetX>this.x&&e.offsetX<(this.x+this.width)&&e.offsetY<(this.y+this.height)&&e.offsetY>(this.y)};
		},
		tipInvoke:function(){
			var _ = this;
			//base on event? NEXT
			return function(w,h){
				return {
					left:_.tipX(w,h),
					top:_.tipY(w,h)
				}
			}
		},
		doConfig:function(){
			iChart.Rectangle2D.superclass.doConfig.call(this);
			var _ = this,tipAlign = _.get('tipAlign'),valueAlign=_.get('valueAlign');
			if(tipAlign=='left'||tipAlign=='right'){
				_.tipY = function(w,h){return _.centerY - h/2;};
			}else{
				_.tipX = function(w,h){return _.centerX -w/2;};
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
			
			
			if(valueAlign=='left'){
				_.push('textAlign','right');
				_.push('value_x',_.x - _.get('value_space'));
				_.push('value_y',_.centerY);
			}else if(valueAlign=='right'){
				_.push('textAlign','left');
				_.push('textBaseline','middle');
				_.push('value_x',_.x + _.width + _.get('value_space'));
				_.push('value_y',_.centerY);
			}else if(valueAlign=='bottom'){
				_.push('value_x',_.centerX);
				_.push('value_y',_.y  + _.height + _.get('value_space'));
				_.push('textBaseline','top');
			}else{
				_.push('value_x',_.centerX);
				_.push('value_y',_.y  - _.get('value_space'));
				_.push('textBaseline','bottom');
			}
			
			_.valueX = _.get('value_x');
			_.valueY = _.get('value_y');
		}
});//@end