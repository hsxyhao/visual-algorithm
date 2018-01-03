
BubbleSort.prototype = AsbtractSortData.prototype

function BubbleSort(len,bound){
	this.init(len,bound);
	this.render();
}

BubbleSort.prototype.sort = function(){
	let data = this.data;
	let $this = this;
	let time = 0;
	for(let i = 0; i < data.length; i++){
		for (let j = i; j < data.length; j++) {
			(function(initData,i,j){
				setTimeout(() => {
					if ($this.isRunning) {
						$this.swap(initData, i, j);
					}
					$this.render(i,j);
				// 排序交换延迟
				},time+=10);
			})(data,i,j);
		}
	}
}

BubbleSort.prototype.render = function(sorted,index){
	let data = this.data;
	let ctx = this.ctx;
	ctx.clearRect(0,0,this.width,this.height);
	let w = this.lineWidth;
	for (let i = 0; i < data.length; i++) {
		if (i <= sorted) {
			ctx.fillStyle = '#FFAA25';
		} else if(i === index){
			ctx.fillStyle = '#FF0000';
		} else{
			ctx.fillStyle = '#33B6FC';
		}
		ctx.fillRect(i*w+1, this.height , w - 1, -data[i]);
	}
	ctx.fill();
}
