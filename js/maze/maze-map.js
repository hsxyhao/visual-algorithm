let config = {
	W:3,
	H:2
}
/**
 * [MazeMap description]
 * @param {[integer]} n [迷宫行数,非偶数]
 * @param {[integer]} m [迷宫列数,非偶数]
 */
function MazeMap(n,m){
	if (n % 2 === 0 || m % 2 ===0) {
		console.warn('Illegal parameter');
		return;
	}
	this.n = n;
	this.m = m;
	this.enterPos = {X:1,Y:0};
	this.existPos = {X:n - 2,Y:m-1};
	this.random = 1;
	this.drection = [[-1,0],[0,1],[1,0],[0,-1]];// 上 右 下 左
	// this.drection = [[0,1],[1,0],[-1,0],[0,-1]]; 右 左 下 上
	this.steps = [];
}

MazeMap.prototype.inMaze = function(x,y){
	return x < this.n && y < this.m && x >= 0 && y >= 0;
}

MazeMap.prototype.draw = function(canvas) {
	this.canvas = canvas;
	canvas.width = this.n * config.W;
	canvas.height = this.m * config.H;
	let ctx = canvas.getContext('2d');
	if (this.timeoutId) {
		clearTimeout(this.timeoutId);
	}
	this.initData(this.n,this.m);
	// 绘制迷宫雏形 可注释跳过
	// this.oneStep(ctx, config.W, config.H);
	// 开始绘制迷宫
	this.startDraw(ctx, config.W, config.H);
};

MazeMap.prototype.initData = function(n,m){
	let map = [],
	visited = [],
	mist = [];
	for(let i = 0; i < n; i++){
		let mapItem = [],
		visitedItem = [];
		for(let j = 0; j < m; j++){
			if (i%2===1 && j%2 === 1) {
				mapItem[j] = true;
			} else {
				mapItem[j] = false;
			}
			visitedItem[j] = false;
		}
		map[i] = mapItem;
		visited[i] = visitedItem;
		mist[i] = visitedItem.slice();
	}
	map[this.enterPos.X][this.enterPos.Y] = true;
	map[this.existPos.X][this.existPos.Y] = true;
	this.map = map;
	this.visited = visited;
	this.mist = mist;
}

/**
 * [drawBase 绘制迷宫的雏形，可跳跃，帮助理解迷宫的生成思路]
 * @param  {[type]} ctx [canvas context对象]
 * @param  {[type]} w   [绘制宽度]
 * @param  {[type]} h   [绘制高度]
 * @return {[type]}     [description]
 */
MazeMap.prototype.drawBase = function(ctx,w,h) {
	let n = this.n,
	m = this.m;
	for(let i = 0; i < n; i++){
		for(let j = 0; j < m; j++){
			if (i%2===1 && j%2 === 1) {
				ctx.fillStyle = '#fff';
			} else {
				ctx.fillStyle = '#009EF4';
			}
			ctx.fillRect(j * w, i * h, w , h);
		}
	}
};

/**
 * [startDraw 开始绘制迷宫地图]
 * @param  {[type]} ctx [canvas context对象]
 * @param  {[type]} w   [绘制宽度]
 * @param  {[type]} h   [绘制高度]
 * @return {[type]}     [description]
 */
MazeMap.prototype.startDraw = function(ctx,w,h){
	let enter = this.enterPos; 
	this.mazeArr = new MazeArray(this.random);
	this.heapMove(enter.X,enter.Y+1);
	// 开始渲染地图
	this.render(ctx,w,h);
}

/**
 * [stackMove 广度优先遍历算法生成迷宫]
 * @param  {[integer]} x [迷宫入口X坐标]
 * @param  {[integer]} y [迷宫入口Y坐标]
 * @return {[type]}   [description]
 */
MazeMap.prototype.heapMove = function(x,y){
	let heap  = this.mazeArr;
	heap.set({x:x,y:y});
	this.visited[x][y] = true;
	this.steps.push(new MapStep(x,y,'mist'));
	while(!heap.empty()){
		let pos = heap.get();
		let x = pos.x,
		y = pos.y;

		for(let i = 0; i < 4; i++){
			let nextX = x + this.drection[i][0] * 2,
				nextY = y + this.drection[i][1] * 2;
			if (this.inMaze(nextX,nextY) &&
				!this.visited[nextX][nextY]) {
				heap.set({x:nextX,y:nextY});
				this.visited[nextX][nextY] = true;
				this.steps.push(new MapStep(nextX,nextY,'mist'));
				this.steps.push(new MapStep(x + this.drection[i][0],y + this.drection[i][1]));
			}
		}
	}
}

/**
 * [stackMove 非递归深度优先遍历算法生成迷宫]
 * @param  {[integer]} x [迷宫入口X坐标]
 * @param  {[integer]} y [迷宫入口Y坐标]
 * @return {[type]}   [description]
 */
