 	/**
	 * @overview this component use for abc
	 * @component#iChart.Tip
	 * @extend#iChart.Element
	 */
	iChart.Tip = iChart.extend(iChart.Html,{
		configure:function(){
			
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Tip.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the legend's type
			 */
			this.type = 'tip';
			
			this.set({
				 text:'',
				 /**
				  * 
				  * @param {String} {'fixed','follow'}(default to 'follow')
				  */
				 showType:'follow',
				 invokeOffset:null,
				 /**
				  * @cfg {Number}  ms
				  */
				 fade_duration:300,
				 move_duration:100,
				 shadow:true,
				 /**
				  * @cfg {Boolean}  if  calculate the position every time (default to false)
				  */
				 invokeOffsetDynamic:false,
				 style:'textAlign:left;padding:4px 5px;cursor:pointer;backgroundColor:rgba(239,239,239,.85);fontSize:12px;color:black;',
				 border:{
					enable:true
				 },
				 delay:200
			});
		},
		follow:function(e,m){
			var style = this.dom.style;
			if(this.get('invokeOffsetDynamic')){
				if(m.hit){
					if(iChart.isString(m.text)||iChart.isNumber(m.text)){
						this.dom.innerHTML =  m.text;
					}
					var o = this.get('invokeOffset')(this.width(),this.height(),m);
					
					style.top =  o.top+"px";
					style.left = o.left+"px";
				}
			}else{
				if(this.get('showType')=='follow'){
					style.top = (e.offsetY-this.height()*1.1-2)+"px";
					style.left = (e.offsetX+2)+"px";
				}else if(iChart.isFunction(this.get('invokeOffset'))){
					var offset = this.get('invokeOffset')(this.width(),this.height(),m);
					style.top =  offset.top+"px";
					style.left = offset.left+"px";
				}else{
					style.top = (e.offsetY-this.height()*1.1-2)+"px";
					style.left = (e.offsetX+2)+"px";
				}
			}
			
		},
		beforeshow:function(e,m){
			this.follow(e,m);
		},
		show:function(e,m){
			this.beforeshow(e,m);
			this.css('visibility','visible');
			if(this.get('animation')){
				this.css('opacity',1);
			}
		},
		hidden:function(e){
			if(this.get('animation')){
				this.css('opacity',0);
			}else{
				this.css('visibility','hidden');
			}
		},
		initialize:function(){
			iChart.Tip.superclass.initialize.call(this);
			
			var self = this;
			
			self.css('position','absolute');
			self.dom.innerHTML = self.get('text');
			
			self.hidden();
			
			if(self.get('animation')){
				var m =  self.get('move_duration')/1000+'s ease-in 0s';
				self.transition('opacity '+self.get('fade_duration')/1000+'s ease-in 0s');
				self.transition('top '+m);
				self.transition('left '+m);
				self.onTransitionEnd(function(e){
					if(self.css('opacity')==0){
						self.css('visibility','hidden');
					}
				},false);
			}
			
			self.wrap.appendChild(self.dom);
			
			self.T.on('mouseover',function(e,m){
				self.show(e,m);	
			}).on('mouseout',function(e,m){
				self.hidden(e);	
			});
			
			if(self.get('showType')=='follow'){
				self.T.on('mousemove',function(e,m){
					if(self.T.variable.event.mouseover){
						setTimeout(function(){
							if(self.T.variable.event.mouseover)
								self.follow(e,m);
						},self.get('delay'));
					}
				});
			}
			
		}
});