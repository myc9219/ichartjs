/**
 * Line ability for Point show
 * 
 * @overview this component use for abc
 * @component#iChart.Points
 * @extend#iChart.Component
 */
iChart.Points = iChart.extend(iChart.Component, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Points.superclass.configure.apply(this, arguments);

		/**
		 * indicate the component's type
		 */
		this.type = 'points';

		this.set({
			/**
			 * @cfg {Boolean} if the label displayed (default to false)
			 */
			label : false,
			/**
			 * @cfg {String} Specifies the shape of two line segment' point(default to 'round').Only applies when intersection is true Available value are:
			 * @Option 'round'
			 */
			sign : 'round',
			/**
			 * @cfg {Boolean} If true the centre of point will be hollow.(default to true)
			 */
			hollow : true,
			/**
			 * @cfg {String} Specifies the bgcolor when hollow applies true.(default to '#FEFEFE')
			 */
			hollow_color : '#FEFEFE',
			sign_opacity:0.6,
			/**
			 * @cfg {Number} Specifies the size of point.(default size 8).Only applies when intersection is true
			 */
			point_size : 8,
			event_size : 0,
			/**
			 * @inner {Array} the set of points to compose line segment
			 */
			points : [],
			/**
			 * @cfg {Number} Override the default as 1
			 */
			shadow_blur : 1,
			/**
			 * @cfg {Number} Override the default as 1
			 */
			shadow_offsety : 1,
			/**
			 * @inner {Number} Specifies the space between two point
			 */
			point_space : 0,
			tip_offset : 2,
			/**
			 * @inner {Object} reference of coordinate
			 */
			coordinate : null
		});

		this.label = null;
		this.tip = null;
	},
	drawSegment : function() {
		this.T.shadowOn(this.get('shadow'));
		this.T.globalAlpha(this.get('sign_opacity'));
		
		var f = this.getPlugin('sign'),b=this.get('f_color'),s=this.get('point_size');
		
		this.get('points').each(function(q,i){
			if(!q.ignored){
				if(!f||!f.call(this,this.T,this.get('sign'),q.x, q.y,s,b)){
					if (this.get('hollow')) {
						this.T.round(q.x, q.y, s*3/8,this.get('hollow_color'),s/4,b);
					} else {
						this.T.round(q.x, q.y, s/2,b);
					}
				}
			}
		},this);
		
		this.T.globalAlpha(1);
		if (this.get('shadow')) {
			this.T.shadowOff();
		}
	},
	doDraw : function(opts) {
		this.drawSegment();
		if (this.get('label')) {
			var p = this.get('points');
			for ( var i = 0; i < p.length; i++) {
				this.T.text(p[i].value, p[i].x, p[i].y - this.get('point_size') * 3 / 2, false, this.get('f_color'), 'center', 'bottom', this.get('fontStyle'));
			}
		}
	},
	isEventValid : function(e) {
		return {
			valid : false
		};
	},
	tipInvoke : function() {
		var x = this.x, y = this.y, o = this.get('tip_offset'), s = this.get('point_size') + o, _ = this;
		return function(w, h, m) {
			var l = m.left, t = m.top;
			l = ((_.tipPosition < 3 && (m.left - w - x - o > 0)) || (_.tipPosition > 2 && (m.left - w - x - o < 0))) ? l - (w + o) : l + o;
			t = _.tipPosition % 2 == 0 ? m.top + s : m.top - h - s;
			return {
				left : l,
				top : t
			}
		}
	},
	doConfig : function() {
		iChart.Points.superclass.doConfig.call(this);
		
		var _ = this, size = _.get('event_size'), heap = _.get('tipInvokeHeap'), p = _.get('points');
		if(size==0){
			size = _.push('event_size',_.get('point_size'));
		}
		
		for ( var i = 0; i < p.length; i++) {
			p[i].x_ = p[i].x;
			p[i].y_ = p[i].y;
		}
		
		if (_.get('tip.enable')) {
			/**
			 * _ use for tip coincidence
			 */
			_.on('mouseover', function(e, m) {
				heap.push(_);
				_.tipPosition = heap.length;
			}).on('mouseout', function(e, m) {
				heap.pop();
			});
			_.push('tip.invokeOffsetDynamic', true);
			_.tip = new iChart.Tip(_.get('tip'), _);
		}
		
		var c = _.get('coordinate'),valid = function(p0, x, y) {
			if (Math.abs(x - (p0.x)) < size &&  Math.abs(y - (p0.y)) < size) {
				return true;
			}
			return false;
		}, to = function(i) {
			return {
				valid : true,
				stop : true,
				text : p[i].text,
				value : p[i].value,
				top : p[i].y,
				left : p[i].x,
				i:i,
				hit : true
			};
		};

		/**
		 * override the default method
		 */
		_.isEventValid = function(e) {
			// console.time('mouseover');
			if (c && !c.isEventValid(e).valid) {
				return {
					valid : false
				};
			}
			// calculate the pointer's position will between which two point?this function can improve location speed
			for ( var i = 0; i < p.length; i++) {
				if (valid(p[i], e.x, e.y))
					return to(i);
			}
			// console.timeEnd('mouseover');
			return {
				valid : false
			};
		}

	}
});// @end
