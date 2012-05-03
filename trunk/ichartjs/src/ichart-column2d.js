	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Column2D
	 * @extend#iChart.Column
	 */
	iChart.Column2D = iChart.extend(iChart.Column,{ 
		/**
		 * initialize the context for the Column2D
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Column2D.superclass.configure.call(this);
			
			this.type = 'column2d';
			this.dataType = 'simple';
			
			this.configuration({
				coordinate:{grid_color:'#c4dede',background_color:'#FEFEFE'}
			});
		},
		doConfig:function(){
			iChart.Column2D.superclass.doConfig.call(this);
			//column's width 
			if(!this.get('hiswidth')){
				this.push('hiswidth',this.get('coordinate.width')/(this.data.length*2+1));
			}
			
			if(this.get('hiswidth')*this.data.length>this.get('coordinate.width')){
				this.push('hiswidth',this.get('coordinate.width')/this.data.length/1.2);
			}
			//the space of two column
			this.push('hispace',(this.get('coordinate.width') - this.get('hiswidth')*this.data.length)/(this.data.length+1));
			
			//use option create a coordinate
			this.coo = iChart.Interface.coordinate2d.call(this);
			
			this.pushComponent(this.coo,true);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				bs = this.coo.get('brushsize'),
				H = this.coo.get('height'),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				gw = this.get('hiswidth')+this.get('hispace'),
				t,lt,tt,h,text,value;
				
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.width',this.get('hiswidth'));
			
			for(var i=0;i<this.data.length;i++){
				
				t = this.data[i].name+":"+this.data[i].value;
				
				h = (this.data[i].value-S.start)*H/S.distance;
				
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
				 * x = this.x + space*(i+1) + width*i
				 */
				this.push('rectangle.originx',this.x+this.get('hispace')+i*gw);//+this.get('xAngle_')*this.get('hiswidth')/2
				/**
				 * y = this.y + brushsize + h
				 */
				this.push('rectangle.originy',this.get('originy') + H - h - bs);
				this.push('rectangle.value',value);
				this.push('rectangle.height',h);
				this.push('rectangle.background_color',this.data[i].color);
				this.push('rectangle.id',i);
				this.rectangles.push(new iChart.Rectangle2D(this.get('rectangle'),this));
				this.labels.push(new iChart.Text({
					id:i,
					text:text,
					originx:this.x + this.get('hispace')+gw*i+this.get('hiswidth')/2,
	 				originy:this.y+H+this.get('text_space')
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
			
		}
		
});