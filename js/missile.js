var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');
var BoundingBox = require('./boundingbox');
var Trail = require('./trail');
var Ship = require('./ship');
var ParticleSystem = require('./particlesystem');

var Missile = Entity.extend({
    init: function(game, id, x, y) {
        this._super(game, id, x, y);
        this.sprite = new Sprite(this, "img/missile.png");
        this.physics = new Physics(this.game, this, new BoundingBox(this.game, this));
        //this.physics.setVelocity(Math.random(), (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        this.physics.collidesWith = ['Asteroid', 'Planet', 'Ship'];
        this.physics.mass = 10;
        this.physics.maxVelocity = 16;
        var _this = this;
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
        this.owner = null;
        this.speed = 0.1;
        this.lastFireTime = 0;
        this.fuel = 100;
        this.particles = new ParticleSystem(this.game, this.pos.x, this.pos.y, this.rotation, 'engine');
        this.particles.setParent(this, 0, 0);
    },
    setTarget: function(target) {
        this.target = target;
    },
    setOwner: function(owner) {
        this.owner = owner;
    },
    update: function() {
        this.physics.update();
        //Steer towards target
        if (!this.target) {
            //Find the nearest target
            for (var i = this.game.entities.length - 1; i >= 0; i--) {
                var entity = this.game.entities[i];
                if (entity instanceof Ship && entity !== this.owner) {
                    if (!this.target && entity !== this.owner) {
                        this.target = entity;
                    } else if (this.target.pos.distance(this) > entity.pos.distance(this) && entity !== this) {
                        this.target = entity;
                    }
                }
            }
        }
        if (this.owner && this.target && this.fuel > 0) {
            this.particles.turnOn();
            var x = this.pos.x - this.target.pos.x;
            var y = this.pos.y - this.target.pos.y;
            var angle = radToDeg(Math.atan2(y, x));
            this.rotation = angle + 180;

            var x = Math.cos(degToRad(this.rotation)) * this.speed;
            var y = Math.sin(degToRad(this.rotation)) * this.speed;
            this.physics.addAcceleration(x, y, 0);
            this.rotation += 90;
            this.fuel--;
        }
        if (this.fuel <= 0) {
            this.particles.turnOff();
        }
    },
    render: function(ctx, screen) {
        this.particles.render(ctx, screen);
        this._super(ctx, screen);
        //this.physics.bounds.render(ctx, screen);
    },
    toJSON: function() {
        return {
            classname: "Missile",
            id: this.id,
            pos: {
                x: this.pos.x,
                y: this.pos.y,
            },
            rotation: this.rotation,
            physics: this.physics,
            fuel: this.fuel,
            _owner: this.owner,
        };
    }
});

function degToRad(angle) {
    return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
    return ((angle * 180) / Math.PI);
}

module.exports = Missile;