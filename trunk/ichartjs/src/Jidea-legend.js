	
	/**
	 * @author wanghe
	 * @component#Jidea.Legend
	 * @extend#Jidea.Component
	 */
	Jidea.Legend = Jidea.extend(Jidea.Component,{
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			Jidea.Legend.superclass.configure.apply(this,arguments);
			
			/**
			 * indicate the legend's type
			 */
			this.type = 'legend';
			
			this.configuration({
				 data:undefined,
				 width:'auto',
				 column:1,
				 row:'max',
				 maxwidth:0,
				 line_height:16,
				 /**
				  * @cfg {String} the shape of legend' sign (default to 'square')
				  
				  * The following list provides all available value you can use：
				  
				  * @Option 'round'
				  * @Option 'square'
				  * @Option 'round-bar'
				  * @Option 'square-bar'
				  */
				 sign:'square',
				 /**
				  * @cfg {Number} the size of legend' sign (default to 12)
				  */
				 sign_size:12,
				 /**
				  * @cfg {Number} the distance of legend' sign and text (default to 5)
				  */
				 sign_space:5,
				 legendspace:5,
				 text_with_sign_color:false,
				 /**
				  * @cfg {String} this property specifies the horizontal position of the legend in an module (defaults to 'right')
				  * The following list provides all available value you can use：
				  * @Option 'left'
				  * @Option 'center'  Only applies when valign = 'top|bottom'
				  * @Option 'right'
				  */
				 align:'right',
				 
				 /**
				  * @cfg {String} this property specifies the vertical position of the legend in an module (defaults to 'middle')
				  * Available value are:
				  * @Option 'top'
				  * @Option 'middle'  Only applies when align = 'left|right'
				  * @Option 'bottom' 
				  */
				 valign:'middle',
				 border:{
					width:1,
					radius:5
				 }
			});
			
			this.registerEvent(
				'drawCell',
				'analysing',
				'drawRaw'
			);
				
		},
		drawCell:function(x,y,text,color){
			var s = this.get('sign_size');
			
			if(this.get('sign')=='round'){	
				this.target.round(x+s/2,y+s/2,s/2,color);
			}else if(this.get('sign')=='round-bar'){		
				this.target.rectangle(x,y+s*5/12,s,s/6,color);
				this.target.round(x+s/2,y+s/2,s/4,color);
			}else if(this.get('sign')=='square-bar'){	
				this.target.rectangle(x,y+s*5/12,s,s/6,color);
				this.target.rectangle(x+s/4,y+s/4,s/2,s/2,color);
			}else{				
				this.target.rectangle(x,y,s,s,color);
			}
			
			var textcolor = this.get('color');
			if(this.get('text_with_sign_color')){
				textcolor = color;
			}
			this.target.fillText(text,x+this.get('signwidth'),y+s/2,this.get('textwidth'),textcolor);

			this.fireEvent(this,'drawCell',[x,y,text,color]);
		},
		drawRow:function(suffix,x,y){
			for (var j=0; j<this.get('column'); j++){
				if(suffix<this.data.length){
					this.fireEvent(this,'drawCell',[this.data[suffix]]);
					this.drawCell(x,y,this.data[suffix].text,this.data[suffix].color);
					this.data[suffix].x = x;
					this.data[suffix].y = y;
				}
				x+=this.columnwidth[j]+this.get('signwidth')+this.get('legendspace');
				suffix++;
			}
		},
		isEventValid:function(e){
			if(e.offsetX>this.x&&e.offsetX<(this.x+this.get('width'))&&e.offsetY>this.y&&e.offsetY<(this.y+this.get('height'))){
				for (var i=0; i<this.data.length; i++){
					if(e.offsetX>this.data[i].x&&e.offsetX<(this.data[i].x+this.data[i].width+this.get('signwidth'))&&e.offsetY>this.data[i].y&&e.offsetY<(this.data[i].y+this.get('line_height'))){
						return {valid:true,value:i,target:this.data[i]};
					}
				}
			}
			return {valid:false};
		},
		doDraw:function(){
			if(this.get('border.enable'))
			this.target.drawBorder(
				this.x,
				this.y,
				this.width,
				this.height,
				this.get('border.width'),
				this.get('border.color'),
				this.get('border.radius')==0?0:Jidea.Math.parseBorder(this.get('border.radius')),
                this.get('background_color'),
                false,
                this.get('shadow'),
				this.get('shadow_color'),
				this.get('shadow_blur'),
				this.get('shadow_offsetx'),
				this.get('shadow_offsety'));
			
			this.target.textStyle('left','middle',Jidea.getFont(this.get('fontweight'),this.get('fontsize'),this.get('font')));
			
			var x = this.x+this.get('padding_left'),
				y = this.y+this.get('padding_top'),
				text,c = this.get('column'),r = this.get('row');
						
			for (var i=0; i<r; i++){
				this.fireEvent(this,'drawRaw',[i*c]);
				this.drawRow(i*c,x,y);
				y+=this.get('line_height');
			}
			
		},
		doEvent:function(){
			
		},
		doConfig:function(){
			Jidea.Legend.superclass.doConfig.call(this);
			Jidea.Assert.isNotEmpty(this.get('data'),this.type+'[data]');
			
			this.push('signwidth',(this.get('sign_size')+this.get('sign_space')));
			
			if(this.get('line_height')<this.get('sign_size')){
				this.push('line_height',this.get('sign_size')+this.get('sign_size')/5);
			}
			
			//calculate the legend's matrix
			var c = Jidea.isNumber(this.get('column'));
			var r = Jidea.isNumber(this.get('row'));
			if(!c&&!r)
				c = 1;
			if(c&&!r)
				this.push('row',Math.ceil(this.data.length/this.get('column')));
			if(!c&&r)
				this.push('column',Math.ceil(this.data.length/this.get('row')));
			c = this.get('column');
			r = this.get('row');
			var suffix=0,maxwidth = this.get('width'),width =0,wauto = (this.get('width')=='auto');
			this.columnwidth = new Array(c);
			
			if(wauto){
				this.target.textFont(this.get('fontStyle'));
				maxwidth = 0;//行最大宽度
			}
			
			//calculate the width each item will used
			for (var i=0; i<this.data.length; i++){
				Jidea.merge(this.data[i],this.fireEvent(this,'analysing',[this.data[i],i]));
				this.data[i].text = this.data[i].text || this.data[i].name;
				this.data[i].width = this.target.measureText(this.data[i].text);
			}
			
			//calculate the each column's width it will used
			for(var i = 0;i<c;i++){
				width = 0;//初始化宽度
				suffix = i;
				while(suffix<this.data.length){
					width = Math.max(width,this.data[suffix].width);
					suffix += c;
				}
				this.columnwidth[i]=width;
				maxwidth+=width;
			}
						
			if(wauto){
				this.push('width',maxwidth+this.get('hpadding')+this.get('signwidth')*c+(c-1)*this.get('legendspace'));
			}
			
			if(this.get('width')>this.get('maxwidth')){
				this.push('width',this.get('maxwidth'));
			}
			
			this.push('textwidth',this.get('width')-this.get('hpadding')-this.get('sign_size')-this.get('sign_space'));
			this.push('height',r*this.get('line_height') + this.get('vpadding'));
			
			this.width = this.get('width');
			this.height = this.get('height'); 
			
			
			//if the position is incompatible,rectify it.
			if(this.get('align')=='center'&&this.get('valign')=='middle'){
				this.push('valign','top');
			}
			
			//if this position incompatible with container,rectify it.	        
			if(this.getC('align')=='left'){
				if(this.get('valign')=='middle'){
					this.push('align','right');
				}
			}
			
			if(this.get('valign')=='top'){
				this.push('originy',this.getC('t_originy'));
			}else if(this.get('valign')=='bottom'){
				this.push('originy',this.getC('b_originy')-this.get('height'));
			}else{
				this.push('originy',this.getC('centery')-this.get('height')/2);
			}
			if(this.get('align')=='left'){
				this.push('originx',this.getC('l_originx'));
			}else if(this.get('align')=='center'){
				this.push('originx',this.getC('centerx')-this.get('textwidth')/2);
			}else{
				this.push('originx',this.getC('r_originx')-this.get('width'));
			}
			
	        this.push('originx',this.get('originx')+this.get('offsetx'));
			this.push('originy',this.get('originy')+this.get('offsety'));
			
			this.x = this.get('originx');
			this.y = this.get('originy');
			
		}
});