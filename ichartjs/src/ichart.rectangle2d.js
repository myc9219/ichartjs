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
				this.T.text(this.get('value'),this.get('value_x'),this.get('value_y'),false,this.get('color'),this.get('textAlign'),this.get('textBaseline'),this.get('fontStyle'));
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
			var self = this,tipAlign = self.get('tipAlign'),valueAlign=self.get('valueAlign');
			if(tipAlign=='left'||tipAlign=='right'){
				self.tipY = function(w,h){return self.centerY - h/2;};
			}else{
				self.tipX = function(w,h){return self.centerX -w/2;};
			}
			
			if(tipAlign=='left'){
				self.tipX = function(w,h){return self.x - self.get('value_space') -w;};
			}else if(tipAlign=='right'){
				self.tipX = function(w,h){return self.x + self.width + self.get('value_space');};
			}else if(tipAlign=='bottom'){
				self.tipY = function(w,h){return self.y  +self.height+3;};
			}else{
				self.tipY = function(w,h){return self.y  - h -3;};
			}
			
			if(valueAlign=='left'){
				self.push('textAlign','right');
				self.push('value_x',self.x - self.get('value_space'));
				self.push('value_y',self.centerY);
			}else if(valueAlign=='right'){
				self.push('textAlign','left');
				self.push('textBaseline','middle');
				self.push('value_x',self.x + self.width + self.get('value_space'));
				self.push('value_y',self.centerY);
			}else if(valueAlign=='bottom'){
				self.push('value_x',self.centerX);
				self.push('value_y',self.y  + self.height + self.get('value_space'));
				self.push('textBaseline','top');
			}else{
				self.push('value_x',self.centerX);
				self.push('value_y',self.y  - self.get('value_space'));
				self.push('textBaseline','bottom');
			}
			
			self.valueX = self.get('value_x');
			self.valueY = self.get('value_y');
		}
});