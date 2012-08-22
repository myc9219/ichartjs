var resultList,
	str,
	canvas,
	chart,
	unit,
	total=0,
	success=0,
	fail=0,
	Html;
function level(cost){
	if(cost<25){
		return "<td class='test_item_speed_high'></td>";
	}else if(cost<40){
		return "<td class='test_item_speed_middle'></td>";
	}else{
		return "<td class='test_item_speed_low'></td>";
	}
}
function result(succ,type,costOrCause){
	str = [resultList.innerHTML];
	str.push("<table class='test_item'><tr><td class='test_item_name'>&nbsp;");
	str.push(type);
	str.push("</td>");
	total++;
	if(succ){
		str.push("<td class='test_item_success'></td>");
		str.push(level(costOrCause));
		str.push("<td class='test_item_cost'>");
		str.push(costOrCause);
		str.push("ms");
		str.push("</td>");
		success++;
	}else{
		str.push("<td class='test_item_fail'></td>");
		str.push("<td>--</td>");
		str.push("<td class='test_item_cause'>");
		str.push(costOrCause);
		str.push("</td>");
		fail++;
	}
	
	
	str.push("</tr></table>");
	resultList.innerHTML = str.join("");
	canvas.innerHTML = "";
}
function start(){
	
	new iChart.Pie2D({
		render :canvas,
		title : 'Test Pie2D',
		data:data,
		radius:140,
		offsetAngle:45
	}).draw();
	
	setTimeout(function(){
		try {
			if(unit.length==0){
				str = [resultList.innerHTML];
				str.push("<div class='test_result'>Test completed.Total:");
				str.push(total);
				str.push("&nbsp;,Success:");
				str.push(success);
				str.push("&nbsp;,Fail:");
				str.push(fail);
				str.push("&nbsp;<button onclick='test();'>Test Again</button>");
				str.push("</div>");
				resultList.innerHTML = str.join("");
				return;
			}
			chart = unit.shift()();
			
			chart.on('beforedraw',function(e){
				chart.START_RUN_TIME = new Date().getTime();
				return true;
			});
			
			chart.on('draw',function(e){
				chart.END_RUN_TIME = new Date().getTime();
				chart.RUN_TIME_COST = chart.END_RUN_TIME - chart.START_RUN_TIME;
			});
			
			//console.profile(chart.get('title.text'));
			chart.draw();
			//console.profileEnd(chart.get('title.text'));
			
			result(true,chart.get('title.text') || chart.type,chart.RUN_TIME_COST);
		} catch (e) {
			result(false,chart.get('title.text') || chart.type,e.name+":"+e.message);
		}
		start();
	},300)
}
/////////////////////上面的写成一个测试的js//////////////////////
function test(){
	resultList.innerHTML = Html;
	total=success=fail=0;
	unit = [];
	unit.push(function(){
		return new iChart.Pie2D({
			render :canvas,
			title : {text:'Test Pie2D'},
			shadow:true,
			data:data,
			radius:140,
			offsetAngle:45
		});
	});
	
	unit.push(function(){
		return new iChart.Pie2D({
			render :canvas,
			title : {text: 'Test Pie2D No Shadow'},
			data:data,
			radius:140,
			offsetAngle:45
		});
	});
	
	unit.push(function(){
		return new iChart.Pie3D({
			render :canvas,
			title : {text: 'Test Pie3D'},
			data : data,
			padding : '10',
			shadow:true,
			radius:240,
			yHeight:30,
			zRotate:45,
			showpercent:true,
			legend:{
				enable:true
			},
			tip:{
				enable:true
			}
		});
	});
	
	unit.push(function(){
		return new iChart.Pie3D({
			render :canvas,
			title : {text: 'Test Pie3D No Shadow'},
			data : data,
			padding : '10',
			radius:240,
			yHeight:30,
			zRotate:45,
			showpercent:true,
			legend:{
				enable:true
			},
			tip:{
				enable:true
			}
		});
	});
	
	unit.push(function(){
		return new iChart.Column2D({
			render :canvas,
			title : {text: 'Test Column2D'},
			data: data,
			shadow:true,
			align:'center',
			coordinate:{
				width:600,
				height:400
			},
			legend:{
				enable:true
			},
			tip:{
				enable:true,
				shadow:true
			}
			
		});
	});
	
	unit.push(function(){
		return new iChart.Column2D({
			render :canvas,
			title : {text: 'Test Column2D No Shadow'},
			data: data,
			align:'center',
			shadow:false,
			coordinate:{
				width:600,
				height:400
			},
			legend:{
				enable:true
			},
			tip:{
				enable:true,
				shadow:true
			}
			
		});
	});
	
	unit.push(function(){
		return new iChart.Column3D({
			render :canvas,
			title : {text: 'Test Column3D'},
			data: data,
			align:'center',
			shadow:true,
			coordinate:{
				width:600,
				height:300,
				background_color:'#d6dbd2'
			},
			tip:{
				enable:true,
				shadow:true,
				showType:'fixed'
			},
			hiswidth:90,
			xAngle:70,
			yAngle:30,
			zScale:1
		});
	});
	
	unit.push(function(){
		return new iChart.Column3D({
			render :canvas,
			title : {text: 'Test Column3D No Shadow'},
			data: data,
			shadow:false,
			align:'center',
			coordinate:{
				width:600,
				height:300,
				background_color:'#d6dbd2'
			},
			tip:{
				enable:true,
				shadow:true,
				showType:'fixed'
			},
			hiswidth:90,
			xAngle:70,
			yAngle:30,
			zScale:1
		});
	});
	
	unit.push(function(){
		return new iChart.Bar2D({
			render :canvas,
			title : {text: 'Test Bar2D'},
			data: data,
			align:'center',
			shadow:true,
			coordinate:{
				width:600,
				height:400
			},
			legend:{
				enable:true
			},
			tip:{
				enable:true,
				shadow:true,
				showType:'follow'
			}
			
		});
	});
	
	unit.push(function(){
		return new iChart.ColumnMulti2D({
			render :canvas,
			title : {text: 'Test ColumnMulti2D'},
			data: data2,
			shadow:true,
			data_labels:data_labels,
			align:'center',
			coordinate:{
				width:600,
				height:400,
				scale:{
					 position:'left',	
					 end_scale:150,
					 scale:30
				}
			},
			legend:{
				enable:true
			},
			tip:{
				enable:true,
				shadow:true,
				showType:'fixed'
			}
		});
	});
	
	
	unit.push(function(){
		return new iChart.LineBasic2D({
			render :canvas,
			title : {text: 'Test LineBasic2D'},
			data: data3,
			align:'center',
			shadow:true,
			data_labels:lineLabels,
			listeners:{
				parsePoint:function(v,x,y){
					return {value:v+"℃"}
				}
			}
		});
	});
	
	unit.push(function(){
		return new iChart.LineBasic2D({
			render :canvas,
			title : 'Test LineBasic2D More Point',
			data: data3,
			shadow:true,
			align:'center',
			tip:{
				enable:true,
				shadow:true
			},
			coordinate:{
				width:640,
				height:260,
				axis:{
					color:'#07575a',
					width:[0,0,2,2]
				},
				grids:{
					vertical:{
						way:'share_alike',
				 		value:12
					}
				},
				crosshair:{
					enable:true
				},
				scale:[{
					 position:'left',	
					 start_scale:0,
					 end_scale:48,
					 scale_line_enable:false,
					 scale:4,
					 listeners:{
						parseText:function(t,x,y){
							return {text:t+"℃"}
						}
					}
				},{
					 position:'bottom',	
					 scale_line_enable:false,
					 start_scale:1,
					 end_scale:12,
					 parseText:function(t,x,y){
						return {textY:y+10}
					 },
					 labels:lineLabels
				}]
			},
			listeners:{
				parsePoint:function(v,x,y){
					return {value:v+"℃"}
				}
			}
		});
	});
	
	
	unit.push(function(){
		var myChart = iChart.noConflict();
		return new myChart.Area2D({
			render :canvas,
			title : 'Test Area2D',
			data: data3,
			align:'center',
			shadow:true,
			width : 800,
			height : 400,
			labels:lineLabels,
			listeners:{
				parsePoint:function(v,x,y){
					return {value:v+"℃"}
				}
			}
		});
	});
	unit.push(function(){
		return new iChart.Area2D({
			render :canvas,
			title : {text: 'Test Area2D No Shadow'},
			data: data3,
			shadow:false,
			align:'center',
			width : 800,
			height : 400,
			labels:lineLabels,
			listeners:{
				parsePoint:function(v,x,y){
					return {value:v+"℃"}
				}
			}
		});
	});
	
	
	
	unit.push(function(){
		return new iChart.Bar2D({
				render :canvas,
				title : {text: 'Test Bar2d'},
				data:data,
				shadow:true,
				coordinate:{
					width:600,
					height:400
				},
				legend:{
					enable:true
				},
				width : 800,
				height : 600
		});
	});
	
	unit.push(function(){
		return new iChart.BarMulti2D({
			render :canvas,
			title : {text: 'Test BarMulti2D'},
			data: data2,
			data_labels:data_labels,
			coordinate:{
				scale:{
					 position:'bottom',	
					 end_scale:150,
					 scale:30
				}
			}
		});
	});
	/**
	 * start Test
	 */
	start();
}

$(function(){
	resultList = $('result_list'),
	canvas = $("myCanvas");
	Html = resultList.innerHTML;
	setTimeout(test,1000);
});