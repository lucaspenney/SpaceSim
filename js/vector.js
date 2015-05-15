/**
 * 2D Vector
 * @author Dave Taylor <dave.taylor@pogokid.com>
 */
var Vector = function(x, y) {
  this.listeners = [];
  this.set(x, y);
};
Vector.scalar = function(s) {
  return {
    x: s,
    y: s
  };
};
Vector.prototype = {
  // simple events
  on: function(eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
    return this;
  },
  _trigger: function(eventName) {
    if (this.listeners[eventName]) {
      for (var i = 0; i < this.listeners[eventName].length; i++) {
        this.listeners[eventName][i].call(this);
      }
    }
    return this;
  },

  // the core place to set the values
  set: function(x, y) {
    this.x = x;
    this.y = typeof y === 'undefined' ? x : y;
    this._trigger('set');
    return this;
  },

  // the maths
  add: function(v) {
    return this.set(
      this.x + v.x,
      this.y + v.y
    );
  },
  subtract: function(v) {
    return this.set(
      this.x - v.x,
      this.y - v.y
    );
  },
  multiply: function(v) {
    return this.set(
      this.x * v.x,
      this.y * v.y
    );
  },
  divide: function(v) {
    return this.set(
      this.x / v.x,
      this.y / v.y
    );
  },
  modulo: function(v) {
    return this.set(
      this.x % v.x,
      this.y % v.y
    );
  },
  inverse: function() {
    return this.set(
      this.x *= -1,
      this.y *= -1
    );
  },
  normalize: function() {
    var mag = this.mag();
    return this.div({
      x: mag,
      y: mag
    });
  },
  scale: function(s) {
    return this.set(
      this.x * s,
      this.y * s
    );
  },
  limit: function(x, y) {
    if (this.x > x) {
      this.set({
        x: x,
      });
    }
    if (this.y > y) {
      this.set({
        y: y,
      });
    }
  },
  mag: function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  },

  // functions which return a new instance
  Plus: function(v) {
    return this.clone().plus(v);
  },
  Minus: function(v) {
    return this.clone().minus(v);
  },
  Mult: function(v) {
    return this.clone().mult(v);
  },
  Div: function(v) {
    return this.clone().div(v);
  },
  Mod: function(v) {
    return this.clone().mod(v);
  },
  Inv: function() {
    return this.clone().inverse();
  },
  Normalize: function() {
    return this.clone().normalize();
  },


  // helpers
  copy: function(v) {
    return this.set(v.x, v.y);
  },
  clone: function() {
    var v = new Vector();
    return v.copy(this);
  },
  equals: function(v) {
    return this.x === v.x && this.y === v.y;
  },

  // other helpers
  distance: function(v) {
    return Math.sqrt(Math.pow((v.x - this.x), 2) + Math.pow((v.y - this.y), 2));
  },
  greaterThan: function(v) {
    if (this.x > v.x && this.y > v.y) return true;
    return false;
  },
  lessThan: function(v) {
    if (this.x < v.x && this.y < v.y) return true;
    return false;
  },
  absoluteGreaterThan: function(n) {
    return Math.abs(this.x) + Math.abs(this.y) > n;
  },
  absoluteLessThan: function(n) {
    return Math.abs(this.x) + Math.abs(this.y) < n;
  },
  getAbsoluteValue: function() {
    return (Math.abs(this.x) + Math.abs(this.y));
  },
  toJSON: function() {
    return {
      x: this.x,
      y: this.y
    };
  }

};
module.exports = Vector;