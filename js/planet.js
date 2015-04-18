var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');

var Planet = Entity.extend({
    init: function(game, x, y) {
        console.log('created');
        this._super(game, x, y);
        this.width = 128;
        this.height = 128;
        this.sprite = new Sprite(this, "img/planet.png");
        this.physics = new Physics(game, this);
        this.physics.setVelocity(Math.random(), Math.random(), (Math.random() - 0.5) * 5);
        this.physics.collidesWith = ['Asteroid', 'Player'];
        this.physics.boundingBox.setOffset(5, 5);
        this.physics.mass = 10000;
        this.physics.static = true;
    },
    update: function() {
        this.physics.update();
    },
    render: function(ctx, screen) {
        this._super(ctx, screen);
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
        };
    }
});

module.exports = Planet;