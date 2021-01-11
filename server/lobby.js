const { Game } = require('./game');

PLAYERS_PER_ROOM = 4;

module.exports.Lobby = function(io) {
    var lobby = this;       // safe reference to this
    var clients = {};       // maps socket.ids to Client objects
    var games = {};         // maps gameIds to Game objects
    var currGameId = 0;     // latest gameId
    var queue = [];         // qeueue of Clients waiting to play a game

    // Begin a game between the given players
    // @param players : list of Clients playing the game
    this.startGame = function(players) {
        var gameId = lobby.generateGameId();
        players.forEach(function(client) {
            client.join(gameId);
        });
        games[gameId] = new Game(io, players, gameId);
    }
    
    this.generateGameId = function() {
        return "" + ++currGameId;
    }

    // Finish the game of the corresponding gameId
    this.finishGame = function(gameId) {
        games[gameId].destroy();
        delete games[gameId];
    }

    // Check the client queue periodically
    setInterval(function() {
        // Initialize games for each 4 players in the queue
        while (queue.length >= PLAYERS_PER_ROOM) {
            var players = queue.slice(0, PLAYERS_PER_ROOM);
            queue = queue.slice(PLAYERS_PER_ROOM);
            lobby.startGame(players);
        }
    }, 2000);


    // ==== LOBBY EVENTS ====
    LOBBY_EVENTS = ['join game', 'disconnect'];

    lobby['join game'] = function(socket) {
        if (!clients[socket.id]) {
            clients[socket.id] = socket;
            console.log("added new socket : ", socket.id);
        }
        queue.push(clients[socket.id]);
    }

    lobby['disconnect'] = function(socket) {
        // TODO : remove  client from the queue
        delete clients[socket.id];
    }
    
    // on each connection, listen for each lobby event
    io.on('connection', function(socket) {
        LOBBY_EVENTS.forEach(function(event) {
            socket.on(event, function(data) {
                lobby[event](socket, data);
            });
        });
    });

}