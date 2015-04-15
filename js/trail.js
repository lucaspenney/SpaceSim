var Class = require('./class');

var Trail = Class.extend({
	init: function(game, parent, centerOffset) {
		this.parent = parent;
		this.centerOffset = centerOffset;
		this.positions = [];
	},
	render: function(ctx, screen) {
		ctx.strokeStyle = "#333333";
		ctx.lineCap = "round";
		ctx.lineWidth = 5;
		for (var i = 0; i < this.positions.length; i++) {
			ctx.beginPath();
			ctx.moveTo(this.x - screen.xOffset, this.y - screen.yOffset);
			ctx.lineTo(this.positions[i].x - screen.xOffset, this.positions[i].y - screen.yOffset);
			ctx.closePath();
			ctx.globalAlpha = i / this.positions.length;
			ctx.stroke();
		}

		//Update positions 
		this.x = this.parent.pos.x + ((Math.cos(degToRad(this.parent.rotation - 90)) * -4) + this.centerOffset);
		this.y = this.parent.pos.y + ((Math.sin(degToRad(this.parent.rotation - 90)) * -4) + this.centerOffset);

		this.positions.push({
			x: this.x,
			y: this.y,
		});
		if (this.positions.length > 10) {
			this.positions.shift();
		}
	},
});

module.exports = Trail;