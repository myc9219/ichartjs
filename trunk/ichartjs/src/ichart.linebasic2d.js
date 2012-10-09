/**
 * @overview this component will draw a line2d chart.
 * @component#@chart#iChart.LineBasic2D
 * @extend#iChart.Line
 */
iChart.LineBasic2D = iChart.extend(iChart.Line, {
	/**
	 * initialize the context for the LineBasic2D
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.LineBasic2D.superclass.configure.call(this);

		this.type = 'basicline2d';

		this.tipInvokeHeap = [];
	},
	doAnimation : function(t, d) {
		var l, ps, p;
		this.coo.draw();
		for ( var i = 0; i < this.lines.length; i++) {
			l = this.lines[i];
			p = l.get('points');
			for ( var j = 0; j < p.length; j++) {
				p[j].y = l.y - Math.ceil(this.animationArithmetic(t, 0, l.y - p[j].y_, d));
			}
			l.drawSegment();
		}
	},
	doConfig : function() {
		iChart.LineBasic2D.superclass.doConfig.call(this);
		var _ = this._();

		_.coo = new iChart.Coordinate2D(iChart.merge({
			scale : [{
				position : _.get('scaleAlign'),
				max_scale : _.get('maxValue')
			}, {
				position : _.get('labelAlign'),
				scaleEnable : false,
				start_scale : 1,
				scale : 1,
				end_scale : _.get('maxItemSize'),
				labels : _.get('labels')
			}]
		}, _.get('coordinate')), _);

		_.components.push(_.coo);

		/**
		 * get the max/min scale of this coordinate for calculated the height
		 */
		var S = _.coo.getScale(_.get('scaleAlign')), H = _.get('coordinate.valid_height'), sp = _.get('label_spacing'), points, x, y, ox = _.get('sub_option.originx'), oy = _.get('sub_option.originy'), p;

		_.push('sub_option.tip.showType', 'follow');
		_.push('sub_option.coordinate', _.coo);
		_.push('sub_option.tipInvokeHeap', _.tipInvokeHeap);
		_.push('sub_option.point_space', sp);
		
		_.data.each(function(d, i) {
			points = [];
			d.value.each(function(v, j) {
				x = sp * j;
				y = (v - S.start) * H / S.distance;
				p = {
					x : ox + x,
					y : oy - y,
					value : v,
					text : v
				};
				iChart.merge(p, _.fireEvent(_, 'parsePoint', [d, v, x, y, j]));
				
				if (_.get('tip.enable'))
					p.text = _.fireString(_, 'parseTipText', [d, v, j], v);
				
				points.push(p);
			}, _);
			
			_.push('sub_option.points', points);
			_.push('sub_option.brushsize', d.linewidth || 1);
			_.push('sub_option.background_color', d.background_color || d.color);
			_.lines.push(new iChart.LineSegment(_.get('sub_option'), _));
		}, this);
	}

});
/**
 * @end
 */
