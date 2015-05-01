var Entity = require('./entity');
var Sprite = require('./sprite');
var Physics = require('./physics');
var Trail = require('./trail');
var ParticleSystem = require('./particlesystem');
var Engine = require('./engine');
var Explosion = require('./explosion');
var BoundingBox = require('./boundingbox');
var BoundingCircle = require('./boundingcircle');
var Vector = require('./vector');
var Planet = require('./planet');

var Player = Entity.extend({
	init: function(game, id, x, y) {
		this.classname = "Player";
		this._super(game, id, x, y);
		this.game = game;
		this.input = {};
		this.client = false;
		this.needSpawn = true;

	},
	update: function() {
		this._super();
		if (this.ship) {
			this.pos = this.ship.pos;
			this.ship.setInput(this.input);
		}
	},
	render: function(ctx, screen) {
		//Render player name
		if (this.ship) {
			ctx.fillStyle = "#CCF";
			ctx.fillText("Player", this.pos.x - screen.xOffset - (this.ship.width / 2), this.pos.y - screen.yOffset - (this.ship.height));
		}

	},
	setInput: function(input) {
		this.input = input;
		if (this.ship) {
			this.ship.input = input;
		}
	},
	requestRespawn: function() {
		var _this = this;
		setTimeout(function() {
			_this.needSpawn = true;
		}, 1000)
	},
	toJSON: function() {
		return {
			classname: "Player",
			id: this.id,
			pos: this.pos,
			needSpawn: this.needSpawn,
			_ship: this.ship,
		};
	}
});

module.exports = Player;