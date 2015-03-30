var clients = [];

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({
		port: 8080
	});

wss.on('connection', function(ws) {
	console.log("Client connected");
	var client = {
		id: clients.length,
		socket: ws,
		name: "Player " + clients.length,
		token: require('crypto').randomBytes(32).toString('hex'),
		entity: null,
	}
	clients.push(client);
	client.socket.send(client);
	ws.on('message', function(message) {
		console.log("Received client message from client" + client.id ":" + message);
	});
});
wss.on('close', function(ws) {
	console.log("Client disconnected");
	for (var i = 0; i < connections.length; i++) {
		if (connections[i].socket == ws) {
			connections.splice(i, 1);
		}
	}
});


var tick = function() {
	for (var x = 0; x < entities.length; x++) {
		entities[x].x += 10;
	}
	for (var i = 0; i < connections.length; i++) {
		var update = {
			entities: entities,
			timestamp: new Date()
		};
		connections[i].socket.send(JSON.stringify(update));
	}
	setTimeout(function() {
		tick();
	}, 32);
};

tick();