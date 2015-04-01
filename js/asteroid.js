var Physics = require('physics.js');

Asteroid.extend(Entity);

function Asteroid(game, x, y) {
    Entity.apply(this, arguments);
    this.width = 30;
    this.height = 30;
    this.sprite = new Sprite(this.game, this, "img/asteroid.png");
    this.physics = new Physics(game, this);
    this.physics.setVelocity(Math.random(), Math.random(), (Math.random() - 0.5) * 5);
    this.physics.collidesWith = ['Asteroid', 'Player'];
    this.physics.boundingBox.setOffset(5, 5);
}

Asteroid.prototype.update = function() {
    this.physics.update();
};

module.exports = Asteroid;