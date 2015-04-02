require('./class');
var Player = require('./player');

var Connection = Class.extend({
    lastUpdate: 0,
    latency: 0,
    init: function(game) {
        this.game = game;
        this.server = new WebSocket("ws://127.0.0.1:8080");
        this.token = null;
        var _this = this;
        this.server.onmessage = function(message) {
            var data = JSON.parse(message.data);
            if (data.handshake !== undefined) {
                _this.handshake(data.handshake);
            } else {
                _this.receive(data);
            }

        }
    },
    receive: function(data) {
        var _this = this;
        var entities = this.game.entities;
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
            _this.createEntityFromJSON(entity);
        });
        console.log(data.deletedEntities);
        _.forEach(data.deletedEntities, function(entity) {
            //Create new entity with this entity id and properties

            _this.game.deletedEntities.push(entity);
        });
        this.lastUpdate = Date.now();
        this.latency = this.lastUpdate - data.timestamp;
    },
    handshake: function(data) {
        this.token = data.token;
        var _this = this;
        _.forEach(data.entities, function(entity) {
            _this.createEntityFromJSON(entity);
        })
    },
    createEntityFromJSON: function(entity) {
        if (entity.classname === "Player") {
            //console.log(entity);
            var nent = new Player(this.game, entity.x, entity.y);
            nent.id = entity.id;
            this.game.entities.push(nent);
        }
    },
});

module.exports = Connection;