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
				shadow_offsety:-2
			});
			
			this.registerEvent();
			
		},
		drawValue:function(){
			if(this.get('value')!=''){
				this.target.text(this.get('value'),this.get('value_x'),this.get('value_y'),false,this.get('color'),this.get('textAlign'),this.get('textBaseline'),this.get('fontStyle'));
			}
		},
		drawRectangle:function(){
			this.target.rectangle(
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
			var self = this;
			//base on event? NEXT
			return function(w,h){
				return {
					left:self.tipX(w,h),
					top:self.tipY(w,h)
				}
			}
		},
		doConfig:function(){
			iChart.Rectangle2D.superclass.doConfig.call(this);
			
			if(this.get('tipAlign')=='left'||this.get('tipAlign')=='right'){
				this.tipY = function(w,h){return this.centerY - h/2;};
			}else{
				this.tipX = function(w,h){return this.centerX -w/2;};
			}
			
			if(this.get('tipAlign')=='left'){
				this.tipX = function(w,h){return this.x - this.get('value_space') -w;};
			}else if(this.get('tipAlign')=='right'){
				this.tipX = function(w,h){return this.x + this.width + this.get('value_space');};
			}else if(this.get('tipAlign')=='bottom'){
				this.tipY = function(w,h){return this.y  +this.height+3;};
			}else{
				this.tipY = function(w,h){return this.y  - h -3;};
			}
			
			if(this.get('valueAlign')=='left'){
				this.push('textAlign','right');
				this.push('value_x',this.x - this.get('value_space'));
				this.push('value_y',this.centerY);
			}else if(this.get('valueAlign')=='right'){
				this.push('textAlign','left');
				this.push('textBaseline','middle');
				this.push('value_x',this.x + this.width + this.get('value_space'));
				this.push('value_y',this.centerY);
			}else if(this.get('valueAlign')=='bottom'){
				this.push('value_x',this.centerX);
				this.push('value_y',this.y  + this.height + this.get('value_space'));
				this.push('textBaseline','top');
			}else{
				this.push('value_x',this.centerX);
				this.push('value_y',this.y  - this.get('value_space'));
				this.push('textBaseline','bottom');
			}
			
			this.valueX = this.get('value_x');
			this.valueY = this.get('value_y');
		}
});