module.exports.Game = function(io, clients, gameId) {
    var game = this;
    
    // initialize game state
    var state = {};
    clients.forEach(function(client) {
        state[client.id] = {
            x: 420,
            y: 310
        };
    });

    this.destroy = function() {
        // cleanup the game
    }

    setInterval(function() {
        io.to(gameId).emit('state', state);
    }, 1000 / 60);


    // ==== GAME EVENTS ====
    GAME_EVENTS = ['player actions', 'disconnect'];

    game['player actions'] = function(socket, data) {
        var player = state[socket.id] || {};
        if (data.left) {
            player.x -= 5;
        }
        if (data.up) {
            player.y -= 5;
        }
        if (data.right) {
            player.x += 5;
        }
        if (data.down) {
            player.y += 5;
        }
    }

    game['disconnect'] = function(socket, data) {
        // TODO : kill player
    }

    clients.forEach(function(client) {
        GAME_EVENTS.forEach(function(event) {
            client.socket.on(event, function(data) {
                game[event](client.socket, data);
            })
        })
    });
}