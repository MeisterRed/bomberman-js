const { Socket } = require('socket.io');
const { Game } = require('./game');

//  The Lobby is where clients wait to be assigned a game.
//  It maintains a queue of clients waiting for a game, 
//  and periodically checks for enough players to initiate a game. 

var Lobby = function(io) {
    var lobby = this;
    var clients    = {};       // maps socket.ids to Client objects
    var games      = {};       // maps gameIds to Game objects
    var queue      = [];       // qeueue of Clients waiting to play a game
    var currGameId = 0;        // latest gameId

    // Constants
    var PLAYERS_PER_ROOM = 4;
    var LOBBY_EVENTS = ['join game', 'disconnect']; // client messages that affect lobby

    // ======== CONSTRUCTOR ======== //
    lobby.init = () => {
        // When a client connects, attach all lobby event handlers to the client socket
        io.on('connection', function(socket) {
            LOBBY_EVENTS.forEach(function(event) {
                console.log(event);
                socket.on(event, function(data) {
                    lobby[event](socket, data);
                });
            });
        });
        // Check the client queue every second to initiate new games
        setInterval(lobby.checkClientQueue, 1000);
    }

    // ======== METHODS ======== //
    /**
     * Checks the client queue for enough players to begin a game
     */
    lobby.checkClientQueue = () => {
        while (queue.length >= PLAYERS_PER_ROOM) {
            // TODO consider race condition
            var players = queue.slice(0, PLAYERS_PER_ROOM);
            queue = queue.slice(PLAYERS_PER_ROOM);
            lobby.startGame(players);
        }
    }

    /**
     * Begins a game between the given player clients
     * @param {Socket[]} players 
     */
    lobby.startGame = (players) => {
        var gameId = lobby.generateGameId();
        players.forEach(function(client) {
            client.join(gameId);
        });
        games[gameId] = new Game(io, players, gameId);
    }

    /**
     * Generates unique gameId
     */
    lobby.generateGameId = function() {
        return "" + ++currGameId;
    }

    /**
     * Finishes the game of the corresponding gameId
     * @param {string} gameId the gameId of the game to finish
     */
    lobby.finishGame = function(gameId) {
        games[gameId].destroy();
        delete games[gameId];
    }

    // ======== LOBBY EVENTS ======== //
    /**
     * Adds the client to the clients object (if not present) and game queue
     * @param {Socket} socket Client socket
     */
    lobby['join game'] = function(socket) {
        if (!clients[socket.id]) {
            clients[socket.id] = socket;
        }
        console.log("Socket #" + socket.id + " joined the game.")
        queue.push(clients[socket.id]);
    }

    /**
     * Removes the client socket from the clients object and game queue
     * @param {Socket} socket Client socket
     */
    lobby['disconnect'] = function(socket) {
        // TODO : remove  client from the queue
        delete clients[socket.id];
    }

    // call constructor
    this.init();
}

module.exports.Lobby = Lobby;