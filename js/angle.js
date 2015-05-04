var Angle = function(a) {
  this.degrees = 0;
  this.set(a);
};
Angle.prototype = {
  set: function(a) {
    this.degrees = (!isNaN(a)) ? a : 0;
    this.makeValid();
    return this;
  },
  add: function(a) {
    this.degrees += a;
    this.makeValid();
    return this;
  },
  subtract: function(a) {
    this.degrees -= a;
    this.makeValid();
    return this;
  },
  addAngle: function(a) {
    this.degrees += a.degrees;
    this.makeValid();
    return this;
  },
  subtractAngle: function(a) {
    this.degrees -= a.degrees;
    this.makeValid();
    return this;
  },
  makeValid: function() {
    while (!this.isValid()) {
      if (this.degrees > 180) this.degrees -= 360;
      else if (this.degrees < -180) this.degrees += 360;
    }
  },
  isValid: function(a) {
    if (this.degrees > 180 || this.degrees < -180) return false;
    return true;
  },
  copy: function(angle) {
    return this.set(angle);
  },
  clone: function() {
    return new Angle(this.degrees);
  },
  toRadians: function() {
    return degToRad(this.degrees);
  },
  fromRadians: function(ra) {
    return this.set(radToDeg(ra));
  },
  toJSON: function() {
    return {
      degrees: this.degrees,
    };
  }
};

function degToRad(angle) {
  return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
  return ((angle * 180) / Math.PI);
}

module.exports = Angle;