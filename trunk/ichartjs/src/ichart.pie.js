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
			 * @cfg {Boolean} 是否显示百分比 (default to true)
			 */
			showpercent : true,
			/**
			 * @cfg {Number} 显示百分比精确小数点位数
			 */
			decimalsnum : 1,
			/**
			 * @cfg {String} the event's name trigger pie pop(default to
			 *      'click')
			 */
			pop_event : 'click',
			/**
			 * @cfg {Boolean}
			 */
			customize_layout : false,
			counterclockwise : false,
			/**
			 * @cfg {Boolean} if it has animate when a piece popd (default to
			 *      false)
			 */
			pop_animate : false,
			/**
			 * @cfg {Boolean} if the piece mutex,it means just one piece could
			 *      pop (default to true)
			 */
			mutex : false,
			shadow : true,
			/**
			 * @cfg {Boolean} if the apply the gradient,if set to true that will
			 *      be gradient color of each sector(default to true)
			 */
			gradient : true,
			shadow_blur : 4,
			shadow_offsetx : 0,
			shadow_offsety : 0,
			increment : undefined,
			/**
			 * @cfg {Boolean} if the label displayed (default to true)
			 */
			label : {
				enable : true,
				/**
				 * label线的长度
				 * 
				 * @memberOf {label}
				 */
				linelength : undefined,
				padding : 5
			},
			tip : {
				enable : false,
				border : {
					width : 2,
					radius : 5
				}
			}
		});
		
		this.registerEvent(
			'animating'
		);
		
		this.sectors = [];
	},
	doAnimation : function(t, d) {
		var s, si = 0, cs = this.offsetAngle;
		for ( var i = 0; i < this.sectors.length; i++) {
			s = this.sectors[i];
			si = this.animationArithmetic(t, 0, s.get('totalAngle'), d);
			s.push('startAngle', cs);
			s.push('endAngle', cs + si);
			cs += si;
			this.fireEvent(this, 'animating', [this,s,t,s.get('totalAngle'), d]);
			s.drawSector();
		}
	},
	doConfig : function() {
		iChart.Pie.superclass.doConfig.call(this);
		iChart.Assert.gtZero(this.total, 'this.total');

		var endAngle = startAngle = this.offsetAngle = iChart.angle2Radian(this.get('offsetAngle')), d = this.data,r=this.get('radius');
		/**
		 * calculate pie chart's angle
		 */
		for ( var i = 0; i < d.length; i++) {
			endAngle += (2 * d[i].value / this.total) * Math.PI;
			if (i == (d.length - 1)) {
				endAngle = 2 * Math.PI + this.offsetAngle;
			}
			d[i].startAngle = startAngle;
			d[i].endAngle = endAngle;
			d[i].totalAngle = endAngle - startAngle;
			d[i].middleAngle = (startAngle + endAngle) / 2;
			startAngle = endAngle;
		}

		/**
		 * calculate pie chart's radius
		 */
		if (r <= 0 || r > this.get('minDistance') / 2) {
			r = this.push('radius', this.get('minDistance') / 2);
		}
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

		this.sector_config = iChart.clone(['originx', 'originy', 'pop_event', 'customize_layout', 'counterclockwise', 'pop_animate', 'mutex', 'shadow_blur', 'shadow_offsetx',
				'shadow_offsety', 'increment', 'gradient', 'color_factor', 'label', 'tip', 'border'], this.options);

	}

});