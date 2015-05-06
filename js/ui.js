var Class = require('./class');
var FPSManager = require('./fpsmanager');
var Screen = require('./screen');
var Stars = require('./stars');
var EventManager = require('./eventmanager');
var InputManager = require('./input');
var Player = require('./player');
var Entity = require('./entity');
var Connection = require('./connection');
var UIMeter = require('./ui-meter');

var UI = Class.extend({
    init: function(client) {
        this.client = client;
        this.game = this.client.game;
        var _this = this;
        var screen = this.client.screen;

        //Create ui
        this.components = [];
        //Fuel meter
        this.components.push(new UIMeter(screen.width / 2, screen.height - 50, function() {
            return (_this.client.screen.focusedEntity.ship.engine.fuel / 1000);
        }, 'fuel'));
    },
    render: function(ctx, screen) {
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].render(ctx, screen);
        }
    },
});

module.exports = UI;