iChart.Element=function(a){this.type="element";iChart.DefineAbstract("configure",this);iChart.DefineAbstract("afterConfiguration",this);this.options={};this.set({id:"",fontsize:12,font:"Verdana",fontweight:"normal",border:{enable:!1,color:"#BCBCBC",style:"solid",width:1,radius:0},shadow:!1,shadow_color:"#666666",shadow_blur:4,shadow_offsetx:0,shadow_offsety:0});this.variable={};this.events={};this.initialization=this.preventEvent=!1;this.configure.apply(this,Array.prototype.slice.call(arguments,1));this.default_=iChart.clone(this.options,!0);this.set(a);this.afterConfiguration()};iChart.Element.prototype={_:function(){return this},set:function(a){iChart.isObject(a)&&iChart.merge(this.options,a)},pushIf:function(a,b){return!iChart.isDefined(this.get(a))?this.push(a,b):this.get(a)},push:function(a,b){var c=a.split("."),d=this.options;for(i=0;i<c.length-1;i++)d[c[i]]||(d[c[i]]={}),d=d[c[i]];return d[c[c.length-1]]=b},get:function(a){var a=a.split("."),b=this.options[a[0]];for(i=1;i<a.length;i++){if(!b)return null;b=b[a[i]]}return b}};