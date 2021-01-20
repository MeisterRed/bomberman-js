module.exports.Client = function(socket) {
    this.socket = socket;
    this.name = '';
    this.id = socket.id;
}

module.exports.Client.prototype.setName = function(name) { 
    this.name = name; 
};