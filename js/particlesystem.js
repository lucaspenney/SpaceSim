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
				refreshAmount: 50,
				amount: 1000,
				rate: 50,
				r: 000,
				g: 000,
				b: 00,
				size: 2,
				step: function(t) {
					if (t < 1) {
						this.vel.x += (Math.random() - 0.5) * 5;
						this.vel.y += (Math.random() - 0.5) * 5;
					}
					this.a *= 0.9;
					if (t < 10) {
						var h = (t) * 10;
						this.r = 100 + Math.random() * 155 - h;
						this.g = 100 + Math.random() * 155 - h;
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
			'explosion': {
				r: 255,
				g: 100,
				b: 100,
				rate: 30,
				step: function(t) {
					this.a *= 0.88;
					this.r -= 2;
					this.g--;
					this.b--;
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
			var x = this.xOffset + Math.cos(this.parent.rotation.clone().add(90).toRadians()) * 13;
			var y = this.yOffset + Math.sin(this.parent.rotation.clone().add(90).toRadians()) * 13;
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
	setParent: function(entity, xOffset, yOffset) {
		this.parent = entity;
		this.xOffset = xOffset;
		this.yOffset = yOffset;
	},
	createParticle: function() {
		if (this.parent) {
			var pos = this.pos.clone();
			pos.add(this.parent.physics.vel.clone().scale(-1).scale((Math.random() - 0.5) * 3));
			console.log(pos);
			var v = new Vector((Math.random() - 0.5), Math.random() - 0.5);
			v.scale(2);

			var p = $.extend({
				vel: vel
			}, this.opts);
			this.particles.push(new Particle(this.game, pos.x, pos.y, p));
		} else {
			var vel = new Vector((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5);
			var pos = this.pos.clone();
			var p = $.extend({
				vel: vel
			}, this.opts);
			this.particles.push(new Particle(this.game, this.pos.x, this.pos.y, p));
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