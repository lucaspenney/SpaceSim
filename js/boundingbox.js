var Class = require('./class');
var Vector = require('./vector');

var BoundingBox = Class.extend({
	init: function(game, entity) {
		this.game = game;
		this.entity = entity;
		this.pos = new Vector(entity.pos.x, entity.y);
		this.xOffset = 0;
		this.yOffset = 0;
		this.width = entity.width || entity.sprite.width;
		this.height = entity.height || entity.sprite.height;
	},
	update: function() {
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
		e = e.physics.boundingBox;
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
		return false;
	},
	getDistBetween: function() {
		e = e.physics.boundingBox;
		var point1a = this.pos.x + (this.width / 2);
		var point1b = this.pos.y + (this.height / 2);
		var point1 = new Point(point1a, point1b);
		var point2a = e.pos.x + (e.width / 2);
		var point2b = e.pos.y + (e.height / 2);
		var point2 = new Point(point2a, point2b);
		return point1.getDist(point2);
	},
	isPointIn: function() {
		if (this.pos.x === undefined || this.pos.y === undefined || this.pos.x === null || this.pos.y === null) return -1;
		if (this.pos.x + this.width > x && this.pos.x < x) {
			if (this.pos.y + this.height > y && this.pos.y < y) {
				return true;
			}
		}
		return false;
	}
});
module.exports = BoundingBox;