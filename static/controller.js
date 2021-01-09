var Controller = function() {
    var self = this;

    // keep track of the current controls the user is pressing
    self.activeControls = {
        up: false,
        down: false,
        left: false,
        right: false,
        bomb: false,
        kick: false
    }

    // add eventListeners to update when actions are initiated or 
    document.addEventListener('keydown', function(event) {
        var action = KEYMAP[event.key];
        if (action) {
            self.activeControls[action] = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        var action = KEYMAP[event.key];
        if (action) {
            self.activeControls[action] = false;
        }
    })
}