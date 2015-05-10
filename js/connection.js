var Class = require('./class');
var Player = require('./player');
var Asteroid = require('./asteroid');
var Planet = require('./planet');
var BlackHole = require('./blackhole');
var Explosion = require('./explosion');
var EntityFactory = require('./entityfactory');
var LZString = require('./lz-string');

var Connection = Class.extend({
    lastUpdate: 0,
    latency: 0,
    init: function(client, game) {
        this.client = client;
        this.game = game;
        this.server = new WebSocket("ws://" + ((window.location.hostname) ? window.location.hostname : '127.0.0.1') + ":8080");
        this.token = null;
        this.lastPacketLength = 0;
        this.lastPacket = null;
        this.lastUpdate = 0;
        this.latency = -1;
        this.lastReceive = 0;
        this.updateRate = 0;
        this.serverFrameTime = 0;
        this.nextData = null;
        this.serverTickRate = 30;
        this.serverMinDelay = 10;
        var _this = this;
        this.server.onmessage = function(message) {
            _this.lastPacketLength = message.data.length;
            var data = JSON.parse(message.data);
            if (data.handshake !== undefined) {
                _this.handshake(data.handshake);
            } else {
                _this.receive(data);
            }
        }
    },
    receive: function(data) {
        console.log('receiving');
        var start = Date.now();
        var _this = this;
        this.updateRate = (Date.now() - this.lastReceive);
        this.lastReceive = Date.now();
        this.latency = data.latency;
        this.game.lagCompensation = 1;
        this.serverFrameTime = data.frameTime;
        this.client.chat.receiveMessages(data.messages);
        var entities = this.game.entities;
        //First, delete any removed entities
        _.forEach(entities, function(entity, index) {
            if (entity === undefined) return true;
            var removed = true;
            _.forEach(data.entities, function(sEnt) {
                if (!entity) return;
                if (sEnt.id === entity.id) removed = false;
            });
            if (removed) {
                //This entity was not in the server's update - remove it
                entity.destroy();
            }
        });
        //Update existing entities
        var updateEntProperties = function(obj, entObj) {
            _.forOwn(obj, function(value, prop) {
                //First, underscore prefixed properties are entity references, reference them
                if (prop.indexOf("_") !== -1) {
                    _.forEach(entities, function(gEnt) {
                        if (gEnt.id === value.id) {
                            entObj[prop.replace("_", "")] = gEnt;
                            return false;
                        }
                    });
                } else if (value instanceof Array) {
                    entObj[prop] = value;
                } else if (typeof value === 'object' && entObj) {
                    updateEntProperties(value, entObj[prop])
                } else if (prop !== undefined && entObj) {
                    entObj[prop] = value;
                }
            });
        };
        _.forEach(data.entities, function(sEnt) {
            _.forEach(entities, function(cEnt) {
                if (!_this.client.screen.focusedEntity && cEnt.id === data.focus.id) {
                    _this.client.screen.setFocusedEntity(cEnt);
                }
                if (cEnt.id === sEnt.id) {
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

        this.send(data.packetId);
        this.updateTime = Date.now() - start;
        this.lastUpdate = Date.now();
        this.client.lastUpdate = Date.now();
        this.client.game.lastTick = Date.now() - this.updateTime;
        this.client.render();
    },
    send: function(packetId) {
        var data = {
            token: this.token,
            packetId: packetId,
            input: this.client.input.getInputState(),
            message: this.client.chat.getAndResetMessage(),
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
        var ent = this.game.entityFactory.create(entity.classname, this.game, entity.pos.x, entity.pos.y, true, entity.id);
    },
});

module.exports = Connection;