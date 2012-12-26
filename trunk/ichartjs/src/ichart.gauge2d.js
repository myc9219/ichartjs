/**
 * @overview this class is abstract,use for config column
 * @component#iChart.Gauge2D
 * @extend#iChart.Chart
 */
iChart.Gauge2D = iChart.extend(iChart.Chart, {
	/**
	 * initialize the context for the Column
	 */
	configure : function(config) {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Gauge2D.superclass.configure.call(this);

		this.type = 'gauge2d';
		
		this.dataType = 'single';
		
		this.set({
			/**
			 * @cfg {Float/String} Specifies the gauge's radius.If given a percentage,it will relative to minDistance.(default to '100%')
			 */
			radius : '100%',
			start_angle:30,
			panel :{
				
			},
			inner_border_color:'#dedede',
			inner_border_width:0,
			inner_border_radius:'95%',
			angle_end:null,
			/**
			 * @cfg {Number} By default,if a width is not specified the chart will attempt to distribution in horizontally.(default to undefined)
			 */
			upperLimit : 120,
			/**
			 * @cfg {Number} the space of each column.this option is readOnly.(default to undefined)
			 */
			lowerLimit : 0,
			
			upperLimit : 0,
			/**
			 * @cfg {Number} the distance of column's bottom and text(default to 6)
			 */
			text_space : 6
		});
		//obj.Set('chart.colors.ranges', [[0, 60, 'green'],[60, 80 'yellow'],[80, 100, 'red']]);
		//needle.radius,needle.linewidth,type
		//Gauge?
		//centerpin radius color
		this.push('data',[0]);
	},
	doAnimation : function(t, d,_) {
		
	},
	doLabel:function(_,id,text,x, y){
		_.labels.push(new iChart.Text(iChart.apply(_.get('label'),{
			id : id,
			text : text,
			originx : x,
			originy : y
		}), _));
	},
	doParse : function(_,d, i, o) {
		_.doActing(_,d,o,i);
	},
	doConfig : function() {
		iChart.Gauge2D.superclass.doConfig.call(this);
		var _ = this._(),f = Math.floor(_.get('minDistance') * 0.5),r = iChart.parsePercent(_.get('radius'),f);
		/**
		 * disable tip and legend
		 */
		_.push('tip',false);
		_.push('legend',false);
		
		_.originXY(_,[r + _.get('l_originx'),_.get('r_originx') - r,_.get('centerx')],[_.get('centery')]);
		
		_.push('panel.rounded',true);
		_.push('panel.label',false);
		_.push('panel.radius',r);
		_.push('panel.originx',_.x);
		_.push('panel.originy',_.y);
		
		_.panel = new iChart.Sector2D(_.get('panel'), _);
		_.panel.zIndex = _.get('z_index')-10;
		
		if(_.get('inner_border_width')>0){
			r = iChart.parsePercent(_.get('inner_border_radius'),r);
			_.push('panel.radius',r);
			_.push('panel.border.color',_.get('inner_border_color'));
			_.push('panel.border.width',_.get('inner_border_width'));
			_.iborder = new iChart.Sector2D(_.get('panel'), _);
			_.components.push(_.iborder);
		}
		
		_.components.push(_.panel);
		
	}

});
/**
 * @end
 */