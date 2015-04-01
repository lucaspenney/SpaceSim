//Entity
require('./class');

var Entity = Class.extend({
  init: function(x, y) {
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.sprite = null;
    this.layer = 0;
  },
  render: function(ctx, screen) {
    if (this.sprite !== undefined) {
      if (this.sprite.loaded) {
        this.sprite.draw(ctx, screen, this.x, this.y);
      }
    }
  },
  update: function() {

  },
  toJSON: function() {

  }
});

module.exports = Entity;