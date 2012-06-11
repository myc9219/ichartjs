(function(){var c=function(a,b){this.T=a;this.line=b;this.direction=a.get("direction");this.size=a.get("queue_size");this.space=a.get("label_spacing");this.end=a.get("line_end")};c.prototype={push:function(a){iChart.isArray(a)||(a=[a]);for("left"==this.direction&&a.reverse();this.size<this.line.points.length+a.length;)this.line.points.shift();for(var b=0;b<this.line.points.length;b++)this.line.points[b].x+=this.space*a.length*("left"==this.direction?-1:1);for(b=0;b<a.length;b++)x="left"==this.direction?this.end-this.space*b:this.space*b,y=(iChart.between(this.T.S.start,this.T.S.end,a[b])-this.T.S.start)*this.T.S.uh,this.line.points.push(iChart.merge({x:x,y:y,value:a[b]},this.T.fireEvent(this.T,"parsePoint",[a[b],x,y,b])))}};iChart.LineMonitor2D=iChart.extend(iChart.Line,{configure:function(){iChart.LineMonitor2D.superclass.configure.call(this);this.type="linemonitor2d";this.set({direction:"left",queue_size:10});this.registerEvent();this.queues=[]},createQueue:function(a){this.init();var a=a||{},b=iChart.clone(this.get("segment_style"));b.brushsize=a.linewidth||1;b.background_color=a.color||"#BDBDBD";a=new iChart.LineSegment(b,this);this.pushComponent(a);return new c(this,a)},doConfig:function(){iChart.LineMonitor2D.superclass.doConfig.call(this);var a=this;a.push("animation",!1);a.get("coordinate.crosshair.enable")&&(a.push("coordinate.crosshair.hcross",1==a.data.length),a.push("coordinate.crosshair.invokeOffset",function(b){b=a.lines[0].isEventValid(b);return b.valid?b:!1}));a.coo=new iChart.Coordinate2D(iChart.merge({scale:[{position:a.get("scaleAlign"),max_scale:a.get("maxValue")},{position:a.get("labelAlign"),scaleEnable:!1,start_scale:1,scale:1,end_scale:a.get("maxItemSize"),labels:a.get("labels")}],axis:{width:[0,0,1,1]}},a.get("coordinate")),a);a.pushComponent(a.coo,!0);a.push("label_spacing",a.get("coordinate.valid_width")/(a.get("queue_size")-1));a.get("segment_style.tip")?a.push("segment_style.tip.wrap",a.get("tip.wrap")):a.push("segment_style.tip",a.get("tip"));a.push("segment_style.tip.showType","follow");a.push("segment_style.coordinate",a.coo);a.push("segment_style.keep_with_coordinate",!0);a.S=a.coo.getScale(a.get("scaleAlign"));a.S.uh=a.get("coordinate.valid_height")/a.S.distance}})})();