MazeMap.prototype.stackMove = function(x,y){
	let stack  = this.mazeArr;
	stack.set({x:x,y:y});
	this.visited[x][y] = true;
	this.steps.push(new MapStep(x,y,'mist'));
	while(!stack.empty()){
		let pos = stack.get();
		let x = pos.x,
		y = pos.y;
		for(let i = 0; i < 4; i++){
			let nextX = x + this.drection[i][0] * 2,
				nextY = y + this.drection[i][1] * 2;
			if (this.inMaze(nextX,nextY) &&
				!this.visited[nextX][nextY]) {
				stack.set({x:nextX,y:nextY});
				this.visited[nextX][nextY] = true;
				this.steps.push(new MapStep(nextX,nextY,'mist'));
				this.steps.push(new MapStep(x + this.drection[i][0],y + this.drection[i][1]));
			}
		}
	}
}

/**
 * [recursiveTraverse 深度优先遍历递归算法生成迷宫地图]
 * @param  {[integer]} x [迷宫入口X坐标]
 * @param  {[integer]} y [迷宫入口Y坐标]
 * @return {[type]}   [description]
 */
MazeMap.prototype.recursiveTraverse = function(x,y){
	if (!this.inMaze(x,y)) {
		console.warn('current position is not in maze');
		return;
	}
	this.visited[x][y] = true;
	this.steps.push(new MapStep(x,y,'mist'));
	for(let i = 0; i < 4; i++){
		let nextX = x + this.drection[i][0] * 2,
			nextY = y + this.drection[i][1] * 2;
		if (this.inMaze(nextX,nextY) &&
			!this.visited[nextX][nextY]) {
			this.steps.push(new MapStep(nextX,nextY,'mist'));
			this.steps.push(new MapStep(x + this.drection[i][0],y + this.drection[i][1]));
			this.recursiveTraverse(nextX,nextY);
		}
	}
}

MazeMap.prototype.setRandom = function(random){
	this.random = random;
}

MazeMap.prototype.render = function(ctx,w,h){
	let self = this,
	map = this.map,
	mist = this.mist;
	(function animation(){
		if (self.steps.length <1) {
			clearTimeout(self.timeoutId);
			return;
		}
		for (let i = 0; i < 20; i++) {
			let step = self.steps.shift();
			if (step) {
				step.forward(step.t==='step'?map:mist);
			}
		}
		self.drawMap(map,mist,ctx,w,h);
		self.timeoutId = setTimeout(animation);
	})();
}

MazeMap.prototype.drawMap = function(map,mist,ctx,w,h){
	let n = this.n,
	m = this.m;
	for(let i = 0; i < n; i++){
		for(let j = 0; j < m; j++){
			if (!mist[i][j]) {
				continue;
			} else if (map[i][j]) {
				ctx.fillStyle = '#fff'
			} else{
				ctx.fillStyle = '#009EF4'
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
function MapStep(x,y,t,value){
	this.x = x;
	this.y = y;
	this.t = t || 'step';
	this.v = value || true;
}

MapStep.prototype.forward = function(arr){
	let x = this.x,
	y = this.y;
	if (this.t === 'step') {
		arr[x][y] = this.v;
	} else {
		for(let i = x-1;i <= x+1;i++) {
			for (let j = y-1;j <= y+1;j++) {
				arr[i][j] = true;	
			}
		}
	}
}

/**
 * [MazeArray 用于生成迷宫的专用]
 * @param {[type]} type [数组操作(获取一个元素)类型，类型有以下：stack，heap，random]
 */
function MazeArray(random){
	this.arr = [];
	this.type = random;
	this.setRandom(random);
}

MazeArray.prototype.setRandom = function(random){
	if (random === 1) {
		// 增强随机
		MazeArray.prototype.set = this._betterSet
		MazeArray.prototype.get = this._betterGet
	} else if (random === 2) {
		// 普通随机
		MazeArray.prototype.set = this._customSet
		MazeArray.prototype.get = this._customGet
	} else if (random === 3) {
		// 栈方式生成
		MazeArray.prototype.set = this._customSet
		MazeArray.prototype.get = this._stack
	} else {
		// 队列方式生成
		MazeArray.prototype.set = this._customSet
		MazeArray.prototype.get = this._heap
	}
}
// 迷宫生成随机性默认支持
MazeArray.prototype._betterSet = function(value){
	if (Math.random() < 0.5) {
		this.arr.push(value);
	} else{
		this.arr.unshift(value);
	}
}

MazeArray.prototype._betterGet = function(){
	if (Math.random() < 0.5) {
		return this.arr.pop();
	} else{
		return this.arr.shift();
	}
}

MazeArray.prototype._customSet = function(value){
	this.arr.push(value);
}

MazeArray.prototype._customGet = function(){
	let index = Math.floor(Math.random() * this.arr.length);
	let returnValue = this.arr[index];
	if (index !== this.arr.length - 1) {
		this.arr[index] = this.arr.pop();
	} else {
		this.arr.pop();
	}
	return returnValue;
}
// 迷宫生成随机性默认支持

MazeArray.prototype._stack = function(){
	return this.arr.pop();
}
MazeArray.prototype._heap = function(){
	return this.arr.shift();
}

MazeArray.prototype.empty = function(){
	return this.arr && this.arr.length === 0;
}