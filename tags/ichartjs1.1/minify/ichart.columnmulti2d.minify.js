iChart.ColumnMulti2D=iChart.extend(iChart.Column,{configure:function(){iChart.ColumnMulti2D.superclass.configure.call(this);this.type="columnmulti2d";this.dataType="complex";this.set({labels:[]})},doEngine:function(a,i,j,f,k,o,l,g,h,m,n){var c;a.columns.each(function(b,d){b.item.each(function(b,e){c=(b.value-f.start)*k/f.distance;a.doParse(a,b,e,{id:d+"_"+e,originx:h+e*(i+l)+d*g,originy:m-(0<c?c:0),height:Math.abs(c)});a.rectangles.push(new iChart[a.sub](a.get("sub_option"),a))},a);a.doLabel(a,d,b.name,h-0.5*j+(d+0.5)*g,n)},a)},doConfig:function(){iChart.ColumnMulti2D.superclass.doConfig.call(this);this.engine(this)}});