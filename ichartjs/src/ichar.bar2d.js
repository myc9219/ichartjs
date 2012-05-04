	
	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Bar2D
	 * @extend#iChart.Bar
	 */
	iChart.Bar2D = iChart.extend(iChart.Bar,{
		/**
		 * initialize the context for the pie
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Bar2D.superclass.configure.call(this);
			
			this.type = 'bar2d';
			
			this.dataType = 'simple';
			
			this.set({
				coordinate:{grid_color:'#CDCDCD',background_color:'#FEFEFE'}
			});
		},
		doConfig:function(){
			iChart.Bar2D.superclass.doConfig.call(this);
			var L = this.data.length,H = this.get('coordinate.height');
			
			//bar's height 
			this.pushIf('barheight',H/(L*2+1));
			
			if(this.get('barheight')*L>H){
				this.push('barheight',H/(L*2+1));
			}
			
			//the space of two bar
			this.push('barspace',(H - this.get('barheight')*L)/(L+1));
			
			//use option create a coordinate
			this.coo = iChart.Interface.coordinate2d.call(this);
			this.pushComponent(this.coo,true);
			
			
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				W = this.coo.get('width'),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				gw = this.get('barheight')+this.get('barspace'),
				t,w,text,value;
				
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.height',this.get('barheight'));
			this.push('rectangle.valueAlign','right');
			this.push('rectangle.tipAlign','right');
			this.push('rectangle.originx',this.x + this.coo.get('brushsize'));
			
			for(var i=0;i<L;i++){
				text = this.data[i].name;
				value = this.data[i].value;
				t = text+":"+value;
				
				w = (this.data[i].value-S.start)*W/S.distance;
				
				if(Le){
					this.push('rectangle.label.text',this.fireString(this,'parseLabelText',[this.data[i],i],t));
				}
				if(Te){
					this.push('rectangle.tip.text',this.fireString(this,'parseTipText',[this.data[i],i],t));
				}
				
				text = this.fireString(this,'parseText',[this.data[i],i],text);
				value = this.fireString(this,'parseValue',[this.data[i],i],value);
				
				/**
				 * y = this.y + brushsize + h
				 */
				this.push('rectangle.originy',this.y+this.get('barspace')+i*gw);
				
				this.push('rectangle.value',value);
				this.push('rectangle.width',w);
				this.push('rectangle.background_color',this.data[i].color);
				this.push('rectangle.id',i);
				
				this.rectangles.push(new iChart.Rectangle2D(this.get('rectangle'),this));
				
				this.labels.push(new iChart.Text({
					id:i,
					textAlign:'right',
					textBaseline:'middle',
					text:text,
					originx:this.x - this.get('text_space'),
	 				originy:this.y + this.get('barspace')+i*gw +this.get('barheight')/2
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
			
		}
		
});