
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
			
			this.set({
				coordinate:{},
				barheight:undefined,
				shadow:true,
				text_space:6,
				/**
				  *@cfg {String} 
				  * Available value are:
				  * @Option 'top,'bottom'
			 	 */
				keduAlign:'bottom',
				/**
				 *@cfg {Object} 
				 *@extend iChart.Chart
				 *@see iChart.Chart#label
				 */
				label:{
					padding:5
				},
				/**
				 *@cfg {Boolean} 
				 */
				customize_layout:false,
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
			 * apply the coordinate feature
			 */
			iChart.Interface.coordinate.call(this);
			/**
			 * quick config to all rectangle
			 */
			iChart.applyIf(this.get('rectangle'),iChart.clone(['label','tip','border'],this.options));
			
			/**
			 * register event
			 */
			this.on('rectangleover',function(e,r){
				this.target.css("cursor","pointer");
				
			}).on('rectanglemouseout',function(e,r){
				this.target.css("cursor","default");
			});
		}
		
});