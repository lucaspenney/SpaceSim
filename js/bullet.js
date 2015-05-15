var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');
var BoundingBox = require('./boundingbox');
var Trail = require('./trail');
var Ship = require('./ship');
var Vector = require('./vector');

var Bullet = Entity.extend({
    init: function(game, id, x, y) {
        this._super(game, id, x, y);
        this.sprite = new Sprite(this, "img/bullet.png");
        this.flashSprite = new Sprite(this, "img/muzzleflash.png");
        this.flashSprite.alpha = 0.5;
        this.physics = new Physics(this.game, this, new BoundingBox(this.game, this));
        this.physics.collidesWith = ['Asteroid', 'Planet', 'Ship'];
        this.physics.mass = 2;
        this.physics.maxVelocity = 24;
        this.owner = null;
        this.physics.on('pre-collide', function(entity) {

            if (!this.owner) return false;
            if (entity.id === this.owner.id) {

                return false;
            }
        });
        this.physics.on('post-collide', function(entity) {
            if (entity instanceof Ship) {
                entity.takeDamage(34);
            }
            this.destroy();
        });
        //this.trail = new Trail(this.game, this, 6, 0);
        this.needFlash = 0;
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
        if (this.flashSprite.loaded && this.needFlash < 3 && this.owner) {
            this.needFlash++;
            this.flashSprite.width = 36;
            this.flashSprite.height = 74;
            this.rotation = this.owner.rotation.clone();
            var x = Math.cos(this.owner.rotation.clone().subtract(90).toRadians()) * 27;
            var y = Math.sin(this.owner.rotation.clone().subtract(90).toRadians()) * 27;
            this.flashSprite.draw(ctx, screen, this.owner.pos.x + x, this.owner.pos.y + y);
        }
        //this.physics.bounds.render(ctx, screen);
    },
    getOwner: function() {
        if (this.owner) return this.owner;
        return {};
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
            _owner: this.getOwner().id,
        };
    }
});

module.exports = Bullet;