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
    init: function(client) {
        this.client = client;
        this.pendingSendMessage = null;
        this.messages = [];
        this.textarea = $('<input type="text" maxlength="60">');
        $('#game').append(this.textarea);
        var _this = this;
        this.client.input.on('esc', function() {
            _this.hide();
        });
        this.client.input.on('y', function() {
            _this.show();
        });
        this.textarea.keyup(function(evt) {

            //Detect enter keypress and clear+send on it 
            if (evt.keyCode === 13) {
                _this.pendingSendMessage = _this.textarea.val();
                _this.textarea.val('');
                _this.hide();
            } else if (evt.keyCode === 27) {
                _this.hide();
            }
        });
    },
    show: function() {
        this.textarea.show();
        this.textarea.focus();
    },
    hide: function() {
        this.client.stage.focus();
        this.textarea.blur();
    },
    setPendingMessage: function(message) {
        this.pendingSendMessage = message
    },
    receiveMessages: function(messages) {
        if (messages && messages.length > 0) {
            for (var i = 0; i < messages.length; i++) {
                this.messages.push(messages[i])
            }
        }
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
        ctx.textAlign = 'left';
        var numMessages = (this.messages.length > 5) ? 5 : this.messages.length;
        for (var i = 0; i < numMessages; i++) {
            var message = this.messages[(this.messages.length - numMessages) + i];
            ctx.fillStyle = "#CCF";
            ctx.font = 'normal 10pt Monospace';
            ctx.fillText(message.name + ":", 20, (screen.height - (7 * 20)) + (i * 20));
            ctx.fillStyle = "#FFF";
            ctx.fillText(message.message, message.name.length * 12, (screen.height - (7 * 20)) + (i * 20));
        }
    },
});

module.exports = Chat;