	/**
	 * @overview this component use for abc
	 * @component#Jidea.Label
	 * @extend#Jidea.Component
	 */
	Jidea.Label = Jidea.extend(Jidea.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Label.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the legend's type
			 */
			this.type = 'legend';
			
			this.configuration({
				 text:'',
				 line_height:16,
				 /**
				  * @cfg {String} the shape of legend' sign (default to 'square')
				  
				  * The following list provides all available value you can use：
				  
				  * @Option 'round'
				  * @Option 'square'
				  */
				 sign:'square',
				 /**
				  * @cfg {Number} the size of legend' sign (default to 12)
				  */
				 sign_size:12,
				 padding:5,
				 offsety:2,
				 sign_space:5,
				 highlight:false,
				 background_color:'#efefef',
				 text_with_sign_color:false,
				 border:{
					radius:2
				 }
			});
			
			this.registerEvent(
				'beforeDrawRow',
				'highlight',
				'drawRow'
			);
				
		},
		drawBorder:function(){
			this.lineFn.call(this);
			this.target.drawBorder(this.labelx,this.labely,this.width,this.height,this.get('border.width'),this.get('border.color'),this.get('border.radius')==0?0:Jidea.Math.parseBorder(this.get('border.radius')),this.get('background_color'),false,this.get('shadow'),this.get('shadow_color'),this.get('shadow_blur'),this.get('shadow_offsetx'),this.get('shadow_offsety'));
			
		},
		isEventValid:function(e){ 
			return {valid:Jidea.Math.inRange(this.labelx,this.labelx+this.width,e.offsetX)&&Jidea.Math.inRange(this.labely,this.labely+this.height,e.offsetY)};
		},
		doDraw:function(opts){
			opts = opts || {};
			if(opts.invoke){
				this.updateLcb(opts.invoke);
			}
			
			/**
			 * when highlight fire
			 */
			if(opts.highlight){
				this.fireEvent(this,'highlight');
			}
			
			this.drawBorder();
			
			
			this.target.textStyle('left','top',this.get('fontStyle'));
			
			var x = this.labelx+this.get('padding_left'),
				y = this.labely+this.get('padding_top')+this.get('offsety');
			
			var textcolor = this.get('color');
			if(this.get('text_with_sign_color')){
				textcolor = this.get('scolor');
			}
			if(this.get('sign')=='square'){				
				this.target.rectangle(x,y,this.get('sign_size'),this.get('sign_size'),this.get('scolor'),1);
			}else{		
				this.target.round(x+this.get('sign_size')/2,y+this.get('sign_size')/2,this.get('sign_size')/2,this.get('scolor'),1);
			}	
			
			this.target.fillText(this.get('text'),x+this.get('sign_size')+this.get('sign_space'),y,this.get('textwidth'),textcolor);
		},
		updateLcb:function(L){
			this.lineFn = L.lineFn;
			var XY = L.labelXY.call(this);
			this.labelx = XY.labelx;
			this.labely = XY.labely;
			this.x = L.origin.x;
			this.y = L.origin.y;
			//console.log(this.x+","+this.y+","+this.labelx+","+this.labely);
		},
		doConfig:function(){
			Jidea.Label.superclass.doConfig.call(this);
			
			this.target.textFont(Jidea.getFont(this.get('fontweight'),this.get('fontsize'),this.get('font')));
			this.height = this.get('line_height')+this.get('vpadding');
			
			this.width = this.target.measureText(this.get('text'))+this.get('hpadding')+this.get('sign_size')+this.get('sign_space');
			
			var lcb = this.get('lineCB');
			if(lcb){
				this.updateLcb(lcb);
			}
			
			
			
			
			
		}
});