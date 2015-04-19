var Class = require('./class');

if (typeof window === "undefined") {
	//Workaround for node loading a file that has no browser stuff
	//When a sprite is created on the server side, it basically has no image and is a placeholder
	Image = function() {};
}

var Sprite = Class.extend({
	init: function(entity, img) {
		this.entity = entity;
		this.img = new Image();
		this.img.src = img;
		this.scale = 1;
		this.width = 0;
		this.height = 0;
		this.alpha = 1;
		this.loaded = false;
		var _this = this;
		this.img.onload = function() {
			_this.loaded = true;
			_this.xOffset = 0;
			_this.yOffset = 0;
			_this.width = _this.img.width;
			_this.height = _this.img.height;
			_this.frameWidth = _this.img.width;
			_this.frameHeight = _this.img.height;
			_this.rotationXOffset = 0;
			_this.rotationYOffset = 0;
		}
	},
	draw: function(ctx, screen, x, y) {
		if (this.loaded) {
			//Draw relative to screen
			x -= screen.xOffset;
			y -= screen.yOffset;
			//Perform the draw
			ctx.save();
			ctx.translate(x + this.rotationXOffset, y + this.rotationYOffset);
			ctx.rotate(degToRad(this.entity.rotation));
			ctx.globalAlpha = this.alpha;
			ctx.drawImage(this.img, this.xOffset, this.yOffset, this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2, this.frameWidth * this.scale, this.frameHeight * this.scale);
			ctx.restore();
		}
	},
});
module.exports = Sprite;