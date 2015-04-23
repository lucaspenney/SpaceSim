var Class = require('./class');
var BoundingBox = require('./boundingbox');
var Vector = require('./vector');
var EventManager = require('./eventmanager');

var Physics = Class.extend({
  init: function(game, entity, bounds) {
    this.game = game;
    this.entity = entity;
    this.vel = new Vector(0, 0);
    this.accel = new Vector(0, 0);
    this.rv = 0;
    this.ra = 0;
    this.maxVelocity = 15;
    this.mass = 100;
    this.bounds = bounds;
    this.collidesWith = [];
    this.static = false;
    this.timeScale = 1;
    this.eventManager = new EventManager();
  },
  update: function(entities) {
    //Add gravity to acceleration
    var time = this.game.tick - this.game.lastTick;
    //console.log(time);
    var percentOff = (time - 33) / 33;
    this.timeScale = percentOff + 1 + this.game.lagCompensation; //Multiply calculations by 1 + % off -- working currently
    var nearbys = [];
    for (var i = 0; i < this.game.entities.length; i++) {
      if (this.game.entities[i].pos.distance(this.entity.pos) < 2000 && this.game.entities[i].physics !== undefined && this.game.entities[i] !== this.entity) {
        nearbys.push(this.game.entities[i]);
        var entity = this.game.entities[i];
        //Add gravity to this entity
        var diffX = entity.pos.x - this.entity.pos.x;
        var diffY = entity.pos.y - this.entity.pos.y;
        var distSquare = diffX * diffX + diffY * diffY
        var dist = Math.sqrt(distSquare);
        var totalForce = entity.physics.mass / distSquare;
        var xa = totalForce * diffX / dist;
        var ya = totalForce * diffY / dist;
        this.addAcceleration(xa, ya, 0);
      }
      var dist = this.entity.pos.distance(this.game.entities[i].pos);

    }
    //Increase velocity by current acceleration
    this.addVelocity(this.accel.x, this.accel.y, this.ra);



    if (!this.static) {
      //Do collision and movement
      var vel = this.vel.clone();
      for (var k = 1; k <= 3; k++) {
        var collision = false;
        var colliding = null;
        var v = vel.clone()
        v.scale(k / 3);
        for (var i = 0; i < nearbys.length; i++) {
          colliding = nearbys[i];
          collision = this.bounds.wouldCollide(v, nearbys[i]);
          if (collision) break;
        }
        if (collision) {
          this.collide(colliding, collision);
          break;
        } else {
          this.entity.pos.add(v);
          this.bounds.update();
        }
      }
      //Move entity based on velocity

      this.entity.rotation += this.rv;
    } else {
      this.bounds.update();
    }

    //Reset acceleration as it's now been applied to the current velocity
    this.accel = new Vector(0, 0);
    this.ra = 0;
  },
  collide: function(entity, collision) {
    //if (this.collidesWith.indexOf(entity.toJSON().classname) === -1) return;
    if (!entity) return;
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

    this.eventManager.dispatch('collision', this, entity);
    entity.physics.eventManager.dispatch('collision', entity.physics, this.entity);
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

    this.vel.x += x * this.timeScale;
    this.vel.y += y * this.timeScale;
    this.rv += r * this.timeScale;

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
    if (!r) r = 0;
    this.accel.x += x * this.timeScale;
    this.accel.y += y * this.timeScale;
    this.ra += r * this.timeScale;
  },
  onCollision: function(func) {
    //Add event listener for collision
    this.eventManager.addEventListener('collision', func);
  },
  toJSON: function() {
    return {
      vel: this.vel,
      rv: this.rv,
      bounds: this.bounds,
    };
  },
});
module.exports = Physics;