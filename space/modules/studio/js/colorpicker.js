HTMLElement.prototype.colorpicker = function(s){

	var s = s || {};

	var size = s.size || 100;

	var el = function(type){return document.createElement(type);}

	HTMLElement.prototype.css = function(css){ 
		for(x in css) this.style[x] = css[x]; 
		return this;
	}

	this.holder = el('div');

	this.holder.style.padding = '10px';

	this.pickerHolder = el('div');

	this.pickerHolder.css({
		position : 'relative',
		float    : 'left'
	});

	this.picker = el('canvas');
	this.pickerCtx = this.picker.getContext('2d');

	this.picker.css({
		border : '1px solid #C9C9C9',
		width  : size+'px',
		height : size+'px',
		cursor : 'crosshair'
	});

	this.picker.setAttribute('width',size+'px');
	this.picker.setAttribute('height',size+'px');

	this.pickerTarget = el('div').css({
		position : 'absolute'
	});

	this.colorHolder = el('div');
	this.colorHolder.css({
		position : 'relative',
		float    : 'left',
		cursor   : 'pointer'
	});

	this.color = el('canvas');
	this.colorCtx = this.color.getContext('2d');

	var colorSize = (size / 10) + 5;

	this.color.css({
		float  	   : 'left',
		marginLeft : '5px',
		width  	   : colorSize+'px',
		height 	   : (size+2)+'px'
	});

	this.colorKnob = el('div').css({
		position 	 : 'absolute',
		width 		 : colorSize+'px',
		height 		 : '2px',
		top 		 : (size/2)+'px',
		border		 : '1px solid #000',
		borderRadius : '3px',
		right 		 : '-1px'
	});

	this.clearer = el('div').css({ clear : 'both' });
	

	this.alphaHolder = el('div').css({
		position : 'relative'
	});

	this.alpha = el('canvas').css({
		width  : size + 'px',
		height : (colorSize/1.5) + 'px',
		border : '1px solid #ccc'
	});

	this.alphaCtx = this.alpha.getContext('2d');

	this.alpha.setAttribute('width',size+'px');
	this.alpha.setAttribute('height',(colorSize/1.5)+'px');

	this.alphaKnob = el('div').css({
		position   : 'absolute',
		height     : (colorSize/1.5) + 'px',
		width      : '3px',
		border     : '1px solid #000',
		top        : '0px',
		background : '#000',
		left       : size+'px',
		cursor     : 'pointer'
	});

	this.colorName = el('input').css({
		marginTop  : '0px',
		width      : size+'px',
		background : 'none',
		border 	   : 'none'	
	});

	this.colorName.setAttribute('readonly','readonly');

	this.pickerHolder.appendChild(this.picker);
	this.pickerHolder.appendChild(this.pickerTarget);

	this.colorHolder.appendChild(this.color);
	this.colorHolder.appendChild(this.colorKnob);

	if(s.rgba) {this.alphaHolder.appendChild(this.alpha);
	this.alphaHolder.appendChild(this.alphaKnob);}

	this.holder.appendChild(this.pickerHolder);
	this.holder.appendChild(this.colorHolder);
	this.holder.appendChild(this.clearer);
	this.holder.appendChild(this.alphaHolder);
	this.holder.appendChild(this.colorName);

	var su = 100;

	var rowSize = size / su;

	var alphaCtx = this.alphaCtx;

	function draw(ctx, hue){
	    for(row=0; row<su; row++){
	        var grad = ctx.createLinearGradient(0, 0, su*rowSize,0);
	        grad.addColorStop(0, 'hsl('+hue+', 100%, '+(su-row)+'%)');
	        grad.addColorStop(1, 'hsl('+hue+', 0%, '+(su-row)+'%)');
	        ctx.fillStyle=grad;
	        ctx.fillRect(0, row*rowSize, su*rowSize, 1*rowSize);
	    }   
	}

	function drawAlpha(ctx,r,g,b){
		var grad = ctx.createLinearGradient(0, 0, size,(size/1.5));
	        grad.addColorStop(0, 'rgba('+r+','+g+','+b+',0)');
	        grad.addColorStop(1, 'rgba('+r+','+g+','+b+',1)');
	        ctx.fillStyle=grad;
	        ctx.fillRect(0, 0, size,(size/1.5));
	}

	function line(dc,color,x1,y1,x2,y2)
	{
	  dc.strokeStyle = color;    // set the color
	  dc.beginPath();            // create the path
	  dc.moveTo(x1,y1);
	  dc.lineTo(x2,y2);
	  dc.stroke();               // stroke along the path
	}

	function hslColor(h,s,l)
	{
	  return 'hsl(' + h + ',' + s + '%,' + l + '%)';
	}

	var h = 150;
	var w = 500;

	for (var i = 0; i < h; ++i) {
	  var ratio = i/h;
	  var hue = Math.floor(360*ratio);
	  var sat = 300;
	  var lum = 50;
	  line(this.colorCtx, hslColor(hue,sat,lum), 0, 0+i, 0+w, i);
	}

	draw(this.pickerCtx,360/2);

	var pickerCtx = this.pickerCtx;
	var alphaKnob = this.alphaKnob;
	var colorPress = false;
	var alphaPress = false;
	var that = this;

	var currentAlpha = 1;

	this.color.onmousedown = function(e){
		colorPress = true;
	}

	this.alpha.onmousedown = function(){
		alphaPress = true;
	}

	this.alphaKnob.onmousedown = function(){
		alphaPress = true;
	}

	colorChoose = function(e){
		that.colorKnob.css({
			position     : 'absolute',
			width        : colorSize+'px',
			height       : '1px',
			top          : e.offsetY+'px',
			border       : '1px solid #000',
			borderRadius : '3px',
			right        : '0px'
		});
		draw(pickerCtx,e.offsetY/size*360);
	}

	this.color.onclick = colorChoose;

	this.color.onmousemove = function(e){
		if(colorPress) {
			colorChoose(e);
			pickerChoose();
		}
	}

	this.alpha.onmousemove = function(e){
		if(alphaPress){
			alphaKnob.css({
				position   : 'absolute',
				height     : (colorSize/1.5) + 'px',
				width      : '3px',
				border     : '1px solid #000',
				top        : '0px',
				background : '#000',
				left       : e.offsetX+'px',
				cursor     : 'pointer'
			});
			currentAlpha = e.offsetX / size;
			pickerChoose();
		}
	}

	function rgba2hex(r, g, b, a) {
	    if (r > 255 || g > 255 || b > 255 || a > 255)
	        throw "Invalid color component";
	    return (256 + r).toString(16).substr(1) +((1 << 24) + (g << 16) | (b << 8) | a).toString(16).substr(1);
	}

	var pickerPress = false;

	this.picker.onmousedown = function(){
		pickerPress = true;
	}

	var pickerChoose = function(e){
		var x,y;
		if(e){
			x = e.offsetX;
			y = e.offsetY;
			cx = x;
			cy = y;
		}else{
			x = cx;
			y = cy;
		}
		var pix = that.pickerCtx.getImageData(x, y, 1, 1).data;
		pix[3] = currentAlpha;
		var rgba = [pix[0],pix[1],pix[2],currentAlpha];
		var hex = '#'+rgba2hex.apply(null,rgba);
		hex = hex.substring(0,hex.length-2);
		drawAlpha(alphaCtx,rgba[0],rgba[1],rgba[2]);
		if(s.onPick && !init) s.onPick(rgba,hex);
		init = false;
		that.colorName.value = hex;
		if(s.rgba) that.colorName.value = 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+','+rgba[3]+')';
		that.pickerTarget.css({
			position     	: 'absolute',
			left 		 	: x+'px',
			top 		 	: y+'px',
			width 		 	: '2px',
			height 		 	: '2px',
			border 		 	: '1px solid #000',
			backgroundColor : '#000',
			borderRadius    : '10px'
		});
		return rgba;
	}

	this.picker.onclick = pickerChoose;

	this.picker.onmousemove = function(e){
		if(pickerPress) pickerChoose(e);
	}

	document.onmouseup = function(e){
		colorPress = false;
		pickerPress = false;
		alphaPress = false;
	}

	var cx = 0;
	var cy = 0;

	var init = true;

	var rgba = pickerChoose();

	drawAlpha(alphaCtx,rgba[0],rgba[1],rgba[2]);

	this.appendChild(this.holder);

}