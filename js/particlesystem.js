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