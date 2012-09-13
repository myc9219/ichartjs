	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.ColumnMulti2D
	 * @extend#iChart.Column
	 */
	iChart.ColumnMulti2D = iChart.extend(iChart.Column,{
		/**
		 * initialize the context for the ColumnMulti2D
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.ColumnMulti2D.superclass.configure.call(this);
			
			this.type = 'columnmulti2d';
			this.dataType = 'complex';
			
			//this.set({});
			
			//this.registerEvent();
			this.columns = [];
		},
		doRectangle : function(d, i, id, x, y, h) {
			this.doParse(d, i, id, x, y, h);
			d.reference = new iChart.Rectangle2D(this.get('rectangle'), this);
			this.rectangles.push(d.reference);
		},
		doConfig:function(){
			iChart.ColumnMulti2D.superclass.doConfig.call(this);
			
			var _ = this._(),
				L = this.data.length,
				KL= this.data_labels.length,
				W = this.get('coordinate.width'),
				H = this.get('coordinate.height'),
				total = KL*L,
				bw = this.pushIf('colwidth',W/(KL+1+total));
			
			if(bw*total>W){
				bw = this.push('colwidth',W/(KL+1+total));
			}
			
			this.push('hispace',(W - bw*total)/(KL+1));
			
			//get the max/min scale of this coordinate for calculated the height
			var S = this.coo.getScale(this.get('scaleAlign')),
				bs = this.coo.get('brushsize'),
				gw = this.data.length*bw+this.get('hispace'),
				h;
			
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.width',bw);
			
			this.columns.each(function(column, i) {
				
				column.item.each(function(d, j) {
					h = (d.value - S.start) * H / S.distance;
					this.doParse(_,d, j, i+'-'+j, this.x + this.get('hispace')+j*bw+i*gw, this.y + H - h - bs, h);
					d.reference = new iChart.Rectangle2D(this.get('rectangle'), this);
					this.rectangles.push(d.reference);
					
				}, this);
				
				this.labels.push(new iChart.Text({
					id:i,
					text:column.name,
					originx:this.x +this.get('hispace')*0.5+(i+0.5)*gw,
	 				originy:this.get('originy')+H+this.get('text_space')
				},this));
				
			}, this);
			
			this.components.push(this.labels);
			this.components.push(this.rectangles);
		}
});//@end