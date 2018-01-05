
let DEFAULT = {
	len: 10,
	bound: 100,
	parent: 'body',
	sortedColor:'red'
}

function Step(type,indexes,other){
	// 排序算法每一步骤的操作类型: swap、highlight
	this.type = type;
	// 操作步骤中最关键的索引
	this.indexes = indexes;
	// 排序其他的关键信息，每种排序显示的颜色数目、区域都有所不同，需要和indexes索引分开
	this.other = other;
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
		//测试备用初始化
		// data[data.length] = len - i; 
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

	// 排序操作步骤记录数组
	this.steps = [];
}

AsbtractSortData.prototype.swap = function(arr,a,b,other){
	SortUtils.swap(arr,a,b);
	this.steps.push(new Step('swap',[a,b],other));
}

AsbtractSortData.prototype.highlight = function(a,b,other){
	this.steps.push(new Step('highlight',[a,b],other));
}

AsbtractSortData.prototype.render = function(arr){
	let self = this;
	// 定义动画函数
	(function animation(){
		if (self.steps.length === 0) {
			clearInterval(self.intervalId);
			return;
		}
		let step = self.steps.shift();
		step.forward(arr);
		self.draw(step,arr);
		self.timeoutId = setTimeout(animation,100);
	})();
}

let SortUtils = {
	swap:function(arr,i,j){
		let temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
}
