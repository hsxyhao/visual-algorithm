
let DEFAULT = {
	len: 10,
	bound: 100,
	parent: 'body',
	sortedColor:'red'
}

function Step(type,indexes,times){
	// 排序算法每一步骤的操作类型: swap、highlight
	this.type = type;
	// 操作步骤中最关键的索引
	this.indexes = indexes;
	// 操作步骤的轮数
	this.times = times;
}

Step.prototype.StepType = {
	SWAP:'swap',
	HIGHTLIGHT:'highlight'
}

Step.prototype.forward = function(arr){
	let a = this.indexes[0],
		b = this.indexes[1];
	if (this.type === this.StepType.SWAP) {
		SortUtils.swap(arr, a, b);
	}
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
		data[data.length] = len - i;
		// data[data.length] = Math.round(Math.random() * bound);
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

	// 排序操作步骤记录数组
	this.steps = [];
}

AsbtractSortData.prototype.swap = function(arr,a,b,times){
	SortUtils.swap(arr,a,b);
	this.steps.push(new Step('swap',[a,b],times));
}

let SortUtils = {
	swap:function(arr,i,j){
		let temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
}
