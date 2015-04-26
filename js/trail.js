var Class = require('./class');

var Trail = Class.extend({
	init: function(game, parent, maxLength, centerOffset) {
		this.parent = parent;
		this.centerOffset = centerOffset;
		this.positions = [];
		this.maxLength = maxLength || 5;
	},
	render: function(ctx, screen) {
		ctx.strokeStyle = "#666";
		ctx.lineCap = "round";
		ctx.lineWidth = 1;
		//Update positions 
		this.x = this.parent.pos.x;
		this.y = this.parent.pos.y;

		this.positions.push({
			x: this.x,
			y: this.y,
		});
		for (var i = 0; i < this.positions.length; i++) {
			ctx.beginPath();
			ctx.moveTo(this.x - screen.xOffset, this.y - screen.yOffset);
			ctx.lineTo(this.positions[i].x - screen.xOffset, this.positions[i].y - screen.yOffset);
			ctx.closePath();
			ctx.globalAlpha = i / this.positions.length;
			ctx.stroke();
		}


		if (this.positions.length > this.maxLength) {
			this.positions.shift();
		}
	},
});

module.exports = Trail;