/**
 * 迷宫数据对象
 * @param {[string]} fileInputClassName [文件选择元素id名]
 */
function Maze() {
	this.drection = [[-1,0],[0,1],[1,0],[0,-1]];
	this.steps = [];
	// parse、ready分别表示地图解析状态以及地图绘制状态
	this.parse = false;
	this.ready = false;
}

Maze.prototype.initMazeData = function(n,m,arr){
	if (!arr || !arr.length) {
		return;
	}
	// 用于记录已经访问过的点
	let vistited = [],
	path = [],
	result = [];
	for(let i = 0; i <= n; i++){
		let visiteItem = [];
		for (let j = 0; j <= m; j++) {
			visiteItem[j] = false;
		}
		vistited[i] = visiteItem;
		path[i] = visiteItem.slice();
		result[i] = visiteItem.slice();
	}
	// 添加对象属性
	this.n = n;
	this.m = m;
	this.enterPos = {X:1,Y:0};
	this.existPos = {X:n - 2,Y:m-1};
	this.mazeArr = arr;
	this.vistited = vistited;
	this.result = result;
	this.path = path;
	this.parse = true;
	this.ready = true;
	this.wall = false;
	this.road = true;
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
	path = [],
	result = [];
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
		result[i-1] = visiteItem.slice();
	}
	// 添加对象属性
	this.n = n;
	this.m = m;
	this.enterPos = {X:1,Y:0};
	this.existPos = {X:n - 2,Y:m-1};
	this.mazeArr = mazeArr;
	this.vistited = vistited;
	this.result = result;
	this.path = path;
	this.parse = true;
	this.wall = '=';
	this.road = ' ';
};

/**
 * [solveMaze 迷宫求解，三种方式：深度递归优先，深度非递归优先，广度优先]
 * @return {[type]} [description]
 */
Maze.prototype.solveMaze = function(type){
	if (!this.ready) {
		console.warn('The map is not ready yet');
		return;
	}
	this.type = type;
	if (type === 1) {
		this.recursiveMove(this.enterPos.X,this.enterPos.Y);
	} else if (type === 2) {
		this.stackMove(this.enterPos.X,this.enterPos.Y);
	} else {
		this.heapMove(this.enterPos.X,this.enterPos.Y);
	}
	this.render();
}

/**
 * [findPath 回溯寻找路径]
 * @param  {[type]} pos [迷宫出口]
 * @return {[type]}     [description]
 */
Maze.prototype.findPath = function(pos){
	let cur = pos;
	while (cur!=null) {
		this.steps.push(new Step(cur.x,cur.y,2));
		cur = cur.prev;
	}
}

Maze.prototype.heapMove = function(x,y){
	let heap = [],
	isSolved = false;
	heap.push({x:x,y:y,prev:null});
	this.vistited[x][y] = true;
	while(heap.length > 0) {
		let pos = heap.shift();
		let x = pos.x,
		y = pos.y;
		this.steps.push(new Step(x,y,true));
		// 判断当前坐标是不是迷宫出口
		if (x === this.existPos.X && y === this.existPos.Y) {
			heap.push({x:this.existPos.X,y:this.existPos.Y,prev:pos});
			this.findPath(pos);
			isSolved = true;
			return true;
		}
		for (let i = 0; i < 4; i++) {
			let nextX = x + this.drection[i][0],
			nextY = y + this.drection[i][1];
			// 判断当前坐标是不是在迷宫范围内，是否不为墙，以及是否没有访问过
			if (this.stepInMaze(nextX,nextY) 
				&& this.getMaze(nextX,nextY) === this.road
				&& !this.vistited[nextX][nextY]) {
				heap.push({x:nextX,y:nextY,prev:pos});
				this.vistited[nextX][nextY] = true;
			}
		}
	}
	if (!isSolved) {
		console.warn('The maze has no solution');
	}
}

/**
 * [stackMove 使用非递归(栈结构)解迷宫]
 * @param  {[type]} x [进入x坐标]
 * @param  {[type]} y [进入y坐标]
 * @return {[type]}   [description]
 */
Maze.prototype.stackMove = function(x,y){
	let stack = [],
	isSolved = false;
	stack.push({x:x,y:y,prev:null});
	this.vistited[x][y] = true;
	while(stack.length > 0) {
		let pos = stack.pop();
		let x = pos.x,
		y = pos.y;
		this.steps.push(new Step(x,y,true));
		// 判断当前坐标是不是迷宫出口
		if (x === this.existPos.X && y === this.existPos.Y) {
			stack.push({x:this.existPos.X,y:this.existPos.Y,prev:pos});
			this.findPath(pos);
			isSolved = true;
			return true;
		}
		for (let i = 0; i < 4; i++) {
			let nextX = x + this.drection[i][0],
			nextY = y + this.drection[i][1];
			if (this.stepInMaze(nextX,nextY) 
				&& this.getMaze(nextX,nextY) === this.road
				&& !this.vistited[nextX][nextY]) {
				stack.push({x:nextX,y:nextY,prev:pos});
				this.vistited[nextX][nextY] = true;
			}
		}
	}
	if (!isSolved) {
		console.warn('The maze has no solution');
		return false;
	}
}

/**
 * [recursiveMove 递归法解决迷宫问题]
 * @param  {[type]} x [进入x坐标]
 * @param  {[type]} y [进入y坐标]
 * @return {[type]}   [description]
 */
Maze.prototype.recursiveMove = function(x,y){
	let self = this;
	return self.stepForward(x,y,(nextX,nextY)=>{
		if(self.recursiveMove(nextX,nextY)){
			return true;
		};
	});
}
Maze.prototype.stepForward = function(x,y,callback){
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
	return x < this.n && y < this.m;
}

Maze.prototype.getMaze = function(i,j){
	if (i > this.n || j > this.m || i < 0 || j < 0) {
		console.warn('ArrayIndexOutOfBoundsException i：'+i+', j:'+j); 
		return;
	}
	return this.mazeArr[i][j];
}

Maze.prototype.render = function(){
	let self = this,
	path = this.path;
	(function animation(){
		if (self.steps.length <1) {
			clearInterval(self.intervalId);
			return;
		}
		for(let i = 0; i < 20; i++){
			let step = self.steps.shift();
			if (step) {
				step.forward(path);
			}
		}
		self.drawMap(path);
		self.timeoutId = setTimeout(animation,4);
	})();
}

Maze.prototype.bindCanvas = function(n,m,canvas){
	this.canvas = canvas;
	canvas.width = 3 * n;
	canvas.height = 2 * m;
	this.ctx = canvas.getContext('2d');
}

/**
 * [createMazeMap 绘制迷宫地图]
 * @param  {[type]} canvas  [canvas绘图对象]
 * @param  {[Array]} mazeArr [迷宫地图原始数据]
 * @param  {[Array]} path    [求解地图已经走过的路径坐标]
 * @return {[type]}         [description]
 */
Maze.prototype.createMazeMap = function(){
	if (!this.parse) {
		console.warn("The map hasn't been parsed yet");
		return;
	}
	if (!this.ctx) {
		console.warn('the canvas context can not be null');
		return;
	}
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
				ctx.fillStyle = '#fff';
			}
			if (!path[i]) {
				console.log();
			}
			if (path[i][j]) {
				ctx.fillStyle = '#EEE448';
			}
			// 回溯寻找迷宫出口路线
			if (path[i][j] === 2) {
				ctx.fillStyle = '#fff';
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