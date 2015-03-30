function Sprite(game, entity, img) {
	this.game = game;
	this.canvas = game.ctx;
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
		_this.rotationXOffset = (_this.img.width / 2);
		_this.rotationYOffset = (_this.img.height / 2);
	}
}

Sprite.prototype.draw = function(x, y) {

	if (this.loaded) {
		//Draw relative to screen
		x -= this.game.screen.xOffset;
		y -= this.game.screen.yOffset;
		//Perform the draw
		this.canvas.save();
		this.canvas.translate(x + this.rotationXOffset, y + this.rotationYOffset);
		this.canvas.rotate(degToRad(this.entity.rotation));
		this.canvas.globalAlpha = this.alpha;
		this.canvas.drawImage(this.img, this.xOffset, this.yOffset, this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2, this.frameWidth * this.scale, this.frameHeight * this.scale);
		this.canvas.restore();
	}
};

function degToRad(angle) {
	return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
	return ((angle * 180) / Math.PI);
}