
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
			(function(i,j){
				setTimeout(() => {
					if (data[i] > data[j]){
						$this.swap(i, j);
					}
					$this.render(i,j);
				// 排序交换延迟
				},time++);
			})(i,j);
		}
	}
}

BubbleSort.prototype.render = function(sorted,index){
	let data = this.data;
	let ctx = this.ctx;
	ctx.clearRect(0,0,this.width,this.height);
	let w = this.lineWidth;
	for (let i = 0; i < data.length; i++) {
		if (i < sorted || sorted == data.length - 1) {
			ctx.fillStyle = '#E65A41';
		} else if(i === sorted){
			ctx.fillStyle = '#45579F';
		} else if(i === index){
			ctx.fillStyle = '#1192D6';
		} else{
			ctx.fillStyle = '#979797';
		}
		ctx.fillRect(i*w+1, this.height , w - 1, -data[i]);
	}
	ctx.fill();
}
