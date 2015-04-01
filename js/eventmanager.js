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