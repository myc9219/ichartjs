/**
 * @overview this component use for abc
 * @component#iChart.Pie
 * @extend#iChart.Chart
 */
iChart.Pie = iChart.extend(iChart.Chart, {
	/**
	 * initialize the context for the pie
	 */
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Pie.superclass.configure.call(this);

		this.type = 'pie';

		this.set({
			/**
			 * @cfg {Float (0~)} the pie's radius
			 */
			radius : 0,
			/**
			 * @cfg {Number} initial angle for first sector
			 */
			offsetAngle : 0,
			/**
			 * @cfg {Boolean} Specify as true to display with percent.(default to true)
			 */
			showpercent : true,
			/**
			 * @cfg {Number} Specify with percent.(default to 1)
			 */
			decimalsnum : 1,
			/**
			 * @cfg {String} the event's name trigger pie pop(default to 'click')
			 */
			bound_event : 'click',
			/**
			 * @cfg {Boolean}
			 */
			customize_layout : false,
			/**
			 * @cfg {Boolean} Specify as true make sector will counterclockwise.(default to false)
			 */
			counterclockwise : false,
			/**
			 * @inner {Boolean} if it has animate when a piece popd (default to false)
			 */
			pop_animate : false,
			/**
			 * @cfg {Boolean} Specify as true it means just one piece could pop (default to true)
			 */
			mutex : false,
			/**
			 * @cfg {Boolean} if the apply the gradient,if set to true that will be gradient color of each sector(default to true)
			 */
			gradient : true,
			/**
			 * @cfg {Number} Specify the length when sector bounded.(default to 1/8 radius,and minimum is 5), 
			 */
			increment : undefined,
			/**
			 * @cfg {Object} Specify the config of label
			 */
			label : {
				enable : true,
				linelength : undefined,
				padding : 5
			},
			/**
			 * @cfg {Object} Specify the config of tip
			 */
			tip : {
				enable : false,
				border : {
					width : 2,
					radius : 5
				}
			}
		});

		this.registerEvent(
		/**
		 * @event Fires when this element' sector bounded
		 * @paramter iChart.Sector2d#sector
		 * @paramter string#name
		 * @paramter int#index
		 */
		'bound',
		/**
		 * @event Fires when this element' sector rebounded
		 * @paramter iChart.Sector2d#sector
		 * @paramter string#name
		 * @paramter int#index
		 */
		'rebound');

		this.sectors = [];
	},
	/**
	 * @method toggle sector 
	 * @paramter int#i the index of sector
	 * @return void
	 */
	toggle:function(i){
		this.sectors[i].toggle();
	},
	/**
	 * @method bound sector
	 * @paramter int#i the index of sector
	 * @return void
	 */
	bound:function(i){
		this.sectors[i].bound();
	},
	/**
	 * @method rebound sector
	 * @paramter int#i the index of sector
	 * @return void
	 */
	rebound:function(i){
		this.sectors[i].rebound();
	},
	doAnimation : function(t, d) {
		var s, si = 0, cs = this.offsetAngle;
		this.sectors.each(function(s, i) {
			si = this.animationArithmetic(t, 0, s.get('totalAngle'), d);
			s.push('startAngle', cs);
			s.push('endAngle', cs + si);
			cs += si;
			// this.fireEvent(this, 'animating', [this, s, t, s.get('totalAngle'), d]);
				s.drawSector();
			}, this);
	},
	/**
	 * @method Returns an array containing all sectors of this pie
	 * @return Array#the collection of sectors
	 */
	getSectors : function() {
		return this.sectors;
	},
	doParse : function(d, i) {
		var _ = this, t = d.name + (_.get('showpercent') ? iChart.toPercent(d.value / _.total, _.get('decimalsnum')) : '');
		if (_.get('label.enable'))
			_.push('sector.label.text', _.fireString(_, 'parseLabelText', [
					d, i
			], t));
		if (_.get('tip.enable'))
			_.push('sector.tip.text', _.fireString(_, 'parseTipText', [
					d, i
			], t));

		_.push('sector.id', i);
		_.push('sector.name', d.name);
		_.push('sector.listeners.changed', function(se, st, i) {
			_.fireEvent(_, st ? 'bound' : 'rebound', [
					_, se.get('name')
			]);
		});
		_.push('sector.startAngle', d.startAngle);
		_.push('sector.middleAngle', d.middleAngle);
		_.push('sector.endAngle', d.endAngle);
		_.push('sector.background_color', d.color);
	},
	doConfig : function() {
		iChart.Pie.superclass.doConfig.call(this);
		iChart.Assert.gtZero(this.total, 'this.total');

		var eA = sA = this.offsetAngle = iChart.angle2Radian(this.get('offsetAngle')), L = this.data.length, r = this.get('radius');
		/**
		 * calculate pie chart's angle
		 */

		this.data.each(function(d, i) {
			eA += (2 * d.value / this.total) * Math.PI;
			if (i == (L - 1)) {
				eA = 2 * Math.PI + this.offsetAngle;
			}
			d.startAngle = sA;
			d.endAngle = eA;
			d.totalAngle = eA - sA;
			d.middleAngle = (sA + eA) / 2;
			sA = eA;
		}, this);

		/**
		 * calculate pie chart's radius
		 */
		if (r <= 0 || r > this.get('minDistance') / 2) {
			r = this.push('radius', this.get('minDistance') / 2);
		}

		this.r = r;
		/**
		 * calculate pie chart's increment
		 */
		this.pushIf('increment', iChart.lowTo(5, r / 8));

		/**
		 * calculate pie chart's alignment
		 */
		if (this.get('align') == 'left') {
			this.push('originx', r + this.get('l_originx') + this.get('offsetx'));
		} else if (this.get('align') == 'right') {
			this.push('originx', this.get('r_originx') - r + this.get('offsetx'));
		} else {
			this.push('originx', this.get('centerx') + this.get('offsetx'));
		}
		this.push('originy', this.get('centery') + this.get('offsety'));

		this.push('sector', iChart.clone([
				'originx', 'originy', 'bound_event', 'customize_layout', 'counterclockwise', 'pop_animate', 'mutex', 'shadow', 'shadow_blur', 'shadow_offsetx', 'shadow_offsety', 'increment', 'gradient', 'color_factor', 'label', 'tip', 'border'
		], this.options));

	}
});//@end 