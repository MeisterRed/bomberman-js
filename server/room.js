const { Socket } = require('socket.io')
const { Client, Roles } = require('./client');
const { Game } = require('./game');

// Constants

const ROOM_EVENTS = ['set rules', 'start game', 'leave room', 'chat', 'kick out', 'swap roles']; 
const MIN_PLAYERS_PER_ROOM = 2;
const MAX_PLAYERS_PER_ROOM = 4;
const MAX_SPECTATORS_PER_ROOM = 20;

//  The Room

module.exports.Room = function(io) {
    var room = this;
    this.roomId = "";
    this.clients = {};
    this.clientEventCallbacks = {};
    this.host = null;
    this.rules = [];
    this.chat = [];
    this.playerCount = 0;
    this.spectatorCount = 0;
    this.game = null;

    // ======== ROOM EVENTS ======== //

    /**
     * Removes the client socket from the clients object and game queue
     * @param {Socket} socket Client socket
     */
    room['disconnect'] = function(socket) {
        // TODO : remove  client from the queue
        console.log("Bye bye room")
        socket.leave(room.roomId);
        delete clients[socket.id];
    }

    room['set rules'] = function(socket) {
        
    }

    /**
     * Begins the game
     * @param {Client[]} players 
     */
    room['start game'] = function(socket) {
        if (room.playerCount >= MIN_PLAYERS_PER_ROOM) {
            var gameId = room.generateGameId();
            Object.values(room.clients).forEach(function (client) {
                client.socket.join(gameId);
            });
            room.game = new Game(io, gameId, room.clients);
        } else {
            console.log("Not enough players!");
        }
    }

    room['leave room'] = function(socket) {
        this.leaveRoom(this.clients[socket.id]);
    }

    room['chat'] = function(socket) {
        
    }

    room['kick out'] = function(socket, playerId) {
        this.clients[playerId].emit("kicked out");
        this.leaveRoom(this.client[data.id]);
    }

    room['swap roles'] = function(socket) {
        let client = this.clients[socket.id];
        //TO DO: Figure out what to do with the host
        if(client.role === Roles.PLAYER && this.spectatorCount < SPECTATORS_PER_ROOM) {
            client.role = Roles.SPECTATOR;
            this.spectatorCount++;
            this.playerCount--;
        }
        else if (client.role === Roles.SPECTATOR && this.playerCount < MAX_PLAYERS_PER_ROOM) {
            client.role = Roles.PLAYER;
            this.playerCount++;
            this.spectatorCount--;
        }
    }

}

module.exports.Room.prototype.generateGameId = function() {
    return "" + (++this.currGameId);
}

module.exports.Room.prototype.setHost = function(host) {
    this.host = host;
    host.setRole(Roles.HOST);
}

module.exports.Room.prototype.joinRoom = function(client) {
    this.clients[client.id] = client;
    client.socket.join(this.roomId);

    // Set client's role unless they're the host
    if (client.role === Roles.HOST) {
        this.playerCount++;
    }
    else if (this.playerCount < MAX_PLAYERS_PER_ROOM) {
        client.setRole(Roles.PLAYER);
        this.playerCount++;
    }
    else {
        client.setRole(Roles.SPECTATOR);
        this.spectatorCount++;
    }

    console.log('Added client to room : ', client.name + " (" + client.role + ")");

    //Add event callbacks
    let room = this;
    room.clientEventCallbacks[client.id] = {};
    ROOM_EVENTS.forEach(function(event) {
        let callback = function(socket, data) {
            console.log("calling : ", event, " for client " + client.name);
            room[event](client.socket, data);
        }
        client.socket.on(event, callback);
        room.clientEventCallbacks[client.id][event] = callback;
    });
}

module.exports.Room.prototype.leaveRoom = function(client) {
    //TO DO: Check if host
    let room = this;

    ROOM_EVENTS.forEach(function(event) {
        client.socket.removeListener(event, room.clientEventCallbacks[client.id][event]);
    })

    if (client.role === Roles.PLAYER) {
        this.playerCount--;
    }
    else if(client.role === Roles.SPECTATOR) {
        this.spectatorCount--;
    }
    client.setRole(Roles.NONE);
    client.socket.leave(this.roomId);
    delete room.clientEventCallbacks[client.id]
    delete room.clients[client.id];
}

module.exports.Room.prototype.init = function(host, id) {
    console.log("Initializing room with id : ", id);
    this.setHost(host);
    this.roomId = id;
    this.joinRoom(host);
}

module.exports.Room.prototype.getFrontendFormat = function() {
    return {
        id: this.roomId,
        playerCount: this.playerCount,
        spectatorCount: this.spectatorCount,
        host: this.host.name,
    }
}