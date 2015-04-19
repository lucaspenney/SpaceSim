var Class = require('./class');
var Vector = require('./vector');

var BoundingBox = Class.extend({
	init: function(game, entity) {
		this.type = 'box';
		this.game = game;
		this.entity = entity;
		this.pos = new Vector(entity.pos.x, entity.y);
		this.xOffset = 0;
		this.yOffset = 0;
		this.width = entity.width || entity.sprite.width;
		this.height = entity.height || entity.sprite.height;
	},
	update: function() {
		this.xOffset = (this.entity.sprite.width / 2) * -1;
		this.yOffset = (this.entity.sprite.height / 2) * -1;
		this.pos.x = this.entity.pos.x + this.xOffset;
		this.pos.y = this.entity.pos.y + this.yOffset;
	},
	setOffset: function(x, y) {
		this.xOffset = x;
		this.yOffset = y;
	},
	setWidth: function(width) {
		this.width = width;
	},
	setHeight: function(height) {
		this.height = height;
	},
	wouldCollide: function(vector, e) {
		var wouldCollide = false;
		this.pos.add(vector);
		wouldCollide = this.isColliding(e);
		this.pos.subtract(vector);
		return wouldCollide;
	},
	isColliding: function(e) {
		if (!e.physics) return false;
		if (this.entity === e) return false;
		e = e.physics.bounds;

		if (e.type === 'box') {
			//If colliding with a bounding box
			if (this.pos.x + this.width > e.pos.x && this.pos.x < e.pos.x + e.width) {
				if (this.pos.y + this.height > e.pos.y && this.pos.y < e.pos.y + e.height) {
					var x, y;
					if (this.pos.x + this.width > e.pos.x) x = (this.pos.x + this.width) - e.pos.x;
					else if (this.pos.x < e.pos.x + e.width) x = this.pos.x - (e.pos.x + e.width);
					if (this.pos.y + this.height > e.pos.y) y = (this.pos.y + this.height) - e.pos.y;
					else if (this.pos.y < e.pos.y + e.height) y = this.pos.y - (e.pos.y + e.height);
					return {
						x: x,
						y: y,
					};
				}
			}
		} else if (e.type === 'circle') {
			//If colliding with a sphere
			if (e.isPointIn(this.pos.x, this.pos.y) || e.isPointIn(this.pos.x + this.width, this.pos.y) || e.isPointIn(this.pos.x, this.pos.y + this.height) || e.isPointIn(this.pos.x + this.width, this.pos.y + this.height)) {
				return true;
			}
			if (e.isPointIn(this.pos.x + (this.width / 2), this.pos.y) || e.isPointIn(this.pos.x, this.pos.y + (this.height / 2)) || e.isPointIn(this.pos.x + (this.width / 2), this.pos.y + (this.height / 2)) || e.isPointIn(this.pos.x + this.width, this.pos.y + (this.height / 2))) {
				return true;
			}
		}

		return false;
	},
	isPointIn: function() {
		if (this.pos.x === undefined || this.pos.y === undefined || this.pos.x === null || this.pos.y === null) return -1;
		if (this.pos.x + this.width > x && this.pos.x < x) {
			if (this.pos.y + this.height > y && this.pos.y < y) {
				return true;
			}
		}
		return false;
	},
	render: function(ctx, screen) {
		//Debugging purposes
		ctx.strokeStyle = "#0F0";
		ctx.strokeRect(this.pos.x - screen.xOffset, this.pos.y - screen.yOffset, this.width, this.height);
	}
});
module.exports = BoundingBox;