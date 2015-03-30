function Particle(game, x, y, a, xv, yv, decay, direction) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.a = a;
	this.xv = xv;
	this.yv = yv;
	this.decay = decay;
	this.direction = direction;
}

Particle.prototype.render = function() {
	this.game.ctx.fillRect(this.x - this.game.screen.xOffset, this.y - this.game.screen.yOffset, 2, 2);
};

Particle.prototype.update = function() {
	this.x += this.xv;
	this.y += this.yv;
	this.a *= this.decay;
}