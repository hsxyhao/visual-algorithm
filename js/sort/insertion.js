
// 插入排序在数据元素近乎有序的情况下算法复杂度是接近O(n)的
InsertionSort.prototype = AsbtractSortData.prototype

function InsertionSort(config) {
	this.init(config);
}


InsertionSort.prototype.sort = function() {
	let arr = this.data.slice(),
	renderArr = this.data.slice();
	// 排序开始时的高亮渲染
	this.highlight([0,-1]);

	for(let i = 0; i < arr.length; i++){
		this.highlight([i,i]);
		for(let j = i; j > 0 && arr[j] < arr[j-1]; j--){
			this.swap(arr,j,j-1,i+1);
			this.highlight([i+1,j-1]);
		}
	}
	// 排序结束时的高亮渲染
	this.highlight([arr.length,-1]);
	this.render(renderArr);
};

InsertionSort.prototype.draw = function(step, arr){
	let ctx = this.ctx;
	ctx.clearRect(0,0,this.width,this.height);

	let w = this.lineWidth,
	sort = step.other || step.indexes[0],
	current = step.indexes[1];
	for(let i = 0; i < arr.length; i++){
		if (i < sort) {
			ctx.fillStyle = '#FFAA25';
		} else { 
			ctx.fillStyle = '#979797';
		} 
		if (i == current) {
			ctx.fillStyle = '#498EF0';
		}
		ctx.fillRect(i*w+1, this.height , w - 1, -arr[i]);
	}
	ctx.fill();
}