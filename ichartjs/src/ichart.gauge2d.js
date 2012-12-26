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
			outer_border_color:'#dedede',
			outer_border_width:1,
			panel_color:'#FEFEFE',
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
		
		/**
		 * build dial panel
		 */
		_.panel = new iChart.Custom({
			z_index:_.get('z_index')-10,
			background_color:_.get('panel_color'),
			radius:r,
			originx:_.x,
			originy:_.y,
			shadow:_.get('shadow'),
			border:{
				width:_.get('outer_border_width'),
				color:_.get('outer_border_color')
			},
			innerborder:{
				radius:iChart.parsePercent(_.get('inner_border_radius'),r),
				width:_.get('inner_border_width'),
				color:_.get('inner_border_color')
			},
			configFn:function(_){
				_.r = _.get('radius');
				_.applyGradient(_.x-_.r,_.y-_.r,2*_.r*0.9,2*_.r*0.9);
				_.iborder = _.get('innerborder.width')>0;
				_.ir = _.get('innerborder.radius');
			},
			drawFn:function(_){
				_.T.sector(_.x, _.y, _.r, 0, 0, Math.PI * 2, _.get('f_color'), _.get('border.width')>0, _.get('border.width'), _.get('border.color'), _.get('shadow'), false, true);
				if(_.iborder){
					_.T.sector(_.x, _.y, _.ir, 0, 0, Math.PI * 2, 0, true, _.get('innerborder.width'), _.get('innerborder.color'), _.get('shadow'), false, true);
				}
			}
		}, _);
		
		_.components.push(_.panel);
		
		
		
	}

});
/**
 * @end
 */