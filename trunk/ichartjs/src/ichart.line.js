/**
 * @overview this class is abstract,use for config line
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

		this.set({
			/**
			 * @cfg {Number} Specifies the default linewidth of the canvas's context in this element.(defaults to 1)
			 */
			brushsize : 1,
			/**
			 * @cfg {Object} the option for coordinate
			 */
			coordinate : {
				axis : {
					width : [0, 0, 2, 2]
				}
			},
			/**
			 * @cfg {Object} Specifies config crosshair.(default enable to false).For details see <link>iChart.CrossHair</link> Note:this has a extra property named 'enable',indicate whether crosshair available(default to false)
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
			labels : [],
			/**
			 * @inner {Number} the distance of column's bottom and text.(default to 6)
			 */
			label_space : 6,
			/**
			 * @inner {Boolean} if the point are proportional space.(default to true)
			 */
			proportional_spacing : true,
			/**
			 * @inner {Number} the space of each label
			 */
			label_spacing : 0,
			/**
			 * @cfg {<link>iChart.LineSegment</link>} the option for linesegment.
			 */
			sub_option : {},
			/**
			 * {Object} the option for legend.
			 */
			legend : {
				sign : 'round-bar',
				sign_size : 14
			},
			/**
			 * @cfg {<link>iChart.Text</link>} Specifies option of label at bottom.
			 */
			label:{}
		});

		this.registerEvent(
		/**
		 * @event Fires when parse this element'data.Return value will override existing.
		 * @paramter object#data the data of one linesegment
		 * @paramter object#v the point's value
		 * @paramter int#x coordinate-x of point
		 * @paramter int#y coordinate-y of point
		 * @paramter int#index the index of point
		 * @return Object object Detail:
		 * @property text the text of point
		 * @property x coordinate-x of point
		 * @property y coordinate-y of point
		 */
		'parsePoint');

	},
	/**
	 * @method Returns the coordinate of this element.
	 * @return iChart.Coordinate2D
	 */
	getCoordinate : function() {
		return this.coo;
	},
	doConfig : function() {
		iChart.Line.superclass.doConfig.call(this);
		var _ = this._(), s = _.data.length == 1;

		/**
		 * apply the coordinate feature
		 */
		iChart.Coordinate.coordinate.call(_);

		_.lines = [];
		_.lines.zIndex = _.get('z_index');
		_.components.push(_.lines);
		
		_.push('line_start', (_.get('coordinate.width') - _.get('coordinate.valid_width')) / 2);
		_.push('line_end', _.get('coordinate.width') - _.get('line_start'));

		if (_.get('proportional_spacing'))
			_.push('label_spacing', _.get('coordinate.valid_width') / (_.get('maxItemSize') - 1));

		_.push('sub_option.originx', _.get(_.X) + _.get('line_start'));
		/**
		 * y also has line_start and line end
		 */
		_.push('sub_option.originy', _.get(_.Y) + _.get('coordinate.height'));
		_.push('sub_option.width', _.get('coordinate.valid_width'));
		_.push('sub_option.height', _.get('coordinate.valid_height'));
		_.pushIf('sub_option.keep_with_coordinate',s);
		
		if (_.get('crosshair.enable')) {
			_.push('coordinate.crosshair', _.get('crosshair'));
			_.push('coordinate.crosshair.hcross', s);
			_.push('coordinate.crosshair.invokeOffset', function(e, m) {
				/**
				 * TODO how fire muti line?now fire by first line
				 */
				var r = _.lines[0].isEventValid(e,_.lines[0]);
				return r.valid ? r : false;
			});
		}
		
		_.pushIf('coordinate.scale',[{
			position : _.get('scaleAlign'),
			max_scale : _.get('maxValue')
		}, {
			position : _.get('labelAlign'),
			start_scale : 1,
			scale : 1,
			end_scale : _.get('maxItemSize'),
			labels : _.get('labels'),
			label:_.get('label')
		}]);
		
		
		/**
		 * use option create a coordinate
		 */
		_.coo = iChart.Coordinate.coordinate_.call(_);
		
		_.components.push(_.coo);
		
		/**
		 * quick config to all linesegment
		 */
		iChart.applyIf(_.get('sub_option'), iChart.clone(['area_opacity'], _.options));
	}

});
/**
 * @end
 */
