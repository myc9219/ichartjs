iChart.Scale=iChart.extend(iChart.Component,{configure:function(){iChart.Scale.superclass.configure.apply(this,arguments);this.type="scale";this.set({which:"h",distance:void 0,start_scale:0,end_scale:void 0,min_scale:void 0,max_scale:void 0,scale:void 0,scale_share:5,scale_line_enable:!0,scale_size:1,scale_width:4,scale_color:"#333333",scaleAlign:"center",labels:[],scale2grid:!0,text_height:16,text_space:4,textAlign:"left",decimalsnum:0,join_style:"none",join_size:2,label:"",label_position:""});this.registerEvent("parseText");this.items=[];this.number=0},isEventValid:function(){return{valid:!1}},doDraw:function(){var c=y=x0=y0=tx=ty=0,a=this.get("scale_width"),f=a/2,e=this.get("scaleAlign"),b=this.get("textAlign"),d=this.get("text_space");this.isHorizontal?("top"==e?y=-a:"center"==e?(y=-f,y0=f):y0=a,this.T.textAlign("center"),"top"==b)?(ty=-d,this.T.textBaseline("bottom")):(ty=d,this.T.textBaseline("top")):("left"==e?c=-a:"center"==e?(c=-f,x0=f):x0=a,this.T.textBaseline("middle"),"right"==b)?(this.T.textAlign("left"),tx=d):(this.T.textAlign("right"),tx=-d);this.T.textFont(this.get("fontStyle"));for(a=0;a<this.items.length;a++)this.get("scale_line_enable")&&this.T.line(this.items[a].x+c,this.items[a].y+y,this.items[a].x+x0,this.items[a].y+y0,this.get("scale_size"),this.get("scale_color"),!1),this.T.fillText(this.items[a].text,this.items[a].textX+tx,this.items[a].textY+ty,!1,this.get("color"),"lr",this.get("text_height"))},doConfig:function(){iChart.Scale.superclass.doConfig.call(this);iChart.Assert.isNumber(this.get("distance"),"distance");var c=this.get("labels").length,a=this.get("min_scale"),f=this.get("max_scale"),e=this.get("scale"),b=this.get("end_scale"),d=this.get("start_scale");if(0<c)this.number=c-1;else{iChart.Assert.isTrue(iChart.isNumber(f)||iChart.isNumber(b),"max_scale&end_scale");if(!b||b<f)b=this.push("end_scale",iChart.ceil(f));d>a&&this.push("start_scale",iChart.floor(a));e&&e<b-d&&this.push("scale_share",(b-d)/e);if(!e||e>b-d)e=this.push("scale",(b-d)/this.get("scale_share"));this.number=this.get("scale_share")}this.push("distanceOne",this.get("valid_distance")/this.number);var f=0,h;this.T.textFont(this.get("fontStyle"));this.push("which",this.get("which").toLowerCase());this.isHorizontal="h"==this.get("which");for(var g=0;g<=this.number;g++)a=c?this.get("labels")[g]:(e*g+d).toFixed(this.get("decimalsnum")),b=this.isHorizontal?this.get("valid_x")+g*this.get("distanceOne"):this.x,h=this.isHorizontal?this.y:this.get("valid_y")+this.get("distance")-g*this.get("distanceOne"),this.items.push(iChart.merge({text:a,x:b,y:h,textX:b,textY:h},this.fireEvent(this,"parseText",[a,b,h,g]))),f=Math.max(f,this.T.measureText(a));this.left=this.right=this.top=this.bottom=0;ts=this.get("text_space");ta=this.get("textAlign");sa=this.get("scaleAlign");w=this.get("scale_width");w2=w/2;this.isHorizontal?(this.top="top"==sa?w:"center"==sa?w2:0,this.bottom=w-this.top,"top"==ta?this.top+=this.get("text_height")+ts:this.bottom+=this.get("text_height")+ts):(this.left="left"==sa?w:"center"==sa?w2:0,this.right=w-this.left,"left"==ta?this.left+=f+ts:this.right+=f+ts)}});iChart.Coordinate2D=iChart.extend(iChart.Component,{configure:function(){iChart.Coordinate2D.superclass.configure.apply(this,arguments);this.type="coordinate2d";this.set({sign_size:12,sign_space:5,scale:[],valid_width:void 0,valid_height:void 0,grid_line_width:1,grid_color:"#c4dede",gridlinesVisible:!0,scale2grid:!0,grids:void 0,ignoreOverlap:!0,ignoreEdge:!1,gradient:!1,ylabel:"",xlabel:"",color_factor:0.18,background_color:"#FEFEFE",alternate_color:!0,crosshair:{enable:!1},width:void 0,height:void 0,axis:{enable:!0,color:"#666666",width:1,style:""}});this.registerEvent();this.scale=[];this.gridlines=[]},getScale:function(c){for(var a=0;a<this.scale.length;a++){var f=this.scale[a];if(f.get("position")==c)return{start:f.get("start_scale"),end:f.get("end_scale"),distance:f.get("end_scale")-f.get("start_scale")}}return{start:0,end:0,distance:0}},isEventValid:function(c){return{valid:c.offsetX>this.x&&c.offsetX<this.x+this.get("width")&&c.offsetY<this.y+this.get("height")&&c.offsetY>this.y}},doDraw:function(){this.T.rectangle(this.x,this.y,this.get("width"),this.get("height"),this.get("fill_color"),this.get("axis.enable"),this.get("axis.width"),this.get("axis.color"),this.get("shadow"),this.get("shadow_color"),this.get("shadow_blur"),this.get("shadow_offsetx"),this.get("shadow_offsety"));if(this.get("alternate_color")){var c,a=!1,f=[0,0,0,0],e=iChart.dark(this.get("background_color"),0.04);this.get("axis.enable")&&(f=this.get("axis.width"))}for(var b=this.gridlines,d=0;d<b.length;d++)b[d].x1=Math.round(b[d].x1),b[d].y1=Math.round(b[d].y1),b[d].x2=Math.round(b[d].x2),b[d].y2=Math.round(b[d].y2),this.get("alternate_color")&&b[d].y1==b[d].y2&&(a&&this.T.rectangle(b[d].x1+f[3],b[d].y1+this.get("grid_line_width"),b[d].x2-b[d].x1-f[3]-f[1],c-b[d].y1-this.get("grid_line_width"),e),c=b[d].y1,a=!a),this.T.line(b[d].x1,b[d].y1,b[d].x2,b[d].y2,this.get("grid_line_width"),this.get("grid_color"));for(d=0;d<this.scale.length;d++)this.scale[d].draw()},doConfig:function(){iChart.Coordinate2D.superclass.doConfig.call(this);iChart.Assert.isNumber(this.get("width"),"width");iChart.Assert.isNumber(this.get("height"),"height");this.on("mouseover",function(){this.T.css("cursor","default")});(!this.get("valid_width")||this.get("valid_width")>this.get("width"))&&this.push("valid_width",this.get("width"));(!this.get("valid_height")||this.get("valid_height")>this.get("height"))&&this.push("valid_height",this.get("height"));this.get("gradient")&&iChart.isString(this.get("background_color"))&&this.push("fill_color",this.T.avgLinearGradient(this.x,this.y,this.x,this.y+this.get("height"),[this.get("dark_color"),this.get("light_color")]));if(this.get("axis.enable")){var c=this.get("axis.width");iChart.isArray(c)||this.push("axis.width",[c,c,c,c])}this.get("crosshair.enable")&&(this.push("crosshair.wrap",this.container.shell),this.push("crosshair.height",this.get("height")),this.push("crosshair.width",this.get("width")),this.push("crosshair.top",this.y),this.push("crosshair.left",this.x),this.crosshair=new iChart.CrossHair(this.get("crosshair"),this));var a,f,e=!(!this.get("gridlinesVisible")||!this.get("grids")),c=e&&!!this.get("grids.horizontal"),b=e&&!!this.get("grids.vertical"),d=this.get("height"),h=this.get("width"),g=this.get("valid_width"),j=this.get("valid_height"),i=this.get("gridlinesVisible")&&this.get("scale2grid")&&!(c&&b),l=(h-g)/2;sh=(d-j)/2;axis=this.get("axis.width");iChart.isArray(this.get("scale"))||(iChart.isObject(this.get("scale"))?this.push("scale",[this.get("scale")]):this.push("scale",[]));for(e=0;e<this.get("scale").length;e++)a=this.get("scale")[e],f=(f=a.position)||"left",f=f.toLowerCase(),a.originx=this.x,a.originy=this.y,a.valid_x=this.x+l,a.valid_y=this.y+sh,a.position=f,"top"==f?(a.which="h",a.distance=h,a.valid_distance=g):"right"==f?(a.which="v",a.distance=d,a.valid_distance=j,a.originx+=h,a.valid_x+=g):"bottom"==f?(a.which="h",a.distance=h,a.valid_distance=g,a.originy+=d,a.valid_y+=j):(a.which="v",a.distance=d,a.valid_distance=j),this.scale.push(new iChart.Scale(a,this.container));if(a=this.push("ignoreOverlap",this.get("ignoreOverlap")&&this.get("axis.enable")||this.get("ignoreEdge")))var k=this.get("ignoreEdge")?function(a,b,c){return a=="v"?c==this.y||c==this.y+d:b==this.x||b==this.x+a}:function(a,b,c){return a=="v"?c==this.y&&axis[0]>0||c==this.y+d&&axis[2]>0:b==this.x&&axis[3]>0||b==this.x+h&&axis[1]>0};if(i)for(e=0;e<this.scale.length;e++)if(i=this.scale[e],!iChart.isFalse(i.get("scale2grid"))&&!(c&&"v"==i.get("which")||b&&"h"==i.get("which"))){f=g=0;"top"==i.get("position")?g=d:"right"==i.get("position")?f=-h:"bottom"==i.get("position")?g=-d:f=h;for(j=0;j<i.items.length;j++)(!a||!k.call(this,i.get("which"),i.items[j].x,i.items[j].y))&&this.gridlines.push({x1:i.items[j].x,y1:i.items[j].y,x2:i.items[j].x+f,y2:i.items[j].y+g})}if(b){e=this.get("grids.vertical");iChart.Assert.gtZero(e.value,"value");b=h/e.value;i=e.value;"given_value"==e.way&&(i=b,b=e.value,b=b>h?h:b);for(e=0;e<=i;e++)(!a||!k.call(this,"h",this.x+e*b,this.y))&&this.gridlines.push({x1:this.x+e*b,y1:this.y,x2:this.x+e*b,y2:this.y+d})}if(c){c=this.get("grids.horizontal");iChart.Assert.gtZero(c.value,"value");b=d/c.value;i=c.value;"given_value"==c.way&&(i=b,b=c.value,b=b>d?d:b);for(e=0;e<=i;e++)(!a||!k.call(this,"v",this.x,this.y+e*b))&&this.gridlines.push({x1:this.x,y1:this.y+e*b,x2:this.x+h,y2:this.y+e*b})}}});iChart.Coordinate3D=iChart.extend(iChart.Coordinate2D,{configure:function(){iChart.Coordinate3D.superclass.configure.apply(this,arguments);this.type="coordinate3d";this.dimension=iChart._3D;this.set({xAngle:60,yAngle:20,xAngle_:void 0,yAngle_:void 0,zHeight:0,pedestal_height:22,board_deep:20,gradient:!0,ignoreEdge:!0,alternate_color:!1,shadow:!0,grid_color:"#7a8d44",background_color:"#d6dbd2",shadow_offsetx:4,shadow_offsety:2,wall_style:[],axis:{enable:!1}})},doDraw:function(){var c=this.get("width"),a=this.get("height"),f=this.get("xAngle_"),e=this.get("yAngle_"),b=this.get("zHeight"),d=f*b,h=e*b,g=this.gridlines;this.T.cube3D(this.x,this.y+a+this.get("pedestal_height"),f,e,!1,c,this.get("pedestal_height"),3*b/2,this.get("axis.enable"),this.get("axis.width"),this.get("axis.color"),this.get("bottom_style"));this.T.cube3D(this.x+this.get("board_deep")*f,this.y+a-this.get("board_deep")*e,f,e,!1,c,a,b,this.get("axis.enable"),this.get("axis.width"),this.get("axis.color"),this.get("board_style"));this.T.cube3D(this.x,this.y+a,f,e,!1,c,a,b,this.get("axis.enable"),this.get("axis.width"),this.get("axis.color"),this.get("wall_style"));for(c=0;c<g.length;c++)this.T.line(g[c].x1,g[c].y1,g[c].x1+d,g[c].y1-h,this.get("grid_line_width"),this.get("grid_color")),this.T.line(g[c].x1+d,g[c].y1-h,g[c].x2+d,g[c].y2-h,this.get("grid_line_width"),this.get("grid_color"));for(c=0;c<this.scale.length;c++)this.scale[c].draw()},doConfig:function(){iChart.Coordinate3D.superclass.doConfig.call(this);var c=this.get("background_color"),a=iChart.dark(c,0.1),f=this.get("height"),e=this.get("width");3>this.get("wall_style").length&&this.push("wall_style",[{color:a},{color:c},{color:a}]);var b=this.get("wall_style")[0].color;this.push("bottom_style",[{color:c,shadow:this.get("shadow"),shadowColor:this.get("shadow_color"),blur:this.get("shadow_blur"),sx:this.get("shadow_offsetx"),sy:this.get("shadow_offsety")},!1,!1,{color:b},{color:b},{color:b}]);this.push("board_style",[!1,!1,!1,{color:b},{color:c},!1]);if(this.get("gradient")){var d=this.get("xAngle_")*this.get("zHeight"),h=this.get("yAngle_")*this.get("zHeight"),g=this.get("wall_style"),j=this.get("bottom_style");iChart.isString(g[0].color)&&(g[0].color=this.T.avgLinearGradient(this.x,this.y+f,this.x+e,this.y+f,[b,this.get("dark_color")]));iChart.isString(g[1].color)&&(g[1].color=this.T.avgLinearGradient(this.x+d,this.y-h,this.x+d,this.y+f-h,[this.get("dark_color"),this.get("light_color")]));iChart.isString(g[2].color)&&(g[2].color=this.T.avgLinearGradient(this.x,this.y,this.x,this.y+f,[c,this.get("dark_color")]));j[5].color=this.T.avgLinearGradient(this.x,this.y+f,this.x,this.y+f+this.get("pedestal_height"),[c,a])}}});