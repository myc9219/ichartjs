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
			if(this.direction==_.L){
				v.reverse();
			}
			
			while(this.size<(this.line.get('points').length+v.length))
				this.line.get('points').shift();
			
			//平移
			for ( var j = 0; j < this.line.get('points').length; j++) {
				this.line.get('points')[j].x += (this.space*v.length)*(this.direction==_.L?-1:1);
			}
			
			for ( var j = 0; j < v.length; j++) {
				x = this.direction==_.L?(this.end - this.space * j):(this.space * j);
				y = (iChart.between(this.T.S.start,this.T.S.end,v[j]) - this.T.S.start)*this.T.S.uh;
				this.line.get('points').push(iChart.merge({x : x,y : y,value : v[j]},this.T.fireEvent(this.T, 'parsePoint', [v[j], x, y, j ])));
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
			style = style || {};
			var LS = iChart.clone(this.get('sub_option'));
				LS.brushsize = style.linewidth || 1;
				LS.background_color = style.color || '#BDBDBD';
			var L = new iChart.LineSegment(LS, this);
			this.components.push(L);
			var queue = new Queue(this,L);
			//this.queues.push(queue);
			return queue;
		},
		doConfig : function() {
			iChart.LineMonitor2D.superclass.doConfig.call(this);
			
			var _ = this;
			//the monitor not support the animation now
			_.push('animation',false);
			
			
			if (_.get('coordinate.crosshair.enable')) {
				_.push('coordinate.crosshair.hcross',_.data.length == 1);
				_.push('coordinate.crosshair.invokeOffset',function(e, m) {
						var r = _.lines[0].isEventValid(e,_.lines[0]);
						return r.valid ? r : false;
				});
			}
			
			_.coo = new iChart.Coordinate2D(iChart.merge( {
				scale : [ {
					position : _.get('scaleAlign'),
					max_scale : _.get('maxValue')
				}, {
					position : _.get('labelAlign'),
					scaleEnable : false,
					start_scale : 1,
					scale : 1,
					end_scale : _.get('maxItemSize'),
					labels : _.get('labels')
				} ],
				axis : {
					width : [ 0, 0, 1, 1 ]
				}
			}, _.get('coordinate')), _);

			_.components.push(_.coo);
			
			_.push('label_spacing',_.get('coordinate.valid_width')/(_.get('queue_size')-1));
			
			if (!_.get('sub_option.tip')) {
				_.push('sub_option.tip', _.get('tip'));
			} else {
				_.push('sub_option.tip.wrap', _.get('tip.wrap'));
			}

			_.push('sub_option.tip.showType','follow');
			_.push('sub_option.coordinate',_.coo);
			_.push('sub_option.keep_with_coordinate',true);
			
			//get the max/min scale of this coordinate for calculated the height
			_.S = _.coo.getScale(_.get('scaleAlign'));
			_.S.uh = _.get('coordinate.valid_height')/ _.S.distance;
			

		}

	});//@end
})();