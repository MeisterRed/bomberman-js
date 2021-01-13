var Client = function(socket) {
    this.socket = socket;
    this.name = '';
    this.id = socket.id;
}

module.exports.Client = Client;