
MergeSort.prototype = AsbtractSortData.prototype;

function MergeSort(config) {
	this.init(config);
}

MergeSort.prototype.sleep = function(time,callback){
	setTimeout(()=>{
		callback();
	},time);
}

MergeSort.prototype.sort = function(){
	console.log(mergeSort(this.data));
}

MergeSort.prototype.render = function(){
	
}

function mergeSort(arr) {  //采用自上而下的递归方法
    var len = arr.length;
    if(len < 2) {
        return arr;
    }
    let middle = Math.floor(len / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right){
    let result = [];

    while (left.length>0 && right.length>0) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());
    return result;
}