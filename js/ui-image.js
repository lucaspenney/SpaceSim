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
var Angle = require('./angle');
var Sprite = require('./sprite');


var UIImage = Class.extend({
    init: function(img, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = new Angle();
        this.image = new Image();
        this.image.src = img;
        var _this = this;
        this.image.onload = function() {
            _this.loaded = true;
        }
    },
    render: function(ctx, screen) {
        if (this.loaded) {
            ctx.drawImage(this.image, 0, 0, screen.width, screen.height);
        }
    },
});

module.exports = UIImage;