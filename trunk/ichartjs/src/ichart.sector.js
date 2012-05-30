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
			name:'',
			counterclockwise : false,
			startAngle : 0,
			middleAngle : 0,
			endAngle : 0,
			totalAngle : 0,
			/**
			 * @cfg {String} the event's name trigger pie bound(default to 'click'). 
			 * Available value are:
			 * @Option 'left'
			 * @Option 'center'
			 * @Option 'right'
			 */
			bound_event : 'click',
			expand : false,
			/**
			 * @cfg {Boolean} if it has animate when a piece popd (default to false)
			 */
			pop_animate : false,
			/**
			 * @cfg {Boolean} if the piece mutex,it means just one piece could pop (default to true)
			 */
			mutex : false,
			increment : undefined,
			shadow : true,
			gradient : true,
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
				linelength : undefined
			},
			tip : {
				enable : false,
				border : {
					width : 2
				}
			}
		});

		this.registerEvent('changed');

		this.label = null;
		this.tip = null;
	},
	bound : function() {
		if(!this.expanded)
			this.toggle();
	},
	rebound : function() {
		if(this.expanded)
			this.toggle();
	},
	toggle : function() {
		this.fireEvent(this,this.get('bound_event'),[this]);
	},
	drawLabel : function() {
		if (this.get('label.enable')) {
			/**
			 * draw the labels
			 */
			this.label.draw({
				highlight : this.highlighted,
				invoke : this.labelInvoke(this.x, this.y)
			});
		}
	},
	doDraw : function(opts) {
		this.drawSector();
		this.drawLabel();
	},
	doConfig : function() {
		iChart.Sector.superclass.doConfig.call(this);
		
		var _ = this;
		
		_.push('totalAngle', _.get('endAngle') - _.get('startAngle'));

		/**
		 * make the label's color in accord with sector
		 */
		_.push('label.scolor', _.get('background_color'));

		_.variable.event.status = _.expanded = _.get('expand');
		
		if (_.get('tip.enable')) {
			if (_.get('tip.showType') != 'follow') {
				_.push('tip.invokeOffsetDynamic', false);
			}
			_.tip = new iChart.Tip(_.get('tip'), _);
		}

		_.variable.event.poped = false;

		_.on(_.get('bound_event'), function(_,e,r) {
			// console.profile('Test for pop');
				// console.time('Test for pop');
				_.variable.event.poped = true;
				_.expanded = !_.expanded;
				_.redraw();
				_.variable.event.poped = false;
				// console.timeEnd('Test for pop');
				// console.profileEnd('Test for pop');
			});

		_.on('beforedraw', function() {
			_.x = _.get('originx');
			_.y = _.get('originy');
			if(_.variable.event.status!=_.expanded){
				_.fireEvent(_,'changed',[_,_.expanded]);
			}
			_.variable.event.status = _.expanded;
			if (_.expanded) {
				if (_.get('mutex') && !_.variable.event.poped) {
					_.expanded = false;
				} else {
					_.x += _.get('increment') * Math.cos(2 * Math.PI - _.get('middleAngle'));
					_.y -= _.get('increment') * Math.sin(2 * Math.PI - _.get('middleAngle'));
				}
			}
			return true;
		});

	}
});//@end