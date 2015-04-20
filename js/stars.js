function Stars(screen) {
    screen = screen;
    this.xOffset = 0;
    this.yOffset = 0;
    this.stars = [];
    this.numStars = 200;
}

Stars.prototype.render = function(ctx, screen) {
    if (this.stars.length == 0) {
        for (var i = 0; i < this.numStars; i++) {
            var x = -1000 + (Math.random() * 3000);
            var y = -1000 + (Math.random() * 3000);
            this.stars.push({
                x: x,
                y: y,
            });
        }
    }

    for (var i = 0; i < this.stars.length; i++) {
        var x = this.stars[i].x - screen.xOffset;
        var y = this.stars[i].y - screen.yOffset;
        if (x > 0 && x < screen.width) {
            if (y > 0 && y < screen.height) {
                ctx.fillStyle = "#FFF";
                ctx.fillRect(x, y, 2, 2);
            }
        }
    }
}

module.exports = Stars;