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
			if(this.get('invokeOffsetDynamic')){
				if(m.hit){
					if(iChart.isString(m.text)||iChart.isNumber(m.text)){
						this.dom.innerHTML =  m.text;
					}
					var o = this.get('invokeOffset')(this.width(),this.height(),m);
					
					this.dom.style.top =  o.top+"px";
					this.dom.style.left = o.left+"px";
				}
			}else{
				if(this.get('showType')=='follow'){
					this.dom.style.top = (e.offsetY-this.height()*1.1-2)+"px";
					this.dom.style.left = (e.offsetX+2)+"px";
				}else if(iChart.isFunction(this.get('invokeOffset'))){
					var offset = this.get('invokeOffset')(this.width(),this.height(),m);
					this.dom.style.top =  offset.top+"px";
					this.dom.style.left = offset.left+"px";
				}else{
					this.dom.style.top = (e.offsetY-this.height()*1.1-2)+"px";
					this.dom.style.left = (e.offsetX+2)+"px";
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
			
			this.css('position','absolute');
			this.dom.innerHTML = this.get('text');
			
			this.hidden();
			
			if(this.get('animation')){
				this.transition('opacity '+this.get('fade_duration')/1000+'s ease-in 0s');
				this.transition('top '+this.get('move_duration')/1000+'s ease-in 0s');
				this.transition('left '+this.get('move_duration')/1000+'s ease-in 0s');
				var self = this;
				this.onTransitionEnd(function(e){
					if(self.css('opacity')==0){
						self.css('visibility','hidden');
					}
				},false);
			}
			
			this.wrap.appendChild(this.dom);
			var self = this;
			
			this.T.on('mouseover',function(e,m){
				self.show(e,m);	
			}).on('mouseout',function(e,m){
				self.hidden(e);	
			});
			
			if(this.get('showType')=='follow'){
				this.T.on('mousemove',function(e,m){
					if(self.target.variable.event.mouseover){
						setTimeout(function(){
							if(self.target.variable.event.mouseover)
								self.follow(e,m);
						},self.get('delay'));
					}
				});
			}
			
		}
});