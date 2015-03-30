Bullet.extend(Entity);

function Bullet(game, x, y, player, direction, speed) {
	Entity.apply(this, arguments);
	this.sprite = new Sprite(this.game, this, "img/bullet.png")
	this.physics = new Physics(game, this);
	this.physics.collidesWith = ['Asteroid'];
	this.rotation = direction;
	this.speed = speed;
	this.owner = player;
	this.physics.weight = 10;
	this.physics.maxVelocity = 12;
	this.physics.setVelocity(Math.cos(degToRad(this.rotation - 90)) * this.speed, Math.sin(degToRad(this.rotation - 90)) * this.speed);
	this.physics.addVelocity(this.owner.physics.xv, this.owner.physics.yv);

	var _this = this;
	this.physics.onCollision = function() {
		_this.destroy();
	};
}

Bullet.prototype.update = function() {
	Entity.prototype.update.call(this);
	this.physics.update();
};