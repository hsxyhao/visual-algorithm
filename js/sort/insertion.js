
// 插入排序在数据元素近乎有序的情况下算法复杂度是接近O(n)的
InsertionSort.prototype = AsbtractSortData.prototype

function InsertionSort(config) {
	this.init(config);
	this.sortedIndex = -1;
	this.currentIndex = -1;
}

InsertionSort.prototype.setPositionInfo = function(sorted,current){
	this.sortedIndex = sorted;
	this.currentIndex = current;
	this.render();
}

// 使用setTimeout模拟线程睡眠，由于js是单线程的，所以如果使用循环模拟睡眠的话，页面会发生假死
InsertionSort.prototype.sleep = function(index,callback){
	(function(index){
		setTimeout(()=>{
			callback(index);
		},index * 200);
	})(index);
}
InsertionSort.prototype.sort = function() {
	let arr = this.data;
	this.setPositionInfo(0 ,-1);
	let $this = this;
	for(let i = 0; i < arr.length; i++){
		$this.sleep(i,(out)=>{
			$this.setPositionInfo(out, out);
		});
		$this.sleep(i,(out)=>{
			for(let j = out; j > 0 && arr[j] < arr[j-1]; j--){
				$this.swap(j,j-1);
				$this.setPositionInfo(out+1, j-1);
			}
		});
	}
	$this.sleep(arr.length,(out)=>{
		this.setPositionInfo(out ,-1);
	});
};

InsertionSort.prototype.render = function(){
	let data = this.data;
	let ctx = this.ctx;
	ctx.clearRect(0,0,this.width,this.height);
	let w = this.lineWidth;
	let sort = this.sortedIndex;
	let current = this.currentIndex;
	for(let i = 0; i < data.length; i++){
		if (i < sort) {
			ctx.fillStyle = '#FFAA25';
		} else { 
			ctx.fillStyle = '#9D9D9D';
		} 
		if (i == current) {
			ctx.fillStyle = '#498EF0';
		}
		ctx.fillRect(i*w+1, this.height , w - 1, -data[i]);
	}
	ctx.fill();
}