	/**
	 * @overview this component use for abc
	 * @component#iChart.Column
	 * @extend#iChart.Chart
	 */
	iChart.Column = iChart.extend(iChart.Chart,{
		/**
		 * initialize the context for the Column
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Column.superclass.configure.call(this);
			
			this.type = 'column';
			
			this.configuration({
				coordinate:{},
				hiswidth:undefined,
				shadow:true,
				text_space:6,
				/**
				  *@cfg {String} 
				  * Available value are:
				  * @Option 'left,'right'
			 	 */
				keduAlign:'left',
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
			var r,h;
			this.coo.draw();
			for(var i=0;i<this.rectangles.length;i++){
				r = this.rectangles[i]; 
				this.fireEvent(this,'beforeRectangleAnimation',[this,r]);
				h = Math.ceil(this.animationArithmetic(t,0,r.height,d));
				r.push('originy',r.y+(r.height-h));
				r.push('height',h);
				this.labels[i].draw();
				r.drawRectangle();
				this.fireEvent(this,'afterRectangleAnimation',[this,r]);
			}
		},
		doConfig:function(){
			iChart.Column.superclass.doConfig.call(this);
			
			/**
			 * apply the coordinate feature
			 */
			iChart.Interface.coordinate.call(this);
			/**
			 * quick config to all rectangle
			 */
			iChart.applyIf(this.get('rectangle'),iChart.clone(['label','tip','border'],this.configurations));
			
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