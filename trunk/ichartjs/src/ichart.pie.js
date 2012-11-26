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
			 * @cfg {Float (0~)} Specifies the pie's radius.(default to calculate by the size of chart)
			 */
			radius : 0,
			/**
			 * @cfg {Number} initial angle for first sector.(default to 0)
			 */
			offset_angle : 0,
			/**
			 * @cfg {Number(0~90)} separate angle of all sector.(default to 0)
			 */
			separate_angle:0,
			/**
			 * @cfg {String} the event's name trigger pie pop(default to 'click')
			 */
			bound_event : 'click',
			/**
			 * @inner {Boolean} True to make sector counterclockwise.(default to false)
			 */
			counterclockwise : false,
			/**
			 * @cfg {Boolean} when label's position in conflict.auto layout.(default to true).
			 */
			intellectLayout : true,
			/**
			 * @cfg {Number} Specifies the distance in pixels when two label is incompatible with each other.(default 4),
			 */
			layout_distance : 4,
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
			 * @cfg {<link>iChart.Sector</link>} option of sector.Note,Pie2d depend on Sector2d and pie3d depend on Sector3d.For details see <link>iChart.Sector</link>
			 */
			sub_option : {
				label : {}
			}
		});

		this.registerEvent(
		/**
		 * @event Fires when this element' sector bounded
		 * @paramter <link>iChart.Sector2d</link>#sector
		 * @paramter string#name
		 * @paramter int#index
		 */
		'bound',
		/**
		 * @event Fires when this element' sector rebounded
		 * @paramter <link>iChart.Sector2d</link>#sector
		 * @paramter string#name
		 * @paramter int#index
		 */
		'rebound');

	},
	/**
	 * @method Toggle sector bound or rebound by a specific index.
	 * @paramter int#i the index of sector
	 * @return void
	 */
	toggle : function(i) {
		this.sectors[i || 0].toggle();
	},
	/**
	 * @method bound sector by a specific index.
	 * @paramter int#i the index of sector
	 * @return void
	 */
	bound : function(i) {
		this.sectors[i || 0].bound();
	},
	/**
	 * @method rebound sector by a specific index.
	 * @paramter int#i the index of sector
	 * @return void
	 */
	rebound : function(i) {
		this.sectors[i || 0].rebound();
	},
	/**
	 * @method Returns an array containing all sectors of this pie
	 * @return Array#the collection of sectors
	 */
	getSectors : function() {
		return this.sectors;
	},
	doAnimation : function(t, d,_) {
		var si = 0, cs = _.oA;
		_.sectors.each(function(s, i) {
			si = _.animationArithmetic(t, 0, s.get('totalAngle'), d);
			s.push('startAngle', cs);
			s.push('endAngle', cs + si);
			cs += si;
			if (!_.is3D())
				s.drawSector();
		});
		
		if (_.is3D()) {
			_.proxy.drawSector();
		}
	},
	doParse : function(_,d, i) {
		var t = d.name + ' ' +_.getPercent(d.value);
		
		_.doActing(_,d,i,t);
		
		_.push('sub_option.id', i);
		
		if(_.get('sub_option.label'))
		_.push('sub_option.label.text', t);
		
		_.push('sub_option.listeners.changed', function(se, st, i) {
			_.fireEvent(_, st ? 'bound' : 'rebound', [_, se.get('name')]);
		});
		_.sectors.push(_.doSector(d));
	},
	test : function(_,l,d,Q) {
		var x = l.get('labelx'),y=l.get('labely')+l.get(_.H)/2*(Q<2?-1:1),
			r = iChart.distanceP2P(_.get(_.X),_.get(_.Y),x,y),y=_.get(_.Y)-y;
		if(r<_.r){
			l.push('labelx',_.get(_.X)+(Math.sqrt(_.r*_.r-y*y)*2+d)*(Q==0||Q==3?1:-1));
			l.localizer(l);
		}
	},
	localizer:function(_){
		if (_.get('intellectLayout')) {
			var unlayout = [],layouted = [],d = _.get('layout_distance'),Q;
			
			_.sectors.each(function(f, i) {
				if(f.isLabel())
				unlayout.push(f.label);
			});
			var pi=Math.PI,abs =function(n,Q){
				while(n<0){
					n+=(pi*2);
				}
				if(Q==0){
					return n;
				}
				if(Q==1){
					return pi-n;
				}
				if(Q==2){
					return n-pi;
				}
				if(Q==3){
					return pi*2-n;
				}
			}
			unlayout.sor(function(p, q) {
				return (abs(p.get('angle'),p.get('quadrantd')) - abs(q.get('angle'),q.get('quadrantd')))>0;
			});
			unlayout.each(function(la) {
				layouted.each(function(l) {
					var x = l.labelx, y = l.labely;
					if ((la.labely <= y && (y - la.labely-1) < la.get(_.H)) || (la.labely > y && (la.labely - y-1) < l.get(_.H))) {
						if ((la.labelx < x && (x - la.labelx) < la.get(_.W)) || (la.labelx > x && (la.labelx - x) < l.get(_.W))) {
							Q = la.get('quadrantd');
							la.push('labely', (la.get('labely')+ y - la.labely) + (la.get(_.H)  + d)*(Q>1?-1:1));
							la.localizer(la);
							_.test(_,la,d,Q);
						}
					}
				}, _);
				layouted.push(la);
			});
		}
	},
	doConfig : function() {
		iChart.Pie.superclass.doConfig.call(this);
		iChart.Assert.gt(this.total,0,'this.total');
		var _ = this._(),r = _.get('radius'), f = _.get('sub_option.label') ? 0.35 : 0.44;
		
		_.sectors = [];
		_.sectors.zIndex = _.get('z_index');
		_.components.push(_.sectors);
		_.oA = iChart.angle2Radian(_.get('offset_angle'))%(2*Math.PI);
		//If 3D,let it bigger
		if (_.is3D())
			f += 0.06;
		
		f = _.get('minDistance') * f;
		
		var L = _.data.length,sepa = iChart.angle2Radian(iChart.between(0,90,_.get('separate_angle'))),PI = 2*Math.PI-sepa,sepa=sepa/L,eA = _.oA+sepa, sA = eA;
		
		
		_.data.each(function(d, i) {
			eA += (d.value / _.total) * PI;
			if (i == (L - 1)) {
				eA = 2 * Math.PI + _.oA;
			}
			d.startAngle = sA;
			d.endAngle = eA;
			d.totalAngle = eA - sA;
			d.middleAngle = (sA + eA) / 2;
			sA = eA+sepa;
		}, _);
		
		
		/**
		 * calculate pie chart's radius
		 */
		if (r <= 0 || r > f) {
			r = _.push('radius', Math.floor(f));
		}
		
		_.r = r;
		
		/**
		 * calculate pie chart's alignment
		 */
		if (_.get('align') == _.L) {
			_.push(_.X, r + _.get('l_originx') + _.get('offsetx'));
		} else if (_.get('align') == _.R) {
			_.push(_.X, _.get('r_originx') - r + _.get('offsetx'));
		} else {
			_.push(_.X, _.get('centerx') + _.get('offsetx'));
		}
		_.push(_.Y, _.get('centery') + _.get('offsety'));
		
		iChart.apply(_.get('sub_option'),iChart.clone([_.X, _.Y, 'bound_event','mutex','increment'], _.options));
		
	}
});
/** @end */
