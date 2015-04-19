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
        //First, delete any removed entities
        _.forEach(entities, function(entity, index) {
            var removed = true;
            _.forEach(data.entities, function(sEnt) {
                if (sEnt.id === entity.id) removed = false;
            });
            if (removed) {
                //This entity was not in the server's update - remove it
                _this.game.entities.splice(index, 1);
            }
        });
        //Update existing entities
        _.forEach(data.entities, function(sEnt) {
            _.forEach(entities, function(cEnt) {
                if (cEnt.id === data.focus.id) {
                    _this.client.screen.focusedEntity = cEnt;
                    console.log(cEnt.pos);
                }
                if (cEnt.id === sEnt.id) {
                    var updateEntProperties = function(obj, entObj) {
                        _.forOwn(obj, function(value, prop) {
                            if (typeof value === 'object') {
                                updateEntProperties(value, entObjd[prop])
                            } else if (prop !== undefined) {
                                entObj[prop] = value;
                            }
                        });
                    };
                    updateEntProperties(sEnt, cEnt);
                }
            })
        });
        //Create any new entities
        _.forEach(data.entities, function(entity) {
            //Create new entity with this entity id and properties
            var exists = false;
            _.forEach(entities, function(ent) {
                if (ent.id === entity.id) exists = true;
            })
            if (!exists) _this.createEntityFromJSON(entity);
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