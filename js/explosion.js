var Entity = require('./entity');
var ParticleSystem = require('./particlesystem');

var Explosion = Entity.extend({
    init: function(game, id, x, y) {
        this._super(game, id, x, y);
        this.particles = new ParticleSystem(this.game, this.pos.x, this.pos.y, 'explosion')
        this.particles.turnOn();
        this.time = 1000;
        this.lifeTime = Date.now() + this.time;
        this.shouldSpawn = true;
        this.sounds = {};
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
    render: function(ctx, screen, audio) {
        this.particles.render(ctx, screen);
        if (!this.sounds.explosion) {
            audio.playSound("explosion", this, function(id) {
                this.sounds.explosion = id;
            });
        }
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