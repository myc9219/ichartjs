iChart.Component=iChart.extend(iChart.Painter,{configure:function(a){iChart.Component.superclass.configure.apply(this,arguments);this.type="component";this.set({tip:{enable:!1,border:{width:2}}});this.atomic=!1;this.inject(a);this.final_parameter={}},afterConfiguration:function(){this.init()},initialize:function(){this.preventEvent||iChart.DefineAbstract("isEventValid",this);iChart.DefineAbstract("doDraw",this);this.doConfig();this.initialization=!0},doConfig:function(){iChart.Component.superclass.doConfig.call(this);this.x=this.get("originx");this.y=this.get("originy");this.data=this.get("data");this.is3D()&&iChart.Interface._3D.call(this);this.get("tip.enable")&&(this.pushIf("tip.border.color",this.get("background_color")),iChart.isFunction(this.get("tip.invokeOffset"))||this.push("tip.invokeOffset",this.tipInvoke()))},isMouseOver:function(a){return this.isEventValid(a)},redraw:function(){this.container.draw()},commonDraw:function(a){this.doDraw.call(this,a)},inject:function(a){a&&(this.container=a,this.target=this.T=a.T)}});