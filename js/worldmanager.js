var Class = require('./class');
var _ = require('lodash-node');

var Vector = require('./vector');

var WorldManager = Class.extend({
    init: function(game) {
        this.game = game;
        this.lastUpdate = 0;
    },
    update: function(clients, entities) {
        if (Date.now() - this.lastUpdate < 300) return;
        this.lastUpdate = Date.now();

        //Remove far entities
        if (clients.length === 0) return;
        _.forEach(entities, function(entity) {
            if (!entity) return;
            var nearClients = 0;
            var farClients = 0;
            _.forEach(clients, function(client) {
                var distance = entity.pos.distance(client.entity.pos);
                if (distance < 5500) {
                    nearClients++;
                } else if (distance > 60000) {
                    farClients++;
                }
            });
            if (nearClients === 0) {
                if (farClients !== 0) entity.destroy();
                else entity.active = false;
            } else
                entity.active = true;
        });

        //Now add new entities
        for (var i = 0; i < 5; i++) { //Max number of entities to spawn (not guaranteed, but limited)
            var _this = this;
            var randClientEntity = clients[clients.length - (Math.floor(Math.random() * clients.length) + 1)].entity;
            var nearPos = randClientEntity.pos.clone();
            nearPos.add(randClientEntity.physics.vel.clone().scale(5));
            var hasPosition = false;
            while (!hasPosition) {
                var x = (nearPos.x - 1200) + (Math.random() * 1200);
                var y = (nearPos.y - 1200) + (Math.random() * 1200);
                var p = new Vector(x, y);
                hasPosition = true;
                _.forEach(clients, function(client) {
                    if (p.distance(client.entity.pos) < 1400) hasPosition = false;
                });
            }
            var farFromEnts = true;
            _.forEach(_this.game.entities, function(ent) {
                if (ent.toJSON().classname === "Planet") {
                    if (ent.pos.distance(p) < 2200) farFromEnts = false;
                }

            });
            if (farFromEnts) {
                _this.createRandomEntity(p.x, p.y);
            }
        }
    },
    createRandomEntity: function(x, y) {
        var classnames = ["Planet"];
        var choice = classnames[Math.floor(Math.random() * classnames.length)];
        console.log(choice);
        this.game.entityFactory.create(choice, this.game, x, y);
    }
});


module.exports = WorldManager;