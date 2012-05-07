	/**
	 * @overview this component use for abc
	 * @component#iChart.Text
	 * @extend#iChart.Component
	 */
	iChart.Text = iChart.extend(iChart.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Text.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'text';
			
			this.set({
				text:'',
				//textAlign：文字水平对齐方式。可取属性值: start, end, left,right, center。默认值:
				textAlign:'center',
				//textBaseline可取属性值：top, hanging, middle,alphabetic, ideographic, bottom。默认值：alphabetic.
				textBaseline:'top'
			});
			
			this.registerEvent();
			/**
			 * indicate this component not need support event
			 */
			this.preventEvent = true;
		},
		doDraw:function(opts){
			if(this.get('text')!='')
			this.T.text(this.get('text'),this.x,this.y,false,this.get('color'),this.get('textAlign'),this.get('textBaseline'),this.get('fontStyle'));
		},
		doConfig:function(){
			iChart.Text.superclass.doConfig.call(this);
			
			
			
			
		}
});