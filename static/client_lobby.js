// Connect to server and inform of new player
const socket = io();
socket.emit('join lobby');

// Listen for lobby updates
var rooms = [];
socket.on('room data', function (room_data) {
    rooms = room_data;
});

var setName = function (name) {
    socket.emit('set name', name);
}

var quickplay = function () {
    socket.emit('quickplay');
}

var createRoom = function () {
    socket.emit('create room');
}

var joinRoom = function (roomId) {
    socket.emit('join room', roomId);
}

var seeRooms = function () {
    socket.emit('see rooms');
}

// TEST FN
var joinFirstRoom = function () {
    joinRoom(rooms[0].id);
}