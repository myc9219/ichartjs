iChart.Pie3D=iChart.extend(iChart.Pie,{configure:function(){iChart.Pie3D.superclass.configure.apply(this,arguments);this.type="pie3d";this.dimension=iChart._3D;this.set({zRotate:45,yHeight:30});this.positive=!0},doSector:function(b,c){b.push("sub_option.cylinder_height",c.cylinder_height?c.cylinder_height*b.get("zRotate"):b.get("cylinder_height"));return new iChart[b.sub](b.get("sub_option"),b)},one:function(b){var c,d,i=[],f=b.get("counterclockwise"),h=function(a,b){return 1+Math.sin(b?a+Math.PI:a)},g;lay=function(a,b,d,e){g=iChart.quadrantd(b);(a&&(0==g||3==g)||!a&&(2==g||1==g))&&c.push({g:b,z:b==d,x:e.x,y:e.y,a:e.a,b:e.b,color:iChart.dark(e.get("background_color")),h:e.h,F:e})};b.proxy=new iChart.Custom({z_index:b.get("z_index")+1,drawFn:function(){this.drawSector();i=[];b.sectors.each(function(a){a.get("label")&&(a.expanded?i.push(a.label):a.label.draw())});i.each(function(a){a.draw()})}});b.proxy.drawSector=function(){b.sectors.each(function(a){b.T.ellipse(a.x,a.y+a.h,a.a,a.b,a.get("startAngle"),a.get("endAngle"),0,a.get("border.enable"),a.get("border.width"),a.get("border.color"),a.get("shadow"),f,!0)},b);c=[];d=[];b.sectors.each(function(a){lay(f,a.get("startAngle"),a.get("endAngle"),a);lay(!f,a.get("endAngle"),a.get("startAngle"),a);d=d.concat(iChart.visible(a.get("startAngle"),a.get("endAngle"),a))},b);c.sor(function(a,b){var c=h(a.g)-h(b.g);return 0==c?a.z:0<c});c.each(function(a){b.T.sector3D.layerDraw.call(b.T,a.x,a.y,a.a+0.5,a.b+0.5,f,a.h,a.g,a.color)},b);b.processAnimation||d.sor(function(a,b){return 0>h((a.s+a.e)/2,1)-h((b.s+b.e)/2,1)});d.each(function(a){b.T.sector3D.sPaint.call(b.T,a.f.x,a.f.y,a.f.a,a.f.b,a.s,a.e,f,a.f.h,a.f.get("f_color"))},b);b.sectors.each(function(a){b.T.ellipse(a.x,a.y,a.a,a.b,a.get("startAngle"),a.get("endAngle"),a.get("f_color"),a.get("border.enable"),a.get("border.width"),a.get("border.color"),!1,!1,!0)},b)};b.one=$.emptyFn},doConfig:function(){iChart.Pie3D.superclass.doConfig.call(this);var b=this._(),c=iChart.angle2Radian(b.get("zRotate"));b.push("cylinder_height",b.get("yHeight")*b.push("zRotate",Math.abs(Math.cos(c))));b.a=b.push("sub_option.semi_major_axis",b.r);b.b=b.push("sub_option.semi_minor_axis",b.r*Math.abs(Math.sin(c)));b.topY=b.push("sub_option.originy",b.get(b.Y)-b.get("yHeight")/2);b.parse(b);b.one(b);b.components.push(b.proxy)}});