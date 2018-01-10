QuickSort.prototype = AsbtractSortData.prototype

function QuickSort(config) {
	this.init(config);
	// 排序最坏情况配置:如果true则表示随机获取基准，否则的话选定数组右边界为基准
	this.worst = true;

	this.sortType = 'three';
}

QuickSort.prototype.sort = function(){
	let arr = this.data.slice(),
	renderArr = this.data.slice(),
	len = arr.length;

	// 选择默认的排序类型
	if (!this.sortType || this.sortType === 'default' || this.sortType === 'one') {
		this._partition = this.oneWay;
		this._paint = this.oneDraw;
		this.quickSort = this._quickSort;
	} else if(this.sortType === 'two'){
		len--;
		this._partition = this.twoWays;
		this._paint = this.twoDraw;
		this.quickSort = this._quickSort;
	} else if (this.sortType === 'three') {
		len--;
		this._partition = this.threeWays;
		this._paint = this.threeDraw;
		this.quickSort = this._quickSortThreeWays;
	}
	this.highlight([-1,-1,-1,-1,-1]);
	console.log(arr);
	this.quickSort(arr,0,len);
	console.log(arr);
	this.highlight([-1,-1,-1,-1,-1]);
	this.render(renderArr);
}

QuickSort.prototype.oneDraw = function(step,arr){
	let ctx = this.ctx;
	ctx.clearRect(0,0,this.width,this.height);
	ctx.fillStyle = '#999999';
	let w = this.lineWidth,
	a = step.indexes[0],
	b = step.indexes[1],
	l = step.indexes[2],
	r = step.indexes[3];
	for (let i = 0; i < arr.length; i++) {
		if (i > l && i < r){
			ctx.fillStyle = '#52995A';
		} else {
			ctx.fillStyle = '#999999';
		}
		if (i === l) {
			// 基准
			ctx.fillStyle = '#445D95';
		} 
		if (i === b) {
			// 排序游标
			ctx.fillStyle = '#139CE6';
		} 
		if (i === r) {
			// 数组右边界
			ctx.fillStyle = '#F5653B';
		}
		ctx.fillRect(i*w+1, this.height , w - 1, -arr[i]);
	}
	ctx.fill();
}

QuickSort.prototype.twoDraw = function(step,arr){
	let ctx = this.ctx;
	ctx.clearRect(0,0,this.width,this.height);
	ctx.fillStyle = '#999999';
	let w = this.lineWidth,
	a = step.indexes[0],
	b = step.indexes[1],
	l = step.indexes[2],
	r = step.indexes[3],
	c = step.indexes[4];
	for (let i = 0; i < arr.length; i++) {
		if (i > l && i < r){
			ctx.fillStyle = '#52995A';
		} else {
			ctx.fillStyle = '#999999';
		}
		if (i === l) {
			// 基准
			ctx.fillStyle = '#445D95';
		}else if (i > l && i <= c) {
			// 排序游标
			ctx.fillStyle = '#139CE6';
		}
		if (i >= b && i <= r) {
			// 排序游标
			ctx.fillStyle = '#139CE6';
		} 
		if (i === r) {
			// 数组右边界
			ctx.fillStyle = '#F5653B';
		}
		ctx.fillRect(i*w+1, this.height , w-1, -arr[i]);
	}
	ctx.fill();
}

QuickSort.prototype.threeDraw = function(step,arr){
	let ctx = this.ctx;
	ctx.clearRect(0,0,this.width,this.height);
	ctx.fillStyle = '#999999';
	let w = this.lineWidth,
	l = step.indexes[2],
	r = step.indexes[3],
	c = step.indexes[4],
	d = step.indexes[5];
	for (let i = 0; i < arr.length; i++) {
		if (i > l && i < r){
			ctx.fillStyle = '#52995A';
		} else {
			ctx.fillStyle = '#999999';
		}
		if (i === l) {
			// 基准
			ctx.fillStyle = '#445D95';
		}else if (i > l && i <= c) {
			// 排序游标
			ctx.fillStyle = '#139CE6';
		}
		if (i >= d && i <= r) {
			// 排序游标
			ctx.fillStyle = '#139CE6';
		} 
		if (i === r) {
			// 数组右边界
			ctx.fillStyle = '#F5653B';
		}
		ctx.fillRect(i*w+1, this.height , w-1, -arr[i]);
	}
	ctx.fill();
}

QuickSort.prototype.draw = function(step,arr){
	this._paint(step,arr);
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

QuickSort.prototype._quickSortThreeWays = function(arr,l,r){
	if (l >= r) {
		return;
	}
	let v = arr[l],
	lt = l,
	gt = r + 1,
	i = l + 1;
	while(i < gt){
		if (arr[i] < v) {
			this.quick(arr,[i,lt+1,l,r,i,gt]);
			lt++;
			i++;
		} else if (arr[i] > v) {
			this.quick(arr,[i,gt-1,l,r,i,gt]);
			gt--;
		} else {
			i++
			this.highlight([i,gt,l,r,i,gt]);
		}
	}
	this.quick(arr,[l,lt,l,r,i,gt]);

	this._quickSortThreeWays(arr,l,lt-1);
	this._quickSortThreeWays(arr,gt,r);
}

QuickSort.prototype.twoWays = function(arr,l,r){
	let v = arr[l],
	i = l+1, 
	j = r;
	// 使用随机方式决定快速排序基准
	if (this.worst) {
		let p = Math.floor(Math.random() * (r-l)) + l;
		this.quick(arr,[p,l,l,r]);
		v = arr[l];
	}
	while(true) {
		while(i<=r && arr[i] < v) {
			i++;
			this.highlight([i,j,l,r,i]);
		}
		while(j>=l+1&&arr[j] > v) {
			j--;
			this.highlight([i,j,l,r,i]);
		}
		if(i > j){
			break;
		}
		this.quick(arr,[i,j,l,r,i]);
		i++;
		j--;
	}
	this.quick(arr,[l,j,l,r,i]);
	return j;
}

QuickSort.prototype.oneWay = function(arr,l,r){
	let v = arr[l],
	j = l;
	// 使用随机方式决定快速排序基准
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
