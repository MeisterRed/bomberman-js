const PLAYER_ACTIONS_PER_SECOND = 1000/60;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const CANVAS = document.getElementById('canvas');
const TILE_DIM = 32;

// TODO : Consider keyMap customization
const KEYMAP = {
    'a': 'left',
    'd': 'right',
    's': 'down',
    'w': 'up',
    'z': 'bomb',
    'x': 'kick'
}
