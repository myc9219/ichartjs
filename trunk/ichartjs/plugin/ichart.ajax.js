iChart.ajax = function(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = handler;
	xhr.open("GET", "unicorn.xml");
	xhr.send();
	
	
}
iChart.override(iChart.Chart, {
	ajax : function(URL,f) {
		var data = [
		        	{name : 'UC浏览器',value : 40.0,color:'#4572a7'},
		        	{name : 'QQ浏览器',value : 37.1,color:'#aa4643'},
		        	{name : '欧朋浏览器',value : 13.8,color:'#89a54e'}
	        	];
		
		//ajaxOptions
		
		this.push("data",data);
		
		
		
		
		
		f();
	}
});
/**
 * @end
 */