var SERVER = true;

function degToRad(angle) {
	return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
	return ((angle * 180) / Math.PI);
}
var _ = require('lodash-node');
var LZString = require('lz-string');
var Crypto = require('crypto');

var Class = require('./js/class');
var Entity = require('./js/entity');
var Player = require('./js/player');
var Asteroid = require('./js/asteroid');
var Planet = require('./js/planet');
var BlackHole = require('./js/blackhole');
var WorldManager = require('./js/worldmanager');
var Game = require('./js/game');

var Server = Class.extend({
	init: function(port) {
		var _this = this;
		var WebSocketServer = require('ws').Server;
		this.websocket = new WebSocketServer({
			port: port
		});
		this.game = new Game();
		this.worldManager = new WorldManager(this.game);
		this.clients = [];
		this.packetTimes = {};
		this.websocket.on('connection', function(ws) {
			console.log("Client connected");
			_this.onConnect(ws);
		});
		this.websocket.on('close', function(ws) {
			_this.disconnectClient(ws);
		});
		this.websocket.on('error', function(ws) {
			_this.disconnectClient(ws);
		});
		this.tickRate = 30;
		this.frameTime = 0;
		this.lastUpdate = 0;
		this.tick();
	},
	onConnect: function(ws) {
		var _this = this;
		//Find a client id
		var id = -1;
		for (var i = 0; i < 64; i++) {
			var canUse = true;
			_.forEach(this.clients, function(client) {
				if (i === client.id) {
					canUse = false;
					return false;
				}
			});
			if (canUse) {
				id = i;
				break;
			}
		}
		var client = {
			id: id,
			socket: ws,
			name: "Player " + id,
			token: require('crypto').randomBytes(32).toString('hex'),
			entity: null,
			latency: -1,
			messages: [],
		}
		this.clients.push(client);
		var cplayer = this.game.entityFactory.create("Player", this.game, 0, 0);
		client.entity = cplayer;
		this.handshake(client);
		ws.on('message', function(message) {
			var data = JSON.parse(message);
			var packetTime = _this.packetTimes[data.packetId];
			client.latency = Date.now() - packetTime;
			if (data.token === client.token) {
				client.entity.setInput(data.input);
				//Send this message to all other clients
				_.forEach(_this.clients, function(c) {
					if (data.message && data.message.length > 0)
						c.messages.push({
							sender: client.id,
							name: client.name,
							message: data.message
						});
				});
			}
		});
	},
	disconnectClient: function(socket) {
		for (var i = 0; i < this.clients.length; i++) {
			if (this.clients[i].socket == socket) {
				this.clients[i].entity.destroy();
				this.clients.splice(i, 1);
			}
		}
		console.log("Client disconnected");
	},
	packageData: function(data, compress) {
		if (compress) return LZString.compressToUTF16(JSON.stringify(data));
		return JSON.stringify(data);
	},
	handshake: function(client) {
		var data = {
			handshake: {
				entities: this.game.entities,
				token: client.token,
			},
		};
		client.socket.send(this.packageData(data));
	},
	tick: function() {
		var _this = this;

		if (Date.now() - _this.lastUpdate < 1000 / _this.tickRate) {
			setTimeout(function() {
				_this.tick();
			}, 0);
			return;
		}

		var start = Date.now();
		for (var i = 0; i < this.clients.length; i++) {
			var entities = [];
			_.forEach(this.game.entities, function(ent) {
				if (_this.clients[i].entity.pos.distance(ent.pos) < 1200) {
					entities.push(ent);
				}
			});
			var radar = [];
			_.forEach(this.clients, function(client) {
				if (_this.clients[i] !== client) {
					radar.push({
						name: client.name,
						pos: client.entity.pos
					});
				}
			});
			this.clients[i].entity.radar = radar;
			var packetId = Crypto.randomBytes(16).toString('hex');
			this.packetTimes[packetId] = Date.now();
			var update = {
				entities: entities,
				timestamp: new Date(),
				packetId: packetId,
				focus: this.clients[i].entity,
				latency: this.clients[i].latency,
				frameTime: this.frameTime,
				messages: this.clients[i].messages,
				time: Date.now(),
			};
			try {
				this.clients[i].socket.send(this.packageData(update));
				this.clients[i].messages = [];
			} catch (e) {
				//Was unable to send client update, disconnect them
				if (this.clients[i])
					this.disconnectClient(this.clients[i].socket);
			}
		}
		this.worldManager.update(this.clients, this.game.entities);
		this.game.update();
		this.frameTime = Date.now() - start;
		this.lastUpdate = Date.now();
		setTimeout(function() {
			_this.tick();
		}, (1000 / _this.tickRate) / 2);
	},
});

new Server(8080);