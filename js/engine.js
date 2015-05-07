var Class = require('./class');
var ParticleSystem = require('./particlesystem');

var Engine = Class.extend({
    init: function(ship) {
        this.ship = ship;
        this.game = ship.game;
        this.mainOn = false;
        this.leftOn = false;
        this.rightOn = false;
        this.fuel = 1000;
        this.particles = new ParticleSystem(this.game, this.ship.pos.x, this.ship.pos.y, 'engine')
        this.particles.setParent(this.ship, 0, 0);
    },
    hasFuel: function() {
        if (this.fuel <= 0) {
            this.mainOn = false;
            this.leftOn = false;
            this.rightOn = false;
        }
        return this.fuel > 0;
    },
    useFuel: function(num) {
        this.fuel -= (num) ? num : 1;
    },
    render: function(ctx, screen) {
        if (this.mainOn && this.fuel > 0) {
            this.particles.turnOn();
        } else this.particles.turnOff();
        this.particles.render(ctx, screen);
    },
    toJSON: function() {
        return {
            mainOn: this.mainOn,
            leftOn: this.leftOn,
            rightOn: this.rightOn,
            fuel: this.fuel,
        };
    }
});

module.exports = Engine;