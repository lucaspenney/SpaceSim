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
var UIImage = require('./ui-image');

var UI = Class.extend({
    init: function(client) {
        this.client = client;
        this.game = this.client.game;
        var _this = this;
        var screen = this.client.screen;

        //Create ui
        this.components = [];
        this.components.push(new UIImage("img/ui.png", 0, 0, 1280, 960));

        //Fuel meter
        this.components.push(new UIMeter(screen.width / 1.435, screen.height - (screen.height / 15), screen.width / 12, screen.height / 35,
            function() {
                if (!screen.focusedEntity || !screen.focusedEntity.ship) return 1;
                return (screen.focusedEntity.ship.engine.fuel / 1000);
            }, 'Fuel'));

        //Shields meter
        //Fuel meter
        this.components.push(new UIMeter(screen.width / 1.185, screen.height - (screen.height / 15), screen.width / 12, screen.height / 35,
            function() {
                if (!screen.focusedEntity || !screen.focusedEntity.ship) return 1;
                return (screen.focusedEntity.ship.health / 100);
            }, 'Shields'));

    },
    render: function(ctx, screen) {
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].render(ctx, screen);
        }
    },
});

module.exports = UI;