	/**
	 * Line ability for real-time show 
	 * @author wanghe
	 * @component#Jidea.LineSegment
	 * @extend#Jidea.Component
	 */
	Jidea.LineSegment = Jidea.extend(Jidea.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.LineSegment.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'linesegment';
			
			this.configuration({
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
				for(var i=0;i<this.points.length;i++){
					this.target.textStyle('center','bottom',Jidea.getFont(this.get('fontweight'),this.get('fontsize'),this.get('font')));
					this.target.fillText(this.points[i].value,this.x+this.points[i].x,this.y-this.points[i].y-this.get('point_size')*3/2,false,this.get('background_color'),'lr',16);
				}
			}
		},
		drawLineSegment:function(){
			this.target.shadowOn(this.get('shadow'),this.get('shadow_color'),this.get('shadow_blur'),this.get('shadow_offsetx'),this.get('shadow_offsety'));
			
			if(this.get('area')){
				var polygons = [this.x,this.y];
				for(var i=0;i<this.points.length;i++){
					polygons.push(this.x+this.points[i].x);
					polygons.push(this.y-this.points[i].y);
				}
				polygons.push(this.x+this.get('width'));
				polygons.push(this.y);
				var bg = this.get('light_color');
				if(this.get('gradient')){
					bg = this.target.avgLinearGradient(this.x,this.y-this.get('height'),this.x,this.y,[this.get('light_color2'),bg]);
				}
				//NEXT Config the area polygon
				this.target.polygon(bg,false,1,'',false,'',0,0,0,this.get('area_opacity'),polygons);
			}
			
			
			for(var i=0;i<this.points.length-1;i++){
				this.target.line(this.x+this.points[i].x,this.y-this.points[i].y,this.x+this.points[i+1].x,this.y-this.points[i+1].y,this.get('brushsize'),this.get('fill_color'),false);
			}
			
			if(this.get('intersection')){
				for(var i=0;i<this.points.length;i++){
					if(this.get('point_hollow')){
						this.target.round(this.x+this.points[i].x,this.y-this.points[i].y,this.get('point_size'),'#FEFEFE',this.get('brushsize'),this.get('fill_color'));
					}else{
						this.target.round(this.x+this.points[i].x,this.y-this.points[i].y,this.get('point_size'),this.get('fill_color'));
					}
				}
			}
			
			if(this.get('shadow')){
		    	this.target.shadowOff();
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
			Jidea.LineSegment.superclass.doConfig.call(this);
			Jidea.Assert.gtZero(this.get('spacing'),'spacing');
			
			this.points = this.get('points');
			
			for(var i=0;i<this.points.length;i++){
				this.points[i].width = this.points[i].x;
				this.points[i].height = this.points[i].y;
			}
			
			var sp = this.get('spacing');
			
			if(this.get('event_range_x')==0){
				this.push('event_range_x',Math.floor(sp/2));
			}else{
				this.push('event_range_x',Jidea.Math.between(1,Math.floor(sp/2),this.get('event_range_x')));
			}
			if(this.get('event_range_y')==0){
				this.push('event_range_y',Math.floor(this.get('point_size')));
			}
			
			var heap = this.get('tipInvokeHeap');
			
			if(this.get('tip.enable')){
				//this use for tip coincidence
				this.on('mouseover',function(e,m){
					heap.push(this);
					this.tipPosition = heap.length;
				}).on('mouseout',function(e,m){
					heap.pop();
				});
				
				
				this.push('tip.invokeOffsetDynamic',true);
				this.tip = new Jidea.Tip(this.get('tip'),this);
			}
			
			var self = this,
				c = self.get('coordinate'),
				ry = self.get('event_range_y'),
				r = self.get('event_range_x'),
				ly = self.get('limit_y'),
				k = self.get('keep_with_coordinate'),
				valid =function(i,x,y){
					if(Math.abs(x-(self.x+self.points[i].x))<r&&(!ly||(ly&&Math.abs(y-(self.y-self.points[i].y))<ry))){
						return true;
					}
					return false;
				},
				to = function(i){
					return {valid:true,text:self.points[i].value,top:self.y-self.points[i].y,left:self.x+self.points[i].x,hit:true};
				};
			
			/**
			 * override the default method
			 */
			this.isEventValid =  function(e){
				//console.time('mouseover');
				if(c&&!c.isEventValid(e).valid){
					return {valid:false};
				}
				var ii = Math.floor((e.offsetX-self.x)/sp);
				if(ii<0||ii>=(this.points.length-1)){
					ii = Jidea.Math.between(0,this.points.length-1,ii);
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