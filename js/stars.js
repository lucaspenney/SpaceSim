var Sprite = require('./sprite');

function Stars(screen) {
    this.screen = screen;
    this.xOffset = 0;
    this.yOffset = 0;
    this.stars = [];
    this.numStars = 400;
    this.stars = [];
    this.layers = [];
    var _this = this;
    this.screen.eventManager.addEventListener('focus', function() {
        _this.init(screen);
        console.log('focus');
    });
}

Stars.prototype.init = function(screen) {
    this.layers = [{
        stars: [],
        amount: 400,
        scale: 0.2,
        size: 0.1,
    }, {
        stars: [],
        amount: 100,
        scale: 0.8,
        size: 0.5,
    }, {
        stars: [],
        amount: 100,
        scale: 1,
        size: 2,
    }, ];
    for (var l = 0; l < this.layers.length; l++) {
        var layer = this.layers[l];
        for (var i = 0; i < layer.amount; i++) {
            var x = Math.floor((Math.random() * screen.width) + (screen.xOffset * layer.scale));
            var y = Math.floor((Math.random() * screen.height) + (screen.yOffset * layer.scale));
            layer.stars.push({
                x: x,
                y: y,
                size: Math.floor(Math.random() * 2) + layer.size
            });
        }
    }
}

Stars.prototype.render = function(ctx, screen) {
    if (this.layers.length == 0) {
        this.init(screen);
    }
    for (var l = 0; l < this.layers.length; l++) {
        var layer = this.layers[l];
        for (var i = 0; i < layer.stars.length; i++) {
            var xOffset = screen.xOffset * layer.scale;
            var yOffset = screen.yOffset * layer.scale;
            if (layer.stars[i].x - xOffset < 0) {
                //layer.stars[i].x = screen.width + xOffset + (Math.random() * 100);
                layer.stars[i].x += screen.width;
            } else if (layer.stars[i].x - xOffset > screen.width) {
                //layer.stars[i].x = xOffset - (Math.random() * 100);
                layer.stars[i].x -= screen.width;
            }

            if (layer.stars[i].y - yOffset < 0) {
                //layer.stars[i].y = screen.height + yOffset + (Math.random() * 100);
                layer.stars[i].y += screen.height;
            } else if (layer.stars[i].y - yOffset > screen.height) {
                //layer.stars[i].y = yOffset - (Math.random() * 100);
                layer.stars[i].y -= screen.height;
            }
            ctx.fillStyle = "#FFF";
            ctx.fillRect(layer.stars[i].x - xOffset, layer.stars[i].y - yOffset, layer.stars[i].size, layer.stars[i].size);
        }
    }
}

module.exports = Stars;