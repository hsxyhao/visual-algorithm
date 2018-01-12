
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
		console.warn('error: this is not a correct maze file');
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
		path[i-1] = visiteItem.slice();
	}
	// 添加对象属性
	this.n = n;
	this.m = m;
	this.enterPos = {X:1,Y:0};
	this.existPos = {X:n - 2,Y:m-1};
	this.mazeArr = mazeArr;
	this.vistited = vistited;
	this.path = path;
	this.parse = true;
};

Maze.prototype.getMaze = function(i,j){
	if (i > this.n || j > this.m || i < 0 || j < 0) {
		console.warn('ArrayIndexOutOfBoundsException i：'+i+', j:'+j); 
		return;
	}
	return this.mazeArr[i][j];
}

Maze.prototype.solveMaze = function(){
	if (!this.ready) {
		console.warn('The map is not ready yet');
		return;
	}
	this.recursiveMove(this.enterPos.X,this.enterPos.Y);
	this.render();
}

/**
 * [stackMove 使用非递归(栈结构)解迷宫]
 * @param  {[type]} x [进入x坐标]
 * @param  {[type]} y [进入y坐标]
 * @return {[type]}   [description]
 */
Maze.prototype.stackMove = function(x,y){
	let stack = [];
	stack.push({x:x,y:y});
	this.vistited[x][y] = true;

}

/**
 * [recursiveMove 递归法解决迷宫问题]
 * @param  {[type]} x [进入x坐标]
 * @param  {[type]} y [进入y坐标]
 * @return {[type]}   [description]
 */
Maze.prototype.recursiveMove = function(x,y){
	let self = this;
	return self.stepMove(x,y,(nextX,nextY)=>{
		if(self.recursiveMove(nextX,nextY)){
			return true;
		};
	});
}
Maze.prototype.stepMove = function(x,y,callback){
	// 判断当前的坐标在不在迷宫地图中
	if (!this.stepInMaze(x,y)) {
		console.error('The current step is not a valid position');
		return;
	}
	// 标志该位置已经被访问
	this.vistited[x][y] = true;
	this.steps.push(new Step(x,y,true));
	// 判断当前坐标是不是迷宫出口
	if (x === this.existPos.X && y === this.existPos.Y) {
		console.log('找到出口');
		return true;
	}

	for (let i = 0; i < 4; i++) {
		let nextX = x + this.drection[i][0],
			nextY = y + this.drection[i][1];
		if (this.stepInMaze(nextX,nextY) 
			&& this.getMaze(nextX,nextY) === this.road
			&& !this.vistited[nextX][nextY]) {
			if(callback && callback(nextX,nextY)){
				return true;
			};
		}
	}
	this.steps.push(new Step(x,y,false));
	return false;
}

Maze.prototype.stepInMaze = function(x,y){
	if (x < this.n && y < this.m) {
		return true;
	}
	return false;
}

Maze.prototype.render = function(){
	let self = this,
	path = this.path;
	(function animation(){
		if (self.steps.length <1) {
			clearInterval(self.intervalId);
			return;
		}
		let step = self.steps.shift();
		step.forward(path);
		self.drawMap(path);
		self.timeoutId = setTimeout(animation,4);
	})();
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

/**
 * [drawMap 绘制地图]
 * @param  {[Array]} path [路径数组]
 * @return {[type]}      [description]
 */
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

/**
 * [Step 迷宫探索步骤对象]
 * @param {[integer]} x [迷宫x坐标]
 * @param {[integer]} y [迷宫y坐标]
 */
function Step(x,y,value){
	this.x = x;
	this.y = y;
	this.v = value;
}

Step.prototype.forward = function(path){
	path[this.x][this.y] = this.v;
}