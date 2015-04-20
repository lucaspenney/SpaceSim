var Class = require('./class');
var Vector = require('./vector');

var BoundingCircle = Class.extend({
	init: function(game, entity, radius) {
		this.type = 'circle';
		this.game = game;
		this.entity = entity;
		this.pos = new Vector(entity.pos.x, entity.y);
		this.radius = radius;
		this.xOffset = 0;
		this.yOffset = 0;
	},
	update: function() {
		this.pos.x = this.entity.pos.x + this.xOffset;
		this.pos.y = this.entity.pos.y + this.yOffset;
	},
	setOffset: function(x, y) {
		this.xOffset = x;
		this.yOffset = y;
	},
	setRadius: function(r) {
		this.radius = r;
	},
	wouldCollide: function(vector, e) {
		var wouldCollide = false;
		this.pos.add(vector);
		wouldCollide = this.isColliding(e);
		this.pos.subtract(vector);
		return wouldCollide;
	},
	isColliding: function(e) {
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
			var dist = this.pos.distance(e.pos);
			if (dist < this.radius + e.radius) {
				return true;
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
	isPointIn: function(x, y) {
		var v = new Vector(x, y);
		if (this.pos.distance(v) <= this.radius) {
			return true;
		}
		return false;
	},
	render: function(ctx, screen) {
		//Debugging purposes
		ctx.strokeStyle = "#0F0";
		ctx.beginPath();
		ctx.arc(this.pos.x - screen.xOffset, this.pos.y - screen.yOffset, this.radius, 0, 2 * Math.PI, false);
		ctx.lineWidth = 5;
		ctx.stroke();

	}
});
module.exports = BoundingCircle;