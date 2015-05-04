//Entity
var Class = require('./class');
var Vector = require('./vector');
var Angle = require('./angle');

var Entity = Class.extend({
  init: function(game, id, x, y) {
    this.game = game;
    this.pos = new Vector(x, y);
    this.id = id;
    this.rotation = new Angle();
    this.sprite = null;
    this.layer = 0;
    this.active = true;
    this.game.eventManager.dispatch('entity.created', this, this);
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
    this.game.eventManager.dispatch('entity.destroyed', this, this);
    for (var i = this.game.entities.length - 1; i >= 0; i--) {
      if (this.game.entities[i].id === this.id) this.game.entities.splice(i, 1);
    }
  },
  toJSON: function() {
    return {
      id: this.id,
    };
  }
});

module.exports = Entity;