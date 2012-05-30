	iChart.Interface = function(){
		var simple = function() {
			var M=0,V=0,MI,ML=0,d;
			this.data.each(function(d,i){
				iChart.merge(d,this.fireEvent(this,'parseData',[this,d,i]));
				if(!d.color)
				d.color = iChart.get(i);
				V  = d.value;
				if(iChart.isNumber(V)){
					V = iChart.parseFloat(V,this.type+':data['+i+']');
					d.value = V;
					this.total+=V;
					M = V>M?V:M;
					if(!MI)
						MI = V;
					MI = V<MI?V:MI;
				}else if(iChart.isArray(V)){
					var T = 0;
					ML = V.length>ML?V.length:ML;
					for(var j=0;j<V.length;j++){
						T+=V[j];
						if(!MI)
						MI = V;
						M = V[j]>M?V[j]:M;
						MI = V[j]<MI?V[j]:MI;
					}
					d.total = T;
				}
			},this);
			
			if(iChart.isArray(this.get('labels'))){
				ML = this.get('labels').length>ML?this.get('labels').length:ML;
			}
			
			this.push('maxItemSize',ML);
			this.push('minValue',MI);
			this.push('maxValue',M);
			this.push('total',this.total);
		},
		complex = function(){
			this.columnKeys = this.get('columnKeys');
			var M=0,MI=0,V,d,L=this.columnKeys.length;
			
			this.data.each(function(d,i){
				iChart.Assert.equal(d.value.length,L,this.type+':data length and columnKeys not corresponding.');
				iChart.merge(d,this.fireEvent(this,'parseData',[this,d,i,this.columnKeys]));
				iChart.Assert.equal(d.value.length,L,this.type+':data length and columnKeys not corresponding.');
			},this);
			
			for(var i=0;i<L;i++){
				var item = [];
				for(var j=0;j<this.data.length;j++){
					d = this.data[j];
					V = d.value[i];
					d.value[i] = iChart.parseFloat(V,this.type+':data['+j+','+i+']');
					if(!d.color)
					d.color = iChart.get(j);
					//NEXT 此总数需考虑?
					this.total+=V;
					M = V>M?V:M;
					MI = V<MI?V:MI;
					
					item.push({
						name:d.name,
						value:d.value[i],
						color:d.color
					});
				}
				this.columns.push({
					name:this.columnKeys[i],
					item:item
				});
				
			}
			this.push('minValue',MI);
			this.push('maxValue',M);
			this.push('total',this.total);
		};
		return {
			parser:function(data){
				
				this.data = this.get('data');
				if(this.dataType=='simple'){
					simple.call(this);
				}else if(this.dataType=='complex'){
					complex.call(this);
				}
			},
			_3D:function(){
				if(this.is3D()){
					var P = iChart.vectorP2P(this.get('xAngle'),this.get('yAngle'));
					this.push('xAngle_',P.x);
					this.push('yAngle_',P.y);
				}
			},
			_2D:'2d',
			coordinate2d:function(){
				return new iChart.Coordinate2D(iChart.apply({
					kedu:{
						 position:this.get('keduAlign'),	
						 max_scale:this.get('maxValue'),
						 min_scale:this.get('minValue')
					}
				},this.get('coordinate')),this);
			},
			coordinate3d:function(){
				return new iChart.Coordinate3D(iChart.apply({
					kedu:{
						 position:this.get('keduAlign'),	
						 scaleAlign:this.get('keduAlign'),	
						 max_scale:this.get('maxValue'),
						 min_scale:this.get('minValue')
					}
				},this.get('coordinate')),this);
			},
			coordinate:function(){
				
				/**
				 * calculate  chart's measurement
				 */
				var w = this.pushIf('coordinate.width',this.get('client_width')*0.8),
					h=this.pushIf('coordinate.height',this.get('client_height')*0.8);
				
				/**
				 * calculate chart's alignment
				 */
				if (this.get('align') == 'left') {
					this.push('originx',this.get('l_originx'));
				}else if (this.get('align') == 'right'){
					this.push('originx',this.get('r_originx')-w);
				}else{
					this.push('originx',this.get('centerx')-w/2);
				}
				
				this.push('originx',this.get('originx')+this.get('offsetx'));
				this.push('originy',this.get('centery')-h/2+this.get('offsety'));
				
				if(!this.get('coordinate.valid_width')||this.get('coordinate.valid_width')>w){
					this.push('coordinate.valid_width',w);
				}
				
				if(!this.get('coordinate.valid_height')||this.get('coordinate.valid_height')>h){
					this.push('coordinate.valid_height',h);
				}
				
				/**
				 * originx for short
				 */
				this.x = this.get('originx');
				/**
				 * 
				 * originy for short 
				 */
				this.y = this.get('originy');
				
				this.push('coordinate.originx',this.x);
				this.push('coordinate.originy',this.y);
				
			}
		}	
	}();
