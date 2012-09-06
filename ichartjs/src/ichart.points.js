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
			point_style : 'round',
			/**
			 * @cfg {Boolean} If true the centre of point will be hollow.(default to true)
			 */
			point_hollow : true,
			point_opacity:0.6,
			/**
			 * @cfg {Number} Specifies the size of point.(default size 3).Only applies when intersection is true
			 */
			point_size : 3,
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
		var p = this.get('points');
		this.T.globalAlpha(this.get('point_opacity'));
		for ( var i = 0; i < p.length; i++) {
			if (this.get('point_hollow')) {
				this.T.round(p[i].x, p[i].y, this.get('point_size'), '#FEFEFE', Math.round(this.get('point_size')/2), this.get('f_color'));
			} else {
				this.T.round(p[i].x, p[i].y, this.get('point_size'), this.get('f_color'));
			}
		}
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
	doConfig : function() {
		iChart.Points.superclass.doConfig.call(this);
		

	}
});// @end
