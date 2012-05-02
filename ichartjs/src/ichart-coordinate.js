;(function(){
	/**
	 * @overview
	 * this is inner use for axis
	 * 用于坐标系上坐标刻度的配置
	 * @component#KeDu
	 * @extend#iChart.Component
	 */
	var KeDu = iChart.extend(iChart.Component,{
			configure:function(){
				/**
				 * invoked the super class's  configuration
				 */
				KeDu.superclass.configure.apply(this,arguments);
				
				/**
				 * indicate the component's type
				 */
				this.type = 'kedu';
				
				this.configuration({
					 /**
					  * @cfg {String} the axis's type(default to 'h')
					  * Available value are:
					  * @Option 'h' :horizontal
					  * @Option 'v' :vertical
					 */
					 which:'h',
					 /**
					 * @inner {Number}
					 */
					 distance:undefined,
					 start_scale:0,
					 end_scale:undefined,
					 min_scale:undefined,
					 max_scale:undefined,
					 scale:undefined,
					 scale_share:5,
					 /**
					  *@cfg {Boolean} 是否显示刻度
				 	  */
					 scale_line_enable:true,
					 scale_size:1,
					 scale_width:4,
					 scale_color:'#333333',
					 scaleAlign:'center',
					 labels:[],
					 /**
					  * @cfg {Boolean} indicate whether the grid is accord with kedu
					  */
					 kedu2grid:true,
					 text_height:16,
					 text_space:4,
					 textAlign:'left',
					 /**
					  *@cfg {Number} 显示百分比精确小数点位数
				 	  */
					 decimalsnum:0,
					 /**
					  * @cfg {String} the style of overlapping(default to 'none')
					  * Available value are:
					  * @Option 'square'
					  * @Option 'round'
					  * @Option 'none'
					 */
					 join_style:'none',
					 /**
					  *@cfg {Number}
					 */
					 join_size:2,
					 label:'',
					 label_position:''
					 
				});
				
				this.registerEvent(
				   /**
					 *@cfg {Function} the event when parse text、you can return a object like this:{text:'',textX:100,textY:100} to override the given
					 * Available param are:
					 * @param text:item's text
					 * @param textX:coordinate-x of item's text
					 * @param textY:coordinate-y of item's text
					 * @param index:item's index
					 * (text,x,y,index)
				 	 */
					'parseText'
				);
				
				this.items = [];
				this.number = 0;
				
			},
			isEventValid:function(e){
				return {valid:false};
			},
			/**
			 * 按照从左自右,从上至下原则
			 */
			doDraw:function(){
				var x=y=x0=y0=tx=ty=0,w = this.get('scale_width'),w2 = this.get('scale_width')/2;
				if(this.isHorizontal){
					if(this.get('scaleAlign')=='top'){
						y = -w;
					}else if(this.get('scaleAlign')=='center'){
						y = - w2;
						y0 = w2;
					}else{
						y0 =w;
					}
					this.target.textAlign('center');
					if(this.get('textAlign')=='top'){
						ty = -this.get('text_space');
						this.target.textBaseline('bottom');
					}else{
						ty = this.get('text_space');
						this.target.textBaseline('top');
					}
				}else{
					if(this.get('scaleAlign')=='left'){
						x = -w;
					}else if(this.get('scaleAlign')=='center'){
						x = - w2;
						x0 = w2;
					}else{
						x0 = w;
					}
					this.target.textBaseline('middle');
					if(this.get('textAlign')=='right'){
						this.target.textAlign('left');
						tx = this.get('text_space');	
					}else{
						this.target.textAlign('right');
						tx = -this.get('text_space');
					}
				}
				//将上述的配置部分转移到config中?
				
				//每一个text的个性化问题?
				this.target.textFont(this.get('fontStyle'));
				
				for(var i =0;i<this.items.length;i++){
					if(this.get('scale_line_enable'))
					this.target.line(this.items[i].x+x,this.items[i].y+y,this.items[i].x+x0,this.items[i].y+y0,this.get('scale_size'),this.get('scale_color'),false);
					
					this.target.fillText(this.items[i].text,this.items[i].textX+tx,this.items[i].textY+ty,false,this.get('color'),'lr',this.get('text_height'));
				}
			},
			doConfig:function(){
				KeDu.superclass.doConfig.call(this);
				iChart.Assert.isNumber(this.get('distance'),'distance');
				
				var customLabel = this.get('labels').length>0;
				if(customLabel){
					this.number = this.get('labels').length-1;
				}else{
					iChart.Assert.isTrue(iChart.isNumber(this.get('max_scale'))||iChart.isNumber(this.get('end_scale')),'max_scale&end_scale');
					
					//end_scale must greater than maxScale
					if(!this.get('end_scale')||this.get('end_scale')<this.get('max_scale')){
						this.push('end_scale',iChart.Math.ceil(this.get('max_scale')));
					}
					//startScale must less than minScale
					if(this.get('start_scale')>this.get('min_scale')){
						this.push('start_scale',iChart.Math.floor(this.get('min_scale')));
					}
					
					if(this.get('scale')&&this.get('scale')<this.get('end_scale')-this.get('start_scale')){
						this.push('scale_share',(this.get('end_scale')-this.get('start_scale'))/this.get('scale'));
					}
					
					//value of each scale
					if(!this.get('scale')||this.get('scale')>this.get('end_scale')-this.get('start_scale')){
						this.push('scale',(this.get('end_scale')-this.get('start_scale'))/this.get('scale_share'));
					}
					
					this.number = this.get('scale_share');
				}
				
				//the real distance of each scale
				this.push('distanceOne',this.get('valid_distance')/this.number);
				
				var text,maxwidth =0,x,y;
						
				this.target.textFont(this.get('fontStyle'));
				this.push('which',this.get('which').toLowerCase());
				this.isHorizontal = this.get('which')=='h';
				
				//有效宽度仅对水平刻度有效、有效高度仅对垂直高度有效
				for(var i=0;i<=this.number;i++){
					text = customLabel?this.get('labels')[i]:(this.get('scale')*i+this.get('start_scale')).toFixed(this.get('decimalsnum'));
					x = this.isHorizontal?this.get('valid_x')+i*this.get('distanceOne'):this.x;
					y = this.isHorizontal?this.y:this.get('valid_y')+this.get('distance')-i*this.get('distanceOne');
					this.items.push(iChart.merge({text:text,x:x,y:y,textX:x,textY:y},this.fireEvent(this,'parseText',[text,x,y,i])));
					maxwidth = Math.max(maxwidth,this.target.measureText(text));
				}
				
				//what does follow code doing?
				this.left = this.right = this.top =this.bottom = 0;
				if(this.isHorizontal){
					if(this.get('scaleAlign')=='top'){
						this.top = this.get('scale_width');
					}else if(this.get('scaleAlign')=='center'){
						this.top = this.get('scale_width')/2;
					}else{
						this.top = 0;
					}
					this.bottom = this.get('scale_width') - this.top;
					if(this.get('textAlign')=='top'){
						this.top +=this.get('text_height') + this.get('text_space');
					}else{
						this.bottom +=this.get('text_height') + this.get('text_space');
					}
				}else{
					if(this.get('scaleAlign')=='left'){
						this.left = this.get('scale_width');
					}else if(this.get('scaleAlign')=='center'){
						this.left = this.get('scale_width')/2;
					}else{
						this.left = 0;
					}
					this.right = this.get('scale_width') - this.left;
					if(this.get('textAlign')=='left'){
						this.left += maxwidth + this.get('text_space');
					}else{
						this.right +=maxwidth + this.get('text_space');
					}
				}
			}
	});
	
	/**
	 * @component#iChart.Coordinate2D
	 * @extend#iChart.Component
	 */
	iChart.Coordinate2D = iChart.extend(iChart.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configurationuration
			 */
			iChart.Coordinate2D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'coordinate2d';
			
			this.configuration({
				 sign_size:12,
				 sign_space:5,
				 kedu:[],
				 valid_width:undefined,
				 valid_height:undefined,
				 grid_line_width:1,
				 grid_color:'#c4dede',
				 gridlinesVisible:true,
				 /**
				  * @cfg {Boolean} indicate whether the grid is accord with kedu,on the premise of grids is not specify.
				  * this just give a convenient way bulid grid for default.and actual value depend on kedu's kedu2grid
				  */
				 kedu2grid:true,
				 /**
				  * @cfg {Object} this is  grid config for custom.the detailed like this:
				  * way:the manner calculate grid-line (default to 'share_alike')
				  *   *   Available property are:
					  *   @Option share_alike 
					  *   @Option given_value 
			 	  * value: way-share_alike:the number of way-share.given_value:the distance each grid line(unit:pixel)
				  * {
				  *  horizontal:
				  *   {
				  * 	way:'share_alike',
				  * 	value:10
				  *   }
				  *  vertical:
				  *   {
				  * 	way:'given_value',
				  * 	value:40
				  *   }
				  * }
				  */
				 grids:undefined,
				  /**
				  * @cfg {Boolean} the grid line will be ignored when gird and axis overlap
				  */
				 ignoreOverlap:true,
				 ignoreEdge:false,
				 gradient:false,
				 ylabel:'',
				 xlabel:'',
				 /**
				  *@cfg {Number} rounded to two digit
			 	  */
				 decimalsnum:0,
				 color_factor:0.18,
				 background_color:'#FEFEFE',
				 alternate_color:true,
				 crosshair:{
					enable:false
				 },
				 width:undefined,
				 height:undefined,
				 /**
				  *@cfg {Object} rounded to two digit
			 	  */
				 axis:{
					enable:true,
					color:'#666666',
					width:1,
					style:''
				 }
			});
			
			this.registerEvent();
			
			this.kedu = [];
			this.gridlines = [];
		},
		getX:function(){
			return this.x;
		},
		getScale:function(p){
			for(var i=0;i<this.kedu.length;i++){
				if(this.kedu[i].get('position')==p){
					return {
						start:this.kedu[i].get('start_scale'),
						end:this.kedu[i].get('end_scale'),
						distance:this.kedu[i].get('end_scale')-this.kedu[i].get('start_scale')
					};
				}
			}
			return {start:0,end:0,distance:0};
		},
		isEventValid:function(e){
			return {valid:e.offsetX>this.x&&e.offsetX<(this.x+this.get('width'))&&e.offsetY<this.y+this.get('height')&&e.offsetY>this.y};
		},
		doDraw:function(opts){
			this.target.rectangle(
						this.x,
						this.y,
						this.get('width'),
						this.get('height'),
						this.get('fill_color'),
						this.get('axis.enable'),
						this.get('axis.width'),
						this.get('axis.color'),
						this.get('shadow'),
						this.get('shadow_color'),
						this.get('shadow_blur'),
						this.get('shadow_offsetx'),
						this.get('shadow_offsety')
					);

			if(this.get('alternate_color')){
				var x,y,
					f = false,
					axis =[0,0,0,0],
					c = iChart.Math.dark(this.get('background_color'),0.04);
				if(this.get('axis.enable')){
					axis = this.get('axis.width');
				}
			}
			for(var i=0;i<this.gridlines.length;i++){
				this.gridlines[i].x1 = Math.round(this.gridlines[i].x1);
				this.gridlines[i].y1 = Math.round(this.gridlines[i].y1);
				this.gridlines[i].x2 = Math.round(this.gridlines[i].x2);
				this.gridlines[i].y2 = Math.round(this.gridlines[i].y2);
				if(this.get('alternate_color')){
					//vertical
					if(this.gridlines[i].x1==this.gridlines[i].x2){
						//next to do
					}
					//horizontal
					if(this.gridlines[i].y1==this.gridlines[i].y2){
						if(f){
							this.target.rectangle(
								this.gridlines[i].x1+axis[3],
								this.gridlines[i].y1+this.get('grid_line_width'),
								this.gridlines[i].x2-this.gridlines[i].x1-axis[3]-axis[1],
								y-this.gridlines[i].y1-this.get('grid_line_width'),
								c);
						}
						x = this.gridlines[i].x1;
						y = this.gridlines[i].y1;
						f = !f;
					}
				}
				this.target.line(this.gridlines[i].x1,this.gridlines[i].y1,this.gridlines[i].x2,this.gridlines[i].y2,this.get('grid_line_width'),this.get('grid_color'));
			}
			for(var i=0;i<this.kedu.length;i++){
				this.kedu[i].draw();
			}
		},
		doConfig:function(){
			iChart.Coordinate2D.superclass.doConfig.call(this);
			iChart.Assert.isNumber(this.get('width'),'width');
			iChart.Assert.isNumber(this.get('height'),'height');
			//console.log(this.get('wall_style'));
			
			this.on('mouseover',function(e){
				this.target.css("cursor","default");
			});
			
			if(!this.get('valid_width')||this.get('valid_width')>this.get('width')){
				this.push('valid_width',this.get('width'));
			}
			if(!this.get('valid_height')||this.get('valid_height')>this.get('height')){
				this.push('valid_height',this.get('height'));
			}
			
			/** 
			 * apply the gradient color to fill_color
			 */
			if(this.get('gradient')&&iChart.isString(this.get('background_color'))){
				this.push('fill_color',this.target.avgLinearGradient(this.x,this.y,this.x,this.y+this.get('height'),[this.get('dark_color'),this.get('light_color')]));
			}
			
			
			if(this.get('axis.enable')){
				var aw = this.get('axis.width');
				if(!iChart.isArray(aw))
				this.push('axis.width',[aw,aw,aw,aw]);
			}
			
			
			if(this.get('crosshair.enable')){
				this.push('crosshair.wrap',this.container.shell);
				this.push('crosshair.height',this.get('height'));
				this.push('crosshair.width',this.get('width'));
				this.push('crosshair.top',this.y);
				this.push('crosshair.left',this.x);
				
				this.crosshair = new iChart.CrossHair(this.get('crosshair'),this);
			}
			
			var kd,jp,
				cg = !!(this.get('gridlinesVisible')&&this.get('grids')),//custom grid
				hg = cg&&!!this.get('grids.horizontal'),
				vg = cg&&!!this.get('grids.vertical'),
				h = this.get('height'),
				w = this.get('width'),
				vw = this.get('valid_width'),
				vh = this.get('valid_height'),
				k2g = this.get('gridlinesVisible')&&this.get('kedu2grid')&&!(hg&&vg),
				sw =(w - vw)/2;
				sh =(h - vh)/2,
				axis = this.get('axis.width');
			
			if(!iChart.isArray(this.get('kedu'))){
				if(iChart.isObject(this.get('kedu')))
					this.push('kedu',[this.get('kedu')]);
				else
					this.push('kedu',[]);
			}
			
			for(var i =0;i<this.get('kedu').length;i++){
				kd = this.get('kedu')[i];
				jp = kd['position'];
				jp = jp || 'left';
				jp = jp.toLowerCase();
				kd['originx'] = this.x;
				kd['originy'] = this.y;
				kd['valid_x'] = this.x + sw;
				kd['valid_y'] = this.y + sh;
				kd['position'] = jp;
				//calculate coordinate,direction,distance
				if(jp=='top'){
					kd['which'] = 'h';
					kd['distance'] = w;
					kd['valid_distance'] = vw;
				}else if(jp=='right'){
					kd['which'] = 'v';
					kd['distance'] = h;
					kd['valid_distance'] = vh;
					kd['originx'] += w;
					kd['valid_x'] += vw;
				}else if(jp=='bottom'){
					kd['which'] = 'h';
					kd['distance'] = w;
					kd['valid_distance'] = vw;
					kd['originy'] += h;
					kd['valid_y'] += vh;
				}else{
					kd['which'] = 'v';
					kd['distance'] = h;
					kd['valid_distance'] = vh;
				}
 				this.kedu.push(new KeDu(kd,this.container));
			}
			
			this.push('ignoreOverlap',this.get('ignoreOverlap')&&this.get('axis.enable')||this.get('ignoreEdge'));
			
			if(this.get('ignoreOverlap')){
				if(this.get('ignoreEdge')){
					var ignoreOverlap = function(w,x,y){
						return w=='v'?(y==this.y)||(y==this.y+h):(x==this.x)||(x==this.x+w);
					}
				}else{
					var ignoreOverlap = function(wh,x,y){
							return wh=='v'?(y==this.y&&axis[0]>0)||(y==(this.y+h)&&axis[2]>0):(x==this.x&&axis[3]>0)||(x==(this.x+w)&&axis[1]>0);
						}
				}
			}
			
			if(k2g){
				var kedu,x,y;
 				for(var i=0;i<this.kedu.length;i++){
 					kedu = this.kedu[i];
 					//disable,given specfiy grid will ignore kedu2grid 
 					if(iChart.isFalse(kedu.get('kedu2grid'))||hg&&kedu.get('which') == 'v'||vg&&kedu.get('which') == 'h'){
 						continue;
		 					}
 			x = y = 0;
					if(kedu.get('position')=='top'){
						y = h;
					}else if(kedu.get('position')=='right'){
						x = -w;
					}else if(kedu.get('position')=='bottom'){
						y = -h;
					}else{
						x = w;
					}
					for(var j =0;j<kedu.items.length;j++){
						if(this.get('ignoreOverlap'))
							if(ignoreOverlap.call(this,kedu.get('which'),kedu.items[j].x,kedu.items[j].y))continue;
						this.gridlines.push({x1:kedu.items[j].x,y1:kedu.items[j].y,x2:kedu.items[j].x+x,y2:kedu.items[j].y+y});
					}
				}
 			}
			if(vg){
				var gv = this.get('grids.vertical');
				iChart.Assert.gtZero(gv['value'],'value');
				var d = w/gv['value'],
					n  = gv['value'];
				if(gv['way']=='given_value'){
					n = d;
					d = gv['value'];
					d = d>w?w:d;
				}
				
				for(var i = 0;i<=n;i++){
					if(this.get('ignoreOverlap'))
						if(ignoreOverlap.call(this,'h',this.x+i*d,this.y))continue;
					this.gridlines.push({x1:this.x+i*d,y1:this.y,x2:this.x+i*d,y2:this.y+h});
				}
			}
			if(hg){
				var gh = this.get('grids.horizontal');
				iChart.Assert.gtZero(gh['value'],'value');
				var d = h/gh['value'],
					n  = gh['value'];
				if(gh['way']=='given_value'){
					n = d;
					d = gh['value'];
					d = d>h?h:d;
				}
				
				for(var i = 0;i<=n;i++){
					if(this.get('ignoreOverlap'))
						if(ignoreOverlap.call(this,'v',this.x,this.y+i*d))continue;
					this.gridlines.push({x1:this.x,y1:this.y+i*d,x2:this.x+w,y2:this.y+i*d});
				}
			}
			
		}
});
/**
 * @component#iChart.Coordinate3D
 * @extend#iChart.Coordinate2D
 */
