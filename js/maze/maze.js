
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
	this.drection = [[-1,0],[0,1],[1,0],[0,-1]];
	this.steps = [];
	// parse、ready分别表示地图解析状态以及地图绘制状态
	this.parse = false;
	this.ready = false;
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

	// 用于记录是否走过
	let vistited = [],
	path = [];
	if (!n || !m) {
		console.error('error: this is not a correct maze file');
		return; 
	}
	let mazeArr = [];
	for(let i = 1; i < arr.length; i++){
		let lineArr = arr[i].split(''),
		visiteItem = [];

		mazeArr[mazeArr.length] = lineArr;
		for (let j = 0; j < lineArr.length; j++) {
			visiteItem[j] = false;
		}
		vistited[i-1] = visiteItem;
		path[i-1] = visiteItem;
	}
	// 添加对象属性
	this.n = n;
	this.m = m;
	this.enterPos = {X:0,Y:1};
	this.existPos = {X:n - 1,Y:m - 2};
	this.mazeArr = mazeArr;
	this.vistited = vistited;
	this.path = path;
	this.parse = true;
};

Maze.prototype.getMaze = function(i,j){
	if (i > this.n || j > this.m || i < 0 || j < 0) {
		console.error('ArrayIndexOutOfBoundsException i：'+i+', j:'+j); 
		return;
	}
	return this.mazeArr[i][j];
}

Maze.prototype.solveMaze = function(){
	if (!this.ready) {
		console.warn('The map is not ready yet');
		return;
	}
	this.move(this.enterPos.X,this.enterPos.Y);
	this.render();
}

Maze.prototype.move = function(x,y){
	// 判断当前的坐标在不在迷宫地图中
	if (!this.stepInMaze(x,y)) {
		console.error('The current step is not a valid position');
		return;
	}
	let self = this;
	this.vistited[x][y] = true;
	this.steps.push(new Step(x,y));
	// 判断当前坐标是不是迷宫出口
	if (x === this.existPos.X && y === this.existPos.Y) {
		return;
	}

	for (let i = 0; i < 4; i++) {
		let nextX = x + this.drection[i][0],
			nextY = y + this.drection[i][1];
		if (this.stepInMaze(nextX,nextY) 
			&& this.getMaze(nextX,nextY) === this.road
			&& !this.vistited[nextX][nextY]) {
			this.move(nextX,nextY);
		}
	}
}

Maze.prototype.stepInMaze = function(x,y){
	if (x < this.n && y < this.m && x >= 0 && y >= 0) {
		return true;
	}
	return false;
}

Maze.prototype.render = function(){
	let self = this,
	path = this.path;
	function animation(){
		if (steps.length <1) {
			return;
		}
		let step = self.steps.unshift();
		step.forward(path);
		self.drawMap(path);
		self.timeoutId = setTimeout(animation,10);
	}
}

/**
 * [createMazeMap 绘制迷宫地图]
 * @param  {[type]} canvas  [canvas绘图对象]
 * @param  {[Array]} mazeArr [迷宫地图原始数据]
 * @param  {[Array]} path    [求解地图已经走过的路径坐标]
 * @return {[type]}         [description]
 */
Maze.prototype.createMazeMap = function(canvas){
	if (!this.parse) {
		console.warn("The map hasn't been parsed yet");
		return;
	}
	this.canvas = canvas;
	canvas.width = 3 * this.n;
	canvas.height = 2 * this.m;
	this.ctx = canvas.getContext('2d');
	this.drawMap(this.path);
	this.ready = true;
}

Maze.prototype.drawMap = function(path){
	let ctx = this.ctx,
	n = this.n,
	m = this.m,
	wall = this.wall,
	mazeArr = this.mazeArr,
	w = 3,
	h = 2;
	for(let i = 0; i < n; i++){
		for(let j = 0; j < m; j++){
			if (mazeArr[i][j] === wall) {
				ctx.fillStyle = '#009EF3'
			} else {
				ctx.fillStyle = '#fff'
			}
			if (path[i][j]) {
				ctx.fillStyle = '#EEE448'
			}
			ctx.fillRect(j * w, i * h, w , h);
		}
		ctx.fill();
	}
}


function Step(x,y){
	this.x = x;
	this.y = y;
}

Step.prototype.forward = function(path){
	path[this.x][this.y] = true;
}