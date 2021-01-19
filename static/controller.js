var Controller = function() {
    var self = this;

    // keep track of the current controls the user is pressing
    self.activeControls = 'x000000' // ignore pos 0

    // add eventListeners to update when actions are initiated or 
    document.addEventListener('keydown', function(event) {
        var action = KEYMAP[event.key];
        if (action) {
            self.activeControls = self.activeControls.substring(0, action) + '1' + self.activeControls.substring(action+1);
        }
    });

    document.addEventListener('keyup', function(event) {
        var action = KEYMAP[event.key];
        if (action) {
            self.activeControls = self.activeControls.substring(0, action) + '0' + self.activeControls.substring(action+1);
        }
    });
}