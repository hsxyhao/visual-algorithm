
let DEFAULT = {
	len: 10,
	bound: 100,
	parent: 'body',
	sortedColor:'red'
}

function AsbtractSortData(config){
	this.init(config);
}

AsbtractSortData.prototype.init = function(config){

	let con = config || DEFAULT;
	let len = config.len || DEFAULT.len;
	let bound = config.bound || DEFAULT.bound;
	let parent = config.parent || DEFAULT.parent;
	this.sortedColor = config.sortedColor || DEFAULT.sortedColor;

	this.length = len;
	this.randomBound = bound;
	let data = [];
	for(let i = 0;i < len; i++){
		data[data.length] = Math.round(Math.random() * bound);
	}
	this.data = data;

	let parentDom = document.querySelector(parent);
	let canvas = parentDom.querySelector('canvas');
	if (!canvas) {
		canvas = document.createElement('canvas');
		this.ctx = canvas.getContext('2d');
		parentDom.appendChild(canvas);
	}else{
		this.ctx = canvas.getContext('2d');
	}

	this.width = canvas.width;
	this.height = canvas.height;
	this.lineWidth = canvas.width / len;
	this.isRunning = true;

}

AsbtractSortData.prototype.swap = function(num1, num2) {
	let temp = this.data[num1];
	this.data[num1] = this.data[num2];
	this.data[num2] = temp;
};
