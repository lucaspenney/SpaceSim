//input.js
var Class = require('./class');
var EventManager = require('./eventmanager');

var InputManager = Class.extend({
	init: function(game) {
		this.game = game;
		this.eventManager = new EventManager();
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
		//Conversion of js keycodes to dev-friendly names
		var keyCodes = {
			"27": "escape",
			"13": "enter",
			"89": "y",
		};
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
			if (document.activeElement.tagName === "INPUT") return; //Don't change key presses when typing in an input
			_this.keys[evt.keyCode] = true;
		});
		jQuery(window).keyup(function(evt) {
			_this.keys[evt.keyCode] = false;
			_this.eventManager.dispatch(keyCodes[evt.keyCode]);
		});
		//Disable browser scrolling with arrow keys functionality
		document.onkeydown = function(event) {
			if (document.activeElement.tagName === "INPUT") return; //Don't prevent key presses when typing in an input
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
	on: function(key, func) {
		this.eventManager.addEventListener(key, func);
	}
});
module.exports = InputManager;