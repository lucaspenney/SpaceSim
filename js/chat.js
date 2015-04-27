var Class = require('./class');
var FPSManager = require('./fpsmanager');
var Screen = require('./screen');
var Stars = require('./stars');
var EventManager = require('./eventmanager');
var InputManager = require('./input');
var Player = require('./player');
var Entity = require('./entity');
var Connection = require('./connection');
var Game = require('./game');

var Chat = Class.extend({
    init: function() {
        this.pendingSendMessage = "test";
        this.messages = [];
    },
    receiveMessage: function(message) {
        if (message && message.length > 0)
            this.messages.push(message);
    },
    sendMessage: function(message) {
        this.pendingSendMessage = message;
    },
    getAndResetMessage: function() {
        var message = this.pendingSendMessage;
        this.pendingSendMessage = null;
        return message;
    },
    render: function(ctx, screen) {

    },
});

module.exports = Chat;