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
			/**
			 * @cfg {Float} Specifies the gauge's end angle.(default to null)
			 */
			end_angle:null,
			space_angle:4,
			tickmarks_radius:'88%',
			tickmarks_width:10,
			tickmarks_bg_color:'#4fa9db',
			tickmarks_size:2,
			tickmarks_count:5,
			tickmarks_color:'#344352',
			tickmarks_lower : 0,
			tickmarks_upper : 100,
			tickmarks_small_color:'#344352',
			tickmarks_small_count:5,
			value : null,
			label:{fontsize:11},
			/**
			 * @cfg {Number} the distance of column's bottom and text(default to 12)
			 */
			label_space : 12,
			screen:{
				/**
				 * @cfg {Number} Specifies the number of decimal.(default to 0)
				 */
				decimalsnum : 1,
				unit_pre:'',
				unit_post:'',
				background_color:'#ffffff',
				height:22,
				width:60,
				fontsize:13,
				fontweight:600,
				border : {
					enable : true
				}
			},
			/**
			 * [[0, 60, 'green'],[60, 80 'yellow'],[80, 100, 'red']]
			 */
			tickmarks_ranges:[],
			center_cap_size:10,
			center_cap_color:'#7bbfec',
			needle_radius:'100%',
			needle_size:    3,
            needle_color:  'red',
            animation:true,
            animation_duration:600,
            animation_timing_function : 'easeOut',
			outer_border_color:'#dedede',
			outer_border_width:1,
			panel_color:'#FEFEFE',
			inner_border_color:'#d8d8da',
			inner_border_width:0,
			inner_border_radius:'95%',
			/**
			 * @cfg {Object/String} Specifies the config of Top Text details see <link>iChart.Text</link>,If given a string,it will only apply the text.note:If the text is empty,then will not display
			 */
			text : {
				text:'',
				line_height:24,
				fontweight : 'bold',
				/**
				 * Specifies the font-size in pixels of top text.(default to 18)
				 */
				fontsize : 18
			}
		});
		
		this.push('data',[0]);
	},
	doAnimation : function(t, d,_) {
		var v = _.animationArithmetic(t,_.needle.start, _.needle.offset, d);
		_.panel.draw();
		_.screen.push('text',v);
		_.screen.draw();
		if(_.text)
		_.text.draw();
		_.needle.push('value',v);
		_.needle.draw();
	},
	to:function(value){
		var _ = this._();
		if(value==_.needle.value)return;
		if(_.processAnimation){
			_.needle.start = _.needle.get('value');
		}else{
			_.needle.start = _.needle.value;
		}
		_.needle.value = parseFloat(value);
		_.needle.offset = _.needle.value-_.needle.start;
		_.runAnimation(_);
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
		var _ = this._(),pi=Math.PI,pi2=pi*2,f = Math.floor(_.get('minDistance') * 0.5),r = iChart.parsePercent(_.get('radius'),f);
		/**
		 * disable tip and legend
		 */
		_.push('tip',false);
		_.push('legend',false);
		_.pushIf('end_angle',-_.get('start_angle'));
		
		
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
			gradient:!!_.get('panel_color'),
			gradient_mode:'RadialGradientOutIn',
			color_factor : 0.2,
			shadow:_.get('shadow'),
			border:{
				width:_.get('outer_border_width'),
				color:_.get('outer_border_color')
			},
			needle:{
				radius:_.get('needle_radius'),
				size:_.get('needle_size'),
				color:_.get('needle_color')
			},
			iborder:{
				radius:iChart.parsePercent(_.get('inner_border_radius'),r),
				width:_.get('inner_border_width'),
				color:_.get('inner_border_color')
			},
			tickmarks:{
				radius:iChart.parsePercent(_.get('tickmarks_radius'),r),
				width:_.get('tickmarks_width'),
				color:_.get('tickmarks_bg_color'),
				start_angle:iChart.angle2Radian(_.get('start_angle')+ 90),
				end_angle:iChart.angle2Radian(_.get('end_angle')+ 450),
				space_angle:iChart.angle2Radian(_.get('space_angle')),
				tickmarks_count:iChart.lowTo(2,_.get('tickmarks_count')),
				tickmarks_size:_.get('tickmarks_size'),
				tickmarks_color:_.get('tickmarks_color'),
				tickmarks_small_color:_.get('tickmarks_small_color'),
				tickmarks_lower : _.get('tickmarks_lower'),
				tickmarks_upper : _.get('tickmarks_upper'),
				tickmarks_small_count:_.get('tickmarks_small_count')||1
			},
			label:_.get('label'),
			label_space:_.get('label_space'),
			configFn:function(_){
				_.r = _.get('radius');
				_.applyGradient(_.x-_.r,_.y-_.r,2*_.r*0.9,2*_.r*0.9);
				_.iborder = _.get('iborder.width')>0;
				_.ir = _.get('iborder.radius');
				_.tr = _.get('tickmarks.radius');
				_.tickbg = [];
				_.tickmarks = [];
				_.labels = [];
				
				var count=_.get('tickmarks.tickmarks_count'),
				colors = [].concat(_.get('tickmarks.color')),
				tcolors = [].concat(_.get('tickmarks.tickmarks_color')),
				stcolors = [].concat(_.get('tickmarks.tickmarks_small_color')),
				scount = _.get('tickmarks.tickmarks_small_count'),
				lower = _.get('tickmarks.tickmarks_lower'),
				upper = _.get('tickmarks.tickmarks_upper'),
				T = (upper - lower)/count,
				A = _.get('tickmarks.space_angle'),
				sA = _.get('tickmarks.start_angle')+A,
				eA = _.get('tickmarks.end_angle')- A,
				tA = eA- sA,
				S = tA/count,
				AA = S/scount,
				size = _.get('tickmarks.tickmarks_size'),
				w = _.get('tickmarks.width')-1,
				tr = _.tr - w -_.get('label_space'),
				wA = size/2/_.tr,
				sAA,
				swA = wA*0.6;
				_.minMarks = T/scount;
				_.lower =lower;
				_.upper =upper;
				
				_.sA =sA;
				_.eA =eA;
				_.tA =tA;
				
				
				for(var i=0;i<=count;i++){
					tcolors[i] = tcolors[i] || tcolors[i-1];
					stcolors[i] = stcolors[i] || stcolors[i-1];
					
					_.tickmarks.push({
						start:sA-wA,
						end:sA+wA,
						radius:_.tr-1,
						width:w,
						color:tcolors[i]
					});
					
					(i<count)&&colors[i]&&_.tickbg.push({
						start:sA-(i==0?A:0),
						end:sA+S+(count-i==1?A:0),
						color:colors[i]
					});
					
					sAA = sA;
					for(var j=0;i<count&&j<scount-1;j++){
						sAA+=AA;
						_.tickmarks.push({
							start:sAA-swA,
							end:sAA+swA,
							radius:_.tr-1-w*0.4,
							width:w*0.6,
							color:stcolors[i]
						});
					}
					
					_.labels.push(new iChart.Text(iChart.apply(_.get('label'),{
						text : lower,
						textAlign:'center',
						textBaseline:'middle',
						originx : _.x+Math.cos(sA)*tr,
						originy : _.y+Math.sin(sA)*tr
					}), _));
					
					lower+=T;
					sA+=S;
				}
			},
			drawFn:function(_){
				_.T.sector(_.x, _.y, _.r, 0, 0, pi2, _.get('f_color'), _.get('border.width')>0, _.get('border.width'), _.get('border.color'), _.get('shadow'), false, true);
				if(_.iborder){
					_.T.sector(_.x, _.y, _.ir, 0, 0, pi2, 0, true, _.get('iborder.width'), _.get('iborder.color'),0, false, true, true);
				}
				
				_.tickbg.each(function(bg){
					_.T.sector(_.x, _.y, _.tr,_.get('tickmarks.width'),bg.start, bg.end,bg.color, 0, 0, 0, 0, false, true, true);
				});
				
				_.tickmarks.each(function(tick){
					_.T.sector(_.x, _.y, tick.radius,tick.width,tick.start,tick.end,tick.color, 0, 0, 0, 0, false, true, true);
				});
				
				
				_.labels.each(function(label){
					label.draw();
				});
			}
		}, _);
		
		var value = (!_.get('value')&&_.get('value')!=0)?_.panel.lower:_.get('value');
		
		/**
		 * build needle
		 */
		_.needle = new iChart.Custom({
			z_index:_.get('z_index')-6,
			radius:iChart.parsePercent(_.get('needle_radius'),_.panel.tr - _.get('tickmarks_width')*0.5),
			originx:_.x,
			originy:_.y,
			panel:_.panel,
			value:value,
			size:_.get('needle_size'),
			background_color:_.get('needle_color'),
			cap:{
				size:_.get('center_cap_size'),
				color:_.get('center_cap_color')
			},
			getRadian:function(v){
				var l = _.panel.lower,u = _.panel.upper;
				if(l>u){
					v = iChart.between(u,l,v);
				}else{
					v = iChart.between(l,u,v);
				}
				return Math.abs(((v-l)/(u-l))*_.panel.tA)+_.panel.sA;
			},
			configFn:function(_){
				_.r = _.get('radius');
				_.panel = _.get('panel');
				_.getRadian = _.get('getRadian');
				_.wA = _.get('size')/2/_.r;
				_.value = _.get('value');
				_.start = _.panel.lower;
				_.offset = _.value-_.start;
			},
			drawFn:function(_){
				var A = _.getRadian(_.get('value')),cap = _.get('cap.size'),Q = _.get('size')/cap;
				
				_.T.polygon(_.get('f_color'),true,1,'#bcbcbc',0,1,[{x:_.x+Math.cos(A-Q)*cap,y:_.y+Math.sin(A-Q)*cap},{x:_.x+Math.cos(A+Q)*cap,y:_.y+Math.sin(A+Q)*cap},{x:_.x+Math.cos(A)*_.r,y:_.y+Math.sin(A)*_.r}]);
				
				_.T.sector(_.x, _.y,cap, 0, 0, pi2, _.get('cap.color'),true,2,'#333333',0, false, true);
			}
		}, _);
		
		/**
		 * build screen
		 */
		_.screen = new iChart.Text(iChart.apply(_.get('screen'),{
			z_index:_.get('z_index')-9,
			originx:_.x-_.get('screen.width')/2,
			originy:_.y+r/3,
			text:value
		}), _);
		
		_.screen.on('beforedraw', function() {
			this.push('text',this.get('unit_pre')+parseFloat(this.get('text')).toFixed(this.get('decimalsnum'))+this.get('unit_post'));
			return true;
		});
		
		if ($.isString(_.get('text'))) {
			_.push('text', $.applyIf({
				text : _.get('text')
			}, _.default_.text));
		}
		
		if (_.get('text.text') != '') {
			_.text = new $.Text(iChart.apply(_.get('text'),{
				z_index:_.get('z_index')-8,
				originx:_.x,
				originy:_.y-r/3,
				textBaseline:'middle'
			}), _);
			_.components.push(_.text);
		}
		
		
		_.components.push(_.screen);
		_.components.push(_.panel);
		_.components.push(_.needle);
	}

});
/**
 * @end
 */