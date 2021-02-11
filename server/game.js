const { Engine }            = require('./engine/Engine')
const { Client, Roles }     = require('./client');

// Constants 
GAME_EVENTS = ['player actions', 'disconnect'];

module.exports.Game = function(io, gameId, clients) {
    var game = this;
    this.players    = Object.values(clients).filter(c => c.role === Roles.PLAYER || c.role === Roles.HOST);
    this.spectators = Object.values(clients).filter(c => c.role === Roles.SPECTATOR);
    this.clientEventCallbacks = {};

    // The engine
    var engine = new Engine(this.players.map(client => client.id));

    this.init = function() {
        // Game Loop
        setInterval(function() {
            engine.step();
            io.to(gameId).emit('state', engine.getState());
        }, 1000 / 30);
    }

    this.destroy = function() {
        delete engine;
    }


    // ==== GAME EVENTS ====
    
    // When a player emits their actions, update their state
    game['player actions'] = function(socket, data) {
        engine.handleInput(socket.id, data);
    }

    // When a player disconnects, 
    game['disconnect'] = function(socket, data) {
        // TODO : if the player is alive, kill them
    }

    // Add game events for each player
    this.players.forEach(function(client) {
        game.clientEventCallbacks[client.id] = {};
        GAME_EVENTS.forEach(function(event) {
            let callback = function(data) {
                game[event](client.socket, data);
            }
            client.socket.on(event, callback);
            game.clientEventCallbacks[client.id][event] = callback;
        });
    });

    this.init();
}