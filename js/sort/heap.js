HeapSort.prototype = AsbtractSortData.prototype

function HeapSort(config){
	this.init(config);
}

HeapSort.prototype.sort = function(){
	let arr = this.data.slice(),
	renderArr = this.data.slice();
	this.heapSort(arr);
	this.render(renderArr);
}

HeapSort.prototype.heapSort = function(arr){
	let len = arr.length;
	this.highlight(null,len);
	for(let i = (len - 2) / 2; i >= 0 ;i--){
		this.shiftDown(arr,len,i);
	}
	for(let i = len - 1; i > 0; i--){
		this.swap(arr,i,0,i);
		this.shiftDown(arr,i,0);
	}
	this.highlight(null,0);
}

HeapSort.prototype.shiftDown = function(arr,n,k){
	while(2*k+1 < n){
		let j = 2*k+1;
		if(j+1 < n && arr[j+1] > arr[j]){
			j++;
		}
		if (arr[k] >= arr[j]) {
			break;
		}
		this.swap(arr,k,j,n);
		k = j;
	}
}

HeapSort.prototype.draw = function(step, arr){
	// 获取关键绘画属性
	let ctx = this.ctx,
		w = this.lineWidth,
		sort = this.sortedIndex,
		current = this.currentIndex;

	// 清除上一次步骤的记录开始重新绘画
	ctx.clearRect(0,0,this.width,this.height);
	let index = step.other;
	for(let i = 0; i < arr.length; i++){
		if (i >= index) {
			ctx.fillStyle = '#FFAA25';
		} else {
			ctx.fillStyle = '#979797';
		}
		ctx.fillRect(i*w+1, this.height , w - 1, -arr[i]);
	}
	ctx.fill();
}

