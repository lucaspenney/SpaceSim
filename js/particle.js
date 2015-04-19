function Particle(game, x, y, a, xv, yv, decay, direction) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.a = a;
	this.xv = xv;
	this.yv = yv;
	this.decay = decay;
	this.direction = direction;
	this.color = "#666";
}

Particle.prototype.render = function(ctx, screen) {
	ctx.fillStyle = this.color;
	ctx.globalAlpha = this.a;
	ctx.fillRect(this.x - screen.xOffset, this.y - screen.yOffset, 2, 2);
	ctx.globalAlpha = 1;
};

Particle.prototype.update = function() {
	this.x += this.xv;
	this.y += this.yv;
	this.x += (Math.random() - 0.5) * 5;
	this.y += (Math.random() - 0.5) * 5;
	this.a *= this.decay;
}

module.exports = Particle;