require('./class');
var Player = require('./player');

var Game = Class.extend({
  init: function() {
    this.entities = [];
    this.debugMode = false;
    for (var i = 0; i < 50; i++) {
      //new Asteroid(this, (Math.random() * 6000) - 3000, (Math.random() * 6000) - 3000);
    }
    this.update();
  },
  update: function() {
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
  }
});
module.exports = Game;