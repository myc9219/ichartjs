/**
 * @overview this component use for abc
 * @component#@chart#iChart.Pie3D
 * @extend#iChart.Pie
 */
iChart.Pie3D = iChart.extend(iChart.Pie, {
	configure : function() {
		/**
		 * invoked the super class's configuration
		 */
		iChart.Pie3D.superclass.configure.apply(this, arguments);

		/**
		 * indicate the legend's type
		 */
		this.type = 'pie3d';
		this.dimension = iChart._3D;

		this.set({
			/**
			 * @cfg {Number} Three-dimensional rotation Z in degree(angle).socpe{0-90}.(default to 45)
			 */
			zRotate : 45,
			/**
			 * @cfg {Number} Specifies the pie's thickness in pixels.(default to 30)
			 */
			yHeight : 30
		});

	},
	doSector : function(d) {
		this.push('sector.cylinder_height', (d.height ? d.height * Math.cos(iChart.angle2Radian(this.get('zRotate'))) : this.get('cylinder_height')));
		var s = new iChart.Sector3D(this.get('sector'), this);
		s.proxy = true;
		return s;
	},
	doConfig : function() {
		iChart.Pie3D.superclass.doConfig.call(this);
		var _ = this, z = _.get('zRotate');
		_.push('zRotate', iChart.between(0, 90, 90 - z));
		_.push('cylinder_height', _.get('yHeight') * Math.cos(iChart.angle2Radian(z)));
		_.push('sector.semi_major_axis', _.r);
		_.push('sector.semi_minor_axis', _.r * z / 90);
		_.push('sector.semi_major_axis', _.r);
		_.push('sector.originy',_.get('originy')-_.get('yHeight')/2);
		_.data.each(function(d, i) {
			_.doParse(d, i);
		}, _);

	_.pushComponent(_.sectors);
	
	_.proxy = new iChart.Custom({
			drawFn : function() {
				this.drawSector();
				/**
				 * draw the labels
				 */
				if (_.get('label.enable')) {
					_.sectors.eachAll(function(s, i) {
						s.label.draw();
					}, _);
				}
			}
	});
	
	var layer = [],PI = Math.PI,PI2=PI*2,a = PI/2,b = PI*1.5,c = _.get('counterclockwise'),
		abs = function(n,f){
			n = Math.abs(n-f);
			return n>PI?PI2-n:n;
		},t='startAngle',d='endAngle';
	
	_.proxy.drawSector = function(){
		/**
		 * paint bottom layer
		 */
		_.sectors.eachAll(function(s, i) {
			_.T.ellipse(s.x, s.y + s.h, s.a, s.b, s.get(t), s.get(d), s.get('f_color'), s.get('border.enable'), s.get('border.width'), s.get('border.color'), s.get('shadow'), s.get('shadow_color'), s.get('shadow_blur'), s.get('shadow_offsetx'), s
					.get('shadow_offsety'), c, true);
		}, _);
		
		layer = [];
		var s,e;
		/**
		 * sort layer
		 */
		_.sectors.eachAll(function(f, i) {
			s = f.get(t);e = f.get(d),fc = $.dark(f.get('f_color'));
			if(c ? (s < a || s > b) : (s > a && s < b)){
				layer.push({g:s,x:f.x,y:f.y,a:f.a,b:f.b,color:fc,h:f.h});
			}
			if(c ? (e > a && e < b) : (e < a || e > b)){
				layer.push({g:e,x:f.x,y:f.y,a:f.a,b:f.b,color:fc,h:f.h});
			}
		}, _);
		/**
		 * realtime sort
		 */
		layer.sort(function(p, q){return abs(p.g,b) - abs(q.g,b)});
		/**
		 * paint inside layer
		 */
		layer.eachAll(function(f, i) {
			_.T.sector3D.layerDraw.call(_.T, f.x, f.y, f.a, f.b, c, f.h, f.g, f.color);
		}, _);
		/**
		 * realtime sort outside layer
		 */
		_.sectors.sort(function(p, q){return abs(q.get(t),a)-abs(p.get(t),a)});
		
		/**
		 * paint outside layer
		 */
		_.sectors.eachAll(function(s, i) {
			_.T.sector3D.sPaint.call(_.T, s.x, s.y, s.a, s.b, s.get(t), s.get(d), false, s.h, s.get('f_color'));
		}, _);
		
		/**
		 * paint top layer
		 */
		_.sectors.eachAll(function(s, i) {
			_.T.ellipse(s.x, s.y, s.a, s.b, s.get(t), s.get(d), s.get('f_color'), s.get('border.enable'), s.get('border.width'), s.get('border.color'), false, 0, 0, 0, 0, false, true);
		}, _);
	}
	_.pushComponent(_.proxy);
}
});// @end
