const {Engine} = require('./engine/Engine')

module.exports.Game = function(io, gameId, clients) {
    var game = this;

    // The engine
    var engine = new Engine(clients.map(client => client.id));

    this.init = function() {
        // Compute the physics step 30 times per second
        setInterval(function() {
            engine.step();
        }, 1000 / 30);

        // Emit state to clients 30 times per second
        setInterval(function() {
            io.to(gameId).emit('state', engine.getState());
        }, 1000 / 30);
    }

    this.destroy = function() {
        delete engine;
    }


    // ==== GAME EVENTS ====
    GAME_EVENTS = ['player actions', 'disconnect'];

    // When a player emits their actions, update their state
    game['player actions'] = function(socket, data) {
        let vx = 0, vy = 0;
        if (data[1] === '1') {
            vx = -4;
        }
        else if (data[2] === '1') {
            vx = 4
        }
        if (data[3] === '1') {
            vy = 4;
        }
        else if (data[4] === '1') {
            vy = -4;
        }
        engine.setPlayerVelocity(socket.id, vx, vy);
    }

    // When a player disconnects, 
    game['disconnect'] = function(socket, data) {
        // TODO : if the player is alive, kill them
    }

    clients.forEach(function(client) {
        GAME_EVENTS.forEach(function(event) {
            client.socket.on(event, function(data) {
                game[event](client.socket, data);
            })
        })
    });

    this.init();
}