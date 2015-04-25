var Class = require('./class');
var _ = require('lodash-node');

var Vector = require('./vector');

var WorldManager = Class.extend({
    init: function(game) {
        this.game = game;
        this.lastUpdate = 0;
    },
    update: function(clients, entities) {
        if (Date.now() - this.lastUpdate < 20) return;
        this.lastUpdate = Date.now();

        //Remove far entities
        if (clients.length === 0) return;
        _.forEach(entities, function(entity) {
            if (!entity) return;
            var nearClients = 0;
            var farClients = 0;
            _.forEach(clients, function(client) {
                var distance = entity.pos.distance(client.entity.pos);
                if (distance < 2600) {
                    nearClients++;
                } else if (distance > 4600) {
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
        var _this = this;
        var randClientEntity = clients[clients.length - (Math.floor(Math.random() * clients.length) + 1)].entity;
        var nearPos = randClientEntity.pos.clone();
        nearPos.add(randClientEntity.physics.vel.clone().scale(10));
        var x = (randClientEntity.pos.x - 3000) + (Math.random() * 6000);
        var y = (randClientEntity.pos.y - 3000) + (Math.random() * 6000);
        var p = new Vector(x, y);
        var farFromPlayers = true;
        _.forEach(clients, function(client) {
            if (p.distance(client.entity.pos) < 1800) farFromPlayers = false;
        });
        if (farFromPlayers) {
            var farFromEnts = true;
            _.forEach(_this.game.entities, function(ent) {
                if (ent.pos.distance(p) < 3000) farFromEnts = false;
            });
            if (farFromEnts) {
                console.log(p);
                _this.createRandomEntity(p.x, p.y);
            }
        }
    },
    createRandomEntity: function(x, y) {
        var classnames = ["Asteroid", "Planet", "Black Hole"];
        var choice = classnames[Math.floor(Math.random() * classnames.length) + 1];
        this.game.entityFactory.create(choice, this.game, x, y);
    }
});


module.exports = WorldManager;