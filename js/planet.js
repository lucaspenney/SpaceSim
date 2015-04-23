var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');
var BoundingCircle = require('./boundingcircle');

var Planet = Entity.extend({
    init: function(game, x, y) {
        this._super(game, x, y);
        this.width = 128;
        this.height = 128;
        this.sprite = new Sprite(this, "img/planet.png");
        this.physics = new Physics(game, this, new BoundingCircle(this.game, this, 60));
        this.physics.setVelocity(Math.random(), Math.random(), (Math.random() - 0.5) * 5);
        this.physics.collidesWith = ['Asteroid', 'Player'];
        this.physics.mass = 10000;
        this.physics.static = true;
    },
    update: function() {
        this.physics.update();
    },
    render: function(ctx, screen) {
        ctx.fillStyle = "#FFF";
        this._super(ctx, screen);
        //this.physics.bounds.render(ctx, screen);
    },
    toJSON: function() {
        return {
            classname: "Planet",
            id: this.id,
            pos: {
                x: this.pos.x,
                y: this.pos.y,
            },
            rotation: this.rotation,
            physics: this.physics,
        };
    }
});

module.exports = Planet;