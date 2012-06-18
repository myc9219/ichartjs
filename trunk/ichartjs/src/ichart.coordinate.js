/**
 * @overview this is inner use for axis
 * @component#iChart.Scale
 * @extend#iChart.Component
 */
iChart.Scale = iChart.extend(iChart.Component, {
	configure : function() {

		/**
		 * invoked the super class's configuration
		 */
		iChart.Scale.superclass.configure.apply(this, arguments);

		/**
		 * indicate the component's type
		 */
		this.type = 'scale';

		this.set({
			/**
			 * @cfg {String} the axis's type(default to 'h') Available value are:
			 * @Option 'h' :horizontal
			 * @Option 'v' :vertical
			 */
			which : 'h',
			/**
			 * @inner {Number}
			 */
			distance : undefined,
			/**
			 * @cfg {Number} Specifies the start coordinate scale value.(default to 0)
			 */
			start_scale : 0,
			/**
			 * @cfg {Number} Specifies the end coordinate scale value.Note either this or property of max_scale must be has the given value.(default to undefined)
			 */
			end_scale : undefined,
			/**
			 * @inner {Number} Specifies the chart's minimal value
			 */
			min_scale : undefined,
			/**
			 * @inner {Number} Specifies the chart's maximal value
			 */
			max_scale : undefined,
			/**
			 * @cfg {Number} Specifies the space of two scale.Note either this or property of scale_share must be has the given value.(default to undefined)
			 */
			scale_space : undefined,
			/**
			 * @cfg {Number} Specifies the number of scale on axis.(default to 5)
			 */
			scale_share : 5,
			/**
			 * @cfg {Boolean} True to display the scale line.(default to true)
			 */
			scale_enable : true,
			/**
			 * @cfg {Number} Specifies the size of brush(context.linewidth).(default to 1)
			 */
			scale_size : 1,
			/**
			 * @cfg {Number} Specifies the width(length) of scale.(default to 4)
			 */
			scale_width : 4,
			/**
			 * @cfg {String} Specifies the color of scale.(default to 4)
			 */
			scale_color : '#333333',
			/**
			 * @cfg {String} Specifies the align against axis.(default to 'center') When the property of which set to 'h',Available value are:
			 * @Option 'left'
			 * @Option 'center'
			 * @Option 'right' When the property of which set to 'v', Available value are:
			 * @Option 'top'
			 * @Option 'center'
			 * @Option 'bottom'
			 */
			scaleAlign : 'center',
			/**
			 * @cfg {Array} the customize labels
			 */
			labels : [],
			/**
			 * @cfg {Boolean} True to Indicate the grid is accord with scale
			 */
			scale2grid : true,
			/**
			 * @cfg {Number} Specifies the lineheight when text display multiline.(default to 16)
			 */
			text_height : 16,
			/**
			 * @cfg {Number} Specifies the distance to scale.(default to 4)
			 */
			text_space : 4,
			/**
			 * @cfg {String} Specifies the align against axis.(default to 'left' or 'bottom' in v mode) When the property of which set to 'h',Available value are:
			 * @Option 'left'
			 * @Option 'right' When the property of which set to 'v', Available value are:
			 * @Option 'top'
			 * @Option 'bottom'
			 */
			textAlign : 'left',
			/**
			 * @cfg {Number} Specifies the number of decimal.(default to 1)
			 */
			decimalsnum : 0,
			/**
			 * @inner {String} the style of overlapping(default to 'none') Available value are:
			 * @Option 'square'
			 * @Option 'round'
			 * @Option 'none'
			 */
			join_style : 'none',
			/**
			 * @inner {Number}
			 */
			join_size : 2
		});

		this.registerEvent(
		/**
		 * @event Fires the event when parse text、you can return a object like this:{text:'',textX:100,textY:100} to override the given.
		 * @paramter string#text item's text
		 * @paramter int#textX coordinate-x of item's text
		 * @paramter int#textY coordinate-y of item's text
		 * @paramter int#index item's index
		 */
		'parseText');

		this.items = [];
		this.number = 0;

	},
	isEventValid : function(e) {
		return {
			valid : false
		};
	},
	/**
	 * 按照从左自右,从上至下原则
	 */
	doDraw : function() {
		var x = y = x0 = y0 = tx = ty = 0, w = this.get('scale_width'), w2 = w / 2, sa = this.get('scaleAlign'), ta = this.get('textAlign'), ts = this.get('text_space');
		if (this.isH) {
			if (sa == 'top') {
				y = -w;
			} else if (sa == 'center') {
				y = -w2;
				y0 = w2;
			} else {
				y0 = w;
			}
			this.T.textAlign('center');
			if (ta == 'top') {
				ty = -ts;
				this.T.textBaseline('bottom');
			} else {
				ty = ts;
				this.T.textBaseline('top');
			}
		} else {
			if (sa == 'left') {
				x = -w;
			} else if (sa == 'center') {
				x = -w2;
				x0 = w2;
			} else {
				x0 = w;
			}
			this.T.textBaseline('middle');
			if (ta == 'right') {
				this.T.textAlign('left');
				tx = ts;
			} else {
				this.T.textAlign('right');
				tx = -ts;
			}
		}
		/**
		 * 将上述的配置部分转移到config中?
		 */

		/**
		 * individuation text?
		 */
		this.T.textFont(this.get('fontStyle'));

		for ( var i = 0; i < this.items.length; i++) {
			if (this.get('scale_enable'))
				this.T.line(this.items[i].x + x, this.items[i].y + y, this.items[i].x + x0, this.items[i].y + y0, this.get('scale_size'), this.get('scale_color'), false);

			this.T.fillText(this.items[i].text, this.items[i].textX + tx, this.items[i].textY + ty, false, this.get('color'), 'lr', this.get('text_height'));
		}
	},
	doConfig : function() {
		iChart.Scale.superclass.doConfig.call(this);
		iChart.Assert.isNumber(this.get('distance'), 'distance');

		var customLabel = this.get('labels').length, min_scale = this.get('min_scale'), max_scale = this.get('max_scale'), scale_space = this.get('scale_space'), end_scale = this.get('end_scale'), start_scale = this.get('start_scale');

		if (customLabel > 0) {
			this.number = customLabel - 1;
		} else {
			iChart.Assert.isTrue(iChart.isNumber(max_scale) || iChart.isNumber(end_scale), 'max_scale&end_scale');

			/**
			 * end_scale must greater than maxScale
			 */
			if (!end_scale || end_scale < max_scale) {
				end_scale = this.push('end_scale', iChart.ceil(max_scale));
			}
			/**
			 * startScale must less than minScale
			 */
			if (start_scale > min_scale) {
				this.push('start_scale', iChart.floor(min_scale));
			}

			if (scale_space && scale_space < end_scale - start_scale) {
				this.push('scale_share', (end_scale - start_scale) / scale_space);
			}

			/**
			 * value of each scale
			 */
			if (!scale_space || scale_space > end_scale - start_scale) {
				scale_space = this.push('scale', (end_scale - start_scale) / this.get('scale_share'));
			}

			this.number = this.get('scale_share');
		}

		/**
		 * the real distance of each scale
		 */
		this.push('distanceOne', this.get('valid_distance') / this.number);

		var text, maxwidth = 0, x, y;

		this.T.textFont(this.get('fontStyle'));
		this.push('which', this.get('which').toLowerCase());
		this.isH = this.get('which') == 'h';

		/**
		 * 有效宽度仅对水平刻度有效、有效高度仅对垂直高度有效
		 */
		for ( var i = 0; i <= this.number; i++) {
			text = customLabel ? this.get('labels')[i] : (scale_space * i + start_scale).toFixed(this.get('decimalsnum'));
			x = this.isH ? this.get('valid_x') + i * this.get('distanceOne') : this.x;
			y = this.isH ? this.y : this.get('valid_y') + this.get('distance') - i * this.get('distanceOne');
			this.items.push(iChart.merge({
				text : text,
				x : x,
				y : y,
				textX : x,
				textY : y
			}, this.fireEvent(this, 'parseText', [text, x, y, i])));
			maxwidth = Math.max(maxwidth, this.T.measureText(text));
		}

		/**
		 * what does follow code doing?
		 */
		this.left = this.right = this.top = this.bottom = 0, ts = this.get('text_space');
		ta = this.get('textAlign');
		sa = this.get('scaleAlign'), w = this.get('scale_width'), w2 = w / 2;

		if (this.isH) {
			if (sa == 'top') {
				this.top = w;
			} else if (sa == 'center') {
				this.top = w2;
			} else {
				this.top = 0;
			}
			this.bottom = w - this.top;
			if (ta == 'top') {
				this.top += this.get('text_height') + ts;
			} else {
				this.bottom += this.get('text_height') + ts;
			}
		} else {
			if (sa == 'left') {
				this.left = w;
			} else if (sa == 'center') {
				this.left = w2;
			} else {
				this.left = 0;
			}
			this.right = w - this.left;
			if (ta == 'left') {
				this.left += maxwidth + ts;
			} else {
				this.right += maxwidth + ts;
			}
		}
	}
});// @end

