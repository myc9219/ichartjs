	;(function(){
		
		Jidea.Event = {
			addEvent:function(ele,type,fn,useCapture){
			 	if (ele.addEventListener) {
				 	ele.addEventListener(type,fn,useCapture);
			 	}
			 	else if (ele.attachEvent) {
			 		ele.attachEvent('on' + type, fn);
			 	}else {
			 		ele['on' + type] = fn;
			 	}
			},
		    fix: function( e ) { //inspire by jquery
				// Fix event for mise
				if(typeof(e) == 'undefined'){
					e = window.event;
				}
				// Fix target property, if necessary
				if ( !e.target ) {
					e.target = e.srcElement || document;
				}
								
				// Add relatedTarget, if necessary
				if ( !e.relatedTarget && e.fromElement ) {
					e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
				}
				
				// Calculate pageX/Y if missing and clientX/Y available
				if ( e.pageX == null && e.clientX != null ) {
					var doc = document.documentElement, body = document.body;
					e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
					e.pageY = e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
				}
				
				// This is mainly for FF which doesn't provide offsetX
		        if (typeof(e.offsetX) == 'undefined' && typeof(e.offsetY) == 'undefined') {
			        // Browser not with offsetX and offsetY
			        if (typeof(e.offsetX) != 'number') {
			            var x = 0,y = 0,obj = e.target;
			            while (obj != document.body && obj) {
			                x += obj.offsetLeft;
			                y += obj.offsetTop;
			                obj = obj.offsetParent;
			            }
			            e.offsetX = e.pageX - x;
			            e.offsetY = e.pageY - y;
			        }
		        }
				
				// Add which for key events
				if ( e.which == null && (e.charCode != null || e.keyCode != null) ) {
					e.which = e.charCode != null ? e.charCode : e.keyCode;
				}
				
				// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
				if ( !e.metaKey && e.ctrlKey ) {
					e.metaKey = e.ctrlKey;
				}
				
				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !e.which && e.button !== undefined ) {
					e.which = (e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ));
				}
				
				// Any browser that doesn't implement stopPropagation() (MSIE)
		        if (!e.stopPropagation) {
		            e.stopPropagation = function () {window.event.cancelBubble = true;}
		        }
				return e;
			}
			
			
			
		};
	})();
