/**
 * @overview 扩展Tip
 */
iChart.override(iChart.Tip,{
	initialize:function(){
		iChart.Tip.superclass.initialize.call(this);
		var _ = this._();
		_.css('position','absolute');
		_.dom.innerHTML = _.get('text');
		_.style = _.dom.style;
		_.hidden();
		if(_.get('animation')){
			var m =  _.get('move_duration')/1000+'s '+_.get('timing_function')+' 0s';
			_.transition('opacity '+_.get('fade_duration')/1000+'s '+_.get('timing_function')+' 0s');
			_.transition('top '+m);
			_.transition('left '+m);
			_.onTransitionEnd(function(e){
				if(_.css('opacity')==0){
					_.css('visibility','hidden');
				}
			},false);
		}
		
		_.wrap.appendChild(_.dom);
		
		_.T.on('click',function(c,e,m){
			_.show(e,m);	
		});
		
	}
});
/**
 * @overview 扩展CrossHair
 */
iChart.override(iChart.CrossHair,{
	initialize:function(){
		iChart.CrossHair.superclass.initialize.call(this);
		
		var _ = this._(),L = iChart.toPixel(_.get('line_width'));
		
		_.top = iChart.fixPixel(_.get(_.O));
		_.left = iChart.fixPixel(_.get(_.L));
		
		_.dom = document.createElement("div");
		
		_.dom.style.zIndex=_.get('index');
		_.dom.style.position="absolute";
		/**
		 * set size zero make integration with vertical and horizontal
		 */
		_.dom.style.width= iChart.toPixel(0);
		_.dom.style.height=iChart.toPixel(0);
		_.dom.style.top=iChart.toPixel(_.get(_.O));
		_.dom.style.left=iChart.toPixel(_.get(_.L));
		_.css('visibility','hidden');
		
		_.horizontal = _.doCreate(_,_.get('hcross')?iChart.toPixel(_.get(_.W)):"0px",L);
		_.vertical = _.doCreate(_,L,_.get('vcross')?iChart.toPixel(_.get(_.H)):"0px");
		
		
		if(_.get('shadow')){
			_.dom.style.boxShadow = _.get('shadowStyle');
		}
		
		_.wrap.appendChild(_.dom);
		
		_.T.on('click',function(c,e,m){
			_.show(e,m);	
		});
		
	}
});


