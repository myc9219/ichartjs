/**
 * @overview this component use for abc
 * @component#iChart.Line
 * @extend#iChart.Chart
 */
iChart.Line = iChart.extend(iChart.Chart, {
	/**
	 * initialize the context for the line
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Line.superclass.configure.call(this);

		this.type = 'line';

		this.dataType = 'simple';

		this.set({
			/**
			 * @cfg {Object} the option for coordinate
			 */
			coordinate : {},
			/**
			 * @cfg {String} the align of scale.(default to 'left') Available value are:
			 * @Option 'left'
			 * @Option 'right'
			 */
			scaleAlign : 'left',
			/**
			 * @cfg {String} the align of label.(default to 'bottom') Available value are:
			 * @Option 'top,'bottom'
			 */
			labelAlign : 'bottom',
			/**
			 * @cfg {Array} the array of labels close to the axis
			 */
			labels : [],
			/**
			 * @cfg {Number} the distance of column's bottom and text.(default to 6)
			 */
			label_space : 6,
			/**
			 * @inner {Boolean} Can Line smooth?now has unavailable
			 */
			smooth : false,
			/**
			 * @cfg {Boolean} if the point are proportional space.(default to true)
			 */
			proportional_spacing : true,
			/**
			 * @inner {Number} the space of each label
			 */
			label_spacing : 0,
			/**
			 * @cfg {Object} the option for linesegment.
			 * For details see <link>iChart.LineSegment</link>
			 */
			segment_style : {},
			/**
			 * {Object} the option for legend.
			 */
			legend : {
				sign : 'round-bar',
				sign_size : 14
			}
		});

		this.registerEvent(
		/**
		 * @event Fires when parse this element'data.Return value will override existing.
		 * @paramter object#data the point's data
		 * @paramter int#x coordinate-x of point
		 * @paramter int#y coordinate-y of point
		 * @paramter int#index the index of point
		 * @return Object object Detail:
		 * @property text the text of point
		 * @property x coordinate-x of point
		 * @property y coordinate-y of point
		 */
		'parsePoint');

		this.lines = [];
	},
	doConfig : function() {
		iChart.Line.superclass.doConfig.call(this);

		/**
		 * apply the coordinate feature
		 */
		iChart.Interface.coordinate.call(this);

		this.push('line_start', (this.get('coordinate.width') - this.get('coordinate.valid_width')) / 2);
		this.push('line_end', this.get('coordinate.width') - this.get('line_start'));

		if (this.get('proportional_spacing'))
			this.push('label_spacing', this.get('coordinate.valid_width') / (this.get('maxItemSize') - 1));

		this.push('segment_style.originx', this.get('originx') + this.get('line_start'));

		/**
		 * y also has line_start and line end
		 */
		this.push('segment_style.originy', this.get('originy') + this.get('coordinate.height'));

		this.push('segment_style.width', this.get('coordinate.valid_width'));
		this.push('segment_style.height', this.get('coordinate.valid_height'));

		this.push('segment_style.limit_y', this.data.length > 1);

		this.push('segment_style.keep_with_coordinate', this.data.length == 1);

		var single = this.data.length == 1, self = this;

		if (this.get('coordinate.crosshair.enable')) {
			this.push('coordinate.crosshair.hcross', single);
			this.push('coordinate.crosshair.invokeOffset', function(e, m) {
				var r = self.lines[0].isEventValid(e);
					/**
					 * TODO how fire muti line?
					 */
					return r.valid ? r : false;
				});
		}
		
		/**
		 * quick config to all linesegment
		 */
		iChart.apply(this.get('segment_style'), iChart.clone(['shadow', 'shadow_blur', 'shadow_offsetx', 'shadow_offsety', 'gradient', 'color_factor','tip'], this.options));
		
	}

});// @end
