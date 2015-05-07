var Entity = require('./entity');
var Sprite = require('./sprite');
var Physics = require('./physics');
var Trail = require('./trail');
var ParticleSystem = require('./particlesystem');
var Engine = require('./engine');
var Weapon = require('./weapon');
var Explosion = require('./explosion');
var BoundingBox = require('./boundingbox');
var BoundingCircle = require('./boundingcircle');
var Vector = require('./vector');
var Angle = require('./angle');
var Planet = require('./planet');
var BlackHole = require('./blackhole');

var Ship = Entity.extend({
	init: function(game, id, x, y) {
		this.width = 32;
		this.height = 32;
		this._super(game, id, x, y);
		this.game = game;
		this.rotation = new Angle();
		this.input = {};
		this.sprite = new Sprite(this, "img/ship1.png");
		this.physics = new Physics(this.game, this, new BoundingCircle(this.game, this, 20));
		this.physics.collidesWith = ['Asteroid', 'Planet', 'Ship', 'Black Hole'];
		this.physics.mass = 10;
		this.physics.maxVelocity = 8;
		this.layer = 100;
		this.trail = new Trail(this.game, this);
		this.turnThrust = 0.4;
		this.mainThrust = 0.25;
		this.engine = new Engine(this);
		this.weapon = new Weapon(this);
		this.landed = false;
		var _this = this;
		this.physics.on('post-collide', function(entity) {
			if (entity instanceof Planet) {
				var x = this.pos.x - entity.pos.x;
				var y = this.pos.y - entity.pos.y;
				var angle = new Angle().fromRadians(Math.atan2(y, x));
				var difference = this.rotation.clone().subtractAngle(angle);
				if (this.physics.vel.absoluteGreaterThan(2) || (difference.degrees < 55 || difference.degrees > 125)) {
					if (this.player) this.player.requestRespawn();
					this.game.entityFactory.create('Explosion', this.game, this.pos.x, this.pos.y);
					this.destroy();
				} else {
					this.rotation.set(angle.degrees + 90);
					this.physics.rv = 0;
					this.landed = true;
				}
			} else if (entity instanceof BlackHole) {
				this.destroy();
				this.player.requestRespawn();
			}
		});
		this.lastFireTime = 0;
	},
	update: function() {
		this._super();
		if (this.engine.hasFuel()) {
			if (this.input.up) {
				this.engine.mainOn = true;
				this.engine.useFuel(2);
				var x = Math.cos(this.rotation.clone().subtract(90).toRadians()) * this.mainThrust;
				var y = Math.sin(this.rotation.clone().subtract(90).toRadians()) * this.mainThrust;
				this.physics.addAcceleration(x, y, 0);
			} else {
				this.mainOn = false;
			}
			if (this.input.left) { //Left Arrow
				this.engine.useFuel();
				this.physics.addAcceleration(0, 0, this.turnThrust * -1);
			}
			if (this.input.right) { //Right Arrow
				this.engine.useFuel();
				this.physics.addAcceleration(0, 0, this.turnThrust);
			}
		} else this.engine.mainOn = false;
		if (this.input.fire) {
			this.weapon.fire();
		}
		this.physics.update();
	},
	render: function(ctx, screen) {
		//this.trail.render(ctx, screen);
		this.engine.render(ctx, screen);
		this._super(ctx, screen);
		//this.physics.bounds.render(ctx, screen);
	},
	setInput: function(input) {
		this.input = input;
	},
	toJSON: function() {
		return {
			classname: "Ship",
			id: this.id,
			pos: this.pos,
			physics: this.physics,
			rotation: this.rotation,
			engine: this.engine,
		};
	}
});

module.exports = Ship;