	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.BarMulti2D
	 * @extend#iChart.Bar
	 */
	iChart.BarMulti2D = iChart.extend(iChart.Bar,{
			/**
			 * initialize the context for the BarMulti2D
			 */
			configure:function(config){
				/**
				 * invoked the super class's  configuration
				 */
				iChart.BarMulti2D.superclass.configure.call(this);
				
				this.type = 'barmulti2d';
				
				this.dataType = 'complex';
				
				this.configuration({
					
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
				iChart.BarMulti2D.superclass.doConfig.call(this);
				
				var total = this.columnKeys.length*this.data.length;
				
				
				this.push('barspace',(this.get('coordinate.width') - this.get('barheight')*total)/(this.columnKeys.length+1));
				
				//bar's height 
				if(!this.get('barheight')){
					this.push('barheight',this.get('coordinate.height')/(this.columnKeys.length+1+total));
				}
				
				if(this.get('barheight')*this.data.length>this.get('coordinate.height')){
					this.push('barheight',this.get('coordinate.height')/this.data.length/1.2);
				}
				//the space of two bar
				this.push('barspace',(this.get('coordinate.height') - this.get('barheight')*total)/(this.columnKeys.length+1));
				
				
				//use option create a coordinate
				this.coo = iChart.Interface.coordinate2d.call(this);
							
				this.pushComponent(this.coo,true);
				
				//get the max/min scale of this coordinate for calculated the height
				var S = this.coo.getScale(this.get('keduAlign')),
					bs = this.coo.get('brushsize'),
					W = this.coo.get('width'),
					Le = this.get('label.enable'),
					Te = this.get('tip.enable'),
					gw = this.data.length*this.get('barheight')+this.get('barspace'),
					item,t,lt,tt,w,text,value;
				
				/**
				 * quick config to all rectangle
				 */
				this.push('rectangle.height',this.get('barheight'));
				this.push('rectangle.originx',this.x + this.coo.get('brushsize'));
				this.push('rectangle.valueAlign','right');
				this.push('rectangle.tipAlign','right');
				
				for(var i=0;i<this.columns.length;i++){
					item  = this.columns[i].item;
					
					text = this.fireEvent(this,'parseText',[this.columns[i],i]);
					text = iChart.isString(text)?text:this.columns[i].name;
					
					for(var j=0;j<item.length;j++){
						w = (item[j].value-S.start)*W/S.distance;
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
						 * y = this.y + brushsize + h
						 */
						this.push('rectangle.originy',this.y + this.get('barspace')+j*this.get('barheight')+i*gw);
						
						this.push('rectangle.value',value);
						this.push('rectangle.width',w);
						this.push('rectangle.background_color',item[j].color);
						this.push('rectangle.id',i+'-'+j);
						
						this.rectangles.push(new iChart.Rectangle2D(this.get('rectangle'),this));
					}
					this.labels.push(new iChart.Text({
						id:i,
						text:text,
						textAlign:'right',
						textBaseline:'middle',
						originx:this.x - this.get('text_space'),
		 				originy:this.y + this.get('barspace')*0.5+(i+0.5)*gw
					},this));
				}
				this.pushComponent(this.labels);
				this.pushComponent(this.rectangles);
			}
			
	});