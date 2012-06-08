	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.BarMulti2D
	 * @extend#iChart.Bar
	 */
	iChart.BarMulti2D = iChart.extend(iChart.Bar,{
			/**
			 * initialize the context for the BarMulti2D
			 */
			configure:function(){
				/**
				 * invoked the super class's  configuration
				 */
				iChart.BarMulti2D.superclass.configure.call(this);
				
				this.type = 'barmulti2d';
				
				this.dataType = 'complex';
				
				//this.set({});
				
				//this.registerEvent();
				this.columns = [];
			},
			doConfig:function(){
				iChart.BarMulti2D.superclass.doConfig.call(this);
				
				var L = this.data.length,
					KL= this.columnKeys.length,
					W = this.coo.get('width'),
					H = this.coo.get('height'),
					total = KL*L,
					/**
					 * bar's height
					 */
					bh = this.pushIf('barheight',H/(KL+1+total));
				
				if(bh*L>H){
					bh = this.push('barheight',H/(KL+1+total));
				}
				
				/**
				 * the space of two bar
				 */
				this.push('barspace',(H - bh*total)/(KL+1));
				
				/**
				 * get the max/min scale of this coordinate for calculated the height
				 */
				var S = this.coo.getScale(this.get('keduAlign')),
					gw = L*bh+this.get('barspace'),
					h2 = this.get('barheight')/2,
					w;
				
				this.push('rectangle.height',bh);
				
				this.columns.each(function(column, i) {
					column.item.each(function(d, j) {
						w = (d.value - S.start) * H / S.distance;
						this.doParse(d, j, i+'-'+j, this.x + this.get('hispace')+j*bh+i*gw,this.y + this.get('barspace')+j*bh+i*gw, w);
						d.reference = new iChart.Rectangle2D(this.get('rectangle'), this);
						this.rectangles.push(d.reference);
					}, this);
					
					this.labels.push(new iChart.Text({
						id:i,
						text:column.name,
						textAlign:'right',
						textBaseline:'middle',
						originx:this.x - this.get('text_space'),
		 				originy:this.y + this.get('barspace')*0.5+(i+0.5)*gw
					},this));
					
				}, this);
				
				this.pushComponent(this.labels);
				this.pushComponent(this.rectangles);
			}
			
	});//@end