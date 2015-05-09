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
        this.maxFuel = 1000;
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
        num = (num) ? num : 1;
        if (this.fuel >= num) {
            this.fuel -= num
            return true;
        }
        return false
    },
    addFuel: function(amount) {
        this.fuel += amount;
        if (this.fuel > this.maxFuel) this.fuel = this.maxFuel;
    },
    render: function(ctx, screen, audio) {
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