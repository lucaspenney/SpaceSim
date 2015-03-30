Player.extend(Entity);

function Player(game, x, y) {
	Entity.apply(this, arguments);
	this.width = 32;
	this.height = 32;
	this.rotation = 0;
	this.sprite = new Sprite(this.game, this, "img/player.png");
	this.physics = new Physics(this.game, this);
	this.physics.collidesWith = ['Asteroid'];
	this.physics.weight = 50;
	this.layer = 100;
	this.trail = new Trail(this.game, 0, 0, this, 16);
	this.enginesOn = false;
	this.weapon = new Weapon(this.game, this);
	this.engine = new Engine(this.game, this);
	this.turnThrust = 0.35;
	this.mainThrust = 0.4;
}

Player.prototype.update = function() {
	Entity.prototype.update.call(this);
	this.enginesOn = false;
	if (this.game.input.keys[38] || this.game.input.keys[87]) {
		this.enginesOn = true;
		var xVel = Math.cos(degToRad(this.rotation - 90)) * this.mainThrust;
		var yVel = Math.sin(degToRad(this.rotation - 90)) * this.mainThrust;
		this.physics.addVelocity(xVel, yVel);
	}
	if (this.game.input.keys[37] || this.game.input.keys[65]) { //Left Arrow
		this.enginesOn = true;
		this.physics.addVelocity(0, 0, this.turnThrust * -1);
	}
	if (this.game.input.keys[39] || this.game.input.keys[68]) { //right arrow
		this.enginesOn = true;
		this.physics.addVelocity(0, 0, this.turnThrust);
	}
	if (this.game.input.keys[32]) {
		this.fire();
	}
	this.physics.update();

	this.game.screen.setXOffset(this.x - 350);
	this.game.screen.setYOffset(this.y - 350);
};

Player.prototype.fire = function() {
	if (!this.weapon) return;
	this.weapon.fire();
}