iChart.Pie=iChart.extend(iChart.Chart,{configure:function(){iChart.Pie.superclass.configure.call(this);this.type="pie";this.dataType="simple";this.set({radius:0,offsetAngle:0,showpercent:!0,decimalsnum:1,bound_event:"click",customize_layout:!1,counterclockwise:!1,pop_animate:!1,mutex:!1,gradient:!0,increment:void 0,label:{enable:!0,linelength:void 0,padding:5},tip:{enable:!1,border:{width:2,radius:5}}});this.registerEvent("bound","rebound");this.sectors=[]},add:function(b,c,a){if(b=iChart.Pie.superclass.add.call(this,b,c,a))this.calculate(),b.each(function(d,a){d.new_=!0;this.doSector(d,a)},this),this.data.each(function(a,b){if(a.new_)delete a.new_;else{var c=a.name+(this.get("showpercent")?iChart.toPercent(a.value/this.total,this.get("decimalsnum")):"");this.get("label.enable")&&a.reference.label.text(this.fireString(this,"parseLabelText",[a,b],c));this.get("tip.enable")&&a.reference.tip.text(this.fireString(this,"parseTipText",[a,b],c));a.reference.id=b;a.reference.push("startAngle",a.startAngle);a.reference.push("middleAngle",a.middleAngle);a.reference.push("endAngle",a.endAngle);a.reference.push("totalAngle",a.endAngle-a.startAngle)}},this),a?this.animation(this):this.draw()},toggle:function(b){this.data[b].reference.toggle()},bound:function(b){this.data[b].reference.bound()},rebound:function(b){this.data[b].reference.rebound()},doAnimation:function(b,c){var a,d=0,e=this.offsetAngle;this.data.each(function(f){a=f.reference;d=this.animationArithmetic(b,0,a.get("totalAngle"),c);a.push("startAngle",e);a.push("endAngle",e+d);e+=d;a.drawSector()},this)},getSectors:function(){return this.sectors},doParse:function(b,c){var a=this,d=b.name+(a.get("showpercent")?iChart.toPercent(b.value/a.total,a.get("decimalsnum")):"");a.get("label.enable")&&a.push("sector.label.text",a.fireString(a,"parseLabelText",[b,c],d));a.get("tip.enable")&&a.push("sector.tip.text",a.fireString(a,"parseTipText",[b,c],d));a.push("sector.id",c);a.push("sector.name",b.name);a.push("sector.listeners.changed",function(b,c){a.fireEvent(a,c?"bound":"rebound",[a,b.get("name")])});a.push("sector.startAngle",b.startAngle);a.push("sector.middleAngle",b.middleAngle);a.push("sector.endAngle",b.endAngle);a.push("sector.background_color",b.color)},calculate:function(){var b=this.offsetAngle,c=b,a=this.data.length;this.data.each(function(d,e){b+=2*d.value/this.total*Math.PI;e==a-1&&(b=2*Math.PI+this.offsetAngle);d.startAngle=c;d.endAngle=b;d.totalAngle=b-c;d.middleAngle=(c+b)/2;c=b},this)},doConfig:function(){iChart.Pie.superclass.doConfig.call(this);iChart.Assert.gtZero(this.total,"this.total");this.offsetAngle=iChart.angle2Radian(this.get("offsetAngle"));r=this.get("radius");this.calculate();if(0>=r||r>this.get("minDistance")/2)r=this.push("radius",this.get("minDistance")/2);this.r=r;this.pushIf("increment",iChart.lowTo(5,r/8));"left"==this.get("align")?this.push("originx",r+this.get("l_originx")+this.get("offsetx")):"right"==this.get("align")?this.push("originx",this.get("r_originx")-r+this.get("offsetx")):this.push("originx",this.get("centerx")+this.get("offsetx"));this.push("originy",this.get("centery")+this.get("offsety"));this.push("sector",iChart.clone("originx,originy,bound_event,customize_layout,counterclockwise,pop_animate,mutex,shadow,shadow_blur,shadow_offsetx,shadow_offsety,increment,gradient,color_factor,label,tip,border".split(","),this.options))}});