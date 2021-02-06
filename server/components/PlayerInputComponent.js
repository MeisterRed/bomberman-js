// Control enum
const CONTROLS = Object.freeze({
    LEFT:   0,
    RIGHT:  1,
    DOWN:   2,
    UP:     3,
    BOMB:   4,
    KICK:   5
})
const NUM_CONTROLS = Object.keys(CONTROLS).length

module.exports.PlayerInputComponent = function() {
    this.actions = {}       // BitMap between controls and whether they're active
    for (let i = 0; i < NUM_CONTROLS; i++) {
        this.actions[i] = false;
    }
}

/**
 * Updates internal action state
 * @param {string} actions each position represents an action; 0 for inactive, or 1 for active
 */
module.exports.PlayerInputComponent.prototype.processInput = function(input) {
    // validate input
    if (input.length != NUM_CONTROLS) return;
    
    // set actions according to input
    for (let i = 0; i < NUM_CONTROLS; i++) {
        this.actions[i] = (input[i] === 0) ? false : true; 
    }
}

module.exports.PlayerInputComponent.prototype.getInputString = function() {
    let result = '';
    for (let i = 0; i < NUM_CONTROLS; i++) {
        result += this.actions[i] ? 1 : 0;
    }
    return result;
}

module.exports.PlayerInputComponent.prototype.update = function(playerState) {
    let vx = 0, vy = 0, tryBomb = false, tryKick = false;

    if (this.actions[CONTROLS.LEFT]) {
        vx = -playerState.peed;
    } 
    else if (this.actions[CONTROLS.RIGHT]) {
        vx = playerState.speed;
    }

    if (this.actions[CONTROLS.UP]) {
        vy = -playerState.speed;
    }
    else if (this.actions[CONTROLS.DOWN]) {
        vy = playerState.speed;
    }

    if (this.actions[CONTROLS.BOMB]) {
        tryBomb = true;
    }
    if (this.actions[CONTROLS.KICK]) {
        tryKick = true
    }

    playerState.vx = vx;
    playerState.vy = vy;
    playerState.tryBomb = tryBomb;
    playerState.tryKick = tryKick;
}