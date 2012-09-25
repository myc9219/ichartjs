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
					 * @event Fires when draw label's text.Return text will override existing text.
					 * @paramter iChart.Rectangle#rect
					 * @paramter string#text the current label's text
					 */
					'drawText');
			
		},
		doDraw:function(opts){
			this.drawRectangle();
			this.drawValue();
		},
		doConfig:function(){
			iChart.Rectangle.superclass.doConfig.call(this);
			iChart.Assert.gtZero(this.get('width'),'width');
			var _ = this._(),v = _.variable.event;
			
			_.width = _.get('width');
			_.height = _.get('height');
			
			_.push('centerx',_.x + _.width/2);
			_.push('centery',_.y + _.height/2);
			
			if(_.get('tip.enable')){
				if(_.get('tip.showType')!='follow'){
					_.push('tip.invokeOffsetDynamic',false);
				}
				_.tip = new iChart.Tip(_.get('tip'),_);
			}
			
			v.highlight = false;
			
			_.on('mouseover',function(){
				//console.time('mouseover');
				v.highlight = true;
				_.redraw();
				v.highlight = false;
				//console.timeEnd('mouseover');
			}).on('mouseout',function(){
				//console.time('mouseout');
				v.highlight = false;
				_.redraw();
				//console.timeEnd('mouseout');
			});
			
			_.on('beforedraw',function(){
				_.push('f_color',v.highlight?_.get('light_color'):_.get('f_color_'));
				return true;
			});
		}
});//@end