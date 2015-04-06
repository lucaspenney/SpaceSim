//input.js
require('./class');

var InputManager = Class.extend({
	init: function(game) {
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
	},
	getInputState: function() {
		var state = {
			up: this.keys[38] || this.keys[87], //W or Up
			left: this.keys[37] || this.keys[65], //A or Left
			right: this.keys[39] || this.keys[68], //D or Right
			down: this.keys[40] || this.keys[83], //S or Down
			fire: this.keys[32], //Spacebar
		};
		return state;
	},
});
module.exports = InputManager;