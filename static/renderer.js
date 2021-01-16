var Renderer = function() {
    CANVAS.width = CANVAS_WIDTH;
    CANVAS.height = CANVAS_HEIGHT;
    this.context = canvas.getContext('2d');
}

// The main render function, which reads a game state and draws it into the canvas
Renderer.prototype.render = function(state) {
    var context = this.context;
    context.clearRect(0, 0, 800, 600);
    context.fillStyle = 'red';
    for (var id in state.players) {
        var player = state.players[id];
        context.beginPath();
        context.arc(player.x+10, player.y+10, 10, 0 , 2 * Math.PI);
        context.fill();
    }
    context.fillStyle = 'brown';
    for (var id in state.blocks) {
        var block = state.blocks[id];
        context.fillRect(block.x, block.y, 20, 20)
    }
}