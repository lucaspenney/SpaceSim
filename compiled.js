(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./js/class');
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
    this.connection = new Connection(this.game);
    this.tick();
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
      _this.game.update(this.input);
    }
  }
});

new Client("#game");

window.degToRad = function(angle) {
  return ((angle * Math.PI) / 180);
}

window.radToDeg = function(angle) {
  return ((angle * 180) / Math.PI);
}
},{"./js/class":3,"./js/connection":4,"./js/entity":5,"./js/eventmanager":6,"./js/fpsmanager":7,"./js/game":8,"./js/input":9,"./js/player":11,"./js/screen":12}],2:[function(require,module,exports){
require('./class');

var BoundingBox = Class.extend({
	init: function(game, entity) {
		this.game = game;
		this.entity = entity;
		this.x = entity.x;
		this.y = entity.y;
		this.xOffset = 0;
		this.yOffset = 0;
		this.width = entity.width || entity.sprite.width;
		this.height = entity.height || entity.sprite.height;
	},
	update: function() {
		this.x = this.entity.x + this.xOffset;
		this.y = this.entity.y + this.yOffset;
	},
	setOffset: function(x, y) {
		this.xOffset = x;
		this.yOffset = y;
	},
	setWidth: function(width) {
		this.width = width;
	},
	setHeight: function(height) {
		this.height = height;
	},
	wouldCollide: function(x, y, e) {
		var wouldCollide = false;
		this.x += x;
		this.y += y;
		wouldCollide = this.isColliding(e);
		this.x -= x;
		this.y -= y;
		return wouldCollide;
	},
	isColliding: function(e) {
		if (!e.physics) return false;
		if (this.entity === e) return false;
		e = e.physics.boundingBox;
		if (this.x + this.width > e.x && this.x < e.x + e.width) {
			if (this.y + this.height > e.y && this.y < e.y + e.height) {
				var x, y;
				if (this.x + this.width > e.x) x = (this.x + this.width) - e.x;
				else if (this.x < e.x + e.width) x = this.x - (e.x + e.width);
				if (this.y + this.height > e.y) y = (this.y + this.height) - e.y;
				else if (this.y < e.y + e.height) y = this.y - (e.y + e.height);
				return {
					x: x,
					y: y,
				};
			}
		}
		return false;
	},
	getDistBetween: function() {
		e = e.physics.boundingBox;
		var point1a = this.x + (this.width / 2);
		var point1b = this.y + (this.height / 2);
		var point1 = new Point(point1a, point1b);
		var point2a = e.x + (e.width / 2);
		var point2b = e.y + (e.height / 2);
		var point2 = new Point(point2a, point2b);
		return point1.getDist(point2);
	},
	isPointIn: function() {
		if (this.x === undefined || this.y === undefined || this.x === null || this.y === null) return -1;
		if (this.x + this.width > x && this.x < x) {
			if (this.y + this.height > y && this.y < y) {
				return true;
			}
		}
		return false;
	}
});
module.exports = BoundingBox;
},{"./class":3}],3:[function(require,module,exports){
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function() {
  var initializing = false,
    fnTest = /xyz/.test(function() {
      xyz;
    }) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function() {};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn) {
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if (!initializing && this.init)
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();
},{}],4:[function(require,module,exports){
require('./class');
var Player = require('./player');

var Connection = Class.extend({
    lastUpdate: 0,
    latency: 0,
    init: function(game) {
        this.game = game;
        this.server = new WebSocket("ws://127.0.0.1:8080");
        var _this = this;
        this.server.onmessage = function(message) {
            var data = JSON.parse(message.data);
            _this.receive(data);
        }
    },
    receive: function(data) {
        var entities = this.game.entities;
        console.log(data.updatedEntities);
        _.forEach(data.updatedEntities, function(entity) {
            //Perform entity updates
            _.forEach(entities, function(ent) {
                if (ent.id === entity.id) {
                    ent.x = entity.x;
                    ent.y = entity.y;
                }
            })
        });
        _.forEach(data.newEntities, function(entity) {
            //Create new entity with this entity id and properties 
            if (entity.classname === "Player") {
                var nent = new Player(this.game, entity.x, entity.y);
                entities.push(nent);
            }
        });
        console.log(entities);
        this.lastUpdate = Date.now();
        this.latency = this.lastUpdate - data.timestamp;
    },
});

module.exports = Connection;
},{"./class":3,"./player":11}],5:[function(require,module,exports){
//Entity
require('./class');

var Entity = Class.extend({
  init: function(x, y) {
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.sprite = null;
    this.layer = 0;
  },
  render: function(ctx, screen) {
    if (this.sprite !== undefined) {
      if (this.sprite.loaded) {
        this.sprite.draw(ctx, screen, this.x, this.y);
      }
    }
  },
  update: function() {

  },
  toJSON: function() {

  }
});

module.exports = Entity;
},{"./class":3}],6:[function(require,module,exports){
function EventManager() {
	this.events = [];
	var events = ["Player.TakeDamage"];
	for (var i = 0; i < events.length; i++) {
		this.events.push({
			name: events[i],
			listeners: []
		});
	}
}

EventManager.prototype.dispatch = function(eventName, params) {
	for (var i = 0; i < this.events.length; i++) {
		if (this.events[i].name === eventName) {
			for (var k = 0; k < this.events[i].listeners.length; k++) {
				this.events[i].listeners[k](params);
			}
		}
	}
};

EventManager.prototype.addEventListener = function(eventName, listener) {
	for (var i = 0; i < this.events.length; i++) {
		if (this.events[i].name === eventName) {
			this.events[i].listeners.push(listener);
			break;
		}
	}
};

module.exports = EventManager;
},{}],7:[function(require,module,exports){
function FPSManager(game) {
	this.game = game;
	this.fps = 30;
	this.now = null;
	this.then = Date.now();
	this.interval = 1000 / this.fps;
	this.delta = null;
}

FPSManager.prototype.render = function(ctx) {
	if (this.game.debugMode) {
		this.game.ctx.fillStyle = "#FFFFFF";
		this.game.ctx.fillText("FPS: " + this.delta.toFixed(2), 20, 20); //.toFixed(2), 20, 20);
	}
};

module.exports = FPSManager;
},{}],8:[function(require,module,exports){
require('./class');
var Player = require('./player');

var Game = Class.extend({
  init: function() {
    this.entities = [];
    this.debugMode = false;
    for (var i = 0; i < 50; i++) {
      //new Asteroid(this, (Math.random() * 6000) - 3000, (Math.random() * 6000) - 3000);
    }
    this.update();
  },
  update: function() {
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].update();
    }
  },
  render: function(ctx, screen) {
    if (!ctx || !screen) return;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, screen.width, screen.height);
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
      this.entities[i].render(ctx, screen);
    }
  }
});
module.exports = Game;
},{"./class":3,"./player":11}],9:[function(require,module,exports){
//input.js


function InputManager(game) {
	this.game = game;
	this.mouse = {
		x: 0,
		y: 0,
		down: false,
		lastClick: {
			x: 0,
			y: 0,
		}
	};
	this.keys = [];
	this.init();
}

InputManager.prototype.init = function() {
	var _this = this;
	jQuery(_this.game.stage).click(function() {
		//Left click
	});
	jQuery(_this.game.stage).bind('contextmenu', function(e) {
		//Right click
		return false; //Disable usual context menu behaviour
	});
	//Keep track of mouse position in window
	jQuery(_this.game.stage).mousemove(function(e) {
		_this.mouse.x = e.pageX - this.offsetLeft;
		_this.mouse.y = e.pageY - this.offsetTop;
	});
	//Listen for key presses/releases
	jQuery(window).keydown(function(evt) {
		_this.keys[evt.keyCode] = true;
	});
	jQuery(window).keyup(function(evt) {
		_this.keys[evt.keyCode] = false;
	});
	//Disable browser scrolling with arrow keys functionality
	document.onkeydown = function(event) {
		return event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 32;
	};
};
/*
InputManager.prototype.handleInteractions = function() {
	if (Game.player === null) return;
	if (this.keys[38] || this.keys[87]) { //Up arrow
		Game.player.move(0, -2);
	}
	if (this.keys[37] || this.keys[65]) { //Left Arrow
		Game.player.move(-2, 0);
	}
	if (this.keys[39] || this.keys[68]) { //right arrow
		Game.player.move(2, 0);
	}
	if (this.keys[40] || this.keys[83]) { //down arrow
		Game.player.move(0, 2);
	}
	if (this.keys[32]) { //spacebar
		//
	}
	if (this.keys[69]) { //e
		Game.player.interact();
	}
	if (this.keys[70]) { //f
		Game.player.toggleFlashlight();
	}
	if (this.keys[71]) {
		Game.player.drop();
	}
	if (this.keys[82]) {
		Game.player.reloadWeapon();
	}
	if (this.keys[49]) { //1
		Game.player.inventory.selectItemSlot(1);
	}
	if (this.keys[50]) { //2
		Game.player.inventory.selectItemSlot(2);
	}
	if (this.keys[51]) { //3
		Game.player.inventory.selectItemSlot(3);
	}
	if (this.keys[52]) { //4
		Game.player.inventory.selectItemSlot(4);
	}
	if (this.keys[53]) { //5
		Game.player.inventory.selectItemSlot(5);
	}
	if (this.keys[54]) { //6
		Game.player.inventory.selectItemSlot(6);
	}
};

*/
module.exports = InputManager;
},{}],10:[function(require,module,exports){
require('./class');
var BoundingBox = require('./boundingbox');

var Physics = Class.extend({
  init: function(game, entity) {
    this.game = game;
    this.entity = entity;
    this.xv = 0;
    this.yv = 0;
    this.rv = 0;
    this.maxVelocity = 8;
    this.weight = 100;
    this.boundingBox = new BoundingBox(game, entity);
    this.collidesWith = [];
  },
  update: function(entities) {
    this.boundingBox.update();
    for (var i = 0; i < this.game.entities.length; i++) {
      var collisionResult;
      if (collisionResult = this.boundingBox.wouldCollide(this.xv, this.yv, this.game.entities[i])) {
        //Basic reflecting collisions
        this.collide(this.game.entities[i], collisionResult);

      }
    }
    this.entity.x += this.xv;
    this.entity.y += this.yv;
    this.entity.rotation += this.rv;
  },
  collide: function(entity, collision) {
    if (this.collidesWith.indexOf(entity.className) === -1) return;
    if (Math.abs(entity.physics.xv) + Math.abs(entity.physics.yv) > Math.abs(this.xv) + Math.abs(this.yv)) {
      var xVel = (entity.physics.xv / 2) * (entity.physics.weight / 100);
      var yVel = (entity.physics.yv / 2) * (entity.physics.weight / 100);
      this.addVelocity(xVel, yVel);

      entity.physics.addVelocity(this.xv * -1.5, this.yv * -1.5);
    } else {
      var xVel = (this.xv / 2) * (this.weight / 100);
      var yVel = (this.yv / 2) * (this.weight / 100);
      entity.physics.addVelocity(xVel, yVel);

      this.addVelocity(entity.physics.xv * -1.5, entity.physics.yv * -1.5);
    }
    //Check to ensure we don't have collision issue still
    if (this.boundingBox.wouldCollide(this.xv, this.yv, entity)) {
      this.xv *= -0.5;
      this.yv *= -0.5;
    }
    this.onCollision();
  },
  addVelocity: function(x, y, r) {
    x = x || 0;
    y = y || 0;
    r = r || 0;

    if (this.xv > this.maxVelocity) this.xv = this.maxVelocity;
    else if (this.xv < this.maxVelocity * -1) this.xv = this.maxVelocity * -1;

    if (this.yv > this.maxVelocity) this.yv = this.maxVelocity;
    else if (this.yv < this.maxVelocity * -1) this.yv = this.maxVelocity * -1;

    if (this.rv > this.maxVelocity) this.rv = this.maxVelocity;
    else if (this.rv < this.maxVelocity * -1) this.rv = this.maxVelocity * -1;

    this.xv += x;
    this.yv += y;
    this.rv += r;

    if (Math.random() > 0.5) {
      this.xv = this.xv * 0.99;
      this.yv = this.yv * 0.99;
      this.rv = this.rv * 0.99;
    }
  },
  setVelocity: function(x, y, r) {
    this.xv = 0;
    this.yv = 0;
    this.rv = 0;
    this.addVelocity(x, y, r);
  },
});
module.exports = Physics;
},{"./boundingbox":2,"./class":3}],11:[function(require,module,exports){
var Entity = require('./entity');
var Sprite = require('./sprite');
var Physics = require('./physics');

var Player = Entity.extend({
	init: function(game, x, y) {
		this._super(x, y);
		this.game = game;
		this.width = 32;
		this.height = 32;
		this.rotation = 0;
		this.sprite = new Sprite(this, "img/player.png");
		this.physics = new Physics(this.game, this);
		this.physics.collidesWith = ['Asteroid'];
		this.physics.weight = 50;
		this.layer = 100;
		//this.trail = new Trail(this.game, 0, 0, this, 16);
		this.enginesOn = false;
		//this.weapon = new Weapon(this.game, this);
		//this.engine = new Engine(this.game, this);
		this.turnThrust = 0.35;
		this.mainThrust = 0.4;
	},
	update: function() {
		this._super();
		this.x += 1;
		this.y += 1;
		/*
		this.enginesOn = false;
		if (input.keys[38] || input.keys[87]) {
			this.enginesOn = true;
			var xVel = Math.cos(degToRad(this.rotation - 90)) * this.mainThrust;
			var yVel = Math.sin(degToRad(this.rotation - 90)) * this.mainThrust;
			this.physics.addVelocity(xVel, yVel);
		}
		if (input.keys[37] || input.keys[65]) { //Left Arrow
			this.enginesOn = true;
			this.physics.addVelocity(0, 0, this.turnThrust * -1);
		}
		if (input.keys[39] || input.keys[68]) { //right arrow
			this.enginesOn = true;
			this.physics.addVelocity(0, 0, this.turnThrust);
		}
		if (input.keys[32]) {
			this.fire();
		}
		this.physics.update();

		this.game.screen.setXOffset(this.x - 350);
		this.game.screen.setYOffset(this.y - 350);
		*/
	},
	toJSON: function() {
		return {
			classname: "Player",
			x: this.x,
			y: this.y,
		};
	}
});

module.exports = Player;
},{"./entity":5,"./physics":10,"./sprite":13}],12:[function(require,module,exports){
function Screen(game) {
    this.xOffset = 0;
    this.yOffset = 0;
    this.width = 600;
    this.height = 450;

}

Screen.prototype.update = function() {

};

Screen.prototype.scroll = function() {
    this.move(0, 0);
};

Screen.prototype.move = function(x, y) {
    this.xOffset += x;
    this.yOffset += y;
};

Screen.prototype.setXOffset = function(x) {
    this.xOffset = x;
};

Screen.prototype.setYOffset = function(y) {
    this.yOffset = y;
};

module.exports = Screen;
},{}],13:[function(require,module,exports){
require('./class');

if (typeof window === "undefined") {
	//Workaround for node loading a file that has no browser stuff
	//When a sprite is created on the server side, it basically has no image and is a placeholder
	Image = function() {};
}

var Sprite = Class.extend({
	init: function(entity, img) {
		this.entity = entity;
		this.img = new Image();
		this.img.src = img;
		this.scale = 1;
		this.width = 0;
		this.height = 0;
		this.alpha = 1;
		this.loaded = false;
		var _this = this;
		this.img.onload = function() {
			_this.loaded = true;
			_this.xOffset = 0;
			_this.yOffset = 0;
			_this.width = _this.img.width;
			_this.height = _this.img.height;
			_this.frameWidth = _this.img.width;
			_this.frameHeight = _this.img.height;
			_this.rotationXOffset = (_this.img.width / 2);
			_this.rotationYOffset = (_this.img.height / 2);
		}
	},
	draw: function(ctx, screen, x, y) {
		if (this.loaded) {
			//Draw relative to screen
			//x -= screen.xOffset;
			//y -= screen.yOffset;
			//Perform the draw
			ctx.save();
			ctx.translate(x + this.rotationXOffset, y + this.rotationYOffset);
			ctx.rotate(degToRad(this.entity.rotation));
			ctx.globalAlpha = this.alpha;
			ctx.drawImage(this.img, this.xOffset, this.yOffset, this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2, this.frameWidth * this.scale, this.frameHeight * this.scale);
			ctx.restore();
		}
	},
});
module.exports = Sprite;
},{"./class":3}]},{},[1]);
