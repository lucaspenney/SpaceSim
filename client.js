var Class = require('./js/class');
var FPSManager = require('./js/fpsmanager');
var Screen = require('./js/screen');
var Stars = require('./js/stars');
var EventManager = require('./js/eventmanager');
var InputManager = require('./js/input');
var Player = require('./js/player');
var Entity = require('./js/entity');
var Connection = require('./js/connection');
var Chat = require('./js/chat');
var AudioManager = require('./js/audio');
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
    this.audio = new AudioManager(this);
    this.screen = new Screen(this);
    this.chat = new Chat(this);
    this.connection = new Connection(this, this.game);
    this.loop();
    this.debug = true;
    this.frameTime = 0;
    this.tickRate = 31;
  },
  loop: function() {
    var _this = this;
    _this.tick();
  },
  tick: function() {
    var _this = this;

    var curTime = Date.now();
    if (_this.screen.focusedEntity) {
      _this.screen.focusedEntity.setInput(_this.input.getInputState());
    }
    if (Date.now() - _this.connection.lastUpdate > _this.tickRate) {
      _this.game.update();
      _this.render();
      console.log('self update');
    }
    _this.frameTime = curTime - Date.now();
    requestAnimationFrame(function() {
      _this.tick();
    });
    this.audio.update();
  },
  render: function() {
    this.game.render(this.ctx, this.screen);
    this.chat.render(this.ctx, this.screen);
    this.debugOutput();
  },
  debugOutput: function() {
    if (this.debug) {
      this.ctx.fillStyle = "#FFF";
      this.ctx.font = 'normal 8pt Monospace';
      this.ctx.fillText("Message Size (b): " + this.connection.lastPacketLength, 10, 10);
      this.ctx.fillText("Latency (ms): " + this.connection.latency + "ms", 10, 20);
      this.ctx.fillText("Client Frame Time (ms): " + this.frameTime, 10, 30);
      this.ctx.fillText("Server Frame Time (ms): " + this.connection.serverFrameTime, 10, 40);
      this.ctx.fillText("Update Rate (ms): " + this.connection.updateRate, 10, 50);
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