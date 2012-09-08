	iChart.Interface = function(){
		var parse = function(n){
			return iChart.isNumber(n)?n:iChart.parseFloat(n,n);
		},
		simple = function(c,z) {
			var M=0,V=0,MI,ML=0;
			c.each(function(d,i){
				iChart.merge(d,this.fireEvent(this,'parseData',[this,d,i]));
				d.color = d.color || iChart.get(i);
				V  = d.value;
				if(iChart.isArray(V)){
					var T = 0;
					ML = V.length>ML?V.length:ML;
					for(var j=0;j<V.length;j++){
						V[j] = parse(V[j]);
						T+=V[j];
						if(!MI)
						MI = V;
						M = V[j]>M?V[j]:M;
						MI = V[j]<MI?V[j]:MI;
					}
					d.total = T;
				}else{
					V = parse(V);
					d.value = V;
					this.total+=V;
					M = V>M?V:M;
					if(!MI)
						MI = V;
					MI = V<MI?V:MI;
				}
			},this);
			
			if(iChart.isNumber(z)){
				Array.prototype.splice.apply(this.data,[z,0].concat(c));
			}else{
				this.data = this.data.concat(c);
			}
			
			if(this.get('minValue')){
				MI = this.get('minValue')<MI?this.get('minValue'):MI;
			}
			
			if(this.get('maxValue')){
				M = this.get('maxValue')<M?this.get('maxValue'):M;
			}
			
			if(iChart.isArray(this.get('data_labels'))){
				ML = this.get('data_labels').length>ML?this.get('data_labels').length:ML;
			}
			
			this.push('maxItemSize',ML);
			this.push('minValue',MI);
			this.push('maxValue',M);
			this.push('total',this.total);
			
			return c;
		},
		complex = function(c,z){
			this.data_labels = this.get('data_labels');
			var M=0,MI=0,V,d,L=this.data_labels.length;
			
			this.data = this.data.concat(c);
			
			this.data.each(function(d,i){
				iChart.merge(d,this.fireEvent(this,'parseData',[this,d,i,this.data_labels]));
				iChart.Assert.equal(d.value.length,L,this.type+':data length and data_labels not corresponding.');
			},this);
			
			for(var i=0;i<L;i++){
				var item = [];
				for(var j=0;j<this.data.length;j++){
					d = this.data[j];
					V = d.value[i];
					V =  parse(V,V);
					d.value[i] = V;
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
					name:this.data_labels[i],
					item:item
				});
			}
			
			
			
			this.push('minValue',MI); 
			this.push('maxValue',M);
			this.push('total',this.total);
		};
		return {
			parser:function(d,i){
				if(this.dataType=='simple'){
					return simple.call(this,[].concat(d),i);
				}else if(this.dataType=='complex'){
					complex.call(this,[].concat(d),i);
				}else{
					this.data = this.data.concat(d);
				}
			},
			_3D:function(){
				if(this.is3D()&&!this.get('xAngle_')){
					var P = iChart.vectorP2P(this.get('xAngle'),this.get('yAngle'));
					this.push('xAngle_',P.x);
					this.push('yAngle_',P.y);
				}
			},
			_2D:function(){
			},
			coordinate_:function(){
				if(this.is3D()){
					this.push('coordinate.xAngle_',this.get('xAngle_'));
					this.push('coordinate.yAngle_',this.get('yAngle_'));
					
					//the Coordinate' Z is same as long as the column's
					this.push('coordinate.zHeight',this.get('zHeight')*this.get('bottom_scale'));
					
					return new iChart.Coordinate3D(iChart.apply({
						scale:{
							 position:this.get('scaleAlign'),	
							 scaleAlign:this.get('scaleAlign'),	
							 max_scale:this.get('maxValue'),
							 min_scale:this.get('minValue')
						}
					},this.get('coordinate')),this);
				}else{
					return new iChart.Coordinate2D(iChart.apply({
						scale:{
							 position:this.get('scaleAlign'),	
							 max_scale:this.get('maxValue'),
							 min_scale:this.get('minValue')
						}
					},this.get('coordinate')),this);
				}
			},
			coordinate:function(){
				/**
				 * calculate  chart's measurement
				 */
				var f =0.9,
					_w = this.get('client_width'),
					_h = this.get('client_height'),
					w = this.pushIf('coordinate.width',Math.floor(_w*f)),
					h=this.pushIf('coordinate.height',Math.floor(_h*f));
				
				if(h>_h){
					h = this.push('coordinate.height',_h*f);
				}
				if(w>_w){
					w = this.push('coordinate.width',_w*f);
				}
				if(this.is3D()){
					h = this.push('coordinate.height',h - (this.get('coordinate.pedestal_height')||22) - (this.get('coordinate.board_deep')||20));
				}	
				
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
