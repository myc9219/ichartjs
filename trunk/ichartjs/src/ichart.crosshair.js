
	/**
	 * @overview this element simulate the crosshair on the coordinate.actually this composed of some div of html. 
	 * @component#iChart.CrossHair
	 * @extend#iChart.Html
	 */
	iChart.CrossHair = iChart.extend(iChart.Html,{
		configure:function(){
		
			/**
			 * invoked the super class's configuration
			 */
			iChart.CrossHair.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'crosshair';
			
			this.set({
				yAngle_ : undefined,
				/**
				 * @inner {Number} Specifies the position top,normally this will given by chart.(default to 0)
				 */
				 top:0,
				 /**
				 * @inner {Number} Specifies the position left,normally this will given by chart.(default to 0)
				 */
				 left:0,
				 /**
				 * @inner {Boolean} private use
				 */
				 hcross:true,
				  /**
				 * @inner {Boolean} private use
				 */
				 vcross:true,
				 /**
				 * @inner {Function} private use
				 */
				 invokeOffset:null,
				 /**
				 * @cfg {Number} Specifies the linewidth of the crosshair.(default to 1)
				 */
				 line_width:1,
				 /**
				 * @cfg {Number} Specifies the linewidth of the crosshair.(default to 1)
				 */
				 line_color:'#1A1A1A',
				 delay:200
			});
		},
		/**
		 * this function will implement at every target object,and this just default effect
		 */
		follow:function(e,m){
			if(this.get('invokeOffset')){
				var o = this.get('invokeOffset')(e,m);
				if(o&&o.hit){
					this.horizontal.style.top = (o.top-this.top)+"px";
					this.vertical.style.left = (o.left-this.left)+"px";
				}
			}else{
				/**
				 * set the 1px offset will make the line at the top left all the time
				 */
				this.horizontal.style.top = (e.offsetY-this.top-1)+"px";
				this.vertical.style.left = (e.offsetX-this.left-1)+"px";
			}
		},
		beforeshow:function(e,m){
			this.follow(e,m);
		},
		initialize:function(){
			iChart.CrossHair.superclass.initialize.call(this);
			
			var _ = this;
			
			_.top = iChart.fixPixel(_.get('top'));
			_.left = iChart.fixPixel(_.get('left'));
			
			_.dom = document.createElement("div");
			
			_.dom.style.zIndex=_.get('index');
			_.dom.style.position="absolute";
			/**
			 * set size zero make integration with vertical and horizontal
			 */
			_.dom.style.width= iChart.toPixel(0);
			_.dom.style.height=iChart.toPixel(0);
			_.dom.style.top=iChart.toPixel(_.get('top'));
			_.dom.style.left=iChart.toPixel(_.get('left'));
			_.css('visibility','hidden');
			
			_.horizontal = document.createElement("div");
			_.vertical = document.createElement("div");
			
			_.horizontal.style.width= iChart.toPixel(_.get('width'));
			_.horizontal.style.height= iChart.toPixel(_.get('line_width'));
			_.horizontal.style.backgroundColor = _.get('line_color');
			_.horizontal.style.position="absolute";
			
			_.vertical.style.width= iChart.toPixel(_.get('line_width'));
			_.vertical.style.height = iChart.toPixel(_.get('height'));
			_.vertical.style.backgroundColor = _.get('line_color');
			_.vertical.style.position="absolute";
			_.dom.appendChild(_.horizontal);
			_.dom.appendChild(_.vertical);
			
			if(_.get('shadow')){
				_.dom.style.boxShadow = _.get('shadowStyle');
			}
			
			_.wrap.appendChild(_.dom);
			
			_.T.on('mouseover',function(e,m){
				_.show(e,m);	
			}).on('mouseout',function(e,m){
				_.hidden(e,m);	
			}).on('mousemove',function(e,m){
				_.follow(e,m);
			});
			
		}
});// @end
