Trail.extend(Entity);

function Trail(game, x, y, parent, centerOffset) {
	Entity.apply(this, arguments);
	this.parent = parent;
	this.centerOffset = centerOffset;
	this.positions = [];
}

Trail.prototype.render = function() {
	this.game.ctx.strokeStyle = "#333333";
	this.game.ctx.lineCap = "round";
	this.game.ctx.lineWidth = 5;
	for (var i = 0; i < this.positions.length; i++) {
		this.game.ctx.beginPath();
		this.game.ctx.moveTo(this.x - this.game.screen.xOffset, this.y - this.game.screen.yOffset);
		this.game.ctx.lineTo(this.positions[i].x - this.game.screen.xOffset, this.positions[i].y - this.game.screen.yOffset);
		this.game.ctx.closePath();
		this.game.ctx.globalAlpha = i / this.positions.length;
		this.game.ctx.stroke();
	}
};

Trail.prototype.update = function() {
	this.x = this.parent.x + ((Math.cos(degToRad(this.parent.rotation - 90)) * -4) + this.centerOffset);
	this.y = this.parent.y + ((Math.sin(degToRad(this.parent.rotation - 90)) * -4) + this.centerOffset);

	this.positions.push({
		x: this.x,
		y: this.y,
	});
	if (this.positions.length > 10) {
		this.positions.shift();
	}
};