
/**
 * 迷宫数据对象
 * @param {[string]} fileInputClassName [文件选择元素id名]
 */
function Maze(fileInputId) {
	let fileInput = document.querySelector('#'+fileInputId),
	reader,
	self = this;
	this.fileInput = fileInputId;
	this.reader = reader;
	this.wall = '=';
	this.road = ' ';
	fileInput.onchange = (event) => {
		let files = event.target.files;
		reader = new FileReader();
		reader.readAsText(files[0],'UTF-8');
		reader.onloadend = (target) => {
			self.mazeText = reader.result
			self.parse2Array();
		}

	}
}

Maze.prototype.parse2Array = function() {
	let txt = this.mazeText,
	lineRegex = /\n/g;
	// 将文本信息转换成字符串数组
	let arr = txt.split(lineRegex);
	// 第一行信息表示为数组的范围
	let range = arr[0];
	let rangeArr = range.split(' ');
	let n = parseInt(rangeArr[0]), 
	m = parseInt(rangeArr[1]);
	if (!n || !m) {
		console.error('error: this is not a correct maze file');
		return; 
	}
	let mazeArr = [];
	for(let i = 1; i < arr.length; i++){
		let lineArr = arr[i].split('');
		mazeArr[mazeArr.length] = lineArr;
	}
	this.n = n;
	this.m = m;
	this.mazeArr = mazeArr;
};

Maze.prototype.getMaze = function(i,j){
	if (i > n || j > m || i < 0 || j < 0) {
		console.error('error: ArrayIndexOutOfBoundsException'); 
		return
	}
	return this.mazeArr[i][j];
}

Maze.prototype.createMazeMap = function(canvas){
	let ctx = canvas.getContext('2d'),
	n = this.n,
	m = this.m,
	wall = this.wall,
	mazeArr = this.mazeArr,
	w = 3,
	h = 2;

	canvas.width = 3 * n;
	canvas.height = 2 * m;

	for(let i = 0; i < n; i++){
		for(let j = 0; j < m; j++){
			if (mazeArr[i][j] === wall) {
				ctx.fillStyle = '#009EF3'
			} else {
				ctx.fillStyle = '#fff'
			}
			ctx.fillRect(j * w, i * h, w , h);
		}
		ctx.fill();
	}
}