	/**
	 * @author wanghe
	 * @component#Jidea.Pie
	 * @extend#Jidea.Chart
	 */
	Jidea.Pie = Jidea.extend(Jidea.Chart, {
	/**
	 * initialize the context for the pie
	 */
	configure : function(config) {
		/**
		 * invoked the super class's  configuration
		 */
		Jidea.Pie.superclass.configure.call(this);

		this.type = 'pie';

		this.configuration({
			/**
			 *@cfg {Float (0~)} the pie's radius
			 */
			radius : 0,
			/**
			 * @cfg {Number} initial angle for first sector
			 */
			offsetAngle : 0,
			/**
			 *@cfg {Boolean} 是否显示百分比 (default to true)
			 */
			showpercent : true,
			/**
			 *@cfg {Number} 显示百分比精确小数点位数
			 */
			decimalsnum : 1,
			/**
			 *@cfg {String} the event's name trigger pie pop(default to 'click')
			 */
			pop_event : 'click',
			/**
			 *@cfg {Boolean} 
			 */
			customize_layout : false,
			counterclockwise : false,
			/**
			 *@cfg {Boolean} if it has animate when a piece popd (default to false)
			 */
			pop_animate : false,
			/**
			 *@cfg {Boolean} if the piece mutex,it means just one piece could pop (default to true)
			 */
			mutex : false,
			shadow:true,
			/**
			 * @cfg {Boolean} if the apply the gradient,if set to true that will be gradient color of each sector(default to true)
			 */
			gradient:true,
			shadow_blur : 4,
			shadow_offsetx : 0,
			shadow_offsety : 0,
			increment : undefined,
			/**
			 *@cfg {Boolean} if the label displayed (default to true)
			 */
			label : {
				enable : true,
				/**
				 * label线的长度
				 * @memberOf {label} 
				 */
				linelength : undefined,
				padding : 5
			},
			tip : {
				enable : false,
				border : {
					width:2,
					radius:5
				}
			},
			border : {
				color : '#EDEDED'
			}
		});
		
		this.registerEvent(
			'beforeSectorAnimation',
			'afterSectorAnimation'
		);
		
		this.sectors = [];
	},
	doAnimation:function(t,d){
		var s,si=0,cs=this.offsetAngle;
		for(var i=0;i<this.sectors.length;i++){
			s = this.sectors[i]; 
			this.fireEvent(this,'beforeSectorAnimation',[this,s]);
			si = this.animationArithmetic(t,0,s.get('totalAngle'),d);
			s.push('startAngle',cs);
			s.push('endAngle',cs+si);
			cs+=si;
			s.drawSector();
			this.fireEvent(this,'afterSectorAnimation',[this,s]);
		}
	},
	doConfig : function() {
		Jidea.Pie.superclass.doConfig.call(this);
		Jidea.Assert.gtZero(this.total, 'this.total');

		var endAngle = startAngle = this.offsetAngle = Jidea.Math.angleToRadian(this.get('offsetAngle'));
		/**
		 * calculate  pie chart's angle 
		 */
		for ( var i = 0; i < this.data.length; i++) {
			endAngle += (2 * this.data[i].value / this.total) * Math.PI;
			if (i == (this.data.length - 1)) {
				endAngle = 2 * Math.PI + this.offsetAngle;
			}
			this.data[i].startAngle = startAngle;
			this.data[i].endAngle = endAngle;
			this.data[i].totalAngle = endAngle - startAngle;
			this.data[i].middleAngle = (startAngle + endAngle) / 2;
			startAngle = endAngle;
		}

		/**
		 * calculate  pie chart's radius 
		 */
		if (this.get('radius') <= 0
				|| this.get('radius') > this.get('minDistance') / 2) {
			this.push('radius', this.get('minDistance') / 2);
		}
		/**
		 * calculate  pie chart's increment 
		 */
		if(!this.get('increment'))
			this.push('increment',Jidea.Math.lowTo(5,this.get('radius')/8));
		
		/**
		 * calculate pie chart's alignment
		 */
		if (this.get('align') == 'left') {
			this.push('originx', this.get('radius')
					+ this.get('l_originx') + this.get('offsetx'));
		} else if (this.get('align') == 'right') {
			this.push('originx', this.get('r_originx')
					- this.get('radius') + this.get('offsetx'));
		} else {
			this.push('originx', this.get('centerx')
					+ this.get('offsetx'));
		}
		this.push('originy', this.get('centery') + this.get('offsety'));
		
		this.sector_config = Jidea.clone([
				'originx',
				'originy',
				'pop_event',
				'customize_layout',
				'counterclockwise',
				'pop_animate',
				'mutex',
				'shadow_blur',
				'shadow_offsetx',
				'shadow_offsety',
				'increment',
				'gradient',
				'color_factor',
				'label',
				'tip',
				'border'],this.configurations);


	}

});