require('./class');
var BoundingBox = require('./boundingbox');

var Physics = Class.extend({
  init: function(game, entity) {
    this.game = game;
    this.entity = entity;
    this.xv = 0;
    this.yv = 0;
    this.rv = 0;
    this.maxVelocity = 8;
    this.mass = 100;
    this.boundingBox = new BoundingBox(game, entity);
    this.collidesWith = [];
  },
  update: function(entities) {
    this.boundingBox.update();
    for (var i = 0; i < this.game.entities.length; i++) {
      var collisionResult;
      if (collisionResult = this.boundingBox.wouldCollide(this.xv, this.yv, this.game.entities[i])) {
        //Basic reflecting collisions
        this.collide(this.game.entities[i], collisionResult);
      }
    }
    this.entity.x += this.xv;
    this.entity.y += this.yv;
    this.entity.rotation += this.rv;
  },
  collide: function(entity, collision) {
    if (this.collidesWith.indexOf(entity.toJSON().classname) === -1) return;
    if (Math.abs(entity.physics.xv) + Math.abs(entity.physics.yv) > Math.abs(this.xv) + Math.abs(this.yv)) {
      var xVel = (entity.physics.xv / 2) * (entity.physics.mass / 100);
      var yVel = (entity.physics.yv / 2) * (entity.physics.mass / 100);
      this.addVelocity(xVel, yVel);

      entity.physics.addVelocity(this.xv * -1.5, this.yv * -1.5);
    } else {
      var xVel = (this.xv / 2) * (this.mass / 100);
      var yVel = (this.yv / 2) * (this.mass / 100);
      entity.physics.addVelocity(xVel, yVel);

      this.addVelocity(entity.physics.xv * -1.5, entity.physics.yv * -1.5);
    }
    //Check to ensure we don't have collision issue still
    if (this.boundingBox.wouldCollide(this.xv, this.yv, entity)) {
      this.xv *= -0.5;
      this.yv *= -0.5;
    }
  },
  addVelocity: function(x, y, r) {
    x = x || 0;
    y = y || 0;
    r = r || 0;

    if (this.xv > this.maxVelocity) this.xv = this.maxVelocity;
    else if (this.xv < this.maxVelocity * -1) this.xv = this.maxVelocity * -1;

    if (this.yv > this.maxVelocity) this.yv = this.maxVelocity;
    else if (this.yv < this.maxVelocity * -1) this.yv = this.maxVelocity * -1;

    if (this.rv > this.maxVelocity) this.rv = this.maxVelocity;
    else if (this.rv < this.maxVelocity * -1) this.rv = this.maxVelocity * -1;

    this.xv += x;
    this.yv += y;
    this.rv += r;

    if (Math.random() > 0.5) {
      this.xv = this.xv * 0.99;
      this.yv = this.yv * 0.99;
      this.rv = this.rv * 0.99;
    }
  },
  setVelocity: function(x, y, r) {
    this.xv = 0;
    this.yv = 0;
    this.rv = 0;
    this.addVelocity(x, y, r);
  },
});
module.exports = Physics;