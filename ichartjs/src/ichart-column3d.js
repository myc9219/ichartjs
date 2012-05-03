	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Column3D
	 * @extend#iChart.Column
	 */
	iChart.Column3D = iChart.extend(iChart.Column,{
		/**
		 * initialize the context for the Column3D 
		 */
		configure:function(config){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Column3D.superclass.configure.call(this);
			
			this.type = 'column3d';
			this.dataType = 'simple';
			this.dimension = iChart.Math._3D;
			
			this.configuration({
				xAngle:60,
				yAngle:20,
				/**
				 * 矩形z轴的深度系数-宽度为参照物
				 */
				zScale:1,
				/**
				 * 坐标z轴的底座深度系数-宽度为参照物 must ge 1
				 */
				bottom_scale:1.4
			});
		},
		doConfig:function(){
			iChart.Column3D.superclass.doConfig.call(this);
			
			/**
			 * common config
			 */
			if(this.get('bottom_scale')<1){
				this.push('bottom_scale',1);
			}
			
			if(!this.get('hiswidth')){
				this.push('hiswidth',this.get('coordinate.width')/(this.data.length*2+1));
			}
			
			if(this.get('hiswidth')*this.data.length>this.get('coordinate.width')){
				this.push('hiswidth',this.get('coordinate.width')/this.data.length/1.2);
			}
			
			this.push('zHeight',this.get('hiswidth')*this.get('zScale'));
			
			this.push('hispace',(this.get('coordinate.width') - this.get('hiswidth')*this.data.length)/(this.data.length+1));
			
			/**
			 * initialize coordinate
			 */
			this.push('coordinate.xAngle_',this.get('xAngle_'));
			this.push('coordinate.yAngle_',this.get('yAngle_'));
			//the Coordinate' Z is same as long as the column's
			this.push('coordinate.zHeight',this.get('zHeight')*this.get('bottom_scale'));
			
			//use option create a coordinate
			this.coo = iChart.Interface.coordinate3d.call(this);
			
			this.pushComponent(this.coo,true);
			
			/**
			 * initialize rectangles
			 */
			//get the max/min scale of this coordinate for calculated the height
			var coo = this.coo,
				S = coo.getScale(this.get('keduAlign')),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				zh = this.get('zHeight')*(this.get('bottom_scale')-1)/2*this.get('yAngle_'),
				t,lt,tt,h,text,value,
				gw = this.get('hiswidth')+this.get('hispace'),
				H = this.coo.get('height');
			
			
			
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.xAngle_',this.get('xAngle_'));
			this.push('rectangle.yAngle_',this.get('yAngle_'));
			this.push('rectangle.width',this.get('hiswidth'));
			this.push('rectangle.magic',coo.magic);
			
			for(var i=0;i<this.data.length;i++){
				t = this.data[i].name+":"+this.data[i].value;
				h = (this.data[i].value-S.start)*H/S.distance;
				if(Le){
					lt = this.fireEvent(this,'parseLabelText',[this.data[i],i]);
					this.push('rectangle.label.text',iChart.isString(lt)?lt:t);
				}
				if(Te){
					tt = this.fireEvent(this,'parseTipText',[this.data[i],i]);
					this.push('rectangle.tip.text',iChart.isString(tt)?tt:t);
				}
				text = this.fireEvent(this,'parseText',[this.data[i],i]);
				value = this.fireEvent(this,'parseValue',[this.data[i],i]);
				text = iChart.isString(text)?text:this.data[i].name;
				value = iChart.isString(value)?value:this.data[i].value;
				/**
				 * x = this.x + space*(i+1) + width*i
				 */
				this.push('rectangle.originx',this.x+this.get('hispace')+i*gw);//+this.get('xAngle_')*this.get('hiswidth')/2
				/**
				 * y = this.y + brushsize + h
				 */
				this.push('rectangle.originy',this.y +(H-h)-zh);
				this.push('rectangle.text',text);
				this.push('rectangle.value',value);
				this.push('rectangle.height',h);
				this.push('rectangle.background_color',this.data[i].color);
				this.push('rectangle.id',i);
				
				this.rectangles.push(new iChart.Rectangle3D(this.get('rectangle'),this));
				this.labels.push(new iChart.Text({
					id:i,
					text:text,
					originx:this.x + this.get('hispace')+gw*i+this.get('hiswidth')/2,
	 				originy:this.y+H+this.get('text_space')
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
			
			if(coo.magic)
				this.pushComponent(new iChart.Custom({
					drawFn:function(){
						coo.box();
					}
			},this));
			
			
			
			
		}
		
});