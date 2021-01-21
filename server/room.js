const { Socket } = require('socket.io')
const { Client } = require('./client');
const { Game } = require('./game');

//  The Room

module.exports.Room = function() {
    var room = this;
    this.roomId = "";
    this.clients = [];
    this.host = null;
    this.rules = [];
    this.chat = [];

    var PLAYERS_PER_ROOM = 4;
    var ROOM_EVENTS = ['set rules', 'start game', 'leave room', 'disconnect', 'chat']; 

    // ======== ROOM EVENTS ======== //
    /**
     * Joins the client to the room
     * @param {Socket} socket Client socket
     */
    room['join room'] = function(socket) {
        clients[socket.id] = new Client(socket);
    }

    /**
     * Removes the client socket from the clients object and game queue
     * @param {Socket} socket Client socket
     */
    room['disconnect'] = function(socket) {
        // TODO : remove  client from the queue
        delete clients[socket.id];
    }

    /**
     * 
     * @param {*} socket
     * @param {name: string} data the name to name the player
     */
    room['set name'] = function(socket, data) {
        clients[socket.id].name = data.name;
    }

    /**
     * Adds the client to the game queue
     * @param {Socket} socket Client socket
     */
    room['quickplay'] = function(socket) {
        queue.push(clients[socket.id]);
    }

}

module.exports.Room.prototype.setHost = function(host) {
    this.host = host;
}

module.exports.Room.prototype.init = function(host, id) {
    this.setHost(host);
    this.roomId = id;
    this.clients.push(host);
}