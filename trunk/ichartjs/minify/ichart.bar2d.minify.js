iChart.Bar2D=iChart.extend(iChart.Bar,{configure:function(){iChart.Bar2D.superclass.configure.call(this);this.type="bar2d";this.set({coordinate:{grid_color:"#CDCDCD",background_color:"#FEFEFE"}})},doConfig:function(){iChart.Bar2D.superclass.doConfig.call(this);var c=this.data.length,b=this.get("coordinate.height"),d=this.pushIf("barheight",b/(2*c+1));d*c>b&&(d=this.push("barheight",b/(2*c+1)));this.push("barspace",(b-d*c)/(c+1));this.coo=iChart.Interface.coordinate2d.call(this);this.pushComponent(this.coo,!0);var b=this.coo.getScale(this.get("scaleAlign")),j=this.coo.get("width"),k=this.get("label.enable"),l=this.get("tip.enable"),h=d+this.get("barspace"),g,i,e,f;this.push("rectangle.height",d);this.push("rectangle.valueAlign","right");this.push("rectangle.tipAlign","right");this.push("rectangle.originx",this.x+this.coo.get("brushsize"));for(var a=0;a<c;a++)e=this.data[a].name,f=this.data[a].value,g=e+":"+f,i=(this.data[a].value-b.start)*j/b.distance,k&&this.push("rectangle.label.text",this.fireString(this,"parseLabelText",[this.data[a],a],g)),l&&this.push("rectangle.tip.text",this.fireString(this,"parseTipText",[this.data[a],a],g)),e=this.fireString(this,"parseText",[this.data[a],a],e),f=this.fireString(this,"parseValue",[this.data[a],a],f),this.push("rectangle.originy",this.y+this.get("barspace")+a*h),this.push("rectangle.value",f),this.push("rectangle.width",i),this.push("rectangle.background_color",this.data[a].color),this.push("rectangle.id",a),this.rectangles.push(new iChart.Rectangle2D(this.get("rectangle"),this)),this.labels.push(new iChart.Text({id:a,textAlign:"right",textBaseline:"middle",text:e,originx:this.x-this.get("text_space"),originy:this.y+this.get("barspace")+a*h+d/2},this));this.pushComponent(this.labels);this.pushComponent(this.rectangles)}});