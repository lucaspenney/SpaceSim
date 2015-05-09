var Class = require('./class');
var Explosion = require('./explosion');
var Ship = require('./ship');

var Audio = Class.extend({
    init: function(client) {
        var _this = this;
        this.client = client;
        this.game = this.client.game;
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
        this.game.on('entity.destroyed', function(entity) {
            var sounds = entity.sounds;
            if (sounds) {
                for (var k in sounds) {
                    if (sounds.hasOwnProperty(k)) {
                        console.log(sounds[k]);
                        _this.sounds[k].stop(sounds[k]);
                        entity.sounds[k] = null;
                    }
                }
            }
        });
    },
    playSound: function(soundName, context, callback) {
        this.sounds[soundName].play(function(id) {
            if (context && callback)
                callback.call(context, id);
        });
    },
    stopSound: function(soundName, soundId) {
        this.sounds[soundName].stop(soundId);
    },
    disableMusic: function() {
        this.sounds["background"].stop();
    }
});

module.exports = Audio;