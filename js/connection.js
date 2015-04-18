var Class = require('./class');
var Player = require('./player');
var Asteroid = require('./asteroid');
var Planet = require('./planet');
var LZString = require('./lz-string');

var Connection = Class.extend({
    lastUpdate: 0,
    latency: 0,
    init: function(client, game) {
        this.client = client;
        this.game = game;
        this.server = new WebSocket("ws://127.0.0.1:8080");
        this.token = null;
        this.lastPacketLength = 0;
        this.lastPacket = null;
        var _this = this;
        this.server.onmessage = function(message) {
            _this.lastPacketLength = message.data.length;
            var data = JSON.parse(message.data);
            if (data.handshake !== undefined) {
                _this.handshake(data.handshake);
            } else {
                if (this.lastPacket === null) {
                    this.lastPacked = data;
                } else {
                    _this.receive(data);
                }
            }
        }
    },
    receive: function(data) {
        var _this = this;
        var entities = this.game.entities;
        _.forEach(data.updatedEntities, function(entity) {
            //Perform entity updates
            _.forEach(entities, function(ent) {
                if (ent.id === data.focus.id) {
                    _this.client.screen.focusedEntity = ent;
                }
                if (ent.id === entity.id) {
                    _.forOwn(entity, function(value, prop) {
                        if (prop === "pos") {
                            ent[prop].x = value.x;
                            ent[prop].y = value.y;
                        } else {
                            ent[prop] = value;
                        }
                    });
                }
            })
        });
        _.forEach(data.newEntities, function(entity) {
            //Create new entity with this entity id and properties
            _this.createEntityFromJSON(entity);
        });
        _.forEach(data.deletedEntities, function(entity) {
            //Create new entity with this entity id and properties

            _this.game.deletedEntities.push(entity);
        });
        this.lastUpdate = Date.now();
        this.latency = this.lastUpdate - data.timestamp;
        this.send();
    },
    send: function() {
        var data = {
            token: this.token,
            input: this.client.input.getInputState(),
        };
        this.server.send(JSON.stringify(data));
    },
    handshake: function(data) {
        this.token = data.token;
        var _this = this;
        _.forEach(data.entities, function(entity) {
            _this.createEntityFromJSON(entity);
        });
    },
    createEntityFromJSON: function(entity) {
        if (entity.classname === "Player") {
            var nent = new Player(this.game, entity.x, entity.y);
            nent.id = entity.id;
            this.game.entities.push(nent);
        } else if (entity.classname === "Asteroid") {
            var nent = new Asteroid(this.game, entity.x, entity.y);
            nent.id = entity.id;
            this.game.entities.push(nent);
        } else if (entity.classname === "Planet") {
            var nent = new Planet(this.game, entity.x, entity.y);
            nent.id = entity.id;
            this.game.entities.push(nent);
        }
    },
});

module.exports = Connection;