const { Socket } = require('socket.io');
const { Client } = require('./client');
const { Game } = require('./game');
const { Room } = require('./room');

//  The Lobby is where clients wait to be assigned a game.
//  It maintains a queue of clients waiting for a game, 
//  and periodically checks for enough players to initiate a game. 

module.exports.Lobby = function(io) {
    var lobby       = this;
    var clients     = {};       // maps socket.ids to Client objects
    var rooms       = [];
    var queue       = [];       // qeueue of Clients waiting to play a game
    var currGameId  = 0;        // latest gameId

    // Constants
    var PLAYERS_PER_ROOM = 4;
    var MAX_ROOMS = 80;
    var LOBBY_EVENTS = ['join lobby', 'quickplay', 'disconnect', 'set name', 'create room',
                        'join room']; 

    // ======== CONSTRUCTOR ======== //
    lobby.init = () => {
        // Make the rooms
        for (var i = 0; i < MAX_ROOMS; i++) {
            rooms.push(new Room());
        }

        // When a client connects, attach all lobby event handlers to the client socket
        io.on('connection', function(socket) {
            LOBBY_EVENTS.forEach(function(event) {
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
     * @param {Client[]} players 
     */
    lobby.startGame = (players) => {
        var gameId = lobby.generateGameId();
        players.forEach(function(client) {
            client.socket.join(gameId);
        });
        games[gameId] = new Game(io, gameId, players);
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
     * Joins the client to the lobby
     * @param {Socket} socket Client socket
     */
    lobby['join lobby'] = function(socket) {
        clients[socket.id] = new Client(socket);
    }

    /**
     * Removes the client socket from the clients object and game queue
     * @param {Socket} socket Client socket
     */
    lobby['disconnect'] = function(socket) {
        // TODO : remove  client from the queue
        delete clients[socket.id];
    }

    /**
     * 
     * @param {*} socket
     * @param {name: string} data the name to name the player
     */
    lobby['set name'] = function(socket, data) {
        clients[socket.id].setName(data.name);
    }

    /**
     * Adds the client to the game queue
     * @param {Socket} socket Client socket
     */
    lobby['quickplay'] = function(socket) {
        queue.push(clients[socket.id]);
    }

    this.init();
}

