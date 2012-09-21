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
			 * @cfg {String} the event's name trigger pie bound(default to 'click').
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
			 * @cfg {Boolean} If true means just one piece could bound at same time.(default to false)
			 */
			mutex : false,
			/**
			 * @cfg {Number} Specifies the offset when bounded.Normally,this will given by chart.(default to undefined)
			 */
			increment : undefined,
			/**
			 * @cfg {String} Specifies the gradient mode of background.(defaults to 'RadialGradientOutIn')
			 * @Option 'RadialGradientOutIn'
			 * @Option 'RadialGradientInOut'
			 */
			gradient_mode:'RadialGradientOutIn',
			/**
			 * @cfg {Object} Specifies the config of label.For details see <link>iChart.Label</link>
			 * Note:this has a extra property named 'enable',indicate whether label available(default to true)
			 */
			label : {
				enable : true
			}
		});

		/**
		 * this element support boxMode
		 */
		this.atomic = true;

		this.registerEvent('changed');

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
	doDraw : function(opts) {
		this.drawSector();
		if (this.label) {
			/**
			 * draw the labels
			 */
			this.label.draw();
		}
	},
	labelInvoke:function(f){
		var A = this.get('middleAngle'),l=this.label;
		x = this.get('inc_x')*f,
		y = -this.get('inc_y')*f;
		
		l.push('originx',l.get('originx')+x);
		l.push('originy',l.get('originy')+y);
		l.push('labelx',l.get('labelx')+x);
		l.push('labely',l.get('labely')+y);
		var p =[];
		l.get('line_potins').each(function(v, i){
			p.push(i%2==0?(v+x):(v+y));
		},l);
		l.push('line_potins',p);
	},
	doConfig : function() {
		iChart.Sector.superclass.doConfig.call(this);

		var _ = this._(),v = _.variable.event;

		_.push('totalAngle', _.get('endAngle') - _.get('startAngle'));


		if(_.get('label.enable')){
			_.pushIf('label.border.color',_.get('border.color'));
			/**
			 * make the label's color in accord with sector
			 */
			_.push('label.scolor', _.get('f_color'));
		}
		_.variable.event.status = _.expanded = _.get('expand');

		if (_.get('tip.enable')) {
			if (_.get('tip.showType') != 'follow') {
				_.push('tip.invokeOffsetDynamic', false);
			}
			_.tip = new iChart.Tip(_.get('tip'), _);
		}

		v.poped = false;

		_.on(_.get('bound_event'), function(_, e, r) {
			// console.profile('Test for pop');
				 //console.time('Test for pop');
				v.poped = true;
				_.expanded = !_.expanded;
				_.redraw();
				v.poped = false;
				 //console.timeEnd('Test for pop');
				// console.profileEnd('Test for pop');
			});
		
		_.on('mouseover',function(e){
			v.highlight = true;
			_.redraw();
			v.highlight = false;
		}).on('mouseout',function(e){
			v.highlight = false;
			_.redraw();
		});
		
		_.on('beforedraw', function() {
			_.push('f_color',v.highlight?_.get('light_color'):_.get('background_color'));
			_.x = _.get('originx');
			_.y = _.get('originy');
			if (v.status != _.expanded) {
				_.fireEvent(_, 'changed', [_, _.expanded]);
				if(_.get('label.enable'))
				_.labelInvoke((_.expanded?1:-1));
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
