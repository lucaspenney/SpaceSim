var Class = require('./class');
var Vector = require('./vector');
var Particle = require('./particle');
if (!_) var _ = require('lodash-node');

var ParticleSystem = Class.extend({
	init: function(game, x, y, type) {
		this.game = game;
		this.pos = new Vector(x, y);
		this.particles = [];
		this.type = type;
		this.active = false;
		this.pid = 0;
		this.rotationalOffset = 0;
		this.particleTypes = {
			'engine': {
				refreshAmount: 50,
				amount: 1000,
				rate: 50,
				r: 255,
				g: 225,
				b: 140,
				size: 2,
				step: function(t) {
					if (t < 1) {
						this.vel.x += (Math.random() - 0.5) * 5;
						this.vel.y += (Math.random() - 0.5) * 5;
					}
					this.a *= 0.88;
					if (t < 2) {
						var h = (t) * 20;
						this.r = 255 + Math.random() * 20 - h;
						this.g = 210 + Math.random() * 40 - h;
						this.b = 130 + Math.random() * 75 - h;
					} else {
						this.r = 150;
						this.g = 150;
						this.b = 150;
						this.size = 3;
					}
					this.vel.x += Math.random() - 0.5;
					this.vel.y += Math.random() - 0.5;
				}
			},
			'engine2': {
				refreshAmount: 100,
				amount: 1000,
				rate: 100,
				r: 200,
				g: 200,
				b: 255,
				size: 2,
				step: function(t) {
					if (t < 1) {
						this.vel.x += (Math.random() - 0.5) * 5;
						this.vel.y += (Math.random() - 0.5) * 5;
					}
					this.a *= 0.8;
					if (t < 10) {
						var h = (t) * 15;
						this.r -= Math.random() * 10;
						this.g -= Math.random() * 10;
						this.b -= Math.random() * 10;
					}
					this.vel.x += Math.random() - 0.5;
					this.vel.y += Math.random() - 0.5;
				}
			},
			'explosion': {
				r: 200,
				g: 200,
				b: 200,
				rate: 200,
				refreshAmount: 0,
				amount: 2000,
				step: function(t) {
					this.a *= 0.88;
					this.r -= (Math.random() - 0.5) * 100;
					this.g -= (Math.random() - 0.5) * 100;
					this.b -= Math.random() * 100;
					this.vel.x += (Math.random() - 0.5) * 8;
					this.vel.y += (Math.random() - 0.5) * 8;
				},

			}
		};
		this.opts = this.particleTypes[type];
		this.update();
		this.update();
	},
	update: function() {
		if (!this.active) return;
		if (this.parent) {
			this.pos = this.parent.pos.clone();
			var x = this.xOffset + Math.cos(this.parent.rotation.clone().add(90).toRadians()) * this.rotationalOffset;
			var y = this.yOffset + Math.sin(this.parent.rotation.clone().add(90).toRadians()) * this.rotationalOffset;
			this.pos.x += x;
			this.pos.y += y;

		}

		if (this.particles.length >= this.opts.amount) {
			for (var i = 0; i < this.opts.refreshAmount; i++) {
				this.particles.shift();
				this.createParticle();
			}
		} else {
			for (var i = 0; i < this.opts.rate; i++) {
				this.createParticle();
			}
		}
	},
	setParent: function(entity, xOffset, yOffset, rOffset) {
		this.parent = entity;
		this.xOffset = xOffset;
		this.yOffset = yOffset;
		this.rotationalOffset = rOffset;
	},
	createParticle: function() {
		if (this.parent) {
			var pos = this.pos.clone();
			pos.add(this.parent.physics.vel.clone().scale(-5 * (Math.random())));
			var p = _.merge({
				vel: vel
			}, this.opts);
			this.particles.push(new Particle(this.game, pos.x, pos.y, p));
		} else {
			var vel = new Vector((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 3);
			var pos = this.pos.clone();
			var p = _.merge({
				vel: vel
			}, this.opts);
			this.particles.push(new Particle(this.game, this.pos.x, this.pos.y, p));
		}
		this.pid++;
	},
	render: function(ctx, screen) {
		this.update();
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].render(ctx, screen);
			this.particles[i].update();
		}
	},
	toggle: function() {
		if (this.active) this.turnOn();
		else this.turnOff();
	},
	turnOn: function() {
		this.active = true;
	},
	turnOff: function() {
		this.active = false;
	},
	toJSON: function() {
		return {
			pos: this.pos,
			active: this.active,
			_parent: this.parent.id,
		};
	}
});

module.exports = ParticleSystem;