function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add(vector) {
    this.x += vector.x;
    this.y += vector.y;
}

module.exports = Vector;