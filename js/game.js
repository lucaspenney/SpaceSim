var Class = require('./class');
var Player = require('./player');

var Game = Class.extend({
  entityId: 0,
  init: function() {
    this.entities = [];
    this.deletedEntities = [];
    this.debugMode = false;
    for (var i = 0; i < 50; i++) {
      //new Asteroid(this, (Math.random() * 6000) - 3000, (Math.random() * 6000) - 3000);
    }
  },
  update: function() {
    if (this.deletedEntities.length > 0) {
      for (var i = 0; i < this.entities.length; i++) {
        for (var k = 0; k < this.deletedEntities.length; k++) {
          if (this.entities[i].id === this.deletedEntities[k].id) {
            this.entities.splice(i, 1);
            i = 0;
            k = 0;
          }
        }
      }
      this.deletedEntities = [];
    }
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].update();
    }
  },
  render: function(ctx, screen) {
    if (!ctx || !screen) return;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, screen.width, screen.height);
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