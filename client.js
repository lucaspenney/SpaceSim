var Class = require('./js/class');
var FPSManager = require('./js/fpsmanager');
var Screen = require('./js/screen');
var Stars = require('./js/stars');
var EventManager = require('./js/eventmanager');
var InputManager = require('./js/input');
var Player = require('./js/player');
var Entity = require('./js/entity');
var Connection = require('./js/connection');
var Game = require('./js/game');

var Client = Class.extend({
  init: function(stage) {
    this.game = new Game();
    this.stage = $(stage);
    this.layers = [];
    this.stage.html('<canvas></canvas>');
    this.canvasElement = this.stage.find('canvas').get(0);
    this.canvasElement.setAttribute('height', this.stage.height());
    this.canvasElement.setAttribute('width', this.stage.width());
    this.ctx = this.canvasElement.getContext('2d');
    this.fpsManager = new FPSManager(this);
    this.input = new InputManager(this);
    this.screen = new Screen(this);
    this.connection = new Connection(this, this.game);
    this.tick();
    this.debug = true;
    this.frameTime = 0;
  },
  tick: function() {
    var _this = this;
    /*requestAnimationFrame(function() {
      _this.tick();
    });*/
    setTimeout(function() {
      _this.tick();
    }, 32)

    var curTime = Date.now();
    _this.fpsManager.now = Date.now();
    _this.fpsManager.delta = this.fpsManager.now - this.fpsManager.then;
    if (this.fpsManager.delta > this.fpsManager.interval) {
      _this.fpsManager.then = this.fpsManager.now - (this.fpsManager.delta % this.fpsManager.interval);
      if (_this.screen.focusedEntity) {
        _this.screen.focusedEntity.setInput(_this.input.getInputState());
      }
      _this.game.update();
      _this.game.render(_this.ctx, _this.screen);
      _this.debugOutput();
    }
    this.frameTime = curTime - Date.now() + 1;
  },
  debugOutput: function() {
    if (this.debug) {
      this.ctx.fillStyle = "#FFF";
      this.ctx.fillText("Message Size: " + this.connection.lastPacketLength, 10, 10);
      this.ctx.fillText("Latency: " + this.connection.latency + "ms", 10, 20);
      this.ctx.fillText("Frame Time: " + this.frameTime, 10, 30);
    }
  },
});

new Client("#game");

window.degToRad = function(angle) {
  return ((angle * Math.PI) / 180);
}

window.radToDeg = function(angle) {
  return ((angle * 180) / Math.PI);
}