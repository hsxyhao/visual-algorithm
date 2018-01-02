function MonteCarlo(config) {
	this.init(config);
	let span = document.createElement('span');
	this.proportion = span;
	this.title.appendChild(span);
}

MonteCarlo.prototype = CFrame.prototype;
MonteCarlo.prototype.contain = function(circle,point){
	return Math.pow(point.y - circle.y, 2) + Math.pow(point.x - circle.x, 2) <= circle.r * circle.r;
}
MonteCarlo.prototype.render = function(circle,points){
	let ctx = this.ctx;
	ctx.clearRect(0,0,this.width,this.height);
	ctx.beginPath();
	this.CanvasUtil.setLineWeight(ctx,3);
	this.CanvasUtil.setLineColor(ctx,'#33B6FC');
	ctx.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI, 1);
	ctx.stroke();
	let circleCount = 0;
	for(let i = 0; i < points.length; i++){
		if (this.contain(circle,points[i])) {
			this.setCanvasStyle({
				fillStyle:'#EA2000'
			});
			circleCount++;
		}else{
			this.setCanvasStyle({
				fillStyle:'#33B6FC'
			});
		}
		ctx.beginPath();
		ctx.moveTo(points[i].x, points[i].y);
		ctx.arc(points[i].x, points[i].y, 3, 0, 2*Math.PI, 1);
		ctx.fill();
	}
	this.proportion.textContent = 'PI:'+ (4 * circleCount / points.length).toFixed(7);
}