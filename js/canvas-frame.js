
let DEFAULT = {
	parent:'body',
	width:500,
	height:500,
	padding:50,
	lineWeight:2,
	lineColor:'#000'
}

function CFrame(config){
	this.init(config);
}

CFrame.prototype.setCanvasStyle = function(style){
	let ctx = this.ctx;
	for (let item in style) {
		ctx[item] = style[item];
	}
}

CFrame.prototype.start = function(callback){
	let interval = setInterval(() => {
		if (this.isRunning) {
			callback();
		}
	},1);
	return interval;
}

CFrame.prototype.render = function(data){
	let ctx = this.ctx;
	let w = this.width / data.length; 
	let CanvasUtil = this.CanvasUtil;
	let y = 0,value = 0;
	ctx.clearRect(0,0,this.width,this.height);
	for(let i = 0; i < data.length; i++){
		if (data[i] > 0) {
			y = this.height / 2 - data[i];
			value = data[i];
			CanvasUtil.setFillColor(ctx,'#33B6FC');
		}else if(data[i] < 0){
			y = this.height / 2;
			value = -data[i];
			CanvasUtil.setFillColor(ctx,'#EA2000');
		}
		CanvasUtil.fillRect(ctx,i*w+1,y,w-1,value);
	}
}

CFrame.prototype.initTitle = function(title){
	let div = document.createElement('div');
	div.style.cssText = 'text-align:center';
	div.textContent = title;
	this.title = div;
	this.parent.insertBefore(div,this.canvas);
}

CFrame.prototype.init = function(con) {
	let initConfig = con || this.config || DEFAULT;
	this.width = initConfig.width || DEFAULT.width;
	this.height = initConfig.height || DEFAULT.height;
	this.padding = initConfig.padding || DEFAULT.padding;

	let style = {};
	style.lineWeight = initConfig.lineWeight || DEFAULT.lineWeight;
	style.lineWeight = initConfig.lineColor || DEFAULT.lineColor;
	this.style = style;
	let parent = initConfig.parent || DEFAULT.parent;
	let parentDom = document.querySelector(parent);
	this.parent = parentDom;

	let canvas = parentDom.querySelector('canvas');
	if (!canvas) {
		canvas = document.createElement('canvas');
		this.ctx = canvas.getContext('2d');
		parentDom.appendChild(canvas);
	}else{
		this.ctx = canvas.getContext('2d');
	}
	//设置canvas宽和高
	canvas.width = this.width - this.padding * 2; 
	canvas.height = this.height - this.padding * 2;

	this.CanvasUtil = {
		setLineColor:function(ctx,value){
			ctx.lineColor = value;
		},
		setLineWeight:function(ctx,value){
			ctx.lineWeight = value;
		},
		fillRect:function(ctx,x,y,width,height){
			ctx.fillRect(x,y,width,height);
		},
		setFillColor:function(ctx,color){
			ctx.fillStyle = color;
		}
	};
	
	this.isRunning = true;
	this.k = 1;

	this.canvas = canvas;
	let CanvasUtil = this.CanvasUtil;
	//初始化canvas样式
	CanvasUtil.setLineColor(this.ctx,this.style.lineColor);
	CanvasUtil.setLineWeight(this.ctx,this.style.lineWeight);

	this.initTitle(initConfig.title);

	let x = Math.abs(this.width - canvas.width)/2;
	let y = Math.abs(this.height - canvas.height - canvas.offsetTop)/2;
	this.canvas.style.margin = y+'px '+x+'px';
};