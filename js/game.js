function Game(stage) {
  this.stage = jQuery(stage);
  this.layers = [];
  this.stage.html('<canvas></canvas>');
  this.canvasElement = this.stage.find('canvas').get(0);
  this.canvasElement.setAttribute('height', this.stage.height());
  this.canvasElement.setAttribute('width', this.stage.width());
  this.ctx = this.canvasElement.getContext('2d');
  this.fpsManager = new FPSManager(this);
  this.eventManager = new EventManager(this);
  this.entities = [];
  this.screen = new Screen(this);
  this.input = new InputManager(this);
  this.debugMode = false;
  var _this = this;
  this.tick = function() {
    requestAnimationFrame(function() {
      _this.tick();
    });
    _this.fpsManager.now = Date.now();
    _this.fpsManager.delta = this.fpsManager.now - this.fpsManager.then;
    if (this.fpsManager.delta > this.fpsManager.interval) {
      _this.fpsManager.then = this.fpsManager.now - (this.fpsManager.delta % this.fpsManager.interval);
      _this.render();
      _this.update();
    }
    if (_this.connectionType == 'server') {
      _this.server.send(JSON.stringify(_this.entities));
    }
  };
  new Player(this, 400, 400);
  for (var i = 0; i < 50; i++) {
    new Asteroid(this, (Math.random() * 6000) - 3000, (Math.random() * 6000) - 3000);
  }
  this.tick();
  this.connectionType = 'client';
  this.server = new WebSocket("ws://127.0.0.1:8080");
  this.server.onmessage = function(message) {
    if (message.data == 'client' || message.data == 'server') {
      _this.connectionType = message.data;
    } else {
      if (_this.connectionType == 'client') {
        _this.connectionType = message.data;
      }
    }

  };
}


Game.prototype.render = function() {
  this.ctx.fillStyle = "#000000";
  this.ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  this.fpsManager.render(this.ctx);
  this.entities.sort(function(a, b) {
    if (a === null) return 1;
    if (b === null) return -1;
    if (a.layer === undefined) a.layer = 0;
    if (b.layer === undefined) b.layer = 0;
    if (a.layer < b.layer)
      return -1;
    if (a.layer > b.layer)
      return 1;
    return 0;
  });
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].render();
  }
};

Game.prototype.update = function() {
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].update();
  }
};