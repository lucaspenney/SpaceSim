var Entity = require('./entity');
var Sprite = require('./sprite');
var Physics = require('./physics');
var Trail = require('./trail');
var ParticleSystem = require('./particlesystem');
var Engine = require('./engine');

var Player = Entity.extend({
	init: function(game, x, y) {
		this._super(game, x, y);
		this.game = game;
		this.width = 32;
		this.height = 32;
		this.rotation = 0;
		this.input = {};
		this.sprite = new Sprite(this, "img/ship.png");
		this.physics = new Physics(this.game, this);
		this.physics.collidesWith = ['Asteroid', 'Player'];
		this.physics.mass = 10;
		this.layer = 100;
		this.trail = new Trail(this.game, this);
		this.enginesOn = false;
		this.client = false;
		//this.weapon = new Weapon(this.game, this);
		//this.engine = new Engine(this.game, this);ww
		this.engineParticles = new ParticleSystem(this.game, this.pos.x, this.pos.y, this.rotation, 'engine')
		this.engineParticles.setParent(this, 0, 0);
		this.turnThrust = 0.4;
		this.mainThrust = 0.5;
		this.engine = new Engine(this);
	},
	update: function() {
		this._super();
		if (this.input.up) {
			this.engine.mainOn = true;
			var x = Math.cos(degToRad(this.rotation - 90)) * this.mainThrust;
			var y = Math.sin(degToRad(this.rotation - 90)) * this.mainThrust;
			this.physics.addAcceleration(x, y, 0);
		} else {
			this.engine.mainOn = false;
		}
		if (this.input.left) { //Left Arrow
			this.physics.addAcceleration(0, 0, this.turnThrust * -1);
		}
		if (this.input.right) { //Right Arrow
			this.physics.addAcceleration(0, 0, this.turnThrust);
		}
		this.physics.update();
	},
	render: function(ctx, screen) {
		//this.trail.render(ctx, screen);
		if (screen.focusedEntity && screen.focusedEntity.id === this.id) {
			screen.setXOffset(this.pos.x - 350);
			screen.setYOffset(this.pos.y - 350);
		}
		if (this.engine.mainOn) {
			this.engineParticles.turnOn()
		} else this.engineParticles.turnOff();

		this.engineParticles.render(ctx, screen);
		this._super(ctx, screen);
		//this.physics.bounds.render(ctx, screen);
	},
	setInput: function(input) {
		this.input = input;
	},
	toJSON: function() {
		return {
			classname: "Player",
			id: this.id,
			pos: this.pos,
			physics: this.physics,
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