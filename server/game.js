module.exports.Game = function(io, player_sockets, gameId) {
    var game = this;
    
    // initialize game state
    var state = {};
    player_sockets.forEach(function(socket) {
        state[socket.id] = {
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
    GAME_EVENTS = ['player actions'];

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

    player_sockets.forEach(function(socket) {
        GAME_EVENTS.forEach(function(event) {
            socket.on(event, function(data) {
                game[event](socket, data);
            })
        })
    });
}