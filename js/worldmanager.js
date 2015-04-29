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
        var _this = this;
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
                } else if (distance > 8000) {
                    farClients++;
                }
            });
            if (nearClients === 0) {
                if (farClients !== 0) {
                    entity.destroy();
                } else entity.active = false;
            } else
                entity.active = true;
        });

        //Now add new entities
        for (var i = 0; i < 15; i++) { //Max number of entities to spawn (not guaranteed, but limited)
            var randClientEntity = clients[clients.length - (Math.floor(Math.random() * clients.length) + 1)].entity;
            var nearPos = randClientEntity.pos.clone();
            //nearPos.add(randClientEntity.physics.vel.clone().scale(5));
            var hasPosition = false;
            while (!hasPosition) {
                var x = (nearPos.x - 1200) + (Math.random() * 2400);
                var y = (nearPos.y - 1200) + (Math.random() * 2400);
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

        //Spawn players that need spawning
        _.forEach(clients, function(client) {
            var entity = client.entity;
            if (entity.needSpawn) {
                var hasPosition = false;
                var p = null;
                var range = 3000;
                while (!hasPosition) {
                    var nearPos = _this.getRandomClient(clients).entity.pos.clone(0);
                    var x = (nearPos.x - range) + (Math.random() * range);
                    var y = (nearPos.y - range) + (Math.random() * range);
                    p = new Vector(x, y);
                    hasPosition = true;
                    _.forEach(clients, function(c) {
                        if (p.distance(c.entity.pos) < 2500) hasPosition = false;
                    });
                    _.forEach(entities, function(e) {
                        if (p.distance(e.pos) < 900) hasPosition = false;
                    })
                    range += 500;
                }

                entity.ship = _this.game.entityFactory.create('Ship', _this.game, p.x, p.y);
                entity.ship.player = entity;
                entity.needSpawn = false;
            }
        });
    },
    createRandomEntity: function(x, y) {
        var classnames = ["Planet"];
        var choice = classnames[Math.floor(Math.random() * classnames.length)];
        this.game.entityFactory.create(choice, this.game, x, y);
    },
    getRandomClient: function(clients) {
        return clients[clients.length - (Math.floor(Math.random() * clients.length) + 1)];
    }
});


module.exports = WorldManager;