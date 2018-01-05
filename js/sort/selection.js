
SelectionSort.prototype = AsbtractSortData.prototype

function SelectionSort(len,bound){
	this.init(len,bound);
	this.render(0, 0);
}

SelectionSort.prototype.sort = function(){
	let self 	= this,
	time 		= 0,
	arr 		= this.data.slice(),
	renderArr	= this.data.slice();
	for (let i = 0; i < arr.length; i++) { 
		let sorted = i; 
	    for (let j = i + 1; j < arr.length; j++) { 
			if (arr[j] < arr[sorted]) {
				sorted = j;
			}
			self.highlight(i,j,0);
    	}
		self.swap(arr,sorted,i,0);	
    }
	self.render(renderArr);
}

SelectionSort.prototype.draw = function(step, arr){
	let ctx 		= this.ctx;
	ctx.fillStyle 	= '#979797';
	ctx.clearRect(0,0,this.width,this.height);

	let w 			= this.lineWidth,
	sorted 			= step.indexes[0],
	index 			= step.indexes[1];
	for (let i = 0; i < arr.length; i++) {
		if (i < sorted || sorted == arr.length - 1) {
			ctx.fillStyle = '#FFAA25';
		} else if(i === index){
			ctx.fillStyle = '#7BBFF3';
		} else if(i === index){
			ctx.fillStyle = '#5495F1';
		} else{
			ctx.fillStyle = '#979797';
		}
		ctx.fillRect(i*w+1, this.height , w - 1, -arr[i]);
	}
	ctx.fill();
}
