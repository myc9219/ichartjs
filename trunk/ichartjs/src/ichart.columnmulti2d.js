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
				L = _.data.length,
				KL= _.data_labels.length,
				W = _.get('coordinate.width'),
				H = _.get('coordinate.height'),
				total = KL*L,
				bw = _.pushIf('colwidth',W/(KL+1+total));
			
			if(bw*total>W){
				bw = _.push('colwidth',W/(KL+1+total));
			}
			
			_.push('hispace',(W - bw*total)/(KL+1));
			
			//get the max/min scale of this coordinate for calculated the height
			var S = _.coo.getScale(_.get('scaleAlign')),
				bs = _.coo.get('brushsize'),
				gw = _.data.length*bw+_.get('hispace'),
				h;
			
			/**
			 * quick config to all rectangle
			 */
			_.push('rectangle.width',bw);
			
			_.columns.each(function(column, i) {
				
				column.item.each(function(d, j) {
					h = (d.value - S.start) * H / S.distance;
					_.doParse(_,d, j, i+'-'+j, _.x + _.get('hispace')+j*bw+i*gw, _.y + H - h - bs, h);
					d.reference = new iChart.Rectangle2D(_.get('rectangle'), this);
					_.rectangles.push(d.reference);
					
				}, _);
				
				_.labels.push(new iChart.Text({
					id:i,
					text:column.name,
					originx:_.x +_.get('hispace')*0.5+(i+0.5)*gw,
	 				originy:_.get('originy')+H+_.get('text_space')
				},_));
				
			}, _);
			
			_.components.push(_.labels);
			_.components.push(_.rectangles);
		}
});//@end