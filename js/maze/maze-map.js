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
	let map = [],
	visited = [];
	for(let i = 0; i < n; i++){
		let mapItem = [],
		visitedItem = [];
		for(let j = 0; j < m; j++){
			if (i%2===1 && j%2 === 1) {
				mapItem[j] = true;
			} else {
				mapItem[j] = false;
			}
			visitedItem[i] = false;
		}
		map[i] = mapItem;
		visited[i] = visitedItem;
	}
	map[this.enterPos.X][this.enterPos.Y] = true;
	map[this.existPos.X][this.existPos.Y] = true;
	this.map = map;
	this.visited = visited;
	this.drection = [[-1,0],[0,1],[1,0],[0,-1]];
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
	this.oneStep(ctx, config.W, config.H);
	this.twoStep(ctx, config.W, config.H);
};

MazeMap.prototype.oneStep = function(ctx,w,h) {
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
	let enter = this.enterPos,
	exist = this.existPos;
	ctx.fillStyle = '#fff';
	ctx.fillRect(enter.Y * w, enter.X * h, w , h);
	ctx.fillRect(exist.Y * w, exist.X * h, w , h);
};

MazeMap.prototype.twoStep = function(ctx,w,h){
	let enter = this.enterPos; 
	this.recursiveTraverse(enter.X,enter.Y+1);
	// 开始渲染地图
	this.render(ctx,w,h);
}

MazeMap.prototype.recursiveTraverse = function(x,y){
	if (!this.inMaze(x,y)) {
		console.warn('current position is not in maze');
		return;
	}
	this.visited[x][y] = true;
	for(let i = 0; i < 4; i++){
		let nextX = x + this.drection[i][0] * 2,
			nextY = y + this.drection[i][1] * 2;
		if (this.inMaze(nextX,nextY) &&
			!this.visited[nextX][nextY]) {
			this.steps.push(new Step(x + this.drection[i][0],y + this.drection[i][1],true));
			this.recursiveTraverse(nextX,nextY);
		}
	}
}

MazeMap.prototype.render = function(ctx,w,h){
	let self = this,
	map = this.map;
	(function animation(){
		if (self.steps.length <1) {
			clearInterval(self.intervalId);
			return;
		}
		let step = self.steps.shift();
		step.forward(map);
		self.drawMap(map,ctx,w,h);
		self.timeoutId = setTimeout(animation,4);
	})();
}

MazeMap.prototype.drawMap = function(map,ctx,w,h){
	let n = this.n,
	m = this.m;
	for(let i = 0; i < n; i++){
		for(let j = 0; j < m; j++){
			if (map[i][j]) {
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
function Step(x,y,value){
	this.x = x;
	this.y = y;
	this.v = value;
}

Step.prototype.forward = function(maze){
	maze[this.x][this.y] = this.v;
}
