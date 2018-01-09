QuickSort.prototype = AsbtractSortData.prototype

function QuickSort(config) {
	this.init(config);
	// 排序最坏情况配置:如果true则表示随机获取基准，否则的话选定数组右边界为基准
	this.worst = true;
}

QuickSort.prototype.sort = function(){
	let arr = this.data.slice(),
	renderArr = this.data.slice();
	this.highlight([-1,-1,0,-1]);
	this._quickSort(arr,0,arr.length);
	this.highlight([-1,-1,-1,arr.length]);
	this.render(renderArr);
}

QuickSort.prototype.draw = function(step,arr){
	let ctx = this.ctx;
	ctx.clearRect(0,0,this.width,this.height);
	let w = this.lineWidth,
	a = step.indexes[0],
	b = step.indexes[1],
	l = step.indexes[2],
	r = step.indexes[3];
	ctx.fillStyle = '#999999';
	for (let i = 0; i < arr.length; i++) {
		if (i === l) {
			// 蓝色
			ctx.fillStyle = '#445D95';
		} else if (i === b) {
			ctx.fillStyle = '#139CE6';
		} else if (i === r) {
			ctx.fillStyle = '#F5653B';
		}else if (i > l && i < a){
			ctx.fillStyle = '#C6C6C6';
		} else if(i > a && i < r) {
			ctx.fillStyle = '#999999';
		} else {
			ctx.fillStyle = '#999999';
		}
		ctx.fillRect(i*w+1, this.height , w - 1, -arr[i]);
	}
	ctx.fill();
}

QuickSort.prototype.quick = function(arr,indexes){
	// indexes包含渲染时的关键颜色判断条件，其中第一个和第二个索引表示要交换的两个元素的下标
	SortUtils.swap(arr,indexes[0],indexes[1]);
	this.steps.push(new Step('swap',indexes,null));
}

QuickSort.prototype._quickSort = function(arr,l,r){
	if (l >= r) {
		return;
	}
	let p = this._partition(arr,l,r);
	this._quickSort(arr,l,p-1);
	this._quickSort(arr,p+1,r);
}

QuickSort.prototype._partition = function(arr,l,r){
	let v = arr[l],
	j = l;
	if (this.worst) {
		let p = Math.floor(Math.random() * (r-l)) + l;
		this.quick(arr,[p,l,l,r]);
		v = arr[l];
	}
	this.highlight([l,-1,l,r]);
	for(let i = l + 1;i <= r;i++){
		if(arr[i] < v){
			this.quick(arr,[j+1,i,l,r]);
			j++;
		}
	}
	this.quick(arr,[l,j,l,r]);
	return j;
}