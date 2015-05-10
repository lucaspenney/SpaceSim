var Class = require('./class');
var Vector = require('./vector');

var Weapon = Class.extend({
	init: function(parent) {
		this.parent = parent;
		this.lastFireTime = Date.now();
		this.missileFire = 1000;
		this.bulletFireRate = 100;
		this.mode = "bullet";
	},
	fire: function() {
		if (this.mode === "missile") {
			if (Date.now() - this.lastFireTime > this.missileFireRate) {
				var missile = this.parent.game.entityFactory.create('Missile', this.parent.game, this.parent.pos.x, this.parent.pos.y);
				if (missile) {
					missile.setOwner(this.parent);
					missile.physics.vel = this.parent.physics.vel.clone();
					var x = Math.cos(this.parent.rotation.clone().subtract(270).toRadians()) * 2;
					var y = Math.sin(this.parent.rotation.clone().subtract(270).toRadians()) * 2;
					missile.physics.vel.add(new Vector(x, y));
				}
				this.lastFireTime = Date.now();
			}
		} else {
			if (Date.now() - this.lastFireTime > this.bulletFireRate) {
				var bullet = this.parent.game.entityFactory.create('Bullet', this.parent.game, this.parent.pos.x, this.parent.pos.y);
				if (bullet) {
					var x = Math.cos(this.parent.rotation.clone().subtract(90).toRadians());
					var y = Math.sin(this.parent.rotation.clone().subtract(90).toRadians());
					var v = new Vector(x, y).scale(8);
					v.add(this.parent.physics.vel.clone());
					bullet.physics.vel.add(v);
					bullet.rotation = this.parent.rotation.clone();
					bullet.setOwner(this.parent);
				}
				this.lastFireTime = Date.now();
			}
		}
	},
});

module.exports = Weapon;