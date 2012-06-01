iChart.Legend=iChart.extend(iChart.Component,{configure:function(){iChart.Legend.superclass.configure.apply(this,arguments);this.type="legend";this.set({data:void 0,width:"auto",column:1,row:"max",maxwidth:0,line_height:16,sign:"square",sign_size:12,sign_space:5,legendspace:5,text_with_sign_color:!1,align:"right",valign:"middle"});this.registerEvent("drawCell","parse","drawRaw")},drawCell:function(b,c,d,e){var a=this.get("sign_size"),h=this.get("sign");"round"==h?this.T.round(b+a/2,c+a/2,a/2,e):"round-bar"==h?(this.T.rectangle(b,c+5*a/12,a,a/6,e),this.T.round(b+a/2,c+a/2,a/4,e)):"square-bar"==h?(this.T.rectangle(b,c+5*a/12,a,a/6,e),this.T.rectangle(b+a/4,c+a/4,a/2,a/2,e)):this.T.rectangle(b,c,a,a,e);h=this.get("color");this.get("text_with_sign_color")&&(h=e);this.T.fillText(d,b+this.get("signwidth"),c+a/2,this.get("textwidth"),h);this.fireEvent(this,"drawCell",[b,c,d,e])},drawRow:function(b,c,d){for(var e,a=0;a<this.get("column");a++)e=this.data[b],b<this.data.length&&(this.fireEvent(this,"drawCell",[e]),this.drawCell(c,d,e.text,e.color),e.x=c,e.y=d),c+=this.columnwidth[a]+this.get("signwidth")+this.get("legendspace"),b++},isEventValid:function(b){var c={valid:!1};b.offsetX>this.x&&b.offsetX<this.x+this.width&&b.offsetY>this.y&&b.offsetY<this.y+this.height&&this.data.each(function(d,e){b.offsetX>d.x&&b.offsetX<d.x+d.width+this.get("signwidth")&&b.offsetY>d.y&&b.offsetY<d.y+this.get("line_height")&&(c={valid:!0,index:e,target:d})},this);return c},doDraw:function(){this.get("border.enable")&&this.T.drawBorder(this.x,this.y,this.width,this.height,this.get("border.width"),this.get("border.color"),this.get("border.radius"),this.get("fill_color"),!1,this.get("shadow"),this.get("shadow_color"),this.get("shadow_blur"),this.get("shadow_offsetx"),this.get("shadow_offsety"));this.T.textStyle("left","middle",iChart.getFont(this.get("fontweight"),this.get("fontsize"),this.get("font")));for(var b=this.x+this.get("padding_left"),c=this.y+this.get("padding_top"),d=this.get("column"),e=this.get("row"),a=0;a<e;a++)this.fireEvent(this,"drawRaw",[a*d]),this.drawRow(a*d,b,c),c+=this.get("line_height")},calculate:function(b,c){this.data=b;var d=0,e=w=this.get("width"),a=0,h="auto"==w,f=iChart.isNumber(this.get("column")),g=iChart.isNumber(this.get("row")),j=this.data.length,i=this.container;!f&&!g&&(f=1);f&&!g&&this.push("row",Math.ceil(j/this.get("column")));!f&&g&&this.push("column",Math.ceil(j/this.get("row")));f=this.get("column");g=this.get("row");j>g*f&&(g+=Math.ceil((j-g*f)/f),this.push("row",g));this.columnwidth=Array(f);h&&(e=0);c.each(function(a,b){iChart.merge(a,this.fireEvent(this,"parse",[a,b]));a.text=a.text||a.name;a.width=this.T.measureText(a.text)},this);for(var k=0;k<f;k++){a=0;for(d=k;d<j;)a=Math.max(a,this.data[d].width),d+=f;this.columnwidth[k]=a;e+=a}h&&(w=this.push("width",e+this.get("hpadding")+this.get("signwidth")*f+(f-1)*this.get("legendspace")));w>this.get("maxwidth")&&(w=this.push("width",this.get("maxwidth")));this.push("textwidth",w-this.get("hpadding")-this.get("signwidth"));this.width=w;this.height=d=this.push("height",g*this.get("line_height")+this.get("vpadding"));this.y="top"==this.get("valign")?i.get("t_originy"):"bottom"==this.get("valign")?i.get("b_originy")-d:i.get("centery")-d/2;this.x="left"==this.get("align")?i.get("l_originx"):"center"==this.get("align")?i.get("centerx")-this.get("textwidth")/2:i.get("r_originx")-w;this.x=this.push("originx",this.x+this.get("offsetx"));this.y=this.push("originy",this.y+this.get("offsety"))},doConfig:function(){iChart.Legend.superclass.doConfig.call(this);iChart.Assert.isNotEmpty(this.get("data"),this.type+"[data]");var b=this.get("sign_size"),c=this.container;this.T.textFont(this.get("fontStyle"));this.push("signwidth",b+this.get("sign_space"));this.get("line_height")<b&&this.push("line_height",b+b/5);"center"==this.get("align")&&"middle"==this.get("valign")&&this.push("valign","top");"left"==c.get("align")&&"middle"==this.get("valign")&&this.push("align","right");this.calculate(this.data,this.data)}});