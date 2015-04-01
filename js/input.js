//input.js


function InputManager(game) {
	this.game = game;
	this.mouse = {
		x: 0,
		y: 0,
		down: false,
		lastClick: {
			x: 0,
			y: 0,
		}
	};
	this.keys = [];
	this.init();
}

InputManager.prototype.init = function() {
	var _this = this;
	jQuery(_this.game.stage).click(function() {
		//Left click
	});
	jQuery(_this.game.stage).bind('contextmenu', function(e) {
		//Right click
		return false; //Disable usual context menu behaviour
	});
	//Keep track of mouse position in window
	jQuery(_this.game.stage).mousemove(function(e) {
		_this.mouse.x = e.pageX - this.offsetLeft;
		_this.mouse.y = e.pageY - this.offsetTop;
	});
	//Listen for key presses/releases
	jQuery(window).keydown(function(evt) {
		_this.keys[evt.keyCode] = true;
	});
	jQuery(window).keyup(function(evt) {
		_this.keys[evt.keyCode] = false;
	});
	//Disable browser scrolling with arrow keys functionality
	document.onkeydown = function(event) {
		return event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 32;
	};
};
/*
InputManager.prototype.handleInteractions = function() {
	if (Game.player === null) return;
	if (this.keys[38] || this.keys[87]) { //Up arrow
		Game.player.move(0, -2);
	}
	if (this.keys[37] || this.keys[65]) { //Left Arrow
		Game.player.move(-2, 0);
	}
	if (this.keys[39] || this.keys[68]) { //right arrow
		Game.player.move(2, 0);
	}
	if (this.keys[40] || this.keys[83]) { //down arrow
		Game.player.move(0, 2);
	}
	if (this.keys[32]) { //spacebar
		//
	}
	if (this.keys[69]) { //e
		Game.player.interact();
	}
	if (this.keys[70]) { //f
		Game.player.toggleFlashlight();
	}
	if (this.keys[71]) {
		Game.player.drop();
	}
	if (this.keys[82]) {
		Game.player.reloadWeapon();
	}
	if (this.keys[49]) { //1
		Game.player.inventory.selectItemSlot(1);
	}
	if (this.keys[50]) { //2
		Game.player.inventory.selectItemSlot(2);
	}
	if (this.keys[51]) { //3
		Game.player.inventory.selectItemSlot(3);
	}
	if (this.keys[52]) { //4
		Game.player.inventory.selectItemSlot(4);
	}
	if (this.keys[53]) { //5
		Game.player.inventory.selectItemSlot(5);
	}
	if (this.keys[54]) { //6
		Game.player.inventory.selectItemSlot(6);
	}
};

*/
module.exports = InputManager;