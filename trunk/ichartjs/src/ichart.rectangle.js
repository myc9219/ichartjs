	/**
	 * @overview this component use for abc
	 * @component#iChart.Rectangle
	 * @extend#iChart.Component
	 */
	iChart.Rectangle = iChart.extend(iChart.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Rectangle.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'rectangle';
			
			this.set({
				/**
				 * @cfg {Number} Specifies the width of this element in pixels,Normally,this will given by chart.(default to 0)
				 */
				width:0,
				/**
				 * @cfg {Number} Specifies the height of this element in pixels,Normally,this will given by chart.(default to 0)
				 */
				height:0,
				/**
				 * @cfg {Number} the distance of column's edge and value in pixels.(default to 4)
				 */
				value_space:4,
				/**
				 * @cfg {String} Specifies the text of this element,Normally,this will given by chart.(default to '')
				 */
				value:'',
				/**
				 * @cfg {String} Specifies the name of this element,Normally,this will given by chart.(default to '')
				 */
				name:'',
				/**
				 * @cfg {String} Specifies the tip alignment of chart(defaults to 'top').Available value are:
				 * @Option 'left'
				 * @Option 'right'
				 * @Option 'top'
				 * @Option 'bottom'
				 */
				tipAlign:'top',
				/**
				 * @cfg {String} Specifies the value's text alignment of chart(defaults to 'top') Available value are:
				 * @Option 'left'
				 * @Option 'right'
				 * @Option 'top'
				 * @Option 'bottom'
				 */
				valueAlign:'top',
				/**
				 * @inner
				 */
				textAlign:'center',
				/**
				 * @inner
				 */
				textBaseline:'top',
				/**
				 * @cfg {Number} Override the default as 3
				 */
				shadow_blur:3,
				/**
				 * @cfg {Number} Override the default as -1
				 */
				shadow_offsety:-1
			});
			
			/**
			 * this element support boxMode
			 */
			this.atomic = true;
			
			this.registerEvent(
					/**
					 * @event Fires when draw this label.Return value will override existing value.
					 * @paramter iChart.Rectangle#rect
					 * @paramter string#text the current label's text
					 */
					'drawLabelText');
			
		},
		doDraw:function(opts){
			this.drawRectangle();
			this.drawValue();
		},
		doConfig:function(){
			iChart.Rectangle.superclass.doConfig.call(this);
			iChart.Assert.gtZero(this.get('width'),'width');
			this.width = this.get('width');
			this.height = this.get('height');
			
			this.centerX = this.x + this.width/2;
			this.centerY = this.y + this.height/2;
			
			if(this.get('tip.enable')){
				if(this.get('tip.showType')!='follow'){
					this.push('tip.invokeOffsetDynamic',false);
				}
				this.tip = new iChart.Tip(this.get('tip'),this);
			}
			
			this.variable.event.highlight = false;
			
			this.on('mouseover',function(e){
				//console.time('mouseover');
				this.variable.event.highlight = true;
				this.redraw();
				this.variable.event.highlight = false;
				//console.timeEnd('mouseover');
			}).on('mouseout',function(e){
				//console.time('mouseout');
				this.variable.event.highlight = false;
				this.redraw();
				//console.timeEnd('mouseout');
			});
			
			this.on('beforedraw',function(){
				this.push('fill_color',this.variable.event.highlight?this.get('light_color'):this.get('background_color'));
				return true;
			});
		}
});//@end