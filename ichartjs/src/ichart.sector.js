/**
 * @overview this component use for abc
 * @component#iChart.Sector
 * @extend#iChart.Component
 */
iChart.Sector = iChart.extend(iChart.Component, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Sector.superclass.configure.apply(this, arguments);

		/**
		 * indicate the component's type
		 */
		this.type = 'sector';

		this.set({
			/**
			 * @cfg {String} Specifies the value of this element,Normally,this will given by chart.(default to '')
			 */
			value:'',
			/**
			 * @cfg {String} Specifies the name of this element,Normally,this will given by chart.(default to '')
			 */
			name:'',
			/**
			 * @cfg {Boolean} True will not darw.(default to false)
			 */
			ignored: false,
			/**
			 * @inner {Boolean} True to make sector counterclockwise.(default to false)
			 */
			counterclockwise : false,
			/**
			 * @cfg {Number} Specifies the start angle of this sector.Normally,this will given by chart.(default to 0)
			 */
			startAngle : 0,
			/**
			 * @cfg {Number} middleAngle = (endAngle - startAngle)/2.Normally,this will given by chart.(default to 0)
			 */
			middleAngle : 0,
			/**
			 * @cfg {Number} Specifies the end angle of this sector.Normally,this will given by chart.(default to 0)
			 */
			endAngle : 0,
			/**
			 * @cfg {Number} Specifies total angle of this sector,totalAngle = (endAngle - startAngle).Normally,this will given by chart.(default to 0)
			 */
			totalAngle : 0,
			/**
			 * @inner {String} the event's name trigger pie bound(default to 'click').
			 */
			bound_event : 'click',
			/**
			 * @cfg {Boolean} True to bound this sector.(default to false)
			 */
			expand : false,
			/**
			 * @cfg {Number} Specifies the width when show a donut.only applies when it not 0.(default to 0)
			 */
			donutwidth : 0,
			/**
			 * @inner {Boolean} If true means just one piece could bound at same time.(default to false)
			 */
			mutex : false,
			/**
			 * @inner {Number} Specifies the offset when bounded.Normally,this will given by chart.(default to undefined)
			 */
			increment : undefined,
			/**
			 * @cfg {String} Specifies the gradient mode of background.(defaults to 'RadialGradientOutIn')
			 * @Option 'RadialGradientOutIn'
			 * @Option 'RadialGradientInOut'
			 */
			gradient_mode:'RadialGradientOutIn',
			/**
			 * @cfg {Number} Specifies the threshold value in angle that applies mini_label.(default to 15)
			 */
			mini_label_threshold_angle:15,
			/**
			 * @cfg {<link>iChart.Text</link>} Specifies the config of label.when mini_label is a object,there will as a <link>iChart.Text</link>.(default to false)
			 * note:set false to make minilabel disabled.
			 */
			mini_label:false,
			/**
			 * @cfg {<link>iChart.Label</link>} Specifies the config of label.when mini_label is unavailable,there will as a <link>iChart.Label</link>.
			 * note:set false to make label disabled.
			 */
			label : {}
		});

		/**
		 * this element support boxMode
		 */
		this.atomic = true;

		this.registerEvent('changed',
				/**
				 * @event Fires when parse this label's data.Return value will override existing. Only valid when label is available
				 * @paramter iChart.Sector#sector the sector object
				 */
				'parseText');

		this.label = null;
		this.tip = null;
	},
	bound : function() {
		if (!this.expanded)
			this.toggle();
	},
	rebound : function() {
		if (this.expanded)
			this.toggle();
	},
	toggle : function() {
		this.fireEvent(this, this.get('bound_event'), [this]);
	},
	/**
	 * @method get the sector's dimension,return hold following property
	 * @property x:the x-coordinate of the center of the sector
	 * @property y:the y-coordinate of the center of the sector
	 * @property startAngle:The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
	 * @property endAngle:the ending angle, in radians
	 * @property middleAngle:the middle angle, in radians
	 * @return object
	 */
	getDimension:function(){
		return {
			x:this.x,
			x:this.y,
			startAngle:this.get("startAngle"),
			middleAngle:this.get("middleAngle"),
			endAngle:this.get("endAngle")
		}
	},
	doDraw : function(opts) {
		if(!this.get('ignored')){
			this.drawSector();
			if(this.label) {
				this.label.draw();
			}
		}
	},
	doText:function(_,x,y){
		_.push('label.originx',x);
		_.push('label.originy',y);
		_.push('label.textBaseline','middle');
		_.label = new iChart.Text(_.get('label'),_);
	},
	doLabel:function(_,x,y,Q,p,x0,y0){
		_.push('label.originx',x);
		_.push('label.originy',y);
		_.push('label.quadrantd',Q);
		_.push('label.line_potins',p);
		_.push('label.labelx',x0);
		_.push('label.labely',y0);
		_.label = new iChart.Label(_.get('label'),_);
	},
	isLabel:function(){
		return this.get('label')&&!this.get('mini_label');
	},
	doConfig : function() {
		iChart.Sector.superclass.doConfig.call(this);

		var _ = this._(),v = _.variable.event,f = _.get('label');

		_.push('totalAngle', _.get('endAngle') - _.get('startAngle'));
		
		if(f){
			if(_.get('mini_label')){
				if((_.get('mini_label_threshold_angle')*Math.PI/180)>_.get('totalAngle')){
					_.push('mini_label',false);
				}else{
					_.push('label',_.get('mini_label'));
				}
			}
			_.push('label.text', _.fireString(_, 'parseText', [_],_.get('label.text')));
			
			_.pushIf('label.border.color',_.get('border.color'));
			/**
			 * make the label's color in accord with sector
			 */
			_.push('label.scolor', _.get('background_color'));
		}
		
		_.variable.event.status = _.expanded = _.get('expand');

		if (_.get('tip.enable')) {
			if (_.get('tip.showType') != 'follow') {
				_.push('tip.invokeOffsetDynamic', false);
			}
			_.tip = new iChart.Tip(_.get('tip'), _);
		}

		v.poped = false;

		_.on(_.get('bound_event'), function() {
			// console.profile('Test for pop');
				//console.time('Test for pop');
				v.poped = true;
				_.expanded = !_.expanded;
				_.redraw();
				v.poped = false;
				 //console.timeEnd('Test for pop');
				// console.profileEnd('Test for pop');
			});
		
		_.on('mouseover',function(){
			v.highlight = true;
			_.redraw();
			v.highlight = false;
		}).on('mouseout',function(){
			v.highlight = false;
			_.redraw();
		});
		
		_.on('beforedraw', function() {
			_.push('f_color',v.highlight?_.get('light_color'):_.get('f_color_'));
			_.x = _.get('originx');
			_.y = _.get('originy');
			if (v.status != _.expanded) {
				_.fireEvent(_, 'changed', [_, _.expanded]);
				if(f)
				_.label.doLayout(_.get('inc_x')*(_.expanded?1:-1),-_.get('inc_y')*(_.expanded?1:-1));
			}
			v.status = _.expanded;
			if (_.expanded) {
				if (_.get('mutex') && !v.poped) {
					_.expanded = false;
				} else {
					_.x += _.get('inc_x');
					_.y -= _.get('inc_y');
				}
			}
			return true;
		});

	}
});// @end
