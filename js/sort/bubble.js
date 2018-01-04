
BubbleSort.prototype = AsbtractSortData.prototype


let SortUtils = {
	swap:function(arr,i,j){
		let temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
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

function BubbleSort(config){
	this.init(config);
	this.steps = [];
}

BubbleSort.prototype.swap = function(arr,a,b,times){
	SortUtils.swap(arr,a,b);
	this.steps.push(new Step('swap',[a,b],times));
}

BubbleSort.prototype.sort = function(){
	let $this 	= this,
	arr 		= this.data.slice(),
	renderArr	= this.data.slice();
	len 		= this.data.length;
	for(let i = 0; i < len - 1; i++){
		for (let j = 0; j < len - i -1; j++) {
			if (arr[j] > arr[j+1]){
				this.swap(arr, j, j+1, len - i - 1);
			}else{
				this.steps.push(new Step('highlight',[j,j+1],len - i - 1));
			}
		}
	}
	this.render(renderArr);
}
BubbleSort.prototype.draw = function(step, arr){
	// 获取关键绘画属性
	let ctx 	= 	this.ctx,
		w 		= 	this.lineWidth,
		sort 	= 	this.sortedIndex,
		current = 	this.currentIndex;

	// 清除上一次步骤的记录开始重新绘画
	ctx.clearRect(0,0,this.width,this.height);

	let index1 = step.indexes[0],
		index2 = step.indexes[1],
		times = step.times;

	for(let i = 0; i < arr.length; i++){
		if (i > times || times === 1){
			ctx.fillStyle = '#FFAA25';
		}else if(i === index1){
			ctx.fillStyle = '#5495F1';
		}else if(i < times) {
			ctx.fillStyle = '#979797';
		}
		ctx.fillRect(i*w+1, this.height , w - 1, -arr[i]);
		console.log();
	}
	ctx.fill();
}

BubbleSort.prototype.render = function(arr){
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
