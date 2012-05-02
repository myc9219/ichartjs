
	/**
	 * @overview this component use for abc
	 * @component#iChart.CrossHair
	 * @extend#iChart.Element
	 */
	iChart.CrossHair = iChart.extend(iChart.Element,{
		configure:function(T){
			/**
			 * indicate the component's type
			 */
			this.type = 'crosshair';
			
			this.configuration({
				 text:'',
				 top:0,
				 left:0,
				 /**
				  * @cfg {Boolean} private use 
				  */
				 hcross:true,
				  /**
				  * @cfg {Boolean} private use 
				  */
				 vcross:true,
				 invokeOffset:null,
				 line_width:1,
				 line_color:'green',
				 shadow_color:'#dedede',
				 delay:200
			});
			this.target = T;
		},
		//this function will implement at every target object,and this just default effect
		follow:function(e,m){
			if(this.get('invokeOffset')){
				var o = this.get('invokeOffset')(e,m);
				if(o&&o.hit){
					this.horizontal.style.top = (o.top-this.top)+"px";
					this.vertical.style.left = (o.left-this.left)+"px";
				}
			}else{
				//set the 1px offset will make the line at the top left all the time 
				this.horizontal.style.top = (e.offsetY-this.top-1)+"px";
				this.vertical.style.left = (e.offsetX-this.left-1)+"px";
			}
		},
		beforeshow:function(e,m){
			this.follow(e,m);
		},
		initialize:function(){
			iChart.CrossHair.superclass.initialize.call(this);
			
			this.top = iChart.Math.fixPixel(this.get('top'));
			this.left = iChart.Math.fixPixel(this.get('left'));
			
			this.dom = document.createElement("div");
			this.dom.style.zIndex=this.get('index');
			this.dom.style.position="absolute";
			//set size zero make  integration with vertical and horizontal
			this.dom.style.width= iChart.Math.toPixel(0);
			this.dom.style.height=iChart.Math.toPixel(0);
			this.dom.style.top=iChart.Math.toPixel(this.get('top'));
			this.dom.style.left=iChart.Math.toPixel(this.get('left'));
			this.css('visibility','hidden');
			
			this.horizontal = document.createElement("div");
			this.vertical = document.createElement("div");
			
			this.horizontal.style.width= iChart.Math.toPixel(this.get('width'));
			this.horizontal.style.height= iChart.Math.toPixel(this.get('line_width'));
			this.horizontal.style.backgroundColor = this.get('line_color');
			this.horizontal.style.position="absolute";
			
			this.vertical.style.width= iChart.Math.toPixel(this.get('line_width'));
			this.vertical.style.height = iChart.Math.toPixel(this.get('height'));
			this.vertical.style.backgroundColor = this.get('line_color');
			this.vertical.style.position="absolute";
			this.dom.appendChild(this.horizontal);
			this.dom.appendChild(this.vertical);
			
			if(this.get('shadow')){
				this.dom.style.boxShadow = this.get('shadowStyle');
			}
			
			this.wrap.appendChild(this.dom);
			
			var self = this;
			
			this.target.on('mouseover',function(e,m){
				self.show(e,m);	
			}).on('mouseout',function(e,m){
				self.hidden(e,m);	
			}).on('mousemove',function(e,m){
				self.follow(e,m);
			});
			
			
			
		}
});