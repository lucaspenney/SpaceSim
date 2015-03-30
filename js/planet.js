Planet.extend(Entity);

function Planet(game, x, y) {
      Entity.apply(this, arguments);
      this.width = 30;
      this.height = 30;
      this.physics = new Physics(game, this);
      this.physics.setVelocity(Math.random(), Math.random(), (Math.random() - 0.5) * 5);
      this.physics.collidesWith = ['Asteroid', 'Player'];
      this.physics.boundingBox.setOffset(5, 5);
}

Planet.prototype.update = function() {
      this.physics.update();
};

Planet.prototype.render = function(ctx) {
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var radius = 70;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = 'green';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();
};