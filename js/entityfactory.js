var Player = require('./player');
var Asteroid = require('./asteroid');
var Planet = require('./planet');
var BlackHole = require('./blackhole');
var Explosion = require('./explosion');

var EntityFactory = function() {
    return {
        create: function(classname, game, x, y, isServer) {
            var entity = this.createEntity(classname, game, x, y, isServer);
            if (entity) {
                game.entities.push(entity);
                return entity;
            }
            return false;
        },
        createEntity: function(classname, game, x, y, isServer) {
            if (!isServer) {
                if (typeof window !== 'undefined') {
                    return false; //Only create new entities if it's the server or the client's connection (which uses isServer)
                }
            }
            if (classname === "Player") {
                return new Player(game, x, y);
            } else if (classname === "Asteroid") {
                return new Asteroid(game, x, y);
            } else if (classname === "Planet") {
                return new Planet(game, x, y);
            } else if (classname === "Black Hole") {
                return new BlackHole(game, x, y);
            } else if (classname === "Explosion") {
                return new Explosion(game, x, y);
            }
        }
    };
};


module.exports = EntityFactory;