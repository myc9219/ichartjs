/**
 * @overview this class is abstract,use for config column
 * @component#iChart.Gauge2D
 * @extend#iChart.Chart
 */
iChart.Gauge2D = iChart.extend(iChart.Chart, {
	/**
	 * initialize the context for the Column
	 */
	configure : function(config) {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Gauge2D.superclass.configure.call(this);

		this.type = 'gauge2d';
		
		this.set({
			/**
			 * @cfg {Float/String} Specifies the gauge's radius.If given a percentage,it will relative to minDistance.(default to '100%')
			 */
			radius : '100%',
			/**
			 * @cfg {Number} By default,if a width is not specified the chart will attempt to distribution in horizontally.(default to undefined)
			 */
			upperLimit : 120,
			/**
			 * @cfg {Number} the space of each column.this option is readOnly.(default to undefined)
			 */
			lowerLimit : undefined,
			/**
			 * @cfg {Number} the distance of column's bottom and text(default to 6)
			 */
			text_space : 6
		});
		//obj.Set('chart.colors.ranges', [[0, 60, 'green'],[60, 80 'yellow'],[80, 100, 'red']]);
		//needle.radius,needle.linewidth,type
		//Gauge?
		//centerpin radius color
	},
	doAnimation : function(t, d,_) {
		
	},
	doLabel:function(_,id,text,x, y){
		_.labels.push(new iChart.Text(iChart.apply(_.get('label'),{
			id : id,
			text : text,
			originx : x,
			originy : y
		}), _));
	},
	doParse : function(_,d, i, o) {
		_.doActing(_,d,o,i);
	},
	doConfig : function() {
		iChart.Gauge2D.superclass.doConfig.call(this);
		var _ = this._(),f = Math.floor(_.get('minDistance') * 0.9),r = iChart.parsePercent(_.get('radius'),f);
		
		
	}

});
/**
 * @end
 */