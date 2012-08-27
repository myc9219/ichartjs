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
		this.dataType = 'simple';

		this.set({
			/**
			 * @cfg {Float (0~)} Specifies the pie's radius.(default to calculate by the size of chart)
			 */
			radius : 0,
			/**
			 * @cfg {Number} initial angle for first sector
			 */
			offsetAngle : 0,
			/**
			 * @cfg {String} the event's name trigger pie pop(default to 'click')
			 */
			bound_event : 'click',
			/**
			 * @inner {Boolean} True to make sector counterclockwise.(default to false)
			 */
			counterclockwise : false,
			/**
			 * @inner {Boolean} 当与其他label有位置冲突时自动浮动其位置.(default to true).
			 */
			intellectLayout : true,
			/**
			 * @inner {Boolean} if it has animate when a piece popd (default to false)
			 */
			pop_animate : false,
			/**
			 * @cfg {Boolean} Specifies as true it means just one piece could pop (default to false)
			 */
			mutex : false,
			/**
			 * @cfg {Number} Specifies the length when sector bounded.(default to 1/8 radius,and minimum is 5),
			 */
			increment : undefined,
			/**
			 * @cfg {Object} Specifies the config of label.For details see <link>iChart.Label</link> Note:this has a extra property named 'enable',indicate whether label available(default to true)
			 */
			label : {
				enable : true
			},
			/**
			 * @cfg {Object} option of sector.Note,Pie2d depend on Sector2d and pie3d depend on Sector3d.For details see <link>iChart.Sector</link>
			 */
			sector : {}
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
		'rebound',
		/**
		 * @event Fires when parse this label's data.Return value will override existing. Only valid when label is available
		 * @paramter Object#data this label's data item
		 * @paramter string#text the current tip's text
		 * @paramter int#i the index of data
		 */
		'parseLabelText');

		this.sectors = [];
	},
	/**
	 * @method Toggle sector bound or rebound by a specific index.
	 * @paramter int#i the index of sector
	 * @return void
	 */
	toggle : function(i) {
		this.data[i || 0].reference.toggle();
	},
	/**
	 * @method bound sector by a specific index.
	 * @paramter int#i the index of sector
	 * @return void
	 */
	bound : function(i) {
		this.data[i || 0].reference.bound();
	},
	/**
	 * @method rebound sector by a specific index.
	 * @paramter int#i the index of sector
	 * @return void
	 */
	rebound : function(i) {
		this.data[i || 0].reference.rebound();
	},
	/**
	 * @method Returns an array containing all sectors of this pie
	 * @return Array#the collection of sectors
	 */
	getSectors : function() {
		return this.sectors;
	},
	doAnimation : function(t, d) {
		var s, si = 0, cs = this.offsetAngle;
		this.data.each(function(D, i) {
			s = D.reference;
			si = this.animationArithmetic(t, 0, s.get('totalAngle'), d);
			s.push('startAngle', cs);
			s.push('endAngle', cs + si);
			cs += si;
			if(!this.is3D())
				s.drawSector();
		}, this);
		if(this.is3D()){
			this.proxy.drawSector();
		}
	},
	localizer : function(la) {
		/**
		 * the code not optimization,need to enhance so that the label can fit the continar
		 */
		this.sectors.each(function(s, i) {
			var l = s.label, x = l.labelx, y = l.labely;
			if ((la.labely <= y && (y - la.labely) < la.get('height')) || (la.labely > y && (la.labely - y) < l.get('height'))) {
				if ((la.labelx < x && (x - la.labelx) < la.get('width')) || (la.labelx > x && (la.labelx - x) < l.get('width'))) {
					var q = la.get('quadrantd');
					if ((q == 2 || q == 3)) {
						/**
						 * console.log('upper..'+la.get('text')+'==='+l.get('text'));
						 */
						la.push('labely', la.get('labely') - la.get('height') + y - la.labely - 2);
						la.push('line_potins', la.get('line_potins').concat(la.get('labelx'), la.get('labely')));
					} else {
						/**
						 * console.log('lower..'+la.get('text')+'==='+l.get('text'));
						 */
						la.push('labely', la.get('labely') + l.get('height') - la.labely + y + 2);
						la.push('line_potins', la.get('line_potins').concat(la.get('labelx'), la.get('labely')));
					}
					la.localizer();
				}
			}
		}, this);
	},
	doParse : function(d, i) {
		var _ = this, t = d.name + (_.get('showpercent') ? ' ' + iChart.toPercent(d.value / _.total, _.get('decimalsnum')) : d.value);
		if (_.get('label.enable')) {
			_.push('sector.label.text', _.fireString(_, 'parseLabelText', [d, i], t));
		}
		if (_.get('tip.enable'))
			_.push('sector.tip.text', _.fireString(_, 'parseTipText', [d, i], t));

		_.push('sector.id', i);
		_.push('sector.value', d.value);
		_.push('sector.name', d.name);
		_.push('sector.listeners.changed', function(se, st, i) {
			_.fireEvent(_, st ? 'bound' : 'rebound', [_, se.get('name')]);
		});
		_.push('sector.startAngle', d.startAngle);
		_.push('sector.middleAngle', d.middleAngle);
		_.push('sector.endAngle', d.endAngle);
		_.push('sector.background_color', d.color);

		d.reference = this.doSector(d);

		this.sectors.push(d.reference);

		if (this.get('label.enable') && this.get('intellectLayout')) {
			this.localizer(d.reference.label);
		}
	},
	/**
	 * calculate pie chart's angle
	 */
	calculate : function() {
		var eA = this.offsetAngle, sA = eA, L = this.data.length;
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
	},
	doConfig : function() {
		iChart.Pie.superclass.doConfig.call(this);
		iChart.Assert.gtZero(this.total, 'this.total');

		this.offsetAngle = iChart.angle2Radian(this.get('offsetAngle'));

		var r = this.get('radius'), f = this.get('minDistance') * (this.get('label.enable') && !this.is3D() ? 0.35 : 0.5);

		this.calculate();

		/**
		 * calculate pie chart's radius
		 */
		if (r <= 0 || r > f) {
			r = this.push('radius', Math.floor(f));
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

		iChart.apply(this.get('sector'), iChart.clone([
				'originx',
				'originy',
				'bound_event',
				'customize_layout',
				'counterclockwise',
				'pop_animate',
				'mutex',
				'shadow',
				'shadow_color',
				'shadow_blur',
				'shadow_offsetx',
				'shadow_offsety',
				'increment',
				'gradient',
				'color_factor',
				'label',
				'tip',
				'border'], this.options));

	}
});// @end
