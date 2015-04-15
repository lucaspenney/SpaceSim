//Entity
var Class = require('./class');
var Vector = require('./vector');

var Entity = Class.extend({
  init: function(game, x, y) {
    this.game = game;
    this.pos = new Vector(x, y);
    this.id = game.newEntityId();
    this.rotation = 0;
    this.sprite = null;
    this.layer = 0;
  },
  render: function(ctx, screen) {
    if (this.sprite !== undefined) {
      if (this.sprite.loaded) {
        this.sprite.draw(ctx, screen, this.pos.x, this.pos.y);
      }
    }
  },
  update: function() {

  },
  destroy: function() {
    this.game.deletedEntities.push(this);
  },
  toJSON: function() {
    return {
      id: this.id,
    };
  }
});

module.exports = Entity;