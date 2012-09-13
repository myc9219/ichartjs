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
				
				this.columns = [];
			},
			doConfig:function(){
				iChart.BarMulti2D.superclass.doConfig.call(this);
				
				var _ = this._(),L = _.data.length,
					KL= _.data_labels.length,
					W = _.coo.get('width'),
					H = _.coo.get('height'),
					b = 'barheight',
					s = 'barspace',
					total = KL*L,
					/**
					 * bar's height
					 */
					bh = _.pushIf(b,H/(KL+1+total));
				if(bh*L>H){
					bh = _.push(b,H/(KL+1+total));
				}
				/**
				 * the space of two bar
				 */
				_.push(s,(H - bh*total)/(KL+1));
				/**
				 * get the max/min scale of this coordinate for calculated the height
				 */
				var S = _.coo.getScale(_.get('scaleAlign')),
					gw = L*bh+_.get(s),
					h2 = _.get(b)/2,
					w;
				_.push('rectangle.height',bh);
				_.columns.each(function(column, i) {
					column.item.each(function(d, j) {
						w = (d.value - S.start) * W / S.distance;
						_.doParse(_,d, j, i+'-'+j, _.x + _.get('hispace')+j*bh+i*gw,_.y + _.get(s)+j*bh+i*gw, w);
						d.reference = new iChart.Rectangle2D(_.get('rectangle'), _);
						_.rectangles.push(d.reference);
					}, _);
					
					_.labels.push(new iChart.Text({
						id:i,
						text:column.name,
						textAlign:'right',
						textBaseline:'middle',
						originx:_.x - _.get('text_space'),
		 				originy:_.y + _.get(s)*0.5+(i+0.5)*gw
					},_));
					
				}, _);
				
				_.components.push(_.labels);
				_.components.push(_.rectangles);
			}
			
	});//@end