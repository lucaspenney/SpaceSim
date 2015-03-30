function Engine(game, player) {
	this.game = game;
	this.player = player;
	this.mainThrust = 0.4;
	this.turnThrust = 0.35;
	this.particles = new ParticleSystem(this.game);
}