var Class = require('./class');
var Vector = require('./vector');
var Particle = require('./particle');

var ParticleSystem = Class.extend({
	init: function(game, x, y, type) {
		this.game = game;
		this.pos = new Vector(x, y);
		this.particles = [];
		this.type = type;
		this.active = false;
		this.particleTypes = {
			'engine': {
				refreshAmount: 20,
				amount: 300,
				decay: 0.88,
			},
			'explosion': {
				refreshAmount: 10,
				amount: 150,
				decay: 0.85,
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
			this.pos.add(this.parent.physics.vel.clone().scale(0.5));
			var x = this.xOffset + Math.cos(this.parent.rotation.clone().add(90).toRadians()) * 13;
			var y = this.yOffset + Math.sin(this.parent.rotation.clone().add(90).toRadians()) * 13;
			this.pos.x += x;
			this.pos.y += y;
		}
		if (this.particles.length === 0) {
			for (var i = 0; i < this.opts.amount; i++) {
				this.createParticle();
			}
		}
		if (this.particles.length >= this.opts.amount) {
			for (var i = 0; i < this.opts.refreshAmount; i++) {
				this.particles.shift();
				this.createParticle();
			}
		} else {
			this.createParticle();
		}
	},
	setParent: function(entity, xOffset, yOffset) {
		this.parent = entity;
		this.xOffset = xOffset;
		this.yOffset = yOffset;
	},
	createParticle: function() {
		if (this.parent) {
			var vel = this.parent.physics.vel.clone();
			var pos = this.pos.clone();
			var v = new Vector((Math.random() - 0.5), Math.random() - 0.5);
			v.scale(2);
			vel.add(v);
			var direction = Math.random() * 360;
			this.particles.push(new Particle(this.game, this.pos.x, this.pos.y, 1, vel.x, vel.y, this.opts.decay, direction));
		} else {
			var vel = new Vector((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5);
			var pos = this.pos.clone();
			var direction = Math.random() * 360;
			this.particles.push(new Particle(this.game, this.pos.x, this.pos.y, 1, vel.x, vel.y, this.opts.decay, direction));
		}
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
});

module.exports = ParticleSystem;