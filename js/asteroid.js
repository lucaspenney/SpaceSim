var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');
var BoundingBox = require('./boundingbox');
var BoundingCircle = require('./boundingcircle');

var Asteroid = Entity.extend({
    init: function(game, x, y) {
        this._super(game, x, y);
        this.width = 30;
        this.height = 30;
        this.sprite = new Sprite(this, "img/asteroid.png");
        this.physics = new Physics(game, this, new BoundingCircle(this.game, this, 20));
        //this.physics.setVelocity(Math.random(), (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        this.physics.collidesWith = ['Asteroid', 'Planet', 'Player'];
        this.physics.mass = 100;
        this.physics.maxVelocity = 2;
        var _this = this;
        this.physics.onCollision(function(entity) {
            _this.game.entityFactory.create('Explosion', _this.game, _this.pos.x, _this.pos.y);
        });
    },
    update: function() {
        this.physics.update();
    },
    render: function(ctx, screen) {
        this._super(ctx, screen);
        //this.physics.bounds.render(ctx, screen);
    },
    toJSON: function() {
        return {
            classname: "Asteroid",
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

module.exports = Asteroid;