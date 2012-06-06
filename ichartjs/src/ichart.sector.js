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
			 * @cfg {Boolean} True to make sector counterclockwise.(default to false)
			 */
			counterclockwise : false,
			/**
			 * @cfg {Number} Specify the start angle of this sector.Normally,this will given by chart.(default to 0)
			 */
			startAngle : 0,
			/**
			 * @cfg {Number} middleAngle = (endAngle - startAngle)/2.Normally,this will given by chart.(default to 0)
			 */
			middleAngle : 0,
			/**
			 * @cfg {Number} Specify the end angle of this sector.Normally,this will given by chart.(default to 0)
			 */
			endAngle : 0,
			/**
			 * @cfg {Number} Specify total angle of this sector,totalAngle = (endAngle - startAngle).Normally,this will given by chart.(default to 0)
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
			 * @inner {Boolean} True to has animation when bound.(default to false)
			 */
			pop_animate : false,
			/**
			 * @cfg {Boolean} if true means just one piece could bound at same time.(default to false)
			 */
			mutex : false,
			/**
			 * @cfg {Number} Specify the offset when bounded.Normally,this will given by chart.(default to undefined)
			 */
			increment : undefined,
			/**
			 * @cfg {Boolean} True to apply the gradient.(default to true)
			 */
			gradient : true,
			/**
			 * @cfg {Boolean} option of label
			 */
			label : {
				enable : true,
				linelength : undefined
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