const { Socket } = require('socket.io');
const { Client } = require('./client');
const { Game } = require('./game');
const { Room } = require('./room');

// Constants
const LOBBY = 'LOBBY';
const LOBBY_EVENTS = [
    'join lobby', 'set name', 'quickplay',
    'create room', 'join room', 'see rooms',
    'disconnect'
]; 
const PLAYERS_PER_ROOM = 4;
const MAX_ROOMS = 80;
const QUEUE_CHECK_MS = 1_000;
const EMIT_ROOM_DATA_MS = 5_000;
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";



//  The Lobby is where clients wait to be assigned a game.
//  It maintains a queue of clients waiting for a game, 
//  and periodically checks for enough players to initiate a game. 

module.exports.Lobby = function(io) {
    var lobby       = this;
    var clients     = {};       // maps socket.ids to Client objects
    var rooms       = {};       // maps room ids to rooms
    var emptyRooms  = [];
    var usedRooms   = [];
    var queue       = [];       // queue of Clients waiting to play a game
    var currGameId  = 0;        // latest gameId

    // ======== CONSTRUCTOR ======== //
    lobby.init = () => {
        // Make the rooms
        for (var i = 0; i < MAX_ROOMS; i++) {
            emptyRooms.push(new Room(io));
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
        setInterval(lobby.checkClientQueue, QUEUE_CHECK_MS);

        // Emit room data every
        setInterval(function() {
            lobby.emitRoomData(LOBBY);
        }, EMIT_ROOM_DATA_MS);
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
     * Generates unique Room ID
    */
    lobby.generateRoomId = function() {
        var id = "";
        var index = "";
        
        do {
            id = "";
            for (var i = 0; i < 6; i++) {
                index = Math.floor(Math.random() * ALPHA.length);
                id += ALPHA[index];
            }
        }
        while (rooms[id]);
        return id;
    }

    /**
     * Finishes the game of the corresponding gameId
     * @param {string} gameId the gameId of the game to finish
     */
    lobby.finishGame = function(gameId) {
        games[gameId].destroy();
        delete games[gameId];
    }

    /**
     * Give clients updated room list
     * @param {string} recipient should either be 'LOBBY' or a specific client id
     */
    lobby.emitRoomData = function(recipient) {
        var roomData = Object.values(rooms).map(room => room.getFrontendFormat());
        io.to(recipient).emit('room data', roomData);
    }

    // ======== LOBBY EVENTS ======== //
    /**
     * Joins the client to the lobby
     * @param {Socket} socket Client socket
     */
    lobby['join lobby'] = function(socket) {
        clients[socket.id] = new Client(socket);
        socket.join(LOBBY);
    }

    /**
     * Removes the client socket from the clients object and game queue
     * @param {Socket} socket Client socket
     */
    lobby['disconnect'] = function(socket) {
        // TODO : remove  client from the queue
        console.log("Bye bye lobby");
        socket.leave(LOBBY)
        delete clients[socket.id];
    }

    /**
     * 
     * @param {*} socket
     * @param {string} name the name to name the player
     */
    lobby['set name'] = function(socket, name) {
        clients[socket.id].setName(name);
    }   

    /**
     * Adds the client to the game queue
     * @param {Socket} socket Client socket
     */
    lobby['quickplay'] = function(socket) {
        console.log("quickplay called");
        queue.push(clients[socket.id]);
    }

    /**
     * 
     * @param {Socket} socket Client socket
     */
    lobby['create room'] = function(socket) {
        console.log("Creating room");
        // TO DO: Consider if the message is sent at the wrong time
        var room = emptyRooms.pop();
        if (!room) {
            // TO DO: Tell client that room doesn't exist or something
        }
        else {
            var id = this.generateRoomId();
            room.init(clients[socket.id], id);
            rooms[id] = room;
            console.log("This is what the room is : ", room.getFrontendFormat());
            usedRooms.push(room);
        }
    }

    /**
     * 
     * @param {Socket} socket Client socket
     * @param {string} roomId ID of room to join
     */
    lobby['join room'] = function(socket, roomId) {
        try {
            rooms[roomId].joinRoom(clients[socket.id]);
        } catch (error) {
            //ignore
            console.log("Error when joining room : ", error);
        }
    }


    lobby['see rooms'] = function (socket) {
        lobby.emitRoomData(socket.id);
    }

    this.init();
}

