var Class = require('./js/class');
var FPSManager = require('./js/fpsmanager');
var Screen = require('./js/screen');
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
  },
  tick: function() {
    var _this = this;
    requestAnimationFrame(function() {
      _this.tick();
    });
    _this.fpsManager.now = Date.now();
    _this.fpsManager.delta = this.fpsManager.now - this.fpsManager.then;
    if (this.fpsManager.delta > this.fpsManager.interval) {
      _this.fpsManager.then = this.fpsManager.now - (this.fpsManager.delta % this.fpsManager.interval);
      _this.game.render(this.ctx, this.screen);
      //_this.game.update(this.input);
      _this.debugOutput();
    }
  },
  debugOutput: function() {
    if (this.debug) {
      this.ctx.fillStyle = "#FFF";
      this.ctx.fillText("Message Size: " + this.connection.lastPacketLength, 10, 10);
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