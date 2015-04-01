require('./class');
var Player = require('./player');

var Connection = Class.extend({
    lastUpdate: 0,
    latency: 0,
    init: function(game) {
        this.game = game;
        this.server = new WebSocket("ws://127.0.0.1:8080");
        var _this = this;
        this.server.onmessage = function(message) {
            var data = JSON.parse(message.data);
            _this.receive(data);
        }
    },
    receive: function(data) {
        var entities = this.game.entities;
        console.log(data.updatedEntities);
        _.forEach(data.updatedEntities, function(entity) {
            //Perform entity updates
            _.forEach(entities, function(ent) {
                if (ent.id === entity.id) {
                    ent.x = entity.x;
                    ent.y = entity.y;
                }
            })
        });
        _.forEach(data.newEntities, function(entity) {
            //Create new entity with this entity id and properties 
            if (entity.classname === "Player") {
                var nent = new Player(this.game, entity.x, entity.y);
                entities.push(nent);
            }
        });
        console.log(entities);
        this.lastUpdate = Date.now();
        this.latency = this.lastUpdate - data.timestamp;
    },
});

module.exports = Connection;