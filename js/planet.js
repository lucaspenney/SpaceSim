var Entity = require('./entity');
var Physics = require('./physics');
var Sprite = require('./sprite');
var BoundingCircle = require('./boundingcircle');

var PlanetTypes = [{
    img: "planet1.png",
    diameter: 640,
    width: 750,
}, {
    img: "planet2.png",
    diameter: 560,
    width: 628,
}, {
    img: "planet3.png",
    diameter: 640,
    width: 710,
}, {
    img: "planet4.png",
    diameter: 640,
    width: 710,
}, ];

var Planet = Entity.extend({
    init: function(game, id, x, y) {
        var planet = PlanetTypes[Math.floor(Math.random() * PlanetTypes.length)];
        this.width = Math.floor(Math.random() * 450) + 325;
        this.height = this.width;
        this._super(game, id, x, y);
        this.radius = ((this.width / planet.width) * planet.diameter) / 2;
        this.sprite = new Sprite(this, "img/" + planet.img);
        this.physics = new Physics(game, this, new BoundingCircle(this.game, this, this.radius));
        this.physics.setVelocity(Math.random(), Math.random(), (Math.random() - 0.5) * 5);
        this.physics.collidesWith = [];
        this.physics.mass = this.width * 18;
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