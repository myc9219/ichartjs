iChart.Sector = iChart.extend(iChart.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Sector.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'sector';
			
			this.set({
				 counterclockwise:false,
				 startAngle:0,
				 middleAngle:0,
				 endAngle:0,
				 totalAngle:0,
				 /**
				  *@cfg {String} the event's name trigger pie pop(default to 'click')
				 */
				 pop_event:'click',
				 expand:false,
				 /**
				  *@cfg {Boolean} if it has animate when a piece popd (default to false)
			 	  */
				 pop_animate:false,
				 /**
				  *@cfg {Boolean} if the piece mutex,it means just one piece could pop (default to true)
				 */
				 mutex:false,
				 increment:undefined,
				 shadow:true,
				 gradient:true,
				 /**
				 *@cfg {Boolean} if the label displayed (default to true)
				 */
				 label:{
					 enable:true,
					 /**
					  * label线的长度
					  * @memberOf {label} 
					  */
					 linelength:undefined
				 },
				 tip:{
					 enable:false,
					 border:{
						width:2
					 }
				 }
			});
			
			this.registerEvent();
			
			this.label = null;
			this.tip = null;
		},
		expand:function(p){
			this.expanded = true;
		},	
		collapse:function(){
			this.expanded = false;
		},
		toggle:function(){
			this.expanded = !this.expanded;
		},
		drawLabel:function(){
			if(this.get('label.enable')){
				/**
				 * draw the labels
				 */
				this.label.draw({
					highlight:this.highlighted,
					invoke:this.labelInvoke(this.x,this.y)
				});
			}
		},
		doDraw:function(opts){
			this.drawSector();
			this.drawLabel();
		},
		doConfig:function(){
			iChart.Sector.superclass.doConfig.call(this);
			
			
			this.push('totalAngle',this.get('endAngle')-this.get('startAngle'));
			
			/**
			 * make the label's color in accord with sector
			 */
			this.push('label.scolor',this.get('background_color'));
			
			this.expanded = this.get('expand');
			
			var self = this;
			
			if(this.get('tip.enable')){
				if(this.get('tip.showType')!='follow'){
					this.push('tip.invokeOffsetDynamic',false); 
				}
				this.tip = new iChart.Tip(this.get('tip'),this);
			}
			
			this.variable.event.poped = false;
			
			this.on(this.get('pop_event'),function(e,r){
//					console.profile('Test for pop');
//					console.time('Test for pop');
					self.variable.event.poped = true;
					self.toggle();
					
					self.redraw();
					
					self.variable.event.poped = false;
//					console.timeEnd('Test for pop');
//					console.profileEnd('Test for pop');
			});
			
			this.on('beforedraw',function(){
				this.x = this.get('originx');
				this.y = this.get('originy');
				if(this.expanded){
					if(this.get('mutex')&&!self.variable.event.poped){
						this.expanded = false;
					}else{
						this.x+=this.get('increment')*Math.cos(2*Math.PI-this.get('middleAngle'));
						this.y-=this.get('increment')*Math.sin(2*Math.PI-this.get('middleAngle'));
					}
				}
				return true;
			});
			
			
		}
});