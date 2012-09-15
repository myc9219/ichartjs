iChart.Pie3D=iChart.extend(iChart.Pie,{configure:function(){iChart.Pie3D.superclass.configure.apply(this,arguments);this.type="pie3d";this.dimension=iChart._3D;this.set({zRotate:45,yHeight:30})},doSector:function(a){this.push("sector.cylinder_height",a.height?a.height*Math.cos(iChart.angle2Radian(this.get("zRotate"))):this.get("cylinder_height"));a=new iChart.Sector3D(this.get("sector"),this);a.proxy=!0;return a},doConfig:function(){iChart.Pie3D.superclass.doConfig.call(this);var a=this,k=a.get("zRotate");a.push("zRotate",iChart.between(0,90,90-k));a.push("cylinder_height",a.get("yHeight")*Math.cos(iChart.angle2Radian(k)));a.push("sector.semi_major_axis",a.r);a.push("sector.semi_minor_axis",a.r*k/90);a.push("sector.semi_major_axis",a.r);a.push("sector.originy",a.get("originy")-a.get("yHeight")/2);a.data.each(function(d,c){a.doParse(d,c)},a);a.components.push(a.sectors);a.proxy=new iChart.Custom({z_index:a.get("z_index"),drawFn:function(){this.drawSector();a.get("label.enable")&&a.sectors.each(function(a){a.label.draw()},a)}});var g=[],h=Math.PI,l=2*h,e=h/2,f=1.5*h,i=a.get("counterclockwise"),j=function(a,c){a=Math.abs(a-c);return a>h?l-a:a};a.proxy.drawSector=function(){a.sectors.each(function(b){a.T.ellipse(b.x,b.y+b.h,b.a,b.b,b.get("startAngle"),b.get("endAngle"),b.get("f_color"),b.get("border.enable"),b.get("border.width"),b.get("border.color"),b.get("shadow"),i,!0)},a);g=[];var d,c;a.sectors.each(function(b){d=b.get("startAngle");c=b.get("endAngle");fc=$.dark(b.get("f_color"));(i?d<e||d>f:d>e&&d<f)&&g.push({g:d,x:b.x,y:b.y,a:b.a,b:b.b,color:fc,h:b.h});(i?c>e&&c<f:c<e||c>f)&&g.push({g:c,x:b.x,y:b.y,a:b.a,b:b.b,color:fc,h:b.h})},a);g.sort(function(b,a){return j(b.g,f)-j(a.g,f)});g.each(function(b){a.T.sector3D.layerDraw.call(a.T,b.x,b.y,b.a,b.b,i,b.h,b.g,b.color)},a);a.sectors.sort(function(a,c){return j(c.get("startAngle"),e)-j(a.get("startAngle"),e)});a.sectors.each(function(b){a.T.sector3D.sPaint.call(a.T,b.x,b.y,b.a,b.b,b.get("startAngle"),b.get("endAngle"),!1,b.h,b.get("f_color"))},a);a.sectors.each(function(b){a.T.ellipse(b.x,b.y,b.a,b.b,b.get("startAngle"),b.get("endAngle"),b.get("f_color"),b.get("border.enable"),b.get("border.width"),b.get("border.color"),!1,!1,!0)},a)};a.components.push(a.proxy)}});