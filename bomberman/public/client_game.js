// Initiate controller and Renderer
var beginGame = function() {
    var controller = new window.Controller();
    var renderer = new window.Renderer();

    // Send player's actions 
    setInterval(function() {
        socket.emit('player actions', controller.activeControls);
    }, window.PLAYER_ACTIONS_PER_SECOND);

    // Receive and render game state from the server
    socket.on('state', function(state) {
        renderer.render(state);
    });
}
