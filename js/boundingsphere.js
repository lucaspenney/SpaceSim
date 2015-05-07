require('./class');

var BoundingSphere = Class.extend({
    init: function(game, entity, radius) {
        this.game = game;
        this.entity = entity;
        this.x = entity.x;
        this.y = entity.y;
        this.xOffset = 0;
        this.yOffset = 0;
        this.radius = radius || entity.radius;;
    },
    update: function() {
        this.x = this.entity.x + this.xOffset;
        this.y = this.entity.y + this.yOffset;
    },
    setOffset: function(x, y) {
        this.xOffset = x;
        this.yOffset = y;
    },
    setWidth: function(width) {
        this.width = width;
    },
    setHeight: function(height) {
        this.height = height;
    },
    wouldCollide: function(x, y, e) {
        var wouldCollide = false;
        this.x += x;
        this.y += y;
        wouldCollide = this.isColliding(e);
        this.x -= x;
        this.y -= y;
        return wouldCollide;
    },
    isColliding: function(e) {
        if (!e.physics) return false;
        if (this.entity === e) return false;
        e = e.physics.boundingBox;
        if (this.x + this.width > e.x && this.x < e.x + e.width) {
            if (this.y + this.height > e.y && this.y < e.y + e.height) {
                var x, y;
                if (this.x + this.width > e.x) x = (this.x + this.width) - e.x;
                else if (this.x < e.x + e.width) x = this.x - (e.x + e.width);
                if (this.y + this.height > e.y) y = (this.y + this.height) - e.y;
                else if (this.y < e.y + e.height) y = this.y - (e.y + e.height);
                return {
                    x: x,
                    y: y,
                };
            }
        }
        return false;
    },
    getDistBetween: function() {
        e = e.physics.boundingBox;
        var point1a = this.x + (this.width / 2);
        var point1b = this.y + (this.height / 2);
        var point1 = new Point(point1a, point1b);
        var point2a = e.x + (e.width / 2);
        var point2b = e.y + (e.height / 2);
        var point2 = new Point(point2a, point2b);
        return point1.getDist(point2);
    },
    isPointIn: function() {
        if (this.x === undefined || this.y === undefined || this.x === null || this.y === null) return -1;
        if (this.x + this.width > x && this.x < x) {
            if (this.y + this.height > y && this.y < y) {
                return true;
            }
        }
        return false;
    }
});
module.exports = BoundingBox;