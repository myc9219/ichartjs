	/**
	 * @author wanghe
	 * @component#Jidea.Rectangle
	 * @extend#Jidea.Component
	 */
	Jidea.Rectangle = Jidea.extend(Jidea.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Rectangle.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'rectangle';
			
			this.configuration({
				width:0,
				height:0,
				value_space:10,
				value:'',
				tipAlign:'top',
				valueAlign:'top',
				textAlign:'center',
				textBaseline:'top',
				color_factor:0.16,
				shadow:true,
				shadow_blur:3,
				shadow_offsetx:0,
				shadow_offsety:-1
			});
			
			this.registerEvent();
			
		},
		doDraw:function(opts){
			this.drawRectangle();
			this.drawValue();
		},
		doConfig:function(){
			Jidea.Rectangle.superclass.doConfig.call(this);
			Jidea.Assert.gtZero(this.get('width'),'width');
			this.width = this.get('width');
			this.height = this.get('height');
			
			
			this.centerX = this.x + this.width/2;
			this.centerY = this.y + this.height/2;
			
			if(this.get('tip.enable')){
				if(this.get('tip.showType')!='follow'){
					this.push('tip.invokeOffsetDynamic',false);
				}
				
				this.tip = new Jidea.Tip(this.get('tip'),this);
			}
			
			this.variable.event.highlight = false;
			
			this.on('mouseover',function(e){
				//console.time('mouseover');
				this.variable.event.highlight = true;
				this.redraw();
				this.variable.event.highlight = false;
				/**
				 * notify the chart so that can control whole situation
				 */
				this.container.fireEvent(this.container,'rectangleover',[e,this]);
				//console.timeEnd('mouseover');
			}).on('mouseout',function(e){
				//console.time('mouseout');
				this.variable.event.highlight = false;
				this.redraw();
				this.container.fireEvent(this.container,'rectanglemouseout',[e,this]);
				//console.timeEnd('mouseout');
			}).on('click',function(e){
				this.container.fireEvent(this.container,'rectangleclick',[e,this]);
			});
			
			this.on('beforedraw',function(){
				if(this.variable.event.highlight){
					this.push('fill_color',this.get('light_color'));
				}else{
					this.push('fill_color',this.get('background_color'));
				}
				return true;
			});
			
			
		}
});