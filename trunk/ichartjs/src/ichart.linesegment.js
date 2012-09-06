/**
 * Line ability for real-time show
 * 
 * @overview this component use for abc
 * @component#iChart.LineSegment
 * @extend#iChart.Component
 */
iChart.LineSegment = iChart.extend(iChart.Component, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.LineSegment.superclass.configure.apply(this, arguments);

		/**
		 * indicate the component's type
		 */
		this.type = 'linesegment';

		this.set({
			/**
			 * @cfg {Boolean} If true there show a point when Line-line intersection(default to true)
			 */
			intersection : true,
			/**
			 * @cfg {Boolean} if the label displayed (default to false)
			 */
			label : false,
			/**
			 * @cfg {String} Specifies the shape of two line segment' point(default to 'round').Only applies when intersection is true Available value are:
			 * @Option 'round'
			 */
			point_style : 'round',
			/**
			 * @cfg {Boolean} If true the centre of point will be hollow.(default to true)
			 */
			point_hollow : true,
			/**
			 * @cfg {Boolean} If true Line will smooth.(default to false)
			 */
			smooth : false,
			/**
			 * @cfg {Number} Specifies smoothness of line will be.(default to 1.5)
			 * 1 means control points midway between points, 2 means 1/3 from the point,formula is 1/(smoothing + 1) from the point
			 */
			smoothing : 1.5,
			/**
			 * @cfg {Number} Specifies the size of point.(default size 3).Only applies when intersection is true
			 */
			point_size : 3,
			/**
			 * @inner {Array} the set of points to compose line segment
			 */
			points : [],
			/**
			 * @inner {Boolean} If true the event accord width coordinate.(default to false)
			 */
			keep_with_coordinate : false,
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
			/**
			 * @inner {Object} reference of coordinate
			 */
			coordinate : null,
			/**
			 * @cfg {Number} Specifies the valid range of x-direction.(default to 0)
			 */
			event_range_x : 0,
			/**
			 * @cfg {Boolean} If true tip show when the mouse must enter the valid distance of axis y.(default to false)
			 */
			limit_y : false,
			/**
			 * @cfg {Number} Specifies the space between the tip and point.(default to 2)
			 */
			tip_offset : 2,
			/**
			 * @cfg {Number} Specifies the valid range of y-direction.(default to 0)
			 */
			event_range_y : 0
		});

		this.label = null;
		this.tip = null;
	},
	drawSegment : function() {
		this.T.shadowOn(this.get('shadow'));
		var p = this.get('points');
		if (this.get('area')) {
			var polygons = [this.x, this.y];
			for ( var i = 0; i < p.length; i++) {
				polygons.push(p[i].x);
				polygons.push(p[i].y);
			}
			polygons.push(this.x + this.get('width'));
			polygons.push(this.y);
			var bg = this.get('light_color');
			if (this.get('gradient')) {
				bg = this.T.avgLinearGradient(this.x, this.y - this.get('height'), this.x, this.y, [this.get('light_color2'), bg]);
			}
			/**
			 * NEXT Config the area polygon 应用CurvePoint,polygons传入集合点
			 */
			this.T.polygon(bg, false, 1, '', false, '', 0, 0, 0, this.get('area_opacity'), polygons);
		}

		this.T.lineArray(p, this.get('brushsize'), this.get('f_color'), this.get('smooth'), this.get('smoothing'));
		
		if (this.get('intersection')) {
			for ( var i = 0; i < p.length; i++) {
				if (this.get('point_hollow')) {
					this.T.round(p[i].x, p[i].y, this.get('point_size'), '#FEFEFE', this.get('brushsize'), this.get('f_color'));
				} else {
					this.T.round(p[i].x, p[i].y, this.get('point_size'), this.get('f_color'));
				}
			}
		}

		if (this.get('shadow')) {
			this.T.shadowOff();
		}
	},
	doDraw : function(opts) {
		this.drawSegment();
		if (this.get('intersection') && this.get('label')) {
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
		iChart.LineSegment.superclass.doConfig.call(this);
		iChart.Assert.gtZero(this.get('point_space'), 'point_space');

		var _ = this, sp = this.get('point_space'), ry = _.get('event_range_y'), rx = _.get('event_range_x'), heap = _.get('tipInvokeHeap'), p = _.get('points');

		for ( var i = 0; i < p.length; i++) {
			p[i].x_ = p[i].x;
			p[i].y_ = p[i].y;
		}

		if (rx == 0) {
			rx = _.push('event_range_x', Math.floor(sp / 2));
		} else {
			rx = _.push('event_range_x', iChart.between(1, Math.floor(sp / 2), rx));
		}
		if (ry == 0) {
			ry = _.push('event_range_y', Math.floor(_.get('point_size')));
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

		var c = _.get('coordinate'), ly = _.get('limit_y'), k = _.get('keep_with_coordinate'), valid = function(i, x, y) {
			if (Math.abs(x - (p[i].x)) < rx && (!ly || (ly && Math.abs(y - (p[i].y)) < ry))) {
				return true;
			}
			return false;
		}, to = function(i) {
			return {
				valid : true,
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
			var ii = Math.floor((e.offsetX - _.x) / sp);
			if (ii < 0 || ii >= (p.length - 1)) {
				ii = iChart.between(0, p.length - 1, ii);
				if (valid(ii, e.offsetX, e.offsetY))
					return to(ii);
				else
					return {
						valid : k
					};
			}
			// calculate the pointer's position will between which two point?this function can improve location speed
			for ( var i = ii; i <= ii + 1; i++) {
				if (valid(i, e.offsetX, e.offsetY))
					return to(i);
			}
			// console.timeEnd('mouseover');
			return {
				valid : k
			};
		}

	}
});// @end
