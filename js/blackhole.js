var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');
var BoundingCircle = require('./boundingcircle');
var BoundingBox = require('./boundingbox');

var BlackHole = Entity.extend({
    init: function(game, x, y) {
        this._super(game, x, y);
        this.sprite = new Sprite(this, "img/black_hole.png");
        this.physics = new Physics(game, this, new BoundingCircle(this.game, this, 32));
        this.physics.setVelocity(Math.random(), Math.random(), (Math.random() - 0.5) * 5);
        this.physics.collidesWith = ['Player', 'Asteroid'];
        this.physics.mass = 20000;
        this.physics.static = true;
        this.physics.onCollision(function(entity) {
            entity.destroy();
        });
    },
    update: function() {
        this.physics.update();
        //Check for entities inside the black hole, and do something with them
    },
    render: function(ctx, screen) {
        ctx.fillStyle = "#FFF";
        this._super(ctx, screen);
        //this.physics.bounds.render(ctx, screen);
    },
    toJSON: function() {
        return {
            classname: "Black Hole",
            id: this.id,
            pos: {
                x: this.pos.x,
                y: this.pos.y,
            },
            rotation: this.rotation,
        };
    }
});

module.exports = BlackHole;