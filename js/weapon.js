function Weapon(game, owner) {
	this.game = game;
	this.kickback = 0.2;
	this.owner = owner;
	this.fireInterval = new Interval(0.1);
	this.power = 12;
}

Weapon.prototype.fire = function() {
	if (this.fireInterval.hasElapsed()) {
		new Bullet(this.game, this.owner.x, this.owner.y, this.owner, this.owner.rotation, this.power);
		this.owner.physics.addVelocity(Math.cos(degToRad(this.owner.rotation - 90)) * this.kickback * -1, Math.sin(degToRad(this.owner.rotation - 90)) * this.kickback * -1);
		this.fireInterval.reset();
	}
}