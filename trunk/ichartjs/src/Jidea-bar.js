
	/**
	 * @overview this component use for abc
	 * @component#Jidea.Bar
	 * @extend#Jidea.Chart
	 */
	Jidea.Bar = Jidea.extend(Jidea.Chart,{
		/**
		 * initialize the context for the bar
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Bar.superclass.configure.call(this);
			
			this.type = 'bar';
			
			this.configuration({
					coordinate:{
					brushsize:1
				},
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
				 *@extend Jidea.Chart
				 *@see Jidea.Chart#label
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
			this.coordinate.draw();
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
			Jidea.Bar.superclass.doConfig.call(this);
			/**
			 * apply the coordinate feature
			 */
			Jidea.Interface.coordinate.call(this);
			/**
			 * quick config to all rectangle
			 */
			Jidea.applyIf(this.get('rectangle'),Jidea.clone(['label','tip','border'],this.configurations));
			
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