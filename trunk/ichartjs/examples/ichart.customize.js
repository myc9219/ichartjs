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

/*!
 * ichartjs sign Plugin
 * version: 1.0
 * @requires ichartjs v1.0 or later
 * @site http://www.ichartjs.com/
 * @author wanghe
 * @Copyright 2012 
 * wanghetommy@gmail.com 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
;
(function($) {
	var sign_fn = function(T, si, x, y, size, color) {
		if(si=='bar'){
			T.box(x-size / 2, y - size / 4, size, size / 2, 0, color);return true;
		}else if(si=='square'){
			T.box(x-size / 2, y - size/ 2, size, size, 0, color);return true;
		}else if(si=='square-hollow'){
			T.box(x-size / 2, y - size/ 2, size, size, 0, color);
			T.box(x-size / 4, y - size/ 4, size/2, size/2, 0, this.get('hollow_color')||'#FEFEFE');
			return true;
		}else if (si == 'round') {
			this.T.round(x, y, size / 2, color);
			return true;
		}else if (si == 'round-hollow') {
			this.T.round(x, y, size*3/8,this.get('hollow_color')||'#FEFEFE',size/4,color);
			return true;
		} else if (si == 'round-bar') {
			this.T.box(x-size/2, y - size / 12, size, size / 6, 0, color);
			this.T.round(x, y, size / 3, color);
			return true;
		} else if (si == 'square-bar') {
			this.T.box(x-size/2, y - size / 12, size, size / 6, 0, color);
			this.T.box(x - size / 4, y - size / 4, size / 2, size / 2, 0, color);return true;
		}else if (si == 'square-bar') {
			this.T.box(x-size/2, y - size / 12, size, size / 6, 0, color);
			this.T.box(x - size / 4, y - size / 4, size / 2, size / 2, 0, color);return true;
		}else if (si == 'rectangle') {
			var border = this.get('sign_border') || this.get('border');
			if(border){
				border = iChart.clone(border);	
				border.radius = border.radius?border.radius/2:0; 
			}
			T.box(x-size / 2, y - size*3 / 8-2, size*1.5, size*3/4 ,border, color);return true;
		}
		return false;

	}

	$.Legend.plugin('sign', sign_fn);
	
})(iChart);
var power = {
	"0":"°",
	"1":"¹",
	"2":"²",
	"3":"³",
	"4":"⁴",
	"5":"⁵",
	"6":"⁶",
	"7":"⁷",
	"8":"⁸",
	"9":"⁹",
	"(":"⁽",
	")":"⁾",
	"+":"⁺",
	"-":"⁻",
	"=":"⁼"
}
var superscript = {
	"0":"₀",
	"1":"₁",
	"2":"₂",
	"3":"₃",
	"4":"₄",
	"5":"₅",
	"6":"₆",
	"7":"₇",
	"8":"₈",
	"9":"₉",
	"(":"₍",
	")":"₎",
	"+":"₊",
	"-":"₋",
	"=":"₌ "	
}
