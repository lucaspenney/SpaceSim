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
            volume: 0.6,
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
            autoplay: true,
        });

        this.game.on('entity.created', function(entity) {
            if (entity instanceof Explosion) {
                _this.sounds["explosion"].play();
            }
            if (entity instanceof Ship) {
                _this.entitySounds[entity.id] = {
                    sounds: {
                        engine: _this.sounds["engine"]
                    },
                    entity: entity
                };
            }
        });
        this.game.on('entity.destroyed', function(entity) {
            if (this.entitySounds[entity.id]) {
                this.entitySounds[entity.id].sounds.engine.stop();
                this.entitySounds[entity.id] = null;
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
                        if (this.entitySounds[entity.id].sounds.engine.pos() === 0) {
                            this.entitySounds[entity.id].sounds.engine.play();
                            engineSound.pos(1)
                        }
                    } else {
                        this.entitySounds[entity.id].sounds.engine.stop();
                    }
                }
            }
        }
    },
});

module.exports = Audio;