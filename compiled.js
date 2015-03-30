//Entity

//Function to subclass entities 
Function.prototype.extend = function(parent) {
  this.prototype = Object.create(parent.prototype);
  this.prototype.className = this.name
};

function Entity(game, x, y) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.rotation = 0;
  this.sprite = null;
  this.layer = 0;
  this.game.entities.push(this);
}

Entity.prototype.render = function() {
  if (this.sprite) {
    this.sprite.draw(this.x, this.y);
  }
}

Entity.prototype.update = function() {

}

Entity.prototype.destroy = function() {
  this.game.entities.splice(this.game.entities.indexOf(this), 1);
}
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
function BoundingBox(game, entity) {
	this.game = game;
	this.entity = entity;
	this.x = entity.x;
	this.y = entity.y;
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = entity.width || entity.sprite.width;
	this.height = entity.height || entity.sprite.height;
}

BoundingBox.prototype.update = function() {
	this.x = this.entity.x + this.xOffset;
	this.y = this.entity.y + this.yOffset;
	this.render();
};

BoundingBox.prototype.setOffset = function(x, y) {
	this.xOffset = x;
	this.yOffset = y;
}

BoundingBox.prototype.setWidth = function(width) {
	this.width = width;
};

BoundingBox.prototype.setHeight = function(height) {
	this.height = height;
};

BoundingBox.prototype.wouldCollide = function(x, y, e) {
	var wouldCollide = false;
	this.x += x;
	this.y += y;
	wouldCollide = this.isColliding(e);
	this.x -= x;
	this.y -= y;
	return wouldCollide;
};

BoundingBox.prototype.isColliding = function(e) {
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
};

BoundingBox.prototype.getDistBetween = function(e) {
	e = e.physics.boundingBox;
	var point1a = this.x + (this.width / 2);
	var point1b = this.y + (this.height / 2);
	var point1 = new Point(point1a, point1b);
	var point2a = e.x + (e.width / 2);
	var point2b = e.y + (e.height / 2);
	var point2 = new Point(point2a, point2b);
	return point1.getDist(point2);
}

BoundingBox.prototype.isPointIn = function(x, y) {
	if (this.x === undefined || this.y === undefined || this.x === null || this.y === null) return -1;
	if (this.x + this.width > x && this.x < x) {
		if (this.y + this.height > y && this.y < y) {
			return true;
		}
	}
	return false;
};

BoundingBox.prototype.render = function() {
	//For debugging
	if (this.game.debugMode) {
		this.game.ctx.strokeStyle = "#00F";
		this.game.ctx.strokeRect(this.x - this.game.screen.xOffset, this.y - this.game.screen.yOffset, this.width, this.height);
	}
};
Bullet.extend(Entity);

function Bullet(game, x, y, player, direction, speed) {
	Entity.apply(this, arguments);
	this.sprite = new Sprite(this.game, this, "img/bullet.png")
	this.physics = new Physics(game, this);
	this.physics.collidesWith = ['Asteroid'];
	this.rotation = direction;
	this.speed = speed;
	this.owner = player;
	this.physics.weight = 10;
	this.physics.maxVelocity = 12;
	this.physics.setVelocity(Math.cos(degToRad(this.rotation - 90)) * this.speed, Math.sin(degToRad(this.rotation - 90)) * this.speed);
	this.physics.addVelocity(this.owner.physics.xv, this.owner.physics.yv);

	var _this = this;
	this.physics.onCollision = function() {
		_this.destroy();
	};
}

Bullet.prototype.update = function() {
	Entity.prototype.update.call(this);
	this.physics.update();
};
function Engine(game, player) {
	this.game = game;
	this.player = player;
	this.mainThrust = 0.4;
	this.turnThrust = 0.35;
	this.particles = new ParticleSystem(this.game);
}
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
Explosion.extend(Entity);

