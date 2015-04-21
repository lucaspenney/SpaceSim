var Class = require('./class');
var Player = require('./player');
var Stars = require('./stars');

var Game = Class.extend({
  entityId: 0,
  init: function() {
    this.entities = [];
    this.deletedEntities = [];
    this.debugMode = false;
    this.stars = new Stars();
    this.lastTick = Date.now();
    this.tick = Date.now();
    this.lagCompensation = 0;
  },
  update: function() {
    this.tick = Date.now();
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].update();
    }
    this.lastTick = this.tick;
  },
  render: function(ctx, screen) {
    if (!ctx || !screen) return;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, screen.width, screen.height);
    this.stars.render(ctx, screen);
    this.entities.sort(function(a, b) {
      if (a === null) return 1;
      if (b === null) return -1;
      if (a.layer === undefined) a.layer = 0;
      if (b.layer === undefined) b.layer = 0;
      if (a.layer < b.layer)
        return -1;
      if (a.layer > b.layer)
        return 1;
      return 0;
    });
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].render(ctx, screen);
    }
  },
  newEntityId: function() {
    this.entityId++;
    return this.entityId;
  },
});
module.exports = Game;