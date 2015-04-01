function Screen(game) {
    this.xOffset = 0;
    this.yOffset = 0;
    this.width = 600;
    this.height = 450;

}

Screen.prototype.update = function() {

};

Screen.prototype.scroll = function() {
    this.move(0, 0);
};

Screen.prototype.move = function(x, y) {
    this.xOffset += x;
    this.yOffset += y;
};

Screen.prototype.setXOffset = function(x) {
    this.xOffset = x;
};

Screen.prototype.setYOffset = function(y) {
    this.yOffset = y;
};

module.exports = Screen;