function Explosion(game, x, y) {
	Entity.apply(this, arguments);
	//this.particles = new ParticleSystem();
}
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
function Game(stage) {
  this.stage = jQuery(stage);
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
function Interval(time) {
	this.timeInterval = time;
	this.timePassed = time;
	this.lastTick = this.getCurrentMs();
}

Interval.prototype.hasElapsed = function() {
	if (this.getCurrentMs() - this.lastTick > this.timeInterval) {
		return true;
	}
	return false;
};

Interval.prototype.reset = function() {
	this.lastTick = this.getCurrentMs();
};

Interval.prototype.getCurrentMs = function() {
	var date = new Date();
	var ms = date.getTime() / 1000;
	return ms;
};
function Particle(game, x, y, a, xv, yv, decay, direction) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.a = a;
	this.xv = xv;
	this.yv = yv;
	this.decay = decay;
	this.direction = direction;
}

Particle.prototype.render = function() {
	this.game.ctx.fillRect(this.x - this.game.screen.xOffset, this.y - this.game.screen.yOffset, 2, 2);
};

Particle.prototype.update = function() {
	this.x += this.xv;
	this.y += this.yv;
	this.a *= this.decay;
}
ParticleSystem.extend(Entity);

function ParticleSystem(game, x, y, amount, func) {
	Entity.apply(this, arguments);
	this.particles = [];
	this.width = 1;
	this.height = 1;
	this.active = true;
	this.amount = amount;
	this.physics = new Physics(this.game, this);
	this.stepFunc = func || function(p) {
		p.xv *= 0.8;
		p.yv *= 0.8;
		p.a *= 0.8;
	};
}

ParticleSystem.prototype.render = function() {
	for (var i = 0; i < this.particles.length; i++) {
		this.stepFunc(this.particles[i]);
	}
	if (this.particles.length > this.amout) {
		this.particles.shift();
		this.particles.push(new Particle());
	} else {
		this.particles.push(new Particle());
	}
};

ParticleSystem.prototype.toggle = function() {
	if (this.active) this.turnOn();
	else this.turnOff();
}

ParticleSystem.prototype.turnOn = function() {
	this.active = true;
}

ParticleSystem.prototype.turnOff = function() {
	this.active = false;
}

ParticleSystem.prototype.createParticle = function() {
	var xv = Math.random() - 0.5;
	var yv = Math.random() - 0.5;
	var direction = Math.random() * 360;
	this.particles.push(new Particle(this.game, this.x, this.y, 1, xv, yv, 0.8, direction));
};

ParticleSystem.prototype.update = function() {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].update();
	}
};
function Physics(game, entity) {
	this.game = game;
	this.entity = entity;
	this.xv = 0;
	this.yv = 0;
	this.rv = 0;
	this.maxVelocity = 8;
	this.weight = 100;
	this.boundingBox = new BoundingBox(game, entity);
	this.collidesWith = [];
	this.eventsManager = new EventManager(this);
}

Physics.prototype.update = function() {
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
};

Physics.prototype.collide = function(entity, collision) {
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
};

Physics.prototype.addVelocity = function(x, y, r) {
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
};

Physics.prototype.setVelocity = function(x, y, r) {
	this.xv = 0;
	this.yv = 0;
	this.rv = 0;
	this.addVelocity(x, y, r);
}

Physics.prototype.onCollision = function() {

}
Player.extend(Entity);

function Player(game, x, y) {
	Entity.apply(this, arguments);
	this.width = 32;
	this.height = 32;
	this.rotation = 0;
	this.sprite = new Sprite(this.game, this, "img/player.png");
	this.physics = new Physics(this.game, this);
	this.physics.collidesWith = ['Asteroid'];
	this.physics.weight = 50;
	this.layer = 100;
	this.trail = new Trail(this.game, 0, 0, this, 16);
	this.enginesOn = false;
	this.weapon = new Weapon(this.game, this);
	this.engine = new Engine(this.game, this);
	this.turnThrust = 0.35;
	this.mainThrust = 0.4;
}

