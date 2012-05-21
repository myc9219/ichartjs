;(function(){
	var Queue = function(T,L){
		this.T = T;
		this.line = L;
		this.direction = T.get('direction');
		this.size = T.get('queue_size');
		this.space = T.get('label_spacing');
		this.end = T.get('line_end');
	}
	
	Queue.prototype = {
		push:function(v){
			if(!iChart.isArray(v)){
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
				y = (iChart.between(this.T.S.start,this.T.S.end,v[j]) - this.T.S.start)*this.T.S.uh;
				this.line.points.push(iChart.merge({x : x,y : y,value : v[j]},this.T.fireEvent(this.T, 'parsePoint', [v[j], x, y, j ])));
			}
		}
	}
	
	/**
	 * Line ability for real-time show 
	 * @overview this component use for abc
	 * @component#@chart#iChart.LineMonitor2D
	 * @extend#iChart.Line
	 */
	iChart.LineMonitor2D = iChart.extend(iChart.Line,{
		/**
		 * initialize the context for the denseline2d
		 */
		configure : function(config) {
			/**
			 * invoked the super class's  configuration
			 */
			iChart.LineMonitor2D.superclass.configure.call(this);

			this.type = 'linemonitor2d';

			this.set({
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
			var LS = iChart.clone(this.get('segment_style'));
				LS.brushsize = style.linewidth || 1;
				LS.background_color = style.color || '#BDBDBD';
			var L = new iChart.LineSegment(LS, this);
			this.pushComponent(L);
			var queue = new Queue(this,L);
			//this.queues.push(queue);
			return queue;
		},
		doConfig : function() {
			iChart.LineMonitor2D.superclass.doConfig.call(this);
			
			var self = this;
			//the monitor not support the animation now
			self.push('animation',false);
			
			
			if (self.get('coordinate.crosshair.enable')) {
				self.push('coordinate.crosshair.hcross',self.data.length == 1);
				self.push('coordinate.crosshair.invokeOffset',function(e, m) {
						var r = self.lines[0].isEventValid(e);
						return r.valid ? r : false;
				});
			}
			
			self.coo = new iChart.Coordinate2D(iChart.merge( {
				kedu : [ {
					position : self.get('keduAlign'),
					max_scale : self.get('maxValue')
				}, {
					position : self.get('labelAlign'),
					scaleEnable : false,
					start_scale : 1,
					scale : 1,
					end_scale : self.get('maxItemSize'),
					labels : self.get('labels')
				} ],
				axis : {
					width : [ 0, 0, 1, 1 ]
				}
			}, self.get('coordinate')), self);

			self.pushComponent(self.coo, true);
			
			self.push('label_spacing',self.get('coordinate.valid_width')/(self.get('queue_size')-1));
			
			if (!self.get('segment_style.tip')) {
				self.push('segment_style.tip', self.get('tip'));
			} else {
				self.push('segment_style.tip.wrap', self.get('tip.wrap'));
			}

			self.push('segment_style.tip.showType','follow');
			self.push('segment_style.coordinate',self.coo);
			self.push('segment_style.keep_with_coordinate',true);
			
			//get the max/min scale of this coordinate for calculated the height
			self.S = self.coo.getScale(self.get('keduAlign'));
			self.S.uh = self.get('coordinate.valid_height')/ self.S.distance;
			

		}

	});//@end
})();