/**
 * @overview this component use for abc
 * @component#iChart.Coordinate2D
 * @extend#iChart.Component
 */
iChart.Coordinate2D = iChart.extend(iChart.Component,
		{
			configure : function() {
				/**
				 * invoked the super class's configurationuration
				 */
				iChart.Coordinate2D.superclass.configure.apply(this, arguments);

				/**
				 * indicate the component's type
				 */
				this.type = 'coordinate2d';

				this.set({
					/**
					 * @inner {Number}
					 */
					sign_size : 12,
					/**
					 * @inner {Number}
					 */
					sign_space : 5,
					/**
					 * @cfg {Array} the option for scale
					 */
					scale : [],
					/**
					 * @cfg {Number} Specifies the valid width,less than the width of coordinate.(default same as width)
					 */
					valid_width : undefined,
					/**
					 * @cfg {Number} Specifies the valid height,less than the height of coordinate.(default same as height)
					 */
					valid_height : undefined,
					/**
					 * @cfg {Number} Specifies the linewidth of the grid.(default to 1)
					 */
					grid_line_width : 1,
					/**
					 * @cfg {Number} Specifies the color of the grid.(default to '#dbe1e1')
					 */
					grid_color : '#dbe1e1',
					/**
					 * @cfg {Boolean} True to display grid line.(default to true)
					 */
					gridlinesVisible : true,
					/**
					 * @cfg {Boolean} indicate whether the grid is accord with scale,on the premise of grids is not specify. this just give a convenient way bulid grid for default.and actual value depend on scale's scale2grid
					 */
					scale2grid : true,
					/**
					 * @cfg {Object} this is grid config for custom.the detailed like this: way:the manner calculate grid-line (default to 'share_alike') * Available property are:
					 * @Option share_alike
					 * @Option given_value value: way-share_alike:the number of way-share.given_value:the distance each grid line(unit:pixel) { horizontal: { way:'share_alike', value:10 } vertical: { way:'given_value', value:40 } }
					 */
					grids : undefined,
					/**
					 * @cfg {Boolean} If True the grid line will be ignored when gird and axis overlap.(default to true)
					 */
					ignoreOverlap : true,
					/**
					 * @cfg {Boolean} If True the grid line will be ignored when gird and coordinate's edge overlap.(default to false)
					 */
					ignoreEdge : false,
					/**
					 * @cfg {String} Specifies the label on x-axis
					 */
					xlabel : '',
					/**
					 * @cfg {String} Specifies the label on y-axis
					 */
					ylabel : '',
					/**
					 * @cfg {Boolean} If True the grid background-color will be alternate.(default to true)
					 */
					alternate_color : true,
					/**
					 * @cfg {Object} Specifies config crosshair.(default enable to false).For details see <link>iChart.iChart.CrossHair</link>
					 * Note:this has a extra property named 'enable',indicate whether crosshair available(default to false)
					 */
					crosshair : {
						enable : false
					},
					/**
					 * @cfg {Number} Required,Specifies the width of this coordinate.(default to undefined)
					 */
					width : undefined,
					/**
					 * @cfg {Number} Required,Specifies the height of this coordinate.(default to undefined)
					 */
					height : undefined,
					/**
					 * @cfg {Object} Specifies style for axis of this coordinate. Available property are:
					 * @Option enable {Boolean} True to display the axis.(default to true)
					 * @Option color {String} Specifies the color of each axis.(default to '#666666')
					 * @Option width {Number/Array} Specifies the width of each axis, If given the a array,there must be have have 4 element, like this:[1,0,0,1](top-right-bottom-left).(default to 1)
					 */
					axis : {
						enable : true,
						color : '#666666',
						width : 1
					}
				});

				this.registerEvent();

				this.scale = [];
				this.gridlines = [];
			},
			getScale : function(p) {
				for ( var i = 0; i < this.scale.length; i++) {
					var k = this.scale[i];
					if (k.get('position') == p) {
						return {
							start : k.get('start_scale'),
							end : k.get('end_scale'),
							distance : k.get('end_scale') - k.get('start_scale')
						};
					}
				}
				return {
					start : 0,
					end : 0,
					distance : 0
				};
			},
			isEventValid : function(e) {
				return {
					valid : e.offsetX > this.x && e.offsetX < (this.x + this.get('width')) && e.offsetY < this.y + this.get('height') && e.offsetY > this.y
				};
			},
			doDraw : function(opts) {

				this.T.rectangle(this.x, this.y, this.get('width'), this.get('height'), this.get('fill_color'), this.get('axis.enable'), this.get('axis.width'), this.get('axis.color'), this.get('shadow'), this.get('shadow_color'), this.get('shadow_blur'), this
						.get('shadow_offsetx'), this.get('shadow_offsety'));

				if (this.get('alternate_color')) {
					var x, y, f = false, axis = [0, 0, 0, 0], c = iChart.dark(this.get('background_color'), 0.04);
					if (this.get('axis.enable')) {
						axis = this.get('axis.width');
					}
				}
				var gl = this.gridlines;
				for ( var i = 0; i < gl.length; i++) {
					gl[i].x1 = Math.round(gl[i].x1);
					gl[i].y1 = Math.round(gl[i].y1);
					gl[i].x2 = Math.round(gl[i].x2);
					gl[i].y2 = Math.round(gl[i].y2);
					if (this.get('alternate_color')) {
						// vertical
						if (gl[i].x1 == gl[i].x2) {
							// next to do
						}
						// horizontal
						if (gl[i].y1 == gl[i].y2) {
							if (f) {
								this.T.rectangle(gl[i].x1 + axis[3], gl[i].y1 + this.get('grid_line_width'), gl[i].x2 - gl[i].x1 - axis[3] - axis[1], y - gl[i].y1 - this.get('grid_line_width'), c);
							}
							x = gl[i].x1;
							y = gl[i].y1;
							f = !f;
						}
					}
					this.T.line(gl[i].x1, gl[i].y1, gl[i].x2, gl[i].y2, this.get('grid_line_width'), this.get('grid_color'));
				}
				for ( var i = 0; i < this.scale.length; i++) {
					this.scale[i].draw();
				}
			},
			doConfig : function() {
				iChart.Coordinate2D.superclass.doConfig.call(this);
				iChart.Assert.isNumber(this.get('width'), 'width');
				iChart.Assert.isNumber(this.get('height'), 'height');
				
				/**
				 * this element not atomic because it is a container,so this is a particular case.
				 */
				this.atomic = false;

				if (!this.get('valid_width') || this.get('valid_width') > this.get('width')) {
					this.push('valid_width', this.get('width'));
				}
				if (!this.get('valid_height') || this.get('valid_height') > this.get('height')) {
					this.push('valid_height', this.get('height'));
				}

				/**
				 * apply the gradient color to fill_color
				 */
				if (this.get('gradient') && iChart.isString(this.get('background_color'))) {
					this.push('fill_color', this.T.avgLinearGradient(this.x, this.y, this.x, this.y + this.get('height'), [this.get('dark_color'), this.get('light_color')]));
				}

				if (this.get('axis.enable')) {
					var aw = this.get('axis.width');
					if (!iChart.isArray(aw))
						this.push('axis.width', [aw, aw, aw, aw]);
				}

				if (this.get('crosshair.enable')) {
					this.push('crosshair.wrap', this.container.shell);
					this.push('crosshair.height', this.get('height'));
					this.push('crosshair.width', this.get('width'));
					this.push('crosshair.top', this.y);
					this.push('crosshair.left', this.x);

					this.crosshair = new iChart.CrossHair(this.get('crosshair'), this);
				}

				var kd, jp, cg = !!(this.get('gridlinesVisible') && this.get('grids')), // custom grid
				hg = cg && !!this.get('grids.horizontal'), vg = cg && !!this.get('grids.vertical'), h = this.get('height'), w = this.get('width'), vw = this.get('valid_width'), vh = this.get('valid_height'), k2g = this.get('gridlinesVisible') && this.get('scale2grid')
						&& !(hg && vg), sw = (w - vw) / 2;
				sh = (h - vh) / 2, axis = this.get('axis.width');

				if (!iChart.isArray(this.get('scale'))) {
					if (iChart.isObject(this.get('scale')))
						this.push('scale', [this.get('scale')]);
					else
						this.push('scale', []);
				}

				for ( var i = 0; i < this.get('scale').length; i++) {
					kd = this.get('scale')[i];
					jp = kd['position'];
					jp = jp || 'left';
					jp = jp.toLowerCase();
					kd['originx'] = this.x;
					kd['originy'] = this.y;
					kd['valid_x'] = this.x + sw;
					kd['valid_y'] = this.y + sh;
					kd['position'] = jp;
					// calculate coordinate,direction,distance
					if (jp == 'top') {
						kd['which'] = 'h';
						kd['distance'] = w;
						kd['valid_distance'] = vw;
					} else if (jp == 'right') {
						kd['which'] = 'v';
						kd['distance'] = h;
						kd['valid_distance'] = vh;
						kd['originx'] += w;
						kd['valid_x'] += vw;
					} else if (jp == 'bottom') {
						kd['which'] = 'h';
						kd['distance'] = w;
						kd['valid_distance'] = vw;
						kd['originy'] += h;
						kd['valid_y'] += vh;
					} else {
						kd['which'] = 'v';
						kd['distance'] = h;
						kd['valid_distance'] = vh;
					}
					this.scale.push(new iChart.Scale(kd, this.container));
				}

				var iol = this.push('ignoreOverlap', this.get('ignoreOverlap') && this.get('axis.enable') || this.get('ignoreEdge'));

				if (iol) {
					if (this.get('ignoreEdge')) {
						var ignoreOverlap = function(w, x, y) {
							return w == 'v' ? (y == this.y) || (y == this.y + h) : (x == this.x) || (x == this.x + w);
						}
					} else {
						var ignoreOverlap = function(wh, x, y) {
							return wh == 'v' ? (y == this.y && axis[0] > 0) || (y == (this.y + h) && axis[2] > 0) : (x == this.x && axis[3] > 0) || (x == (this.x + w) && axis[1] > 0);
						}
					}
				}

				if (k2g) {
					var scale, x, y;
					for ( var i = 0; i < this.scale.length; i++) {
						scale = this.scale[i];
						// disable,given specfiy grid will ignore scale2grid
						if (iChart.isFalse(scale.get('scale2grid')) || hg && scale.get('which') == 'v' || vg && scale.get('which') == 'h') {
							continue;
						}
						x = y = 0;
						if (scale.get('position') == 'top') {
							y = h;
						} else if (scale.get('position') == 'right') {
							x = -w;
						} else if (scale.get('position') == 'bottom') {
							y = -h;
						} else {
							x = w;
						}
						for ( var j = 0; j < scale.items.length; j++) {
							if (iol)
								if (ignoreOverlap.call(this, scale.get('which'), scale.items[j].x, scale.items[j].y))
									continue;
							this.gridlines.push({
								x1 : scale.items[j].x,
								y1 : scale.items[j].y,
								x2 : scale.items[j].x + x,
								y2 : scale.items[j].y + y
							});
						}
					}
				}
				if (vg) {
					var gv = this.get('grids.vertical');
					iChart.Assert.gtZero(gv['value'], 'value');
					var d = w / gv['value'], n = gv['value'];
					if (gv['way'] == 'given_value') {
						n = d;
						d = gv['value'];
						d = d > w ? w : d;
					}

					for ( var i = 0; i <= n; i++) {
						if (iol)
							if (ignoreOverlap.call(this, 'h', this.x + i * d, this.y))
								continue;
						this.gridlines.push({
							x1 : this.x + i * d,
							y1 : this.y,
							x2 : this.x + i * d,
							y2 : this.y + h
						});
					}
				}
				if (hg) {
					var gh = this.get('grids.horizontal');
					iChart.Assert.gtZero(gh['value'], 'value');
					var d = h / gh['value'], n = gh['value'];
					if (gh['way'] == 'given_value') {
						n = d;
						d = gh['value'];
						d = d > h ? h : d;
					}

					for ( var i = 0; i <= n; i++) {
						if (iol)
							if (ignoreOverlap.call(this, 'v', this.x, this.y + i * d))
								continue;
						this.gridlines.push({
							x1 : this.x,
							y1 : this.y + i * d,
							x2 : this.x + w,
							y2 : this.y + i * d
						});
					}
				}

			}
		});// @end
