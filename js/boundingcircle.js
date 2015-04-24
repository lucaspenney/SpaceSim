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
		this.update();
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
		if (!e.physics) return false;
		if (this.entity === e) return false;
		e = e.physics.bounds;

		if (e.type === 'box') {
			//If colliding with a bounding box
			if (this.isPointIn(e.pos.x, e.pos.y) || this.isPointIn(e.pos.x + this.width, e.pos.y) || this.isPointIn(e.pos.x, e.pos.y + this.height) || this.isPointIn(e.pos.x + this.width, e.pos.y + this.height)) {
				return true;
			}
			if (this.isPointIn(e.pos.x + (this.width / 2), e.pos.y) || this.isPointIn(e.pos.x, e.pos.y + (this.height / 2)) || this.isPointIn(e.pos.x + (this.width / 2), e.pos.y + (this.height / 2)) || this.isPointIn(e.pos.x + this.width, e.pos.y + (this.height / 2))) {
				return true;
			}
		} else if (e.type === 'circle') {
			var dist = this.pos.distance(e.pos);
			//console.log(dist);
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

	},
	toJSON: function() {
		return {
			pos: this.pos,
			radius: this.radius,
		};
	}
});
module.exports = BoundingCircle;