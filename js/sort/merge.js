
MergeSort.prototype = AsbtractSortData.prototype;

function MergeSort(config) {
	this.init(config);
}

MergeSort.prototype.setPosition = function(l,r,m){
    this.steps.push(new Step('highlight',[l,r,m,-1,-1],null));
}

MergeSort.prototype.mergeStep = function(l,r,k,v){
    this.steps.push(new Step('merge',[l,r,k,v],null));
}

MergeSort.prototype.sort = function(){
    let arr = this.data.slice(),
    len = arr.length,
    renderArr = this.data.slice();
    // 排序开始之前记录一次
    this.setPosition(-1,-1,-1);
	// this.mergeSort(arr,0,len - 1);
    this.mergeSort2(arr);
    // 排序结束之后记录一次
    this.setPosition(0,len - 1,len - 1);
    this.render(renderArr);
}

MergeSort.prototype.draw = function(step, arr){
    let ctx = this.ctx;
    ctx.fillStyle = '#979797';
    ctx.clearRect(0,0,this.width,this.height);

    let w = this.lineWidth,
    left = step.indexes[0],
    right = step.indexes[1],
    mergeIndex = step.indexes[2],
    val = step.indexes[3];
    for (let i = 0; i < arr.length; i++) {
        if (i >= left && i <= right) {
            ctx.fillStyle = '#FFAA25';
        } else {
            ctx.fillStyle = '#979797';
        }
        if (i >= left && i <= mergeIndex) {
             ctx.fillStyle = '#EA2000';
        }
        ctx.fillRect(i*w+1, this.height , w - 1, -arr[i]);
    }
    ctx.fill();
}

// 自上而下的归并排序算法
MergeSort.prototype.mergeSort = function (arr,l,r){
    if (l >= r) {
        return;
    }
    this.setPosition(l,r,-1);
    let mid = Math.floor((l+r) / 2);
    this.mergeSort(arr,l,mid);
    this.mergeSort(arr,mid+1,r);
    this.merge(arr,l,mid,r);
}

// 自底而上的归并排序算法
MergeSort.prototype.mergeSort2 = function(arr){
    let len = arr.length;
    for (let sz = 1; sz < len; sz = sz + sz) {// sz子数组大小
        for (let low = 0; low < len - sz; low += sz + sz) {// low: 子数组索引
            this.merge(arr, low, low + sz - 1, Math.min(low + sz + sz - 1, len - 1));
        }
    }
}


MergeSort.prototype.merge= function (arr,l,mid,r){
    let aux = [];
    for(let k = l; k <= r; k++){
        aux[k-l] = arr[k];
    }
    let i = l,j = mid + 1;
    for(let k = l; k <= r; k++){
        if (i > mid) {
            arr[k] = aux[j-l];
            j++;
        }else if(j > r){
            arr[k] = aux[i-l];
            i++;
        }else if(aux[i - l] < aux[j - l]){
            arr[k] = aux[i-l]; i++;
        } else {
            arr[k] = aux[j-l]; j++;
        }
        this.mergeStep(l,r,k,arr[k]);
    }
}