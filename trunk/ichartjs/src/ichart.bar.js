
	/**
	 * @overview this component use for abc
	 * @component#iChart.Bar
	 * @extend#iChart.Chart
	 */
	iChart.Bar = iChart.extend(iChart.Chart,{
		/**
		 * initialize the context for the bar
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Bar.superclass.configure.call(this);
			
			this.type = 'bar';
			this.dataType = 'simple';
			this.set({
				/**
				 * @cfg {Object} the option for coordinate
				 */
				coordinate:{},
				/**
				 * @cfg {Number} the width of each bar(default to calculate according to coordinate's height)
				 */
				barheight:undefined,
				/**
				 * @cfg {Number} the distance of column's bottom and text(default to 6)
				 */
				text_space:6,
				/**
				  *@cfg {String} the align of scale(default to 'bottom')
				  * Available value are:
				  * @Option 'top,'bottom'
			 	 */
				keduAlign:'bottom',
				/**
				 *@cfg {Object}  the option for label
				 *@extend iChart.Chart
				 *@see iChart.Chart#label
				 */
				label:{
					padding:5
				},
				/**
				 * @cfg {Object} the option for rectangle
				 */
				rectangle:{}
			});
			
			this.registerEvent(
					'rectangleover',
					'rectanglemouseout',
					'rectangleclick',
					'parseValue',
					'parseText',
					'beforeRectangleAnimation',
					'afterRectangleAnimation'
					
				);
				
			this.rectangles = [];
			this.labels = [];
		},
		doAnimation:function(t,d){
			var r;
			this.coo.draw();
			for(var i=0;i<this.rectangles.length;i++){
				r = this.rectangles[i]; 
				this.fireEvent(this,'beforeRectangleAnimation',[this,r]);
				r.push('width',Math.ceil(this.animationArithmetic(t,0,r.width,d)));
				this.labels[i].draw();
				r.drawRectangle();
				this.fireEvent(this,'afterRectangleAnimation',[this,r]);
			}
		},
		doConfig:function(){
			iChart.Bar.superclass.doConfig.call(this);
			/**
			 * Apply the coordinate feature
			 */
			iChart.Interface.coordinate.call(this);
			/**
			 * Quick config to all rectangle
			 */
			iChart.apply(this.get('rectangle'),iChart.clone(['label','tip','border'],this.options));
			
		}
		
});//@end