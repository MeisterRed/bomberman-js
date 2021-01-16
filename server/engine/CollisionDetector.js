const { PhysicsEntity } = require('./PhysicsEntity');

/**
 * The CollisionDetector has methods to check for collisions between PhysicsEntities
 */
var CollisionDetector = function() { }

/**
 * Return a list of all collisions between the player and the list of collidable entities
 * @param {PhysicsEntity} player 
 * @param {PhysicsEntity[]} entities
 */
CollisionDetector.prototype.detectCollisions = function(player, entities) {
    let collisions = [];
    for (let i = 0, length = entities.length; i < length; i++) { 
        if (this.collideRect(player, entities[i])) {
            collisions.push(entities[i])
        }
    }
    return collisions;
}

/**
 * Return true if the hitboxes of the collider and collidee intersect
 * @param {PhysicsEntity} collider 
 * @param {PhysicsEntity} collidee 
 */
CollisionDetector.prototype.collideRect = function(collider, collidee) {
    // Store the collider and collidee edges
    var l1 = collider.getLeft();
    var t1 = collider.getTop();
    var r1 = collider.getRight();
    var b1 = collider.getBottom();

    var l2 = collidee.getLeft();
    var t2 = collidee.getTop();
    var r2 = collidee.getRight();
    var b2 = collidee.getBottom();

    // If the any of the edges are beyond any of the others, 
    // then we know that the box cannot be colliding
    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
        return false;
    }

    // If the algorithm made it here, it had to collide
    return true;
};

module.exports.CollisionDetector = CollisionDetector;