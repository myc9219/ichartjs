/**
 * @overview 扩展Label
 */
iChart.override(iChart.Label,{
	text : function(text) {
		if (text)
			this.push('text', text);
		this.push(this.W, this.T.measureText(this.get('text')) + this.get('hpadding'));
	},
	doDraw : function(_){
		_.localizer(_);
		var p = _.get('line_points'), x = _.labelx + _.get('padding_left'), y = _.labely + _.get('padding_top');
		
		var Q = _.get('quadrantd');
		
		if(Q==1){
			p.push({
				x:_.labelx+_.get(_.W),
				y:_.labely + _.get(_.H)
			});
		}
		
		if(Q==0){
			p.push({
				x:_.labelx,
				y:_.labely + _.get(_.H)
			});
		}
		
		_.T.lineArray(p, _.get('line_thickness'), _.get('border.color'));
		
		_.T.line(_.labelx, _.labely+ _.get(_.H), _.labelx+_.get(_.W), _.labely+ _.get(_.H),_.get('line_thickness'), _.get('border.color'));
		
		_.T.textStyle(_.L, _.O, _.get('fontStyle'));
		
		var textcolor = _.get('color');
		if (_.get('text_with_sign_color')) {
			textcolor = _.get('scolor');
		}
		
		_.T.fillText(_.get('text'), x , y, _.get('textwidth'), textcolor);
	}
});
