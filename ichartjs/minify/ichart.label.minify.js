iChart.Label=iChart.extend(iChart.Component,{configure:function(){iChart.Label.superclass.configure.apply(this,arguments);this.type="label";this.set({text:"",line_height:12,line_thickness:1,sign:"square",sign_size:12,padding:"2 5",offsety:2,sign_space:5,background_color:"#efefef",text_with_sign_color:!1});this.atomic=!0;this.registerEvent()},isEventValid:function(a){return{valid:iChart.inRange(this.labelx,this.labelx+this.get("width"),a.x)&&iChart.inRange(this.labely,this.labely+this.get("height"),a.y)}},text:function(a){a&&this.push("text",a);this.push("width",this.T.measureText(this.get("text"))+this.get("hpadding")+this.get("sign_size")+this.get("sign_space"))},localizer:function(){var a=this.get("quadrantd");this.labelx=1<=a&&2>=a?this.get("labelx")-this.get("width"):this.get("labelx");this.labely=2<=a?this.get("labely")-this.get("height"):this.get("labely")},doLayout:function(a,c){var b=this._();b.push("labelx",b.get("labelx")+a);b.push("labely",b.get("labely")+c);b.get("line_points").each(function(b){b.x+=a;b.y+=c},b)},doDraw:function(){var a=this._();a.localizer();var c=a.get("line_points"),b=a.get("sign_size"),d=a.labelx+a.get("padding_left"),e=a.labely+a.get("padding_top");a.T.lineArray(c,a.get("line_thickness"),a.get("border.color"));a.T.box(a.labelx,a.labely,a.get("width"),a.get("height"),a.get("border"),a.get("f_color"),!1,a.get("shadow"),a.get("shadow_color"),a.get("shadow_blur"),a.get("shadow_offsetx"),a.get("shadow_offsety"));a.T.textStyle("left","top",a.get("fontStyle"));c=a.get("color");a.get("text_with_sign_color")&&(c=a.get("scolor"));"square"==a.get("sign")?a.T.box(d,e,b,b,0,a.get("scolor")):a.T.round(d+b/2,e+b/2,b/2,a.get("scolor"));a.T.fillText(a.get("text"),d+b+a.get("sign_space"),e,a.get("textwidth"),c)},doConfig:function(){iChart.Label.superclass.doConfig.call(this);var a=this._();a.T.textFont(a.get("fontStyle"));a.get("fontsize")>a.get("line_height")&&a.push("line_height",a.get("fontsize"));a.push("height",a.get("line_height")+a.get("vpadding"));a.text();a.localizer()}});