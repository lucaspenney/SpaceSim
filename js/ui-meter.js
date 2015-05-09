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
var Vector = require('./vector');

var UIMeter = Class.extend({
    init: function(x, y, width, height, getVal, label) {
        this.pos = new Vector(x, y);
        this.getVal = getVal;
        this.label = label;
        this.width = width;
        this.height = height;
        this.padding = 1;
    },
    render: function(ctx, screen) {
        ctx.fillStyle = "#000";
        ctx.fillRect(this.pos.x, this.pos.y, this.width + this.padding, this.height + this.padding);
        var value = this.getVal();
        ctx.fillStyle = "#F00";
        ctx.fillRect(this.pos.x + this.padding, this.pos.y + this.padding, (value * this.width) - this.padding, this.height - this.padding);
        ctx.fillStyle = "#FFF";
        ctx.textAlign = 'center';
        ctx.fillText(this.label + " " + Math.floor(value * 100) + "%", this.pos.x + this.width / 2, this.pos.y + this.height / 1.5);
    },
});

module.exports = UIMeter;