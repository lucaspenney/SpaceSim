function Stars(screen) {
    screen = screen;
    this.xOffset = 0;
    this.yOffset = 0;
    this.stars = [];
    this.numStars = 900;
}

Stars.prototype.render = function(ctx, screen) {
    if (this.stars.length == 0) {
        for (var i = 0; i < this.numStars; i++) {
            var x = -3000 + (Math.random() * 6000);
            var y = -3000 + (Math.random() * 6000);
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