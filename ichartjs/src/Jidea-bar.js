
	/**
	 * @author wanghe
	 * @component#Jidea.Bar
	 * @extend#Jidea.Column
	 */
	Jidea.Bar = Jidea.extend(Jidea.Column,{
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
				/**
				  *@cfg {String} 
				  * Available value are:
				  * @Option 'top,'bottom'
			 	 */
				keduAlign:'bottom'
			});
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
			
		}
		
});