var Class = require('./class');
var Explosion = require('./explosion');
var Ship = require('./ship');

var Audio = Class.extend({
    init: function(client) {
        var _this = this;
        this.client = client;
        this.game = this.client.game;
        this.entitySounds = [];
        this.sounds = {};
        this.sounds["background"] = new Howl({
            urls: ['sound/background2.ogg'],
            volume: 0.4,
            autoplay: true,
            loop: true,
            buffer: true,
        });
        this.sounds["explosion"] = new Howl({
            urls: ['sound/explosion.wav'],
            volume: 0.6,
        });
        this.sounds["engine"] = new Howl({
            urls: ['sound/engine.wav'],
            loop: true,
            volume: 0.5,
            buffer: true,
        });

        this.game.on('entity.created', function(entity) {
            if (entity instanceof Explosion) {
                _this.sounds["explosion"].play();
            }
            if (entity instanceof Ship) {
                _this.entitySounds[entity.id] = {
                    sounds: {
                        engine: {
                            sound: _this.sounds["engine"],
                            id: null,
                        }
                    },
                    entity: entity
                };
            }
        });
        this.game.on('entity.destroyed', function(entity) {
            if (_this.entitySounds[entity.id]) {
                _this.entitySounds[entity.id].sounds.engine.sound.stop(_this.entitySounds[entity.id].sounds.engine.id);
                _this.entitySounds[entity.id] = null;
            }
        });
    },
    update: function() {
        for (var i = this.game.entities.length - 1; i >= 0; i--) {
            var entity = this.game.entities[i];
            if (entity instanceof Ship) {
                if (this.entitySounds[entity.id]) {
                    var engineSound = this.entitySounds[entity.id].sounds.engine;
                    if (entity.engine.mainOn) {
                        if (engineSound.id === null) {
                            engineSound.sound.play(function(id) {
                                engineSound.id = id;
                            }).loop();
                        }
                    } else {
                        if (engineSound.id !== null) {
                            engineSound.sound.stop(engineSound.id);
                            engineSound.id = null;
                        }
                    }
                }
            }
        }
    },
});

module.exports = Audio;