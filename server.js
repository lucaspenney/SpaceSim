var SERVER = true;

var _ = require('lodash-node');

var Entity = require('./js/entity');
var Player = require('./js/player');
var Game = require('./js/game');

var clients = [];
var newEntities = [];

var game = new Game();

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({
		port: 8080
	});

wss.on('connection', function(ws) {
	console.log("Client connected");
	var client = {
		id: _.uniqueId(),
		socket: ws,
		name: "Player " + clients.length,
		token: require('crypto').randomBytes(32).toString('hex'),
		entity: null,
	}
	clients.push(client);
	//client.socket.send(JSON.stringify(client.token));
	newEntities.push(new Player(game, 50, 50));
	ws.on('message', function(message) {
		console.log("Received client message from client" + client.id + ":" + message);
	});

});
wss.on('close', function(ws) {
	for (var i = 0; i < clients.length; i++) {
		if (clients[i].socket == ws) {
			clients.splice(i, 1);
		}
	}
});

var tick = function() {
	game.update();
	for (var x = 0; x < game.entities.length; x++) {
		game.entities[x].x += 1;
		game.entities[x].y += 1;
	}
	for (var i = 0; i < clients.length; i++) {
		var update = {
			updatedEntities: game.entities,
			newEntities: newEntities,
			timestamp: new Date(),
		};
		clients[i].socket.send(JSON.stringify(update));
		_.forEach(newEntities, function(entity) {
			game.entities.push(entity);
		});
		newEntities = [];
	}
	setTimeout(function() {
		tick();
	}, 32);
};

tick();