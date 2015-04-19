var Class = require('./class');
var BoundingBox = require('./boundingbox');
var Vector = require('./vector');

var Physics = Class.extend({
  init: function(game, entity) {
    this.game = game;
    this.entity = entity;
    this.vel = new Vector(0, 0);
    this.accel = new Vector(0, 0);
    this.rv = 0;
    this.ra = 0;
    this.maxVelocity = 15;
    this.mass = 100;
    this.bounds = new BoundingBox(game, entity);
    this.collidesWith = [];
    this.static = false;
  },
  update: function(entities) {
    //Add gravity to acceleration
    var nearbys = [];
    for (var i = 0; i < this.game.entities.length; i++) {
      if (this.game.entities[i].pos.distance(this.entity.pos) < 3000 && this.game.entities[i].physics !== undefined && this.game.entities[i] !== this.entity) {
        nearbys.push(this.game.entities[i]);
        var entity = this.game.entities[i];
        //Add gravity to this entity
        var diffX = entity.pos.x - this.entity.pos.x;
        var diffY = entity.pos.y - this.entity.pos.y;
        var distSquare = diffX * diffX + diffY * diffY
        var dist = Math.sqrt(distSquare);
        //If you add mass to the objects change to entity.mass
        //instead of 50
        var totalForce = entity.physics.mass / distSquare;
        var xa = totalForce * diffX / dist;
        var ya = totalForce * diffY / dist;
        this.addAcceleration(xa, ya, 0);
      }
      var dist = this.entity.pos.distance(this.game.entities[i].pos);

    }
    //Increase velocity by current acceleration
    this.addVelocity(this.accel.x, this.accel.y, this.ra);


    for (var i = 0; i < nearbys.length; i++) {
      //Check for collisions
      var collision = this.bounds.wouldCollide(this.vel, nearbys[i]);
      if (collision) {
        this.collide(nearbys[i], collision);
      }
    }

    if (!this.static) {
      //Move entity based on velocity
      this.entity.pos.add(this.vel);
      this.entity.rotation += this.rv;
    }

    //Reset acceleration as it's now been applied to the current velocity
    this.accel = new Vector(0, 0);
    this.ra = 0;
    this.bounds.update();
  },
  collide: function(entity, collision) {
    //if (this.collidesWith.indexOf(entity.toJSON().classname) === -1) return;
    var e = entity.physics;

    e.vel.x += this.vel.x / 2;
    e.vel.y += this.vel.y / 2;

    this.vel.x *= -0.5;
    this.vel.y *= -0.5;

    /*
    if (Math.abs(entity.physics.vel.x) + Math.abs(entity.physics.vel.y) > Math.abs(this.vel.x) + Math.abs(this.vel.y)) {
      var velx = (entity.physics.vel.x / 2) * (entity.physics.mass / 100);
      var vely = (entity.physics.vel.y / 2) * (entity.physics.mass / 100);
      this.addAcceleration(xVel, yVel);

      entity.physics.addVelocity(this.vel.x * -1, this.vel.y * -1);
    } else {
      var xVel = (this.vel.x / 2) * (this.mass / 100);
      var yVel = (this.vel.y / 2) * (this.mass / 100);
      entity.physics.addAcceleration(xVel, yVel);

      this.addVelocity(entity.physics.vel.x * -1, entity.physics.vel.y * -1);
    }
    */
    //Check to ensure we don't have collision issue still
    if (this.bounds.wouldCollide(this.vel.x, this.vel.y, entity)) {
      //this.vel.x *= -0.5;
      //this.vel.y *= -0.5;
    }
  },
  addVelocity: function(x, y, r) {
    x = x || 0;
    y = y || 0;
    r = r || 0;

    if (this.vel.x > this.maxVelocity) this.vel.x = this.maxVelocity;
    else if (this.vel.x < this.maxVelocity * -1) this.vel.x = this.maxVelocity * -1;

    if (this.vel.y > this.maxVelocity) this.vel.y = this.maxVelocity;
    else if (this.vel.y < this.maxVelocity * -1) this.vel.y = this.maxVelocity * -1;

    if (this.rv > this.maxVelocity) this.rv = this.maxVelocity;
    else if (this.rv < this.maxVelocity * -1) this.rv = this.maxVelocity * -1;

    this.vel.x += x;
    this.vel.y += y;
    this.rv += r;

    if (Math.random() > 0.5) {
      //this.vel.x = this.vel.x * 0.99;
      //this.vel.y = this.vel.y * 0.99;
      //this.rv = this.rv * 0.99;
    }
  },
  setVelocity: function(x, y, r) {
    this.vel.x = x;
    this.vel.y = y;
    this.rv = r;
  },
  addAcceleration: function(x, y, r) {
    this.accel.x += x;
    this.accel.y += y;
    this.ra += r || 0;
  },
  getDistTo: function(physics) {
    //Calculate the distance between the center of this physics object and the center of another
    //Get the center coordinate of this physics obj
  },
});
module.exports = Physics;