/**
 * @overview this component use for abc
 * @component#iChart.Coordinate3D
 * @extend#iChart.Coordinate2D
 */
iChart.Coordinate3D = iChart.extend(iChart.Coordinate2D, {
	configure : function() {
		/**
		 * invoked the super class's configurationuration
		 */
		iChart.Coordinate3D.superclass.configure.apply(this, arguments);

		/**
		 * indicate the component's type
		 */
		this.type = 'coordinate3d';
		this.dimension = iChart._3D;

		this.set({
			/**
			 * @cfg {Number} Three-dimensional rotation X in degree(angle).socpe{0-90},Normally, this will accord with the chart.(default to 60)
			 */
			xAngle : 60,
			/**
			 * @cfg {Number} Three-dimensional rotation Y in degree(angle).socpe{0-90},Normally, this will accord with the chart.(default to 20)
			 */
			yAngle : 20,
			xAngle_ : undefined,
			yAngle_ : undefined,
			/**
			 * @cfg {Number} Required,Specifies the z-axis deep of this coordinate,Normally, this will given by chart.(default to 0)
			 */
			zHeight : 0,
			/**
			 * @cfg {Number} Specifies pedestal height of this coordinate.(default to 22)
			 */
			pedestal_height : 22,
			/**
			 * @cfg {Number} Specifies board deep of this coordinate.(default to 20)
			 */
			board_deep : 20,
			/**
			 * @cfg {Boolean} Override the default as true
			 */
			gradient : true,
			/**
			 * @cfg {float} Override the default as 0.18.
			 */
			color_factor : 0.18,
			/**
			 * @cfg {Boolean} Override the default as true.
			 */
			ignoreEdge : true,
			/**
			 * @cfg {Boolean} Override the default as false.
			 */
			alternate_color : false,
			/**
			 * @cfg {String} Override the default as '#7a8d44'.
			 */
			grid_color : '#7a8d44',
			/**
			 * @cfg {String} Override the default as '#d6dbd2'.
			 */
			background_color : '#d6dbd2',
			/**
			 * @cfg {Number} Override the default as 4.
			 */
			shadow_offsetx : 4,
			/**
			 * @cfg {Number} Override the default as 2.
			 */
			shadow_offsety : 2,
			/**
			 * @cfg {Array} Specifies the style of board(wall) of this coordinate. the array length must be 3 and each object option has two property. Available property are:
			 * @Option color the color of wall
			 * @Option alpha the opacity of wall
			 */
			wall_style : [],
			/**
			 * @cfg {Boolean} Override the default as axis.enable = false.
			 */
			axis : {
				enable : false
			}
		});
	},
	doDraw : function(opts) {
		var w = this.get('width'), h = this.get('height'), xa = this.get('xAngle_'), ya = this.get('yAngle_'), zh = this.get('zHeight'), offx = xa * zh, offy = ya * zh, gl = this.gridlines;

		/**
		 * bottom
		 */
		this.T.cube3D(this.x, this.y + h + this.get('pedestal_height'), xa, ya, false, w, this.get('pedestal_height'), zh * 3 / 2, this.get('axis.enable'), this.get('axis.width'), this.get('axis.color'), this.get('bottom_style'));
		/**
		 * board_style
		 */
		this.T.cube3D(this.x + this.get('board_deep') * xa, this.y + h - this.get('board_deep') * ya, xa, ya, false, w, h, zh, this.get('axis.enable'), this.get('axis.width'), this.get('axis.color'), this.get('board_style'));

		this.T.cube3D(this.x, this.y + h, xa, ya, false, w, h, zh, this.get('axis.enable'), this.get('axis.width'), this.get('axis.color'), this.get('wall_style'));

		for ( var i = 0; i < gl.length; i++) {
			this.T.line(gl[i].x1, gl[i].y1, gl[i].x1 + offx, gl[i].y1 - offy, this.get('grid_line_width'), this.get('grid_color'));
			this.T.line(gl[i].x1 + offx, gl[i].y1 - offy, gl[i].x2 + offx, gl[i].y2 - offy, this.get('grid_line_width'), this.get('grid_color'));
		}

		for ( var i = 0; i < this.scale.length; i++) {
			this.scale[i].draw();
		}
	},
	doConfig : function() {
		iChart.Coordinate3D.superclass.doConfig.call(this);

		var bg = this.get('background_color'), dark_color = iChart.dark(bg, 0.1), h = this.get('height'), w = this.get('width');

		if (this.get('wall_style').length < 3) {
			this.push('wall_style', [{
				color : dark_color
			}, {
				color : bg
			}, {
				color : dark_color
			}]);
		}

		var dark = this.get('wall_style')[0].color;

		/**
		 * 右-前
		 */
		this.push('bottom_style', [{
			color : bg,
			shadow : this.get('shadow'),
			shadowColor : this.get('shadow_color'),
			blur : this.get('shadow_blur'),
			sx : this.get('shadow_offsetx'),
			sy : this.get('shadow_offsety')
		}, false, false, {
			color : dark
		}, {
			color : dark
		}, {
			color : dark
		}]);

		/**
		 * 上-右
		 */
		this.push('board_style', [false, false, false, {
			color : dark
		}, {
			color : bg
		}, false]);
		/**
		 * 下底-底-左-右-上-前
		 */
		if (this.get('gradient')) {
			var offx = this.get('xAngle_') * this.get('zHeight'), offy = this.get('yAngle_') * this.get('zHeight'), ws = this.get('wall_style'), bs = this.get('bottom_style');

			if (iChart.isString(ws[0].color)) {
				ws[0].color = this.T.avgLinearGradient(this.x, this.y + h, this.x + w, this.y + h, [dark, this.get('dark_color')]);
			}
			if (iChart.isString(ws[1].color)) {
				ws[1].color = this.T.avgLinearGradient(this.x + offx, this.y - offy, this.x + offx, this.y + h - offy, [this.get('dark_color'), this.get('light_color')]);
			}
			if (iChart.isString(ws[2].color)) {
				ws[2].color = this.T.avgLinearGradient(this.x, this.y, this.x, this.y + h, [bg, this.get('dark_color')]);
			}
			bs[5].color = this.T.avgLinearGradient(this.x, this.y + h, this.x, this.y + h + this.get('pedestal_height'), [bg, dark_color]);
		}

	}
});// @end
