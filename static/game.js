// Connect to server and inform of new player
var socket = io();
socket.emit('connect');
//socket.emit('join game');

// Initiate controller and Renderer
var controller = new Controller();
var renderer = new Renderer();

// Send player's actions 
setInterval(function() {
    socket.emit('player actions', controller.activeControls);
}, PLAYER_ACTIONS_PER_SECOND);

// Receive and render game state from the server
socket.on('state', function(state) {
  renderer.render(state);
});