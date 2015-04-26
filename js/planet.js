var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');
var BoundingCircle = require('./boundingcircle');

var PlanetTypes = [{
    img: "planet1.png",
    width: 350,
    height: 350,
    radius: 120,
}, {
    img: "planet2.png",
    width: 512,
    height: 512,
    radius: 130
}, {
    img: "planet3.png",
    width: 650,
    height: 650,
    radius: 220,
}, ];

var Planet = Entity.extend({
    init: function(game, x, y) {
        var planet = PlanetTypes[Math.floor(Math.random() * PlanetTypes.length)];
        this._super(game, x, y);
        this.width = planet.width;
        this.height = planet.height;
        this.sprite = new Sprite(this, "img/" + planet.img);
        this.physics = new Physics(game, this, new BoundingCircle(this.game, this, planet.radius));
        this.physics.setVelocity(Math.random(), Math.random(), (Math.random() - 0.5) * 5);
        this.physics.collidesWith = ['Asteroid', 'Player'];
        this.physics.mass = 10000;
        this.physics.static = true;
    },
    update: function() {
        this.physics.update();
    },
    render: function(ctx, screen) {
        ctx.fillStyle = "#FFF";
        this._super(ctx, screen);
        //this.physics.bounds.render(ctx, screen);
    },
    toJSON: function() {
        return {
            classname: "Planet",
            id: this.id,
            pos: {
                x: this.pos.x,
                y: this.pos.y,
            },
            width: this.width,
            height: this.height,
            sprite: this.sprite,
            rotation: this.rotation,
            physics: this.physics,
        };
    }
});

module.exports = Planet;