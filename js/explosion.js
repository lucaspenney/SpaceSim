var Entity = require('./entity');
var ParticleSystem = require('./particlesystem');

var Explosion = Entity.extend({
    init: function(game, x, y) {
        this._super(game, x, y);
        this.particles = new ParticleSystem(this.game, this.pos.x, this.pos.y, 0, 'explosion')
        this.time = 1000;
        this.lifeTime = Date.now() + this.time;
        this.shouldSpawn = true;
    },
    update: function() {
        if (this.lifeTime - (this.time / 2) < Date.now()) {
            this.particles.turnOff();
        } else {
            this.particles.turnOn();
        }
        if (this.lifeTime < Date.now()) {
            this.destroy();
        }
    },
    render: function(ctx, screen) {
        this.particles.render(ctx, screen);
    },
    toJSON: function() {
        return {
            classname: "Explosion",
            id: this.id,
            pos: {
                x: this.pos.x,
                y: this.pos.y,
            },
        };
    }
});

module.exports = Explosion;