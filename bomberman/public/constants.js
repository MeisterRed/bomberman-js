const PLAYER_ACTIONS_PER_SECOND = 1000/10;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
var CANVAS = 0;
setTimeout(() => {
    CANVAS = document.getElementById('canvas');
}, 3000)
console.log(document.documentElement.innerHTML);
const TILE_DIM = 32;

// TODO : Consider keyMap customization
const KEYMAP = {
    'a': 1,     //LEFT
    'd': 2,     //RIGHT
    's': 3,     //DOWN
    'w': 4,     //UP
    'z': 5,     //BOMB
    'x': 6      //KICK
};