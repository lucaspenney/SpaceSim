var Class = require('./class');

var Engine = Class.extend({
    init: function(player) {
        this.player = player;
        this.game = player.game;
        this.mainOn = false;
        this.leftOn = false;
        this.rightOn = false;
    },
});

module.exports = Engine;