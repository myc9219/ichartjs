	/**
	 * @overview this component use for abc
	 * @component#@chart#iChart.Column3D
	 * @extend#iChart.Column
	 */
	iChart.Column3D = iChart.extend(iChart.Column,{
		/**
		 * initialize the context for the Column3D 
		 */
		configure:function(){
			/**
			 * invoked the super class's  configuration
			 */
			iChart.Column3D.superclass.configure.call(this);
			
			this.type = 'column3d';
			this.dimension = iChart._3D;
			
			this.set({
				/**
				 * @cfg {Number} Three-dimensional rotation X in degree(angle).socpe{0-90}(default to 60)
				 */
				xAngle:60,
				/**
				 * @cfg {Number} Three-dimensional rotation Y in degree(angle).socpe{0-90}(default to 20)
				 */
				yAngle:20,
				/**
				 * @cfg {Number} Three-dimensional z-axis deep factor.frame of reference is width(default to 1)
				 */
				zScale:1,
				/**
				 * @cfg {Number} Three-dimensional z-axis deep factor of pedestal.frame of reference is width(default to 1.4)
				 */
				bottom_scale:1.4
			});
		},
		doConfig:function(){
			iChart.Column3D.superclass.doConfig.call(this);
			
			var L = this.data.length,W = this.get('coordinate.width'),
			hw = this.pushIf('hiswidth',W/(L*2+1));
			/**
			 * common config
			 */
			if(this.get('bottom_scale')<1){
				hw = this.push('bottom_scale',1);
			}
			
			if(hw*L>W){
				this.push('hiswidth',W/(L*2+1));
			}
			
			this.push('zHeight',hw*this.get('zScale'));
			
			this.push('hispace',(W - hw*L)/(L+1));
			
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
			var S = this.coo.getScale(this.get('keduAlign')),
				Le = this.get('label.enable'),
				Te = this.get('tip.enable'),
				zh = this.get('zHeight')*(this.get('bottom_scale')-1)/2*this.get('yAngle_'),
				t,lt,tt,h,text,value,
				gw = hw+this.get('hispace'),
				H = this.coo.get('height');
			
			
			/**
			 * quick config to all rectangle
			 */
			this.push('rectangle.xAngle_',this.get('xAngle_'));
			this.push('rectangle.yAngle_',this.get('yAngle_'));
			this.push('rectangle.width',hw);
			
			for(var i=0;i<L;i++){
				text = this.data[i].name;
				value = this.data[i].value;
				t = text+":"+value;
				h = (this.data[i].value-S.start)*H/S.distance;
				
				if(Le){
					this.push('rectangle.label.text',this.fireString(this,'parseLabelText',[this.data[i],i],t));
				}
				
				if(Te){
					this.push('rectangle.tip.text',this.fireString(this,'parseTipText',[this.data[i],i],t));
				}
				
				text = this.fireString(this,'parseText',[this.data[i],i],text);
				value = this.fireString(this,'parseValue',[this.data[i],i],value);
				
				/**
				 * x = this.x + space*(i+1) + width*i
				 */
				this.push('rectangle.originx',this.x+this.get('hispace')+i*gw);//+this.get('xAngle_')*hw/2
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
					originx:this.x + this.get('hispace')+gw*i+hw/2,
	 				originy:this.y+H+this.get('text_space')
				},this));
				
			}
			this.pushComponent(this.labels);
			this.pushComponent(this.rectangles);
		}
		
});//@end