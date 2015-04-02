var SERVER = true;

var _ = require('lodash-node');

var Entity = require('./js/entity');
var Player = require('./js/player');
var Game = require('./js/game');

var clients = [];
var newEntities = [];
var deletedEntities = [];

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
	var cplayer = new Player(game, 50, 50)
	newEntities.push(cplayer);
	client.entity = cplayer;
	handshake(client);
	ws.on('message', function(message) {
		console.log("Received client message from client" + client.id + ":" + message);
	});

});
wss.on('close', function(ws) {
	disconnectClient(ws);
});

function disconnectClient(socket) {
	for (var i = 0; i < clients.length; i++) {
		if (clients[i].socket == socket) {
			clients[i].entity.destroy();
			deletedEntities.push(clients[i].entity);
			clients.splice(i, 1);
		}
	}
	console.log("Client disconnected");
}
wss.on('error', function(ws) {
	console.log("Client disconnecting");
	disconnectClient(ws);
});

var handshake = function(client) {
	var data = {
		handshake: {
			entities: game.entities,
			token: client.token,
		},
	};
	client.socket.send(JSON.stringify(data));
}

var tick = function() {
	for (var x = 0; x < game.entities.length; x++) {
		game.entities[x].x += 1;
		game.entities[x].y += 1;
	}
	for (var i = 0; i < clients.length; i++) {
		var update = {
			updatedEntities: game.entities,
			deletedEntities: _.union(deletedEntities, game.deletedEntities),
			newEntities: newEntities,
			timestamp: new Date(),
		};
		try {
			clients[i].socket.send(JSON.stringify(update));
		} catch (e) {
			//Was unable to send client update, disconnect them
			disconnectClient(clients[i].socket);
		}
	}
	_.forEach(newEntities, function(entity) {
		game.entities.push(entity);
	});
	newEntities = [];
	game.update();

	setTimeout(function() {
		tick();
	}, 32);
};

tick();