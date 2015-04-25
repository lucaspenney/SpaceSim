var Entity = require('./entity');
var Sprite = require('./sprite');
var Physics = require('./physics');
var Trail = require('./trail');
var ParticleSystem = require('./particlesystem');
var Engine = require('./engine');
var Explosion = require('./explosion');
var BoundingBox = require('./boundingbox');
var BoundingCircle = require('./boundingcircle');
var Vector = require('./vector');

var Player = Entity.extend({
	init: function(game, x, y) {
		this._super(game, x, y);
		this.game = game;
		this.width = 32;
		this.height = 32;
		this.rotation = 0;
		this.input = {};
		this.sprite = new Sprite(this, "img/ship.png");
		//this.physics = new Physics(this.game, this, new BoundingBox(this.game, this));
		this.physics = new Physics(this.game, this, new BoundingCircle(this.game, this, 20));
		this.physics.collidesWith = ['Asteroid', 'Planet', 'Player'];
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
		this.mainThrust = 0.25;
		this.engine = new Engine(this);
		var _this = this;
		this.physics.onCollision(function(entity) {
			_this.game.entityFactory.create('Explosion', _this.game, _this.pos.x, _this.pos.y);
			_this.destroy();
		});
		this.lastFireTime = 0;
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
		if (this.input.fire) {
			if (Date.now() - this.lastFireTime > 100) {
				var bullet = this.game.entityFactory.create('Bullet', this.game, this.pos.x, this.pos.y);
				if (bullet) {
					bullet.rotation = this.rotation;
					var x = Math.cos(degToRad(this.rotation - 90)) * 5;
					var y = Math.sin(degToRad(this.rotation - 90)) * 5;
					bullet.physics.vel = this.physics.vel.clone().add((new Vector(x, y)).scale(3));
					this.lastFireTime = Date.now();
				}
			}
		}
		this.physics.update();
	},
	render: function(ctx, screen) {
		//this.trail.render(ctx, screen);
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
			engine: this.engine,
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