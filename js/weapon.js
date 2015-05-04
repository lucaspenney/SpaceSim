var Class = require('./class');
var Vector = require('./vector');

var Weapon = Class.extend({
	init: function(parent) {
		this.parent = parent;
		this.lastFireTime = Date.now();
		this.fireRate = 1000;
	},
	fire: function() {
		if (Date.now() - this.lastFireTime > this.fireRate) {
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
	},
});

function degToRad(angle) {
	return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
	return ((angle * 180) / Math.PI);
}

module.exports = Weapon;