	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Column2D
	 * @extend#iChart.Column
	 */
	iChart.Column2D = iChart.extend(iChart.Column,{ 
		/**
		 * initialize the context for the Column2D
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Column2D.superclass.configure.call(this);
			
			this.type = 'column2d';
			this.dataType = 'simple';
			
			this.set({
				coordinate:{grid_color:'#c4dede',background_color:'#FEFEFE'}
			});
		},
		doConfig:function(){
			iChart.Column2D.superclass.doConfig.call(this);
			
			var L = this.data.length,
				W = this.get('coordinate.width'),
				hw = this.pushIf('hiswidth',W/(L*2+1));
			
			
			if(hw*L>W){
				hw = this.push('hiswidth',W/(L*2+1));
			}
			
			//the space of two column
			this.push('hispace',(W - hw*L)/(L+1));
			
			//use option create a coordinate
			this.coo = iChart.Interface.coordinate2d.call(this);
			
			this.pushComponent(this.coo,true);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				bs = this.coo.get('brushsize'),
				H = this.coo.get('height'),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				gw = hw+this.get('hispace'),
				t,h,text,value;
				
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.width',hw);
			
			for(var i=0;i<L;i++){
				text = this.data[i].name;
				value = this.data[i].value;
				t = text+":"+value;
				h = (this.data[i].value-S.start)*H/S.distance;
				
				if(Le){
					this.push('rectangle.label.text',this.fireString(this,'parseLabelText',[this.data[i],i],t));
				}
				
				if(Te){
					this.push('rectangle.tip.text',this.fireString(this,'parseTipText',[this.data[i],i],t));
				}
				
				text = this.fireString(this,'parseText',[this.data[i],i],text);
				value = this.fireString(this,'parseValue',[this.data[i],i],value);
				
				/**
				 * x = this.x + space*(i+1) + width*i
				 */
				this.push('rectangle.originx',this.x+this.get('hispace')+i*gw);
				/**
				 * y = this.y + brushsize + h
				 */
				this.push('rectangle.originy',this.y + H - h - bs);
				this.push('rectangle.value',value);
				this.push('rectangle.height',h);
				this.push('rectangle.background_color',this.data[i].color);
				this.push('rectangle.id',i);
				this.rectangles.push(new iChart.Rectangle2D(this.get('rectangle'),this));
				this.labels.push(new iChart.Text({
					id:i,
					text:text,
					originx:this.x + this.get('hispace')+gw*i+hw/2,
	 				originy:this.y+H+this.get('text_space')
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
			
		}
		
});