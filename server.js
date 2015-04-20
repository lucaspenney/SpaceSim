var SERVER = true;

var _ = require('lodash-node');
var LZString = require('lz-string');
var Crypto = require('crypto');

var Class = require('./js/class');
var Entity = require('./js/entity');
var Player = require('./js/player');
var Asteroid = require('./js/asteroid');
var Planet = require('./js/planet');
var Game = require('./js/game');

var Server = Class.extend({
	init: function(port) {
		var _this = this;
		var WebSocketServer = require('ws').Server;
		this.websocket = new WebSocketServer({
			port: port
		});
		this.game = new Game();
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

		for (var i = 0; i < 50; i++) {
			var a = new Asteroid(this.game, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
			this.game.entities.push(a);
		}
		this.game.entities.push(new Planet(this.game, 300, 300));
		this.tick();
	},
	onConnect: function(ws) {
		var _this = this;
		var client = {
			id: _.uniqueId(),
			socket: ws,
			name: "Player " + this.clients.length,
			token: require('crypto').randomBytes(32).toString('hex'),
			entity: null,
			latency: -1,
		}
		this.clients.push(client);
		var cplayer = new Player(this.game, 50, 50)
		this.game.entities.push(cplayer);
		client.entity = cplayer;
		this.handshake(client);
		ws.on('message', function(message) {
			var data = JSON.parse(message);
			var packetTime = _this.packetTimes[data.packetId];
			client.latency = Date.now() - packetTime;
			if (data.token === client.token) {
				client.entity.setInput(data.input);
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
		for (var i = 0; i < this.clients.length; i++) {
			var entities = [];
			_.forEach(this.game.entities, function(ent) {
				if (_this.clients[i].entity.pos.distance(ent.pos) < 500) {
					entities.push(ent);
				}
			});
			var packetId = Crypto.randomBytes(16).toString('hex');
			this.packetTimes[packetId] = Date.now();
			var update = {
				entities: entities,
				timestamp: new Date(),
				packetId: packetId,
				focus: this.clients[i].entity,
				latency: this.clients[i].latency,
			};
			try {
				this.clients[i].socket.send(this.packageData(update));
			} catch (e) {
				//Was unable to send client update, disconnect them
				this.disconnectClient(this.clients[i].socket);
			}
		}
		_.forEach(this.newEntities, function(entity) {
			_this.game.entities.push(entity);
		});

		this.game.update();
		var _this = this;
		setTimeout(function() {
			_this.tick();
		}, 33);
	},
});

new Server(8080);