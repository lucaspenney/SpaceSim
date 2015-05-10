var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');
var BoundingBox = require('./boundingbox');
var Trail = require('./trail');
var Ship = require('./ship');

var Bullet = Entity.extend({
    init: function(game, id, x, y) {
        this._super(game, id, x, y);
        this.width = 6;
        this.height = 18;
        this.sprite = new Sprite(this, "img/bullet.png");
        this.physics = new Physics(this.game, this, new BoundingBox(this.game, this));
        this.physics.collidesWith = ['Asteroid', 'Planet', 'Ship'];
        this.physics.mass = 2;
        this.physics.maxVelocity = 16;
        this.owner = null;
        this.physics.on('pre-collide', function(entity) {

            if (!this.owner) return false;
            if (entity.id === this.owner.id) {

                return false;
            }
        });
        this.physics.on('post-collide', function(entity) {
            if (entity instanceof Ship) {
                this.game.entityFactory.create('Explosion', this.game, entity.pos.x, entity.pos.y);
                entity.destroy();
            }
            this.destroy();
        });
        //this.trail = new Trail(this.game, this, 6, 0);
        var _this = this;
    },
    setOwner: function(owner) {
        this.owner = owner;
    },
    update: function() {
        this.physics.update();
    },
    render: function(ctx, screen) {
        //this.trail.render(ctx, screen);
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
            _owner: this.owner,
        };
    }
});

module.exports = Bullet;