iChart.Column2D=iChart.extend(iChart.Column,{configure:function(){iChart.Column2D.superclass.configure.call(this);this.type="column2d"},doConfig:function(){iChart.Column2D.superclass.doConfig.call(this);var e=this.coo.getScale(this.get("scaleAlign")),g=this.coo.get("brushsize"),c=this.coo.get("height"),h=this.get("hiswidth")/2,f=this.get("hiswidth")+this.get("hispace"),d;this.data.each(function(a,b){d=(a.value-e.start)*c/e.distance;this.doParse(a,b,b,this.x+this.get("hispace")+b*f,this.y+c-d-g,d);a.reference=new iChart.Rectangle2D(this.get("rectangle"),this);this.rectangles.push(a.reference);this.labels.push(new iChart.Text({id:b,text:a.name,originx:this.x+this.get("hispace")+f*b+h,originy:this.y+c+this.get("text_space")},this))},this);this.pushComponent(this.labels);this.pushComponent(this.rectangles)}});