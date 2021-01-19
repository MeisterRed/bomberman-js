const {Solver} = require('./Solver');
const {CollisionDetector} = require('./CollisionDetector');
const {PhysicsEntity, EntityType} = require('./PhysicsEntity');

/**
 * 
 * @param {string[]} playerIds 
 */
var Engine = function(playerIds) {
    this.playerIds      = playerIds;
    this.players        = {};   // the map between playerIds and player entities 
    this.collidables    = [];   // the collidable entities
    this.entities       = [];   // all movable entities    
    this.solver         = new Solver();
    this.collider       = new CollisionDetector();   // computes collisions 
    
    // Make the player entities
    var playerId;
    for(let i = 0, length = playerIds.length; i < length; i++) {
        playerId = playerIds[i];
        this.players[playerId] = new PhysicsEntity();
        this.players[playerId].setPos(
            i < 2       ?   0 : 200, 
            i%2 == 0    ?   0 : 200
        );
    }

    // Make some blocks
    var rand = 1;
    for(var rand = 1; rand > 0.2; rand = Math.random()) {
        let collidable = new PhysicsEntity();
        collidable.setPos(Math.random() * 800, Math.random() * 600);
        this.collidables.push(collidable);
    }

    // Make 2 specific blocks beside eachother
    // for(var i = 0; i < 10; i++) {
    //     let collidable = new PhysicsEntity();
    //     collidable.setPos(300 + i*20, 300);
    //     this.collidables.push(collidable);
    // }

    // Add all movable entities into entities
    for(let i = 0, length = playerIds.length; i < length; i++) {
        playerId = playerIds[i];
        this.entities.push(this.players[playerId]);
    }
    // TODO : add bombs, powerups, all other moving entities

    // console.log("PLAYERS : ", this.players);
    // console.log("COLLIDABLES : ", this.collidables);
    // console.log("STATE : ", this.getState());
}

Engine.prototype.step = function() {
    var entity;
    var entities = this.entities;

    // Update position / velocity on all movable entities
    for (var i = 0, length = entities.length; i < length; i++) {
        entity = entities[i];
        switch (entity.type) {
            case EntityType.KINEMATIC:
                entity.vx += entity.ax;
                entity.vy += entity.ay;
                entity.x  += entity.vx;
                entity.y  += entity.vy;
                break;
            default:
                break;
        }
    }

    for (var i = 0, length = this.playerIds.length; i < length; i++) {
        let player = this.players[this.playerIds[i]];
        let collisions = this.collider.detectCollisions(player, this.collidables);
        if (collisions) {
            this.solver.resolve(player, collisions);
        }
    }
};

Engine.prototype.setPlayerVelocity = function(playerId, vx, vy) {
    var player = this.players[playerId];
    player.vx = vx;
    player.vy = vy;
}

Engine.prototype.getState = function() {
    return {
        players: this.players,
        blocks: this.collidables
    }
}

module.exports.Engine = Engine;