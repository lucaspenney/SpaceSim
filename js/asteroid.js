var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');

var Asteroid = Entity.extend({
    init: function(game, x, y) {
        this._super(game, x, y);
        this.width = 30;
        this.height = 30;
        this.sprite = new Sprite(this, "img/asteroid.png");
        this.physics = new Physics(game, this);
        this.physics.setVelocity(Math.random(), Math.random(), (Math.random() - 0.5) * 5);
        this.physics.collidesWith = ['Asteroid', 'Player'];
        this.physics.boundingBox.setOffset(5, 5);
    },
    update: function() {
        this.physics.update();
    },
    render: function(ctx, screen) {
        this._super(ctx, screen);
    },
    toJSON: function() {
        return {
            classname: "Asteroid",
            id: this.id,
            x: this.x,
            y: this.y,
            rotation: this.rotation,
        };
    }
});

module.exports = Asteroid;