iChart.Coordinate3D = iChart.extend(iChart.Coordinate2D,{
		configure:function(){
			/**
			 * invoked the super class's  configurationuration
			 */
			iChart.Coordinate3D.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the component's type
			 */
			this.type = 'coordinate3d';
			this.dimension = iChart.Math._3D;
			
			this.configuration({
				 xAngle:60,
				 yAngle:20,
				 xAngle_:undefined,
				 yAngle_:undefined,
				 zHeight:0,
				 pedestal_height:22,
				 board_deep:20,
				 gradient:true,
				 ignoreEdge:true,
				 alternate_color:false,
				 shadow:true,
				 shadow_blur:4,
				 grid_color:'#7a8d44',
				 background_color:'#d6dbd2',
				 shadow_offsetx:4,
				 shadow_offsety:2,
				 /**
				  *@cfg {String} for 3D
				  * Available property are:
				  * @Option color the color of wall
				  * @Option alpha the opacity of wall
			 	  */
				 wall_style:[],
				 magical_shell:[],
				 axis:{
					enable:false
				 }
			});
		},
		box:function(){
			if(this.get('magical_shell').length==6){
				this.target.cube3D(
						this.x,
						this.y+this.get('height'),
						this.get('xAngle_'),
						this.get('yAngle_'),
						false,
						this.get('width'),
						this.get('height'),
						this.get('zHeight'),
						this.get('axis.enable'),
						this.get('axis.width'),
						this.get('axis.color'),
						this.get('magical_shell')
					);
			}
		},
		doDraw:function(opts){
			/**
			 * bottom 
			 */
			this.target.cube3D(
						this.x,
						this.y + this.get('height') + this.get('pedestal_height'),
						this.get('xAngle_'),
						this.get('yAngle_'),
						false,
						this.get('width'),
						this.get('pedestal_height'),
						this.get('zHeight')*3/2,
						this.get('axis.enable'),
						this.get('axis.width'),
						this.get('axis.color'),
						this.get('bottom_style')
					);
			/**
			 * board_style 
			 */
			this.target.cube3D(
						this.x+this.get('board_deep')*this.get('xAngle_'),
						this.y+ this.get('height')-this.get('board_deep')*this.get('yAngle_'),
						this.get('xAngle_'),
						this.get('yAngle_'),
						false,
						this.get('width'),
						this.get('height'),
						this.get('zHeight'),
						this.get('axis.enable'),
						this.get('axis.width'),
						this.get('axis.color'),
						this.get('board_style')
					);
			
			this.target.cube3D(
						this.x,
						this.y+this.get('height'),
						this.get('xAngle_'),
						this.get('yAngle_'),
						false,
						this.get('width'),
						this.get('height'),
						this.get('zHeight'),
						this.get('axis.enable'),
						this.get('axis.width'),
						this.get('axis.color'),
						this.get('wall_style')
					);
			
			
			var offx = this.get('xAngle_')*this.get('zHeight'),
				offy = this.get('yAngle_')*this.get('zHeight');
			
			for(var i=0;i<this.gridlines.length;i++){
				 this.target.line(this.gridlines[i].x1,this.gridlines[i].y1,this.gridlines[i].x1+offx,this.gridlines[i].y1-offy,this.get('grid_line_width'),this.get('grid_color'));
				 this.target.line(this.gridlines[i].x1+offx,this.gridlines[i].y1-offy,this.gridlines[i].x2+offx,this.gridlines[i].y2-offy,this.get('grid_line_width'),this.get('grid_color'));
			}
			
			for(var i=0;i<this.kedu.length;i++){
				this.kedu[i].draw();
			}
		},
		doConfig:function(){
			iChart.Coordinate3D.superclass.doConfig.call(this);
			
			var bg = this.get('background_color'),
				dark_color = iChart.Math.dark(bg,0.1),
				h = this.get('height'),
				w = this.get('width');
			
			if(this.get('wall_style').length<3){
				this.push('wall_style',[
					{color:dark_color},
					{color:bg},
					{color:dark_color}
				]);
			}
			
			if(this.get('magical_shell').length==3){
				if(this.get('gradient')){
					var color = this.get('magical_shell')[2].color,
						lc = iChart.Math.light(color,0.3);
					this.get('magical_shell')[2].color = this.target.avgLinearGradient(this.x,this.y,this.x+w,this.y,[color,lc,lc,lc,lc,color]);
					color = this.get('magical_shell')[1].color,
					lc = iChart.Math.light(color,0.3);
					this.get('magical_shell')[1].color = this.target.avgLinearGradient(this.x,this.y,this.x,this.y-this.get('yAngle_')*this.get('zHeight'),[color,iChart.Math.light(color,0.3)]);
					
				}
				
				this.push('magical_shell',[false,false,false].concat(this.get('magical_shell')));
			}
			
			this.magic = this.get('magical_shell').length==6;
			
			var dark = this.get('wall_style')[0].color;
			
			
			//右-前
			this.push('bottom_style',[
				 {color:bg,shadow:this.get('shadow'),shadowColor:this.get('shadow_color'),blur:this.get('shadow_blur'),sx:this.get('shadow_offsetx'),sy:this.get('shadow_offsety')},
				 false,
				 false,
				 {color:dark},
				 {color:dark},
				 {color:dark}
			]);
			
			//上-右
			this.push('board_style',[
				 false,false,false,{color:dark},{color:bg},false
			]);
			
			//下底-底-左-右-上-前
			if(this.get('gradient')){
				var offx = this.get('xAngle_')*this.get('zHeight'),
					offy = this.get('yAngle_')*this.get('zHeight'),
					ws = this.get('wall_style'),
					bs = this.get('bottom_style');
				
				if(iChart.isString(ws[0].color)){
					ws[0].color = this.target.avgLinearGradient(this.x,this.y+h,this.x+w,this.y+h,[dark,this.get('dark_color')]);
				}
				
				if(iChart.isString(ws[1].color)){
					ws[1].color = this.target.avgLinearGradient(this.x+offx,this.y-offy,this.x+offx,this.y+h-offy,[this.get('dark_color'),this.get('light_color')]);
				}
				
				if(iChart.isString(ws[2].color)){
					ws[2].color = this.target.avgLinearGradient(this.x,this.y,this.x,this.y+h,[bg,this.get('dark_color')]);
				}
				
				bs[5].color = this.target.avgLinearGradient(this.x,this.y+h,this.x,this.y+h+this.get('pedestal_height'),[bg,dark_color]);
								
				
			}
			
			
		}
});
})();