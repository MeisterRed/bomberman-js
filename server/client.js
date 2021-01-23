module.exports.Roles = Object.freeze({
    NONE:0,
    HOST:1,
    PLAYER:2,
    SPECTATOR:3
})

module.exports.Client = function(socket) {
    this.socket = socket;
    this.name = '';
    this.id = socket.id;
    this.role = Roles.NONE;
}

module.exports.Client.prototype.setName = function(name) { 
    this.name = name; 
};
module.exports.Client.prototype.setRole = function(role) {
    this.role = role;
}