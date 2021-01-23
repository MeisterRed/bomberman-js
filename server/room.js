const { Socket } = require('socket.io')
const { Client, Roles } = require('./client');
const { Game } = require('./game');

const ROOM_EVENTS = ['set rules', 'start game', 'leave room', 'disconnect', 'chat']; 

//  The Room

module.exports.Room = function() {
    var room = this;
    this.roomId = "";
    this.clients = {};
    this.clientEventCallbacks = {};
    this.host = null;
    this.rules = [];
    this.chat = [];
    this.playerCount = 0;
    this.spectatorCount = 0;

    var PLAYERS_PER_ROOM = 4;
    var SPECTATORS_PER_ROOM = 20;

    // ======== ROOM EVENTS ======== //

    /**
     * Removes the client socket from the clients object and game queue
     * @param {Socket} socket Client socket
     */
    room['disconnect'] = function(socket) {
        // TODO : remove  client from the queue
        delete clients[socket.id];
    }

    room['set rules'] = function(socket) {
        
    }

    /**
     * Begins a game between the given player clients
     * @param {Client[]} players 
     */
    room['start game'] = function(socket) {
        if (this.clients.length > 1) {
            var gameId = generateGameId();
            this.clients.forEach(function (client) {
                client.socket.join(gameId);
            });
            games[gameId] = new Game(io, gameId, players);
        }
    }

    room['leave room'] = function(socket) {
        this.leaveRoom(this.client[socket.id]);
    }

    room['chat'] = function(socket) {
        
    }

    room['kick out'] = function(socket, data) {
        this.clients[data.id].emit("kicked out");
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
        else if (client.role === Roles.SPECTATOR && this.playerCount < PLAYERS_PER_ROOM) {
            client.role = Roles.PLAYER;
            this.playerCount++;
            this.spectatorCount--;
        }
    }

}

module.exports.Room.prototype.generateGameId = function() {
    return "" + (++currGameId);
}

module.exports.Room.prototype.setHost = function(host) {
    this.host = host;
    host.setRole(Roles.HOST);
}

module.exports.Room.prototype.joinRoom = function(client) {
    let room = this;
    this.clients[client.id] = client;
    client.socket.join(this.roomId);

    if (client.role === Roles.HOST) {
        //Do Nothing
    }
    else if (this.playerCount !== PLAYERS_PER_ROOM) {
        client.setRole(Roles.PLAYER);
        this.playerCount++;
    }
    else {
        client.setRole(Roles.SPECTATOR);
        this.spectatorCount++;
    }

    //Add event callbacks
    room.clientEventCallbacks[client.id] = {};
    ROOM_EVENTS.forEach(function(event) {
        let functionCallback = function(event) {
            room[event](client.socket, data);
        }
        client.socket.on(event, functionCallback);
        room.clientEventCallbacks[client.id][event] = functionCallback;
    })
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
    client.setRole(roles.NONE);
    client.socket.leave(this.roomId);
    delete room.clientEventCallbacks[client.id]
    delete clients[client.id];

    
}

module.exports.Room.prototype.init = function(host, id) {
    this.setHost(host);
    this.roomId = id;
    this.joinRoom(host);
}