	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.ColumnMulti2D
	 * @extend#iChart.Column
	 */
	iChart.ColumnMulti2D = iChart.extend(iChart.Column,{
		/**
		 * initialize the context for the ColumnMulti2D
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.ColumnMulti2D.superclass.configure.call(this);
			
			this.type = 'columnmulti2d';
			this.dataType = 'complex';
			
			this.set({
				
			});
			//this.registerEvent();
			this.columns = [];
		},
		doAnimation:function(t,d){
			var r,h;
			this.coo.draw();
			for(var i=0;i<this.labels.length;i++){
				this.labels[i].draw();
			}
			for(var i=0;i<this.rectangles.length;i++){
				r = this.rectangles[i]; 
				this.fireEvent(this,'beforeRectangleAnimation',[this,r]);
				h = Math.ceil(this.animationArithmetic(t,0,r.height,d));
				r.push('originy',r.y+(r.height-h));
				r.push('height',h);
				r.drawRectangle();
				this.fireEvent(this,'afterRectangleAnimation',[this,r]);
			}
		},
		doConfig:function(){
			iChart.ColumnMulti2D.superclass.doConfig.call(this);
			
			var total = this.columnKeys.length*this.data.length;
			
			if(!this.get('hiswidth')){
				this.push('hiswidth',this.get('coordinate.width')/(this.columnKeys.length+1+total));
			}
			
			if(this.get('hiswidth')*total>this.get('coordinate.width')){
				this.push('hiswidth',this.get('coordinate.width')/total/1.2);
			}
			
			this.push('hispace',(this.get('coordinate.width') - this.get('hiswidth')*total)/(this.columnKeys.length+1));
			
			//use option create a coordinate
			this.coo = iChart.Interface.coordinate2d.call(this);
						
			this.pushComponent(this.coo,true);
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('keduAlign')),
				bs = this.coo.get('brushsize'),
				H = this.coo.get('height'),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				gw = this.data.length*this.get('hiswidth')+this.get('hispace'),
				item,t,lt,tt,h,text,value;
			
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.width',this.get('hiswidth'));
			
			for(var i=0;i<this.columns.length;i++){
				item  = this.columns[i].item;
				
				text = this.fireEvent(this,'parseText',[this.columns[i],i]);
				text = iChart.isString(text)?text:this.columns[i].name;
				
				for(var j=0;j<item.length;j++){
					h = (item[j].value-S.start)*H/S.distance;
					t = item[j].name+":"+item[j].value;
					if(Le){
						lt = this.fireEvent(this,'parseLabelText',[item[j],i]);
						this.push('rectangle.label.text',iChart.isString(lt)?lt:t);
					}
					if(Te){
						tt = this.fireEvent(this,'parseTipText',[item[j],i]);
						this.push('rectangle.tip.text',iChart.isString(tt)?tt:t);
					}
					
					value = this.fireEvent(this,'parseValue',[item[j],i]);
					value = iChart.isString(value)?value:item[j].value;
					
					/**
					 * x = this.x + space*(i+1) + width*(j+i*length)
					 */
					this.push('rectangle.originx',this.x + this.get('hispace')+j*this.get('hiswidth')+i*gw);//+this.get('xAngle_')*this.get('hiswidth')/2
					/**
					 * y = this.y + brushsize + h
					 */
					this.push('rectangle.originy',this.get('originy') + H - h - bs);
					//this.push('rectangle.text',text);
					this.push('rectangle.value',value);
					this.push('rectangle.height',h);
					this.push('rectangle.background_color',item[j].color);
					this.push('rectangle.id',i+'-'+j);
					
					this.rectangles.push(new iChart.Rectangle2D(this.get('rectangle'),this));
				}
				this.labels.push(new iChart.Text({
					id:i,
					text:text,
					originx:this.x +this.get('hispace')*0.5+(i+0.5)*gw,
	 				originy:this.get('originy')+H+this.get('text_space')
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
		}
		
});