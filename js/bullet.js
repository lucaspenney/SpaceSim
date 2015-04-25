var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');
var BoundingBox = require('./boundingbox');

var Bullet = Entity.extend({
    init: function(game, x, y) {
        this._super(game, x, y);
        this.width = 2;
        this.height = 2;
        this.sprite = new Sprite(this, "img/bullet.png");
        this.physics = new Physics(this.game, this, new BoundingBox(this.game, this));
        //this.physics.setVelocity(Math.random(), (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        this.physics.collidesWith = ['Asteroid', 'Planet'];
        this.physics.mass = 0;
        this.physics.maxVelocity = 16;
        var _this = this;
        this.physics.onCollision(function(entity) {
            console.log('Impacted ' + entity.toJSON().classname);
            _this.destroy();
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
            classname: "Bullet",
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

module.exports = Bullet;