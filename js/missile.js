var Entity = require('./entity');
var Physics = require('./physics');
var Angle = require('./angle');
var Sprite = require('./sprite');
var BoundingBox = require('./boundingbox');
var Trail = require('./trail');
var Ship = require('./ship');
var Planet = require('./planet');
var ParticleSystem = require('./particlesystem');
var Engine = require('./engine');
var Vector = require('./vector');

Math.sign = Math.sign || function(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
}

var Missile = Entity.extend({
    init: function(game, id, x, y) {
        this._super(game, id, x, y);
        this.width = 18;
        this.height = 35;
        this.sprite = new Sprite(this, "img/missile.png");
        this.physics = new Physics(this.game, this, new BoundingBox(this.game, this));
        this.physics.collidesWith = ['Asteroid', 'Planet', 'Ship'];
        this.physics.mass = 10;
        this.physics.maxVelocity = 8;
        var _this = this;
        this.physics.on('pre-collide', function(entity) {
            if (!this.owner) return false;
            if (entity.id === this.owner.id) {
                return false;
            }
        });
        this.physics.on('post-collide', function(entity) {
            if (entity instanceof Ship) {
                entity.destroy();
            }
            this.game.entityFactory.create('Explosion', this.game, entity.pos.x, entity.pos.y);
            this.destroy();
        });
        this.owner = null;
        this.speed = 0.5;
        this.lastFireTime = 0;
        this.engine = new Engine(this);
        this.rotation = new Angle();
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
        this.engine.mainOn = false;
        if (this.owner && this.target && this.engine.hasFuel()) {
            var x = this.pos.x - this.target.pos.x;
            var y = this.pos.y - this.target.pos.y;
            var angle = new Angle().fromRadians((Math.atan2(y, x)));
            this.rotation.set(angle.degrees - 180);

            var x = Math.cos(this.rotation.toRadians()) * this.speed;
            var y = Math.sin(this.rotation.toRadians()) * this.speed;
            var targetVel = new Vector(x, y);
            this.rotation.add(90);
            if (Math.sign(targetVel.x) !== Math.sign(this.physics.vel.x) ||
                Math.sign(targetVel.y) !== Math.sign(this.physics.vel.y)) {
                //Correct tradjectory when off course
                this.physics.addAcceleration(x * 2, y * 3, 0);
                this.engine.mainOn = true;
                this.engine.useFuel(3);
            } else {
                //Move towards target
                this.physics.addAcceleration(x * 0.5, y * 0.5, 0);

                this.engine.mainOn = false;
                this.engine.useFuel(2);
            }
        }
    },
    render: function(ctx, screen, audio) {
        this.engine.render(ctx, screen, audio);
        this._super(ctx, screen);

        if (!this.sounds.engine && this.engine.mainOn) {
            audio.playSound("engine", this, function(id) {
                this.sounds.engine = id;
            })
        }
        if (this.sounds.engine && !this.engine.mainOn) {
            audio.stopSound("engine", this.sounds.engine);
            this.sounds.engine = null;
        }
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
            engine: this.engine,
            fuel: this.fuel,
            _owner: this.owner,
        };
    }
});

module.exports = Missile;