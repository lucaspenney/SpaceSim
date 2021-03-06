var EventManager = require('./eventmanager');
var Stars = require('./stars');
var Sprite = require('./sprite');

function Screen(client) {
    this.client = client;
    this.xOffset = 0;
    this.yOffset = 0;
    this.targetXOffset = 0;
    this.targetYOffset = 0;
    this.width = Math.min(window.innerWidth, 1280);
    this.height = Math.min(window.innerHeight, 960);
    this.focusedEntity = null;
    this.eventManager = new EventManager();
    this.stars = new Stars(this);

    //Set screen size
    this.client.canvasElement.setAttribute('height', this.height);
    this.client.canvasElement.setAttribute('width', this.width);
    this.client.stage.width(this.width);
    this.client.stage.height(this.height);
    this.client.stage.css('margin-top', ($(window).height() - this.height) / 2)
    var fitWindow = false;
    if (fitWindow) {
        $(this.client.canvasElement).width($(window).width());
    }

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
    if (ent.ship) {
        this.focusedEntity = ent;
    } else return;
    this.targetXOffset = ent.ship.pos.x - (this.width / 2);
    this.targetXOffset = ent.ship.pos.y - (this.height / 2);
    this.eventManager.dispatch('focus');
    this.xOffset = this.targetXOffset;
    this.yOffset = this.targetYOffset;
}

Screen.prototype.render = function(ctx, screen) {

    var lookAheadFactor = 12;
    if (this.focusedEntity && this.focusedEntity.ship) {
        this.targetXOffset = this.focusedEntity.ship.pos.x + this.focusedEntity.ship.physics.vel.clone().scale(lookAheadFactor).x - (this.width / 2);
        this.targetYOffset = this.focusedEntity.ship.pos.y + this.focusedEntity.ship.physics.vel.clone().scale(lookAheadFactor).y - (this.height / 2);
        this.targetXOffset = this.focusedEntity.ship.pos.x - (this.width / 2);
        this.targetyOffset = this.focusedEntity.ship.pos.y - (this.height / 2);
        //this.xOffset += (this.targetXOffset - this.xOffset) * 0.25;
        //this.yOffset += (this.targetYOffset - this.yOffset) * 0.25;
    }
    this.xOffset = this.targetXOffset;
    this.yOffset = this.targetYOffset;
    this.stars.render(ctx, screen);
}

module.exports = Screen;