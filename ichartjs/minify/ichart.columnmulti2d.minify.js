iChart.ColumnMulti2D=iChart.extend(iChart.Column,{configure:function(){iChart.ColumnMulti2D.superclass.configure.call(this);this.type="columnmulti2d";this.dataType="complex";this.columns=[]},doRectangle:function(a,b,c,d,f,e){this.doParse(a,b,c,d,f,e);a.reference=new iChart.Rectangle2D(this.get("rectangle"),this);this.rectangles.push(a.reference)},doConfig:function(){iChart.ColumnMulti2D.superclass.doConfig.call(this);var a=this._(),b=a.data.length,c=a.data_labels.length,d=a.get("coordinate.width"),f=a.get("coordinate.height"),b=c*b,e=a.pushIf("colwidth",d/(c+1+b));e*b>d&&(e=a.push("colwidth",d/(c+1+b)));a.push("hispace",(d-e*b)/(c+1));var h=a.coo.getScale(a.get("scaleAlign")),j=a.coo.get("brushsize"),i=a.data.length*e+a.get("hispace"),g;a.push("rectangle.width",e);a.columns.each(function(b,c){b.item.each(function(b,d){g=(b.value-h.start)*f/h.distance;a.doParse(a,b,d,c+"-"+d,a.x+a.get("hispace")+d*e+c*i,a.y+f-g-j,g);b.reference=new iChart.Rectangle2D(a.get("rectangle"),this);a.rectangles.push(b.reference)},a);a.labels.push(new iChart.Text({id:c,text:b.name,originx:a.x+0.5*a.get("hispace")+(c+0.5)*i,originy:a.get("originy")+f+a.get("text_space")},a))},a);a.components.push(a.labels);a.components.push(a.rectangles)}});