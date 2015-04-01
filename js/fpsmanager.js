function FPSManager(game) {
	this.game = game;
	this.fps = 30;
	this.now = null;
	this.then = Date.now();
	this.interval = 1000 / this.fps;
	this.delta = null;
}

FPSManager.prototype.render = function(ctx) {
	if (this.game.debugMode) {
		this.game.ctx.fillStyle = "#FFFFFF";
		this.game.ctx.fillText("FPS: " + this.delta.toFixed(2), 20, 20); //.toFixed(2), 20, 20);
	}
};

module.exports = FPSManager;