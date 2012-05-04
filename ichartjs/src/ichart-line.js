	/**
	 * @overview this component use for abc
	 * @component#iChart.Line
	 * @extend#iChart.Chart
	 */
	iChart.Line = iChart.extend(iChart.Chart,{
		/**
		 * initialize the context for the line
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Line.superclass.configure.call(this);
			
			this.type = 'line';
			
			this.dataType='simple';
				
			this.set({
				coordinate:{},
				/**
				  *@cfg {String} 
				  * Available value are:
				  * @Option 'left,'right'
			 	 */
				keduAlign:'left',
				/**
				  *@cfg {String} 
				  * Available value are:
				  * @Option 'top,'bottom'
			 	 */
				labelAlign:'bottom',
				labels:[],
				label_space:6,
				/**
				 *@cfg {Boolean} Can Line smooth?
				 */
				smooth:false,
				/**
				 *@cfg {Boolean} if the point are proportional space(default to true)
				 */
				proportional_spacing:true,
				/**
				 * @cfg {TypeName}  need named ???
				 */
				label_spacing:0,
				segment_style:{
					 /**
					 *@cfg {Boolean} if the label displayed (default to true)
					 */
					label:false
				},
				/**
				 *@cfg {Boolean} if the tip displayed (default to false).Note that this option only applies when showPoint = true. 
				 */
				tip:{
					enable:false
				},
				legend:{
					sign:'round-bar',
				 	sign_size:14
				},
				/**
				 *@cfg {Boolean} if the crosshair displayed (default to false). 
				 */
				crosshair:false,
				/**
				 *@cfg {Object} style of the crosshair. 
				 */
				crosshair_style:{
					width:1,
					color:'blank'
				},
				/**
				 *@cfg {Boolean} 
				 */
				customize_layout:false
			});
			
			this.registerEvent(
				'parsePoint',
				'beforeLineAnimation',
				'afterLineAnimation'
			);
			
			this.lines = [];
		},
		doConfig:function(){
			iChart.Line.superclass.doConfig.call(this);
			
			/**
			 * apply the coordinate feature
			 */
			iChart.Interface.coordinate.call(this);
			
			this.push('line_start',(this.get('coordinate.width')-this.get('coordinate.valid_width'))/2);
			this.push('line_end',this.get('coordinate.width')-this.get('line_start'));
			
			if(this.get('proportional_spacing'))
			this.push('label_spacing',this.get('coordinate.valid_width')/(this.get('maxItemSize')-1));
			
			
			this.push('segment_style.originx',this.get('originx')+this.get('line_start'));
			
			//NEXT y also has line_start and line end
			this.push('segment_style.originy',this.get('originy')+this.get('coordinate.height'));
			
			this.push('segment_style.width',this.get('coordinate.valid_width'));
			this.push('segment_style.height',this.get('coordinate.valid_height'));
			
			this.push('segment_style.limit_y',this.data.length>1);
			
			this.push('segment_style.keep_with_coordinate',true&&this.data.length==1);
			
			var single = this.data.length==1,self = this;
			
			if(this.get('coordinate.crosshair.enable')){
				this.push('coordinate.crosshair.hcross',single);
				this.push('coordinate.crosshair.invokeOffset',function(e,m){
					var r = self.lines[0].isEventValid(e);//NEXT how fire muti line?
					return r.valid?r:false;
				});
			}
			
			if(!this.get('segment_style.tip')){
				this.push('segment_style.tip',this.get('tip'));
			}else{
				this.push('segment_style.tip.wrap',this.get('tip.wrap'));
			}
			
			
		}
		
});