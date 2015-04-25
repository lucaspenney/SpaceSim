var EventManager = require('./eventmanager');
var Stars = require('./stars');

function Screen(game) {
    this.xOffset = 0;
    this.yOffset = 0;
    this.width = 1000;
    this.height = 750;
    this.focusedEntity = null;
    this.eventManager = new EventManager();
    this.stars = new Stars(this);
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

Screen.prototype.setFocusedEntity = function(ent) {
    this.focusedEntity = ent;
    console.log(this.focusedEntity)
    this.xOffset = ent.pos.x - (this.width / 2);
    this.yOffset = ent.pos.y - (this.height / 2);
    this.eventManager.dispatch('focus');
}

Screen.prototype.render = function(ctx, screen) {
    if (this.focusedEntity) {
        this.xOffset = this.focusedEntity.pos.x - (this.width / 2);
        this.yOffset = this.focusedEntity.pos.y - (this.height / 2);
    }
    this.stars.render(ctx, screen);
}

module.exports = Screen;