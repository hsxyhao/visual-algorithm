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
	let map = [];
	for(let i = 0; i < n; i++){
		let mapItem = [];
		for(let j = 0; j < m; j++){
			if (i%2===1 && j%2 === 1) {
				mapItem[j] = true;
			} else {
				mapItem[j] = false;
			}
		}
		map[i] = mapItem;
	}
	this.map = map;
	this.enterPos = {X:1,Y:0};
	this.existPos = {X:n - 2,Y:m-1};
}

MazeMap.prototype.draw = function(canvas) {
	this.canvas = canvas;
	canvas.width = this.n * config.W;
	canvas.height = this.m * config.H;
	let ctx = canvas.getContext('2d');
	this.oneStep(ctx, config.W, config.H);
};

MazeMap.prototype.oneStep = function(ctx,w,h) {
	let n = this.n,
	m = this.m;
	for(let i = 0; i < n; i++){
		let mapItem = [];
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

}

MazeMap.prototype.recursiveTraverse = function(){
	
}

