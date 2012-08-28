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
			coordinate : {
				axis:{
					width:[0,0,2,2]
			 	}
			},
			/**
			 * @cfg {Object} Specifies config crosshair.(default enable to false).For details see <link>iChart.CrossHair</link>
			 * Note:this has a extra property named 'enable',indicate whether crosshair available(default to false)
			 */
			crosshair : {
				enable : false
			},
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
			data_labels : [],
			/**
			 * @cfg {Number} the distance of column's bottom and text.(default to 6)
			 */
			label_space : 6,
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

		var _ = this,s=_.data.length == 1;
		
		_.push('line_start', (_.get('coordinate.width') - _.get('coordinate.valid_width')) / 2);
		_.push('line_end', _.get('coordinate.width') - _.get('line_start'));

		if (_.get('proportional_spacing'))
			_.push('label_spacing', _.get('coordinate.valid_width') / (_.get('maxItemSize') - 1));

		_.push('segment_style.originx', _.get('originx') + _.get('line_start'));

		/**
		 * y also has line_start and line end
		 */
		_.push('segment_style.originy', _.get('originy') + _.get('coordinate.height'));

		_.push('segment_style.width', _.get('coordinate.valid_width'));
		_.push('segment_style.height', _.get('coordinate.valid_height'));

		_.push('segment_style.limit_y', !s);

		_.push('segment_style.keep_with_coordinate', s);

		
		if(_.get('crosshair.enable')){
			_.push('coordinate.crosshair', _.get('crosshair'));
			_.push('coordinate.crosshair.hcross',s);
			_.push('coordinate.crosshair.invokeOffset', function(e, m) {
				var r = _.lines[0].isEventValid(e);
					/**
					 * TODO how fire muti line?
					 */
					return r.valid ? r : false;
				});
		}
		
		/**
		 * quick config to all linesegment
		 */
		iChart.applyIf(_.get('segment_style'), iChart.clone(['shadow', 'shadow_blur', 'shadow_offsetx', 'shadow_offsety', 'gradient', 'color_factor','tip'], _.options));
		
	}

});// @end
