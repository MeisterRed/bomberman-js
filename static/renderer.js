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
    for (var id in state) {
        var player = state[id];
        context.beginPath();
        context.arc(player.x, player.y, 10, 0 , 2 * Math.PI);
        context.fill();
    }
}