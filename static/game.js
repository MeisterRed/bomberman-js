var socket = io();
socket.on('message', function(data) {
    console.log(data);
});

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
      case 'a': // A 
        movement.left = true;
        break;
      case 'w': // W
        movement.up = true;
        break;
      case 'd': // D
        movement.right = true;
        break;
      case 's': // S
        movement.down = true;
        break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
      case 'a': // A
        movement.left = false;
        break;
      case 'w': // W
        movement.up = false;
        break;
      case 'd': // D
        movement.right = false;
        break;
      case 's': // S
        movement.down = false;
        break;
    }
  });

socket.emit('new player');
setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
    context.clearRect(0, 0, 800, 600);
    context.fillStyle = 'green';
    for (var id in players) {
        var player = players[id];
        context.beginPath();
        context.arc(player.x, player.y, 10, 0 , 2 * Math.PI);
        context.fill();
    }
});