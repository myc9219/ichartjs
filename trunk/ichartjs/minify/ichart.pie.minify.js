iChart.Pie=iChart.extend(iChart.Chart,{configure:function(){iChart.Pie.superclass.configure.call(this);this.type="pie";this.dataType="simple";this.set({radius:0,offsetAngle:0,bound_event:"click",counterclockwise:!1,intellectLayout:!0,pop_animate:!1,mutex:!1,increment:void 0,label:{enable:!0},sector:{}});this.registerEvent("bound","rebound","parseLabelText");this.sectors=[]},add:function(a,c,b){if(a=iChart.Pie.superclass.add.call(this,a,c,b))this.calculate(),a.each(function(a,b){a.new_=!0;this.doSector(a,b)},this),this.data.each(function(a,b){if(a.new_)delete a.new_;else{var c=a.name+(this.get("showpercent")?iChart.toPercent(a.value/this.total,this.get("decimalsnum")):"");this.get("label.enable")&&a.reference.label.text(this.fireString(this,"parseLabelText",[a,b],c));this.get("tip.enable")&&a.reference.tip.text(this.fireString(this,"parseTipText",[a,b],c));a.reference.id=b;a.reference.push("startAngle",a.startAngle);a.reference.push("middleAngle",a.middleAngle);a.reference.push("endAngle",a.endAngle);a.reference.push("totalAngle",a.endAngle-a.startAngle)}},this),b?this.animation(this):this.draw()},toggle:function(a){this.data[a||0].reference.toggle()},bound:function(a){this.data[a||0].reference.bound()},rebound:function(a){this.data[a||0].reference.rebound()},getSectors:function(){return this.sectors},doAnimation:function(a,c){var b,d=0,e=this.offsetAngle;this.data.each(function(f){b=f.reference;d=this.animationArithmetic(a,0,b.get("totalAngle"),c);b.push("startAngle",e);b.push("endAngle",e+d);e+=d;b.drawSector()},this)},localizer:function(a){this.sectors.each(function(c){var c=c.label,b=c.labelx,d=c.labely;if(a.labely<=d&&d-a.labely<a.get("height")||a.labely>d&&a.labely-d<c.get("height"))if(a.labelx<b&&b-a.labelx<a.get("width")||a.labelx>b&&a.labelx-b<c.get("width"))b=a.get("quadrantd"),2==b||3==b||a.labely<d?a.push("labely",a.get("labely")-a.get("height")+d-a.labely-2):a.push("labely",a.get("labely")+c.get("height")-a.labely+d+2),a.push("line_potins",a.get("line_potins").concat(a.get("labelx"),a.get("labely"))),a.localizer()},this)},doParse:function(a,c){var b=this,d=a.name+(b.get("showpercent")?" "+iChart.toPercent(a.value/b.total,b.get("decimalsnum")):a.value);b.get("label.enable")&&b.push("sector.label.text",b.fireString(b,"parseLabelText",[a,c],d));b.get("tip.enable")&&b.push("sector.tip.text",b.fireString(b,"parseTipText",[a,c],d));b.push("sector.id",c);b.push("sector.value",a.value);b.push("sector.name",a.name);b.push("sector.listeners.changed",function(a,c){b.fireEvent(b,c?"bound":"rebound",[b,a.get("name")])});b.push("sector.startAngle",a.startAngle);b.push("sector.middleAngle",a.middleAngle);b.push("sector.endAngle",a.endAngle);b.push("sector.background_color",a.color);a.reference=this.doSector(a);this.sectors.push(a.reference);this.get("label.enable")&&this.get("intellectLayout")&&this.localizer(a.reference.label)},calculate:function(){var a=this.offsetAngle,c=a,b=this.data.length;this.data.each(function(d,e){a+=2*d.value/this.total*Math.PI;e==b-1&&(a=2*Math.PI+this.offsetAngle);d.startAngle=c;d.endAngle=a;d.totalAngle=a-c;d.middleAngle=(c+a)/2;c=a},this)},doConfig:function(){iChart.Pie.superclass.doConfig.call(this);iChart.Assert.gtZero(this.total,"this.total");this.offsetAngle=iChart.angle2Radian(this.get("offsetAngle"));var a=this.get("radius"),c=this.get("minDistance")*(this.get("label.enable")&&!this.is3D()?0.35:0.5);this.calculate();if(0>=a||a>c)a=this.push("radius",Math.floor(c));this.r=a;this.pushIf("increment",iChart.lowTo(5,a/8));"left"==this.get("align")?this.push("originx",a+this.get("l_originx")+this.get("offsetx")):"right"==this.get("align")?this.push("originx",this.get("r_originx")-a+this.get("offsetx")):this.push("originx",this.get("centerx")+this.get("offsetx"));this.push("originy",this.get("centery")+this.get("offsety"));iChart.apply(this.get("sector"),iChart.clone("originx,originy,bound_event,customize_layout,counterclockwise,pop_animate,mutex,shadow,shadow_color,shadow_blur,shadow_offsetx,shadow_offsety,increment,gradient,color_factor,label,tip,border".split(","),this.options))}});