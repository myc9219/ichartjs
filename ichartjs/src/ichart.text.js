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
				 * @cfg {String} there has two layers of meaning,when width is 0,Specifies the textAlign of html5.else this is the alignment of box.(default to 'center')
				 * when width is 0,Available value are:
				 * @Option start
				 * @Option end
				 * @Option left
				 * @Option right
				 * @Option center
				 * when width is not 0,Available value are:
				 * @Option left
				 * @Option right
				 * @Option center
				 */
				textAlign:'center',
				background_color : 0,
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
				 * @cfg {Object} Here,specify as false by default
				 */
				border : {
					enable : false
				},
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
			if(this.get('box_feature'))
			this.T.drawBox(this.x,this.y,this.get('width'),this.get('height'),this.get('border'),this.get('f_color'));
			
			if(this.get('text')!='')
			this.T.text(this.get('text'),this.get('textx'),this.get('texty'),this.get('width'),this.get('color'),this.get('textAlign'),this.get('textBaseline'),this.get('fontStyle'));
		},
		doConfig:function(){
			iChart.Text.superclass.doConfig.call(this);
			var x = this.x,y=this.y,w=this.get('width'),h=this.get('height'),a=this.get('textAlign');
			x+=(a=='center'?w/2:(a=='right'?w:0));
			if(h){
				y+=h/2;
				this.push('textBaseline','middle');
			}
			this.push('textx',x);
			this.push('texty',y);
			this.push('box_feature',w&&h);
			
			
		}
});//@end