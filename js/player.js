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
		this.radar = [{
			name: '',
			pos: {}
		}];
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
			if (screen.focusedEntity !== this)
				ctx.fillText("Player", this.pos.x - screen.xOffset - (this.ship.width / 2), this.pos.y - screen.yOffset - (this.ship.height));
		}
		if (screen.focusedEntity === this) {
			for (var i = 0; i < this.radar.length; i++) {
				var distance = this.pos.distance(new Vector(this.radar[i].pos.x, this.radar[i].pos.y));
				if (distance < 750) continue;
				var x = this.pos.x - this.radar[i].pos.x;
				var y = this.pos.y - this.radar[i].pos.y;

				var angle = radToDeg(Math.atan2(y, x));

				var x = Math.cos(degToRad(angle - 180)) * 100;
				var y = Math.sin(degToRad(angle - 180)) * 100;

				var p = new Vector(this.pos.x + x, this.pos.y + y);
				var p2 = new Vector(this.pos.x + (x * 2), this.pos.y + (y * 2));

				ctx.strokeStyle = "#FFF";
				ctx.fillText(this.radar[i].name, p.x - screen.xOffset, p.y - screen.yOffset);
				ctx.beginPath();
				ctx.moveTo(p.x - screen.xOffset, p.y - screen.yOffset);
				ctx.lineTo(p2.x - screen.xOffset, p2.y - screen.yOffset);
				ctx.stroke();
			}
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
			radar: this.radar,
			_ship: this.ship,
		};
	}
});

module.exports = Player;