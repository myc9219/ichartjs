iChart.Column=iChart.extend(iChart.Chart,{configure:function(){iChart.Column.superclass.configure.call(this);this.type="column";this.dataType="simple";this.set({coordinate:{},colwidth:void 0,text_space:6,scaleAlign:"left",rectangle:{}});this.registerEvent();this.rectangles=[];this.labels=[];this.labels.ignore=!0},doAnimation:function(a,d){var b,e;this.coo.draw();for(var c=0;c<this.labels.length;c++)this.labels[c].draw();for(c=0;c<this.rectangles.length;c++)b=this.rectangles[c],e=Math.ceil(this.animationArithmetic(a,0,b.height,d)),b.push("originy",b.y+(b.height-e)),b.push("height",e),b.drawRectangle()},getCoordinate:function(){return this.coo},doParse:function(a,d,b,e,c,g){var f=this.get("showpercent")?iChart.toPercent(a.value/this.total,this.get("decimalsnum")):a.value;this.get("tip.enable")&&this.push("rectangle.tip.text",this.fireString(this,"parseTipText",[a,a.value,d],a.name+" "+f));this.push("rectangle.value",f);this.push("rectangle.name",a.name);this.push("rectangle.background_color",a.color);this.push("rectangle.id",b);this.push("rectangle.originx",e);this.push("rectangle.originy",c);this.push("rectangle.height",g)},doConfig:function(){iChart.Column.superclass.doConfig.call(this);iChart.Interface.coordinate.call(this);if("simple"==this.dataType){var a=this.data.length,d=this.get("coordinate.width"),b=this.pushIf("colwidth",d/(2*a+1));b*a>d&&(b=this.push("colwidth",d/(2*a+1)));this.push("hispace",(d-b*a)/(a+1))}this.is3D()&&this.push("zHeight",this.get("colwidth")*this.get("zScale"));this.coo=iChart.Interface.coordinate_.call(this);this.pushComponent(this.coo,!0);iChart.apply(this.get("rectangle"),iChart.clone("shadow,shadow_color,shadow_blur,shadow_offsetx,shadow_offsety,gradient,color_factor,label,tip,border".split(","),this.options));this.push("rectangle.width",this.get("colwidth"))}});