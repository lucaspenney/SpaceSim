var Entity = require('./entity');
var Sprite = require('./sprite');
var Physics = require('./physics');
var Trail = require('./trail');

var Player = Entity.extend({
	init: function(game, x, y) {
		this._super(game, x, y);
		this.game = game;
		this.width = 32;
		this.height = 32;
		this.rotation = 0;
		this.input = {};
		this.sprite = new Sprite(this, "img/player.png");
		this.physics = new Physics(this.game, this);
		this.physics.collidesWith = ['Asteroid', 'Player'];
		this.physics.weight = 50;
		this.layer = 100;
		this.trail = new Trail(this.game, this, 16);
		this.enginesOn = false;
		//this.weapon = new Weapon(this.game, this);
		//this.engine = new Engine(this.game, this);
		this.turnThrust = 0.35;
		this.mainThrust = 0.4;
	},
	update: function() {
		this._super();
		this.physics.update();
		if (this.input.up) {
			var xVel = Math.cos(degToRad(this.rotation - 90)) * this.mainThrust;
			var yVel = Math.sin(degToRad(this.rotation - 90)) * this.mainThrust;
			this.physics.addVelocity(xVel, yVel);
		}
		if (this.input.left) { //Left Arrow
			this.enginesOn = true;
			this.physics.addVelocity(0, 0, this.turnThrust * -1);
		}
		if (this.input.right) { //Right Arrow
			this.enginesOn = true;
			this.physics.addVelocity(0, 0, this.turnThrust);
		}
	},
	render: function(ctx, screen) {
		this.trail.render(ctx, screen);
		screen.setXOffset(this.x - 350);
		screen.setYOffset(this.y - 350);
		this._super(ctx, screen);
	},
	setInput: function(input) {
		this.input = input;
	},
	toJSON: function() {
		return {
			classname: "Player",
			id: this.id,
			x: this.x,
			y: this.y,
			rotation: this.rotation,
		};
	}
});

function degToRad(angle) {
	return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
	return ((angle * 180) / Math.PI);
}

module.exports = Player;