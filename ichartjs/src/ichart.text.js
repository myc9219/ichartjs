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
				/**
				 * @cfg {String} Specifies the text want to disply.(default to '')
				 */
				text:'',
				/**
				 * @cfg {String} Specifies the textAlign of html5.(default to 'center')
				 * Available value are:
				 * @Option start
				 * @Option end
				 * @Option left
				 * @Option right
				 * @Option center
				 */
				textAlign:'center',
				/**
				 * @cfg {String} Specifies the textBaseline of html5.(default to 'top')
				 * Available value are:
				 * @Option top
				 * @Option hanging
				 * @Option middle
				 * @Option alphabetic
				 * @Option ideographic
				 * @Option bottom
				 */
				textBaseline:'top',
				/**
				 * @cfg {Number} Specifies the maxwidth of text in pixels,if given 0 will not be limited.(default to 0)
				 */
				width:0,
				/**
				 * @cfg {Number} Specifies the maxheight of text in pixels,if given 0 will not be limited(default to 0)
				 */
				height:0,
				/**
				 * @cfg {String} Specifies the writing-mode of text.(default to 'lr') .
				 * Available value are:
				 * @Option 'lr'
				 */
				writingmode : 'lr',
				/**
				 * @cfg {Number} Specifies the lineheight when text display multiline.(default to 16).
				 */
				line_height : 16
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
});//@end