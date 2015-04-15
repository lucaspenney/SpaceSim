function Screen(game) {
    this.xOffset = 0;
    this.yOffset = 0;
    this.width = 800;
    this.height = 600;
    this.focusedEntity = null;
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