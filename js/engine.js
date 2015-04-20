var Class = require('./class');

var Engine = Class.extend({
    init: function(player) {
        this.player = player;
        this.game = player.game;
        this.mainOn = false;
        this.leftOn = false;
        this.rightOn = false;
    },
    toJSON: function() {
        return {
            mainOn: this.mainOn,
            leftOn: this.leftOn,
            rightOn: this.rightOn,
        };
    }
});

module.exports = Engine;