var Class = require('./class');
var _ = require('lodash-node');

var Vector = require('./vector');

var Spawner = Class.extend({
    init: function(game) {
        this.game = game;
    },
    getPlayerSpawnPoint: function() {
        var others = [];
        for (var i = this.entities.length - 1; i >= 0; i--) {

        }
    }
});


module.exports = Spawner;