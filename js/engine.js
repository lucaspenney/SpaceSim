var Class = require('./class');

var Engine = Class.extend({
    init: function(player) {
        this.player = player;
        this.game = player.game;
        this.mainOn = false;
        this.leftOn = false;
        this.rightOn = false;
        this.fuel = 1000;
    },
    hasFuel: function() {
        return this.fuel > 0;
    },
    useFuel: function(num) {
        this.fuel -= (num) ? num : 1;
    },
    toJSON: function() {
        return {
            mainOn: this.mainOn,
            leftOn: this.leftOn,
            rightOn: this.rightOn,
            fuel: this.fuel,
        };
    }
});

module.exports = Engine;