	/**
	 * Line ability for real-time show 
	 * @overview this component use for abc
	 * @component#iChart.LineSegment
	 * @extend#iChart.Component
	 */
	iChart.LineSegment = iChart.extend(iChart.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.LineSegment.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'linesegment';
			
			this.set({
				 /**
				  * @cfg {Boolean} if highlight the point when Line-line intersection(default to true)
				  */
				 intersection:true,
				 /**
				 *@cfg {Boolean} if the label displayed (default to false)
				 */
				 label:false,
				 /**
				  * @cfg {String} the shape of two line segment' point(default to 'round').Only applies when intersection is true
				  * @Option 'round'
				  */
				 point_style:'round',
				 point_hollow:true,
				 /**
				  * @cfg {Number} the size of point(default size 4).Only applies when intersection is true
				  */
				 point_size:3,
				 /**
				  * @cfg {Array} the set of points to compose line segment
				  */
				 points:[],
				 keep_with_coordinate:false,
				 shadow:true,
				 shadow_blur:1,
				 shadow_offsetx:0,
				 shadow_offsety:1,
				 spacing:0,
				 coordinate:null,
				 event_range_x:0,
				 /**
				  * @cfg {Boolean} if true tip show when the mouse must enter the valid distance of axis y
				  */
				 limit_y:false,
				 /**
				 * @cfg {Number} The distance between the tip and point
				 */
				 tip_offset:2,
				 event_range_y:0,
				 area:false,
				 area_opacity:0.4,
				 tip:{
					 enable:false,
					 border:{
						width:2
					 }
				 }
			});
			
			this.label = null;
			this.tip = null;
		},
		drawLabel:function(){
			if(this.get('intersection')&&this.get('label')){
				var p = this.get('points');
				for(var i=0;i<p.length;i++){
					this.T.textStyle('center','bottom',iChart.getFont(this.get('fontweight'),this.get('fontsize'),this.get('font')));
					this.T.fillText(p[i].value,this.x+p[i].x,this.y-p[i].y-this.get('point_size')*3/2,false,this.get('background_color'),'lr',16);
				}
			}
		},
		drawLineSegment:function(){
			this.T.shadowOn(this.get('shadow'),this.get('shadow_color'),this.get('shadow_blur'),this.get('shadow_offsetx'),this.get('shadow_offsety'));
			var p = this.get('points');
			
			if(this.get('area')){
				var polygons = [this.x,this.y];
				for(var i=0;i<p.length;i++){
					polygons.push(this.x+p[i].x);
					polygons.push(this.y-p[i].y);
				}
				polygons.push(this.x+this.get('width'));
				polygons.push(this.y);
				var bg = this.get('light_color');
				if(this.get('gradient')){
					bg = this.T.avgLinearGradient(this.x,this.y-this.get('height'),this.x,this.y,[this.get('light_color2'),bg]);
				}
				//NEXT Config the area polygon
				this.T.polygon(bg,false,1,'',false,'',0,0,0,this.get('area_opacity'),polygons);
			}
			
			
			for(var i=0;i<p.length-1;i++){
				this.T.line(this.x+p[i].x,this.y-p[i].y,this.x+p[i+1].x,this.y-p[i+1].y,this.get('brushsize'),this.get('fill_color'),false);
			}
			
			if(this.get('intersection')){
				for(var i=0;i<p.length;i++){
					if(this.get('point_hollow')){
						this.T.round(this.x+p[i].x,this.y-p[i].y,this.get('point_size'),'#FEFEFE',this.get('brushsize'),this.get('fill_color'));
					}else{
						this.T.round(this.x+p[i].x,this.y-p[i].y,this.get('point_size'),this.get('fill_color'));
					}
				}
			}
			
			if(this.get('shadow')){
		    	this.T.shadowOff();
		    }
		},
		doDraw:function(opts){
			this.drawLineSegment();
			this.drawLabel();
		},
		isEventValid:function(e){
			return {valid:false};
		},
		tipInvoke:function(){
			var x  = this.x,
				y = this.y,
				o = this.get('tip_offset'),
				s = this.get('point_size')+o,
				self = this;
			return function(w,h,m){
				var l = m.left,t = m.top;
				l = ((self.tipPosition<3&&(m.left-w-x-o>0))||(self.tipPosition>2&&(m.left-w-x-o<0)))?l-(w+o):l+o;
				t = self.tipPosition%2==0?m.top+s:m.top-h-s;
				return {
					left:l,
					top:t
				}
			}
		},
		doConfig:function(){
			iChart.LineSegment.superclass.doConfig.call(this);
			iChart.Assert.gtZero(this.get('spacing'),'spacing');
			
			var self = this,
				sp = this.get('spacing'),
				ry = self.get('event_range_y'),
				rx = self.get('event_range_x'),
				heap = self.get('tipInvokeHeap'),
				p = self.get('points');
			self.points = p;
			
			for(var i=0;i<p.length;i++){
				p[i].width = p[i].x;
				p[i].height = p[i].y;
			}
			
			if(rx==0){
				rx = self.push('event_range_x',Math.floor(sp/2));
			}else{
				rx = self.push('event_range_x',iChart.between(1,Math.floor(sp/2),rx));
			}
			if(ry==0){
				ry = self.push('event_range_y',Math.floor(self.get('point_size')));
			}
			
			if(self.get('tip.enable')){
				//self use for tip coincidence
				self.on('mouseover',function(e,m){
					heap.push(self);
					self.tipPosition = heap.length;
				}).on('mouseout',function(e,m){
					heap.pop();
				});
				self.push('tip.invokeOffsetDynamic',true);
				self.tip = new iChart.Tip(self.get('tip'),self);
			}
			
			var c = self.get('coordinate'),
				ly = self.get('limit_y'),
				k = self.get('keep_with_coordinate'),
				valid =function(i,x,y){
					if(Math.abs(x-(self.x+p[i].x))<rx&&(!ly||(ly&&Math.abs(y-(self.y-p[i].y))<ry))){
						return true;
					}
					return false;
				},
				to = function(i){
					return {valid:true,text:p[i].value,top:self.y-p[i].y,left:self.x+p[i].x,hit:true};
				};
			
			/**
			 * override the default method
			 */
			self.isEventValid =  function(e){
				//console.time('mouseover');
				if(c&&!c.isEventValid(e).valid){
					return {valid:false};
				}
				var ii = Math.floor((e.offsetX-self.x)/sp);
				if(ii<0||ii>=(p.length-1)){
					ii = iChart.between(0,p.length-1,ii);
					if(valid(ii,e.offsetX,e.offsetY))
						return to(ii);
					else
						return {valid:k};	
				}
				//calculate the pointer's position will between which two point?this function can improve location speed 
				for(var i=ii;i<=ii+1;i++){
					if(valid(i,e.offsetX,e.offsetY))
						return to(i);
				}
				//console.timeEnd('mouseover');
				return {valid:k};
			}
			
			
		}
});