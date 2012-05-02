;(function(){
	var Queue = function(T,L){
		this.target = T;
		this.line = L;
		this.direction = T.get('direction');
		this.size = T.get('queue_size');
		this.space = T.get('label_spacing');
		this.end = T.get('line_end');
	}
	
	Queue.prototype = {
		push:function(v){
			if(!Jidea.isArray(v)){
				v = [v];
			}
			if(this.direction=='left'){
				v.reverse();
			}
			
			while(this.size<(this.line.points.length+v.length))
				this.line.points.shift();
			
			//平移
			for ( var j = 0; j < this.line.points.length; j++) {
				this.line.points[j].x += (this.space*v.length)*(this.direction=='left'?-1:1);
			}
			
			for ( var j = 0; j < v.length; j++) {
				
				x = this.direction=='left'?(this.end - this.space * j):(this.space * j);
				
				y = (Jidea.Math.between(this.target.S.start,this.target.S.end,v[j]) - this.target.S.start)*this.target.S.uh;
				
				this.line.points.push(Jidea.merge({x : x,y : y,value : v[j]},this.target.fireEvent(this.target, 'parsePoint', [v[j], x, y, j ])));
			}
		}
	}
	
	/**
	 * Line ability for real-time show 
	 * @overview this component use for abc
	 * @component#@chart#Jidea.LineMonitor2D
	 * @extend#Jidea.Line
	 */
	Jidea.LineMonitor2D = Jidea.extend(Jidea.Line,{
		/**
		 * initialize the context for the denseline2d
		 */
		configure : function(config) {
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.LineMonitor2D.superclass.configure.call(this);

			this.type = 'linemonitor2d';

			this.configuration({
				/**
				 * @cfg {String} the direction of line run (default 'left')
				 * Available value are:
				 * @Option 'left'
				 * @Option 'right'
				 */
				direction : 'left',
				queue_size : 10
			});
			this.registerEvent();
			
			this.queues = [];
			
		},
		createQueue:function(style){
			this.init();
			style = style || {};
			var LS = Jidea.clone(this.get('segment_style'));
				LS.brushsize = style.linewidth || 1;
				LS.background_color = style.color || '#BDBDBD';
			var L = new Jidea.LineSegment(LS, this);
			this.pushComponent(L);
			var queue = new Queue(this,L);
			//this.queues.push(queue);
			return queue;
		},
		doConfig : function() {
			Jidea.LineMonitor2D.superclass.doConfig.call(this);
			
			//the monitor not support the animation now
			this.push('animation',false);
			
			var single = this.data.length == 1, self = this;
			
			if (this.get('coordinate.crosshair.enable')) {
				this.push('coordinate.crosshair.hcross',single);
				this.push('coordinate.crosshair.invokeOffset',function(e, m) {
						var r = self.lines[0].isEventValid(e);
						return r.valid ? r : false;
				});
			}
			
			this.coordinate = new Jidea.Coordinate2D(Jidea.merge( {
				kedu : [ {
					position : this.get('keduAlign'),
					max_scale : this.get('maxValue')
				}, {
					position : this.get('labelAlign'),
					scaleEnable : false,
					start_scale : 1,
					scale : 1,
					end_scale : this.get('maxItemSize'),
					labels : this.get('labels')
				} ],
				axis : {
					width : [ 0, 0, 1, 1 ]
				}
			}, this.get('coordinate')), this);

			this.pushComponent(this.coordinate, true);
			
			this.push('label_spacing',this.get('coordinate.valid_width')/(this.get('queue_size')-1));
			
			if (!this.get('segment_style.tip')) {
				this.push('segment_style.tip', this.get('tip'));
			} else {
				this.push('segment_style.tip.wrap', this.get('tip.wrap'));
			}

			this.push('segment_style.tip.showType','follow');
			this.push('segment_style.coordinate',this.coordinate);
			this.push('segment_style.keep_with_coordinate',true);
			
			
			
			//get the max/min scale of this coordinate for calculated the height
			this.S = this.coordinate.getScale(this.get('keduAlign'));
			this.S.uh = this.get('coordinate.valid_height')/ this.S.distance;
			

		}

	});
})();