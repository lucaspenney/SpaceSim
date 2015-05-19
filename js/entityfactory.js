var Player = require('./player');
var Ship = require('./ship');
var Asteroid = require('./asteroid');
var Planet = require('./planet');
var BlackHole = require('./blackhole');
var Explosion = require('./explosion');
var Bullet = require('./bullet');
var Missile = require('./missile');
var Bot = require('./bot');

var EntityFactory = function() {
    return {
        create: function(classname, game, x, y, isServer, id) {
            var entity = this.createEntity(classname, game, x, y, isServer, id);
            if (entity) {
                game.entities.push(entity);
                return entity;
            }
            return false;
        },
        createEntity: function(classname, game, x, y, isServer, id) {
            if (!isServer) {
                if (typeof window !== 'undefined') {
                    return false; //Only create new entities if it's the server or the client's connection (which uses isServer)
                }
            }
            if (id === undefined) id = game.newEntityId();
            if (classname === "Player") {
                return new Player(game, id, x, y);
            } else if (classname === "Ship") {
                return new Ship(game, id, x, y);
            } else if (classname === "Asteroid") {
                return new Asteroid(game, id, x, y);
            } else if (classname === "Planet") {
                return new Planet(game, id, x, y);
            } else if (classname === "Black Hole") {
                return new BlackHole(game, id, x, y);
            } else if (classname === "Explosion") {
                return new Explosion(game, id, x, y);
            } else if (classname === "Bullet") {
                return new Bullet(game, id, x, y);
            } else if (classname === "Missile") {
                return new Missile(game, id, x, y);
            } else if (classname === "Bot") {
                return new Bot(game, id, x, y);
            }
        },
    };
};


module.exports = EntityFactory;