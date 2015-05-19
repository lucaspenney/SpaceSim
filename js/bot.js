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
var Angle = require('./angle');
var Planet = require('./planet');

var Bot = Entity.extend({
	init: function(game, id, x, y) {
		this._super(game, id, x, y);
		this.game = game;
		this.needSpawn = true;
		this.layer = 999;
		this.ship = this.game.entityFactory.create('Ship', this.game, this.pos.x, this.pos.y);
		this.ship.owner = this;
	},
	update: function() {
		this._super();
		if (this.ship) {
			this.pos = this.ship.pos.clone();;
		}
	},
	render: function(ctx, screen) {
		//Render player name
		if (this.ship) {
			ctx.fillStyle = "#CCF";
			ctx.textAlign = 'center';
			if (screen.focusedEntity !== this)
				ctx.fillText("Bot", this.pos.x - screen.xOffset, this.pos.y - screen.yOffset - (this.ship.height));
		}
		if (!this.target) {
			//Find a target, for now pick one at random
			this.target = this.pos.clone();
			this.target.x += (Math.random() - 0.5) * 3000;
			this.target.y += (Math.random() - 0.5) * 3000;

		}
	},
	setInput: function(input) {
		this.input = input;
		if (this.ship) {
			this.ship.setInput(this.input);
		}
	},
	requestRespawn: function() {
		var _this = this;
		setTimeout(function() {
			_this.needSpawn = true;
		}, 1000);
	},
	getShip: function() {
		if (this.ship) return this.ship;
		else return {};
	},
	toJSON: function() {
		return {
			classname: "Bot",
			id: this.id,
			pos: this.pos,
			needSpawn: this.needSpawn,
			radar: this.radar,
			_ship: this.getShip().id,
		};
	}
});

module.exports = Bot;