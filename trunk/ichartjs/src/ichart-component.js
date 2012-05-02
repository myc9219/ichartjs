/**
 * @overview this component use for abc
 * @component#iChart.Component
 * @extend#iChart.Painter
 */
iChart.Component = iChart.extend(iChart.Painter, {

	configure : function(c) {
		/**
		 * indicate the module's type
		 */
		this.type = 'component';

		this.configuration({
			/**
			 * @cfg {Boolean} indicate whether there has a effect of color gradient
			 */
			gradient : true
		});

		this.inject(c);
		/**
		 * register the common event
		 */
		// this.registerEvent();
	this.autoInitialized = true;

	this.final_parameter = {};

},
initialize : function() {
	if (!this.preventEvent)
		/**
		 * define interface method
		 */
		iChart.DefineAbstract('isEventValid', this);

	iChart.DefineAbstract('doDraw', this);

	this.doConfig();
	this.initialization = true;
},
doConfig : function() {
	iChart.Component.superclass.doConfig.call(this);
	/**
	 * originx
	 */
	this.x = this.get('originx');
	/**
	 * 
	 * originy
	 */
	this.y = this.get('originy');
	/**
	 * if have evaluate it
	 */
	this.data = this.get('data');

	if (this.is3D()) {
		iChart.Interface._3D.call(this);
	}

	if (this.get('tip.enable')) {
		if (!this.get('tip.border.color'))
			/**
			 * make tip's border in accord with sector
			 */
			this.push('tip.border.color', this.get('background_color'));

		if (!iChart.isFunction(this.get('tip.invokeOffset')))
			/**
			 * indicate the tip must calculate position
			 */
			this.push('tip.invokeOffset', this.tipInvoke());
	}

},
isMouseOver : function(e) {
	return this.isEventValid(e);
},
redraw : function() {
	this.container.draw();
},
commonDraw : function(opts) {
	// this.target.save();
	// 转换中心坐标至当前目标坐标中心
	// this.target.ctx.translate(this.x,this.y);
	/**
	 * execute the doDraw() that the subClass implement
	 */
	this.doDraw.call(this, opts);

	// this.target.restore();

},
inject : function(c) {
	if (c) {
		this.container = c;
		this.target = c.target;
	}
},
getC : function(name) {
	return this.container.get(name);
},
getContainer : function() {
	return this.container;
}

});