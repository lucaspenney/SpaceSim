function EventManager() {
	this.listeners = [];
}

EventManager.prototype.dispatch = function(eventName, context, params) {
	for (var i = 0; i < this.listeners.length; i++) {
		if (this.listeners[i].name === eventName) {
			this.listeners[i].callback.call(context, params);
		}
	}
};

EventManager.prototype.addEventListener = function(event, func) {
	this.listeners.push({
		name: event,
		callback: func
	});
};

module.exports = EventManager;