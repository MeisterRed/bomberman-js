var setRules = function() {
    socket.emit('set rules');
}

var startGame = function() {
    socket.emit('start game');
}

var leaveRoom = function() {
    socket.emit('leave room');
}

var sendChat = function() {
    socket.emit('chat')
}