Player.prototype.update = function() {
	Entity.prototype.update.call(this);
	this.enginesOn = false;
	if (this.game.input.keys[38] || this.game.input.keys[87]) {
		this.enginesOn = true;
		var xVel = Math.cos(degToRad(this.rotation - 90)) * this.mainThrust;
		var yVel = Math.sin(degToRad(this.rotation - 90)) * this.mainThrust;
		this.physics.addVelocity(xVel, yVel);
	}
	if (this.game.input.keys[37] || this.game.input.keys[65]) { //Left Arrow
		this.enginesOn = true;
		this.physics.addVelocity(0, 0, this.turnThrust * -1);
	}
	if (this.game.input.keys[39] || this.game.input.keys[68]) { //right arrow
		this.enginesOn = true;
		this.physics.addVelocity(0, 0, this.turnThrust);
	}
	if (this.game.input.keys[32]) {
		this.fire();
	}
	this.physics.update();

	this.game.screen.setXOffset(this.x - 350);
	this.game.screen.setYOffset(this.y - 350);
};

Player.prototype.fire = function() {
	if (!this.weapon) return;
	this.weapon.fire();
}
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
function Sprite(game, entity, img) {
	this.game = game;
	this.canvas = game.ctx;
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
}

Sprite.prototype.draw = function(x, y) {

	if (this.loaded) {
		//Draw relative to screen
		x -= this.game.screen.xOffset;
		y -= this.game.screen.yOffset;
		//Perform the draw
		this.canvas.save();
		this.canvas.translate(x + this.rotationXOffset, y + this.rotationYOffset);
		this.canvas.rotate(degToRad(this.entity.rotation));
		this.canvas.globalAlpha = this.alpha;
		this.canvas.drawImage(this.img, this.xOffset, this.yOffset, this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2, this.frameWidth * this.scale, this.frameHeight * this.scale);
		this.canvas.restore();
	}
};

function degToRad(angle) {
	return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
	return ((angle * 180) / Math.PI);
}
Trail.extend(Entity);

function Trail(game, x, y, parent, centerOffset) {
	Entity.apply(this, arguments);
	this.parent = parent;
	this.centerOffset = centerOffset;
	this.positions = [];
}

Trail.prototype.render = function() {
	this.game.ctx.strokeStyle = "#333333";
	this.game.ctx.lineCap = "round";
	this.game.ctx.lineWidth = 5;
	for (var i = 0; i < this.positions.length; i++) {
		this.game.ctx.beginPath();
		this.game.ctx.moveTo(this.x - this.game.screen.xOffset, this.y - this.game.screen.yOffset);
		this.game.ctx.lineTo(this.positions[i].x - this.game.screen.xOffset, this.positions[i].y - this.game.screen.yOffset);
		this.game.ctx.closePath();
		this.game.ctx.globalAlpha = i / this.positions.length;
		this.game.ctx.stroke();
	}
};

Trail.prototype.update = function() {
	this.x = this.parent.x + ((Math.cos(degToRad(this.parent.rotation - 90)) * -4) + this.centerOffset);
	this.y = this.parent.y + ((Math.sin(degToRad(this.parent.rotation - 90)) * -4) + this.centerOffset);

	this.positions.push({
		x: this.x,
		y: this.y,
	});
	if (this.positions.length > 10) {
		this.positions.shift();
	}
};
function Weapon(game, owner) {
	this.game = game;
	this.kickback = 0.2;
	this.owner = owner;
	this.fireInterval = new Interval(0.1);
	this.power = 12;
}

Weapon.prototype.fire = function() {
	if (this.fireInterval.hasElapsed()) {
		new Bullet(this.game, this.owner.x, this.owner.y, this.owner, this.owner.rotation, this.power);
		this.owner.physics.addVelocity(Math.cos(degToRad(this.owner.rotation - 90)) * this.kickback * -1, Math.sin(degToRad(this.owner.rotation - 90)) * this.kickback * -1);
		this.fireInterval.reset();
	}
}