(function(u){var z=navigator.userAgent.toLowerCase(),i=function(c){return c.test(z)},l=Object.prototype.toString,n=document.documentMode,A=i(/opera/);A&&i(/version\/10\.5/);var F=i(/\bchrome\b/),G=i(/webkit/),v=!F&&i(/safari/),S=v&&i(/applewebkit\/4/),T=v&&i(/version\/3/),U=v&&i(/version\/4/),w=!A&&i(/msie/),V=w&&(i(/msie 8/)&&7!=n&&9!=n||8==n),W=w&&(i(/msie 9/)&&7!=n&&8!=n||9==n);w&&i(/msie 10/);var X=!!document.createElement("canvas").getContext,x=!G&&i(/gecko/),B=x&&i(/rv:1\.9/),H=x&&i(/rv:2\.0/),
Y=B&&i(/rv:1\.9\.1/),Z=B&&i(/rv:1\.9\.2/),$=H&&i(/rv:2\.0\.\d/),aa=x&&i(/firefox/),ba=i(/windows|win32/),ca=i(/macintosh|mac os x/),da=i(/linux/),y={Linear:function(c,d,g,j){return g*c/j+d},Quad:{easeIn:function(c,d,g,j){return g*(c/=j)*c+d},easeOut:function(c,d,g,j){return-g*(c/=j)*(c-2)+d},easeInOut:function(c,d,g,j){return 1>(c/=j/2)?g/2*c*c+d:-g/2*(--c*(c-2)-1)+d}},Cubic:{easeIn:function(c,d,g,j){return g*(c/=j)*c*c+d},easeOut:function(c,d,g,j){return g*((c=c/j-1)*c*c+1)+d},easeInOut:function(c,
d,g,j){return 1>(c/=j/2)?g/2*c*c*c+d:g/2*((c-=2)*c*c+2)+d}},Quart:{easeIn:function(c,d,g,j){return g*(c/=j)*c*c*c+d},easeOut:function(c,d,g,j){return-g*((c=c/j-1)*c*c*c-1)+d},easeInOut:function(c,d,g,j){return 1>(c/=j/2)?g/2*c*c*c*c+d:-g/2*((c-=2)*c*c*c-2)+d}},Bounce:{easeOut:function(c,d,g,j){return(c/=j)<1/2.75?g*7.5625*c*c+d:c<2/2.75?g*(7.5625*(c-=1.5/2.75)*c+0.75)+d:c<2.5/2.75?g*(7.5625*(c-=2.25/2.75)*c+0.9375)+d:g*(7.5625*(c-=2.625/2.75)*c+0.984375)+d}}},R=function(c){var d=!1,g=!1,j=[],i=function(){if(document.addEventListener)return function(){document.removeEventListener("DOMContentLoaded",
i,!1);s()};if(document.attachEvent)return function(){"complete"===document.readyState&&(document.detachEvent("onreadystatechange",i),s())}}(),n=function(){if(!d){try{document.documentElement.doScroll("left")}catch(a){setTimeout(n,1);return}s()}},s=function(){if(!d){d=!0;for(var a=0;a<j.length;a++)j[a].call(document);j=[]}},u=function(){if(!g){g=!0;if("complete"===document.readyState)return setTimeout(s,1);if(document.addEventListener)document.addEventListener("DOMContentLoaded",i,!1),c.addEventListener("load",
s,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",i);c.attachEvent("onload",s);var a=!1;try{a=null==c.frameElement}catch(b){}document.documentElement.doScroll&&a&&n()}}},z=function(a){u();d?a.call(document,e):j.push(function(){return a.call(this)})},e=function(a){if(!a||a.nodeType)return a;if("string"===typeof a)return-1!=a.indexOf("#")&&(a=a.substring(1)),document.getElementById(a);"function"===typeof a&&z(a)};e.apply=function(a,b){if(a&&b&&"object"==typeof b)for(var o in b)"undefined"!=
typeof b[o]&&(a[o]=b[o]);if(!b&&a){var c={};for(o in a)c[o]=a[o];return c}return a};e.applyIf=function(a,b){if(a&&b&&"object"==typeof b)for(var o in b)"undefined"!=typeof b[o]&&"undefined"==typeof a[o]&&(a[o]=b[o]);return!b&&a?e.apply(a):a};e.merge=function(a,b,o){if(a&&b&&"object"==typeof b){for(var c in b)"undefined"!=typeof b[c]&&("[object Object]"===l.apply(b[c])?"[object Object]"===l.apply(a[c])?e.merge(a[c],b[c]):a[c]=e.clone(b[c],!0):a[c]=b[c]);if("object"==typeof o)return e.merge(a,o)}return a};
e.clone=function(a,b,c){var m={};if("[object Array]"===l.apply(a)&&"[object Object]"===l.apply(b))for(var f=0;f<a.length;f++)m[a[f]]=c&&"[object Object]"===l.apply(b[a[f]])?e.clone(b[a[f]]):b[a[f]];else if("[object Object]"===l.apply(a))for(f in a)m[f]=b&&"[object Object]"===l.apply(a[f])&&!(a[f]instanceof e.Painter)?e.clone(a[f],b):a[f];return m};e.override=function(a,b){if(b){var c=a.prototype;e.apply(c,b);e.isIE&&b.hasOwnProperty("toString")&&(c.toString=b.toString)}};e.extend=function(){var a=
function(a){for(var b in a)this[b]=a[b]},b=Object.prototype.constructor;return function(c,m){var f=function(){c.apply(this,arguments)},h=function(){},d=c.prototype;h.prototype=d;h=f.prototype=new h;h.constructor=f;f.superclass=d;d.constructor==b&&(d.constructor=c);f.override=function(a){e.override(f,a)};h.superclass=h.supr=function(){return d};h.override=a;e.override(f,m);f.extend=function(a){return e.extend(f,a)};return f}}();var C=Math.sin,I=Math.cos,ea=Math.atan,fa=Math.sqrt,ga=Math.abs,r=Math.PI,
D=2*r,ha=Math.ceil,E=Math.round,J=Math.floor,K=Math.max,L=Math.min,k=parseFloat,M=function(a,b){if(e.isNumber(a))return[a,a,a,a];a=a.replace(/^\s+|\s+$/g,"").replace(/\s{2,}/g,/\s/).replace(/\s/g,",").split(",");1==a.length?a[0]=a[1]=a[2]=a[3]=k(a[0])||b:2==a.length?(a[0]=a[2]=k(a[0])||b,a[1]=a[3]=k(a[1])||b):3==a.length?(a[0]=k(a[0])||b,a[1]=a[3]=k(a[1])||b,a[2]=k(a[2])||b):(a[0]=k(a[0])||b,a[1]=k(a[1])||b,a[2]=k(a[2])||b,a[3]=k(a[3])||b);return a},N=function(a){if(0==a)return a;for(var a=a/10,b=
0;1>a;)a*=10,b++;for(;1<a/10;)a/=10,b--;for(a=J(a);0<b;)a/=10,b--;for(;0>b;)a*=10,b++;return a},ia="navy,olive,silver,gold,lime,fuchsia,aqua,green,red,blue,pink,purple,yellow,maroon,black,gray,white".split(","),O={navy:"rgb(0,0,128)",olive:"rgb(128,128,0)",orange:"rgb(255,165,0)",silver:"rgb(192,192,192)",white:"rgb(255,255,255)",gold:"rgb(255,215,0)",lime:"rgb(0,255,0)",fuchsia:"rgb(255,0,255)",aqua:"rgb(0,255,255)",green:"rgb(0,128,0)",red:"rgb(255,0,0)",blue:"rgb(0,0,255)",pink:"rgb(255,192,203)",
purple:"rgb(128,0,128)",yellow:"rgb(255,255,0)",maroon:"rgb(128,0,0)",black:"rgb(0,0,0)",azure:"rgb(240,255,255)",beige:"rgb(245,245,220)",brown:"rgb(165,42,42)",cyan:"rgb(0,255,255)",darkblue:"rgb(0,0,139)",darkcyan:"rgb(0,139,139)",darkgrey:"rgb(169,169,169)",darkgreen:"rgb(0,100,0)",darkkhaki:"rgb(189,183,107)",darkmagenta:"rgb(139,0,139)",darkolivegreen:"rgb(85,107,47)",darkorange:"rgb(255,140,0)",darkorchid:"rgb(153,50,204)",darkred:"rgb(139,0,0)",darksalmon:"rgb(233,150,122)",darkviolet:"rgb(148,0,211)",
indigo:"rgb(75,0,130)",khaki:"rgb(240,230,140)",lightblue:"rgb(173,216,230)",lightcyan:"rgb(224,255,255)",lightgreen:"rgb(144,238,144)",lightgrey:"rgb(211,211,211)",lightpink:"rgb(255,182,193)",lightyellow:"rgb(255,255,224)",magenta:"rgb(255,0,255)",violet:"rgb(128,0,128)"},ja=function(a){a=a.replace(/\s/g,"").toLowerCase();if(/rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)/.exec(a)||/rgba\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},(0(\.[0-9])?|1(\.0)?)\)/.exec(a))return a;if(/#(([a-fA-F0-9]{6})|([a-fA-F0-9]{3}))/.exec(a))return a=
a.replace(/#/g,"").replace(/^(\w)(\w)(\w)$/,"$1$1$2$2$3$3"),"rgb("+parseInt(a.substring(0,2),16)+","+parseInt(a.substring(2,4),16)+","+parseInt(a.substring(4,6),16)+")";if(O[a])return O[a];throw Error("invalid colors value '"+a+"'");},P=function(a,b){b=b||0.14;return 0.5<a?b-(1-a)/10:0.1<a?b-0.16+a/5:a>b?b:a/2},Q=function(a,b,c,m){var b=ja(b),f=/rgb\((\w*),(\w*),(\w*)\)/.exec(b);if(f)b=[f[1],f[2],f[3]];else if(f=/rgba\((\w*),(\w*),(\w*),(.*)\)/.exec(b))b=[f[1],f[2],f[3],f[4]];else throw Error("invalid colors value '"+
b+"'");var h;var f=b,d=void 0,g=void 0;e.isArray(f)&&(d=f[1],g=f[2],f=f[0]);var f=f/255,d=d/255,g=g/255,i=K(K(f,d),g),j=L(L(f,d),g),j=i-j;0==j?h=[0,0,i]:(f==i?h=(d-g)/j:d==i?h=(g-f)/j+2:g==i&&(h=(f-d)/j+4),h*=60,0>h&&(h+=360),h=[h,j/i,i]);h[1]-=m||0;a?(h[2]-=P(h[2],c),h[1]=e.upTo(h[1],1),h[2]=e.lowTo(h[2],0)):(h[2]+=P(1-h[2],c),h[1]=e.lowTo(h[1],0),h[2]=e.upTo(h[2],1));a=h;c=b[3];b=m=void 0;e.isArray(a)&&(b=c,c=a[1],m=a[2],a=a[0]);var k,l,n;h=J(a/60)%6;a=a/60-h;p=m*(1-c);q=m*(1-c*a);t=m*(1-c*(1-a));
switch(h){case 0:k=m;l=t;n=p;break;case 1:k=q;l=m;n=p;break;case 2:k=p;l=m;n=t;break;case 3:k=p;l=q;n=m;break;case 4:k=t;l=p;n=m;break;case 5:k=m,l=p,n=q}return"rgb"+(b?"a":"")+"("+E(255*k)+","+E(255*l)+","+E(255*n)+(b?","+b+")":")")};e.apply(e,{version:"1.0",email:"wanghetommy@gmail.com",isEmpty:function(a,b){return null===a||void 0===a||e.isArray(a)&&!a.length||(!b?""===a:!1)},isArray:function(a){return"[object Array]"===l.apply(a)},isDate:function(a){return"[object Date]"===l.apply(a)},isObject:function(a){return!!a&&
"[object Object]"===l.apply(a)},isFunction:function(a){return"[object Function]"===l.apply(a)},isNumber:function(a){return"number"===typeof a&&isFinite(a)},isString:function(a){return"string"===typeof a},isBoolean:function(a){return"boolean"===typeof a},isFalse:function(a){return"boolean"===typeof a&&!a},isElement:function(a){return a?!!a.tagName:!1},isDefined:function(a){return"undefined"!==typeof a},getFont:function(a,b,c){return a+" "+b+"px "+c},getDoc:function(){return c.contentWindow?c.contentWindow.document:
c.contentDocument?c.contentDocument:c.document},DefineAbstract:function(a,b){if(!b[a])throw Error("Cannot instantiate the type '"+b.type+"'.you must implements it with method '"+a+"'.");},getAnimationArithmetic:function(a){return"linear"==a?y.Linear:"bounce"==a?y.Bounce.easeOut:"easeInOut"==a||"easeIn"==a||"easeOut"==a?y[e.DefaultAnimationArithmetic][a]:y.Linear},noConflict:function(){return R},parseBorder:function(a,b){return M(a,b)},parsePadding:function(a,b){return M(a,b)},distanceP2P:function(a,
b,c,d){return fa((c-a)*(c-a)+(d-b)*(d-b))},atan2Radian:function(a,b,c,d){if(a==c)return d>b?r/2:3*r/2;var f=e.quadrant(a,b,c,d),a=ea(ga((b-d)/(a-c)));1==f?a=r-a:2==f?a=r+a:3==f&&(a=D-a);return a},angle2Radian:function(a){return a*r/180},radian2Angle:function(a){return 180*a/r},quadrant:function(a,b,c,d){return a<c?b<d?3:0:b<d?2:1},quadrantd:function(a){a=2*(a%(2*r));return ha(a/r)},upTo:function(a,b){return b>a?a:b},lowTo:function(a,b){return b<a?a:b},between:function(a,b,c){return c>b?b:c<a?a:c},
inRange:function(a,b,c){return b>c&&a<c},angleInRange:function(a,b,c){a%=D;b%=D;return b>a?b>c&&a<c:b<a?c<b||c>a:c==b},inRangeClosed:function(a,b,c){return b>=c&&a<=c},inEllipse:function(a,b,c,d){return 1>=a*a/c/c+b*b/d/d},p2Point:function(a,b,c,d){return{x:a+I(c)*d,y:b+C(c)*d}},vectorP2P:function(a,b,c){c||(b=e.angle2Radian(b),a=e.angle2Radian(a));b=C(b);return{x:b*C(a),y:b*I(a)}},iGather:function(a){return(a||"ichartjs")+"-"+(new Date).getTime().toString()},toPercent:function(a,b){return"("+(100*
a).toFixed(b)+"%)"},parseFloat:function(a,b){if(!e.isNumber(a)&&(a=k(a),!e.isNumber(a)))throw Error("'"+b+"'is not a valid number.");return a},ceil:function(a){return a+N(a)},floor:function(a){return a-N(a)},get:function(a){return ia[a%16]},_2D:"2d",_3D:"3d",light:function(a,b,c){return Q(!1,a,b,c)},dark:function(a,b,c){return Q(!0,a,b,c)},fixPixel:function(a){return e.isNumber(a)?a:k(a.replace("px",""))||0},toPixel:function(a){return e.isNumber(a)?a+"px":e.fixPixel(a)+"px"},emptyFn:function(){return!0},
supportCanvas:X,isOpera:A,isWebKit:G,isChrome:F,isSafari:v,isSafari2:S,isSafari3:T,isSafari4:U,isIE:w,isIE8:V,isIE9:W,isGecko:x,isGecko3:B,isGecko4:H,isFF:aa,isFF3_5:Y,isFF3_6:Z,isFF4:$,isLinux:da,isWindows:ba,isMac:ca,FRAME:20,INTERVAL:30,DefaultAnimationArithmetic:"Cubic"});e.Assert={gtZero:function(a,b){e.Assert.gt(a,0,b)},gt:function(a,b,c){if(!e.isNumber(a)&&a>=b)throw Error(c+" required Number gt "+b+",given:"+a);},isNumber:function(a,b){if(!e.isNumber(a))throw Error(b+" required Number,given:"+
a);},isNotEmpty:function(a,b){if(!a||""==a)throw Error(" required not empty.cause:"+b);if(e.isArray(a)&&0==a.length)throw Error("required must has one element at least.cause:"+b);},isArray:function(a,b){if(!e.isArray(a))throw Error(b+" required Array,given:"+a);},isFunction:function(a,b){if(!e.isFunction(a))throw Error(b+" required Function,given:"+a);},isTrue:function(a,b){if(!0!==a)throw Error(b);},equal:function(a,b,c){if(a!==b)throw Error(c);}};e.Event={addEvent:function(a,b,c,d){a.addEventListener?
a.addEventListener(b,c,d):a.attachEvent?a.attachEvent("on"+b,c):a["on"+b]=c},fix:function(a){"undefined"==typeof a&&(a=c.event);a.target||(a.target=a.srcElement||document);!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(null==a.pageX&&null!=a.clientX){var b=document.documentElement,d=document.body;a.pageX=a.clientX+(b&&b.scrollLeft||d&&d.scrollLeft||0)-(b&&b.clientLeft||d&&d.clientLeft||0);a.pageY=a.clientY+(b&&b.scrollTop||d&&d.scrollTop||
0)-(b&&b.clientTop||d&&d.clientTop||0)}if("undefined"==typeof a.offsetX&&"undefined"==typeof a.offsetY&&"number"!=typeof a.offsetX){for(var d=b=0,e=a.target;e!=document.body&&e;)b+=e.offsetLeft,d+=e.offsetTop,e=e.offsetParent;a.offsetX=a.pageX-b;a.offsetY=a.pageY-d}if(null==a.which&&(null!=a.charCode||null!=a.keyCode))a.which=null!=a.charCode?a.charCode:a.keyCode;!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey);!a.which&&void 0!==a.button&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);a.stopPropagation||
(a.stopPropagation=function(){c.event.cancelBubble=true});return a}};return e}(u);u.iChart=u.$=R})(window);