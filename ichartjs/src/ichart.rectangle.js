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
				 * @cfg {<link>iChart.Text</link>} Specifies the config of label,set false to make label disabled.
				 */
				label : {},
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
					 * @event Fires when parse this label's data.Return value will override existing.
					 * @paramter <link>iChart.Rectangle</link>#rect
					 * @paramter string#text the current label's text
					 */
					'parseText');
			
			this.label = null;
		},
		doDraw:function(opts){
			this.drawRectangle();
			if(this.label)
				this.label.draw();
		},
		doConfig:function(){
			iChart.Rectangle.superclass.doConfig.call(this);
			iChart.Assert.gtZero(this.get('width'),'width');
			var _ = this._(),v = _.variable.event,vA=_.get('valueAlign');
			
			_.width = _.get('width');
			_.height = _.get('height');
			
			var x = _.push('centerx',_.x + _.width/2),
				y = _.push('centery',_.y + _.height/2),
				a = 'center',
				b = 'middle',
				s=_.get('value_space');
			
			_.push('value',_.fireString(_, 'parseText', [_, _.get('value')], _.get('value')));
			
			if(vA=='left'){
				a = 'right';
				x = _.x - s;
			}else if(vA=='right'){
				a = 'left';
				x =_.x + _.width + s;
			}else if(vA=='bottom'){
				y = _.y  + _.height + s;
				b = 'top';
			}else{
				y = _.y  - s;
				b = 'bottom';
			}
			
			if(_.get('label')){
				_.push('label.originx', x);
				_.push('label.originy', y);
				_.push('label.text',_.get('value'));
				iChart.applyIf(_.get('label'),{
					textAlign : a,
					textBaseline : b,
					color:_.get('color')
				});
				_.label = new iChart.Text(_.get('label'), _);
			}
			
			if(_.get('tip.enable')){
				if(_.get('tip.showType')!='follow'){
					_.push('tip.invokeOffsetDynamic',false);
				}
				_.tip = new iChart.Tip(_.get('tip'),_);
			}
			
			v.highlight = false;
			
			_.on('mouseover',function(){
				v.highlight = true;
				_.redraw();
				v.highlight = false;
			}).on('mouseout',function(){
				v.highlight = false;
				_.redraw();
			});
			
			_.on('beforedraw',function(){
				_.push('f_color',v.highlight?_.get('light_color'):_.get('f_color_'));
				return true;
			});
		}
});
/**
 *@end
 */	