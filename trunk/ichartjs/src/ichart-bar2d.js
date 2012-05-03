	
	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Bar2D
	 * @extend#iChart.Bar
	 */
	iChart.Bar2D = iChart.extend(iChart.Bar,{
		/**
		 * initialize the context for the pie
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Bar2D.superclass.configure.call(this);
			
			this.type = 'bar2d';
			
			this.dataType = 'simple';
			
			this.configuration({
				coordinate:{grid_color:'#CDCDCD',background_color:'#FEFEFE'}
			});
		},
		doConfig:function(){
			iChart.Bar2D.superclass.doConfig.call(this);
			//bar's height 
			if(!this.get('barheight')){
				this.push('barheight',this.get('coordinate.height')/(this.data.length*2+1));
			}
			
			if(this.get('barheight')*this.data.length>this.get('coordinate.height')){
				this.push('barheight',this.get('coordinate.height')/this.data.length/1.2);
			}
			//the space of two bar
			this.push('barspace',(this.get('coordinate.height') - this.get('barheight')*this.data.length)/(this.data.length+1));
			
			//use option create a coordinate
			this.coo = iChart.Interface.coordinate2d.call(this);
			
			this.pushComponent(this.coo,true);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				W = this.coo.get('width'),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				gw = this.get('barheight')+this.get('barspace'),
				t,lt,tt,w,text,value;
				
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.height',this.get('barheight'));
			this.push('rectangle.valueAlign','right');
			this.push('rectangle.tipAlign','right');
			this.push('rectangle.originx',this.x + this.coo.get('brushsize'));
			
			for(var i=0;i<this.data.length;i++){
				
				t = this.data[i].name+":"+this.data[i].value;
				
				w = (this.data[i].value-S.start)*W/S.distance;
				
				if(Le){
					lt = this.fireEvent(this,'parseLabelText',[this.data[i],i]);
					this.push('rectangle.label.text',iChart.isString(lt)?lt:t);
				}
				if(Te){
					tt = this.fireEvent(this,'parseTipText',[this.data[i],i]);
					this.push('rectangle.tip.text',iChart.isString(tt)?tt:t);
				}
				text = this.fireEvent(this,'parseText',[this.data[i],i]);
				value = this.fireEvent(this,'parseValue',[this.data[i],i]);
				text = iChart.isString(text)?text:this.data[i].name;
				value = iChart.isString(value)?value:this.data[i].value;
				
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