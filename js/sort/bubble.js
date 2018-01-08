
BubbleSort.prototype = AsbtractSortData.prototype

function BubbleSort(config){
	this.init(config);
}

BubbleSort.prototype.sort = function(){
	let $this = this,
	arr = this.data.slice(),
	renderArr = this.data.slice();
	len = this.data.length;
	for(let i = 0; i < len - 1; i++){
		for (let j = 0; j < len - i -1; j++) {
			let times = len - i - 1;
			if (arr[j] > arr[j+1]){
				this.swap(arr, j, j+1, times);
			}else{
				this.highlight(j,j+1, times);
			}
		}
	}
	this.render(renderArr);
}
BubbleSort.prototype.draw = function(step, arr){
	// 获取关键绘画属性
	let ctx = this.ctx,
		w = this.lineWidth,
		sort = this.sortedIndex,
		current = this.currentIndex;

	// 清除上一次步骤的记录开始重新绘画
	ctx.clearRect(0,0,this.width,this.height);

	let index1 = step.indexes[0],
		index2 = step.indexes[1],
		// 代表当前循环的轮数
		times = step.other;

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

