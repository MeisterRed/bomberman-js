const {PhysicsEntity, CollisionType} = require('./PhysicsEntity');

var Solver = function() { }

Solver.prototype.resolve = function(player, collisions) {
    var entity;
    for (var i = 0, length = collisions.length; i < length; i++) {
        entity = collisions[i]
        switch(entity.collision) {
            case CollisionType.DISPLACE:
                this.resolveDisplacement(player, entity);
                break;
        }
    }
}

Solver.prototype.resolveDisplacement = function(player, entity) {
    // Find the mid points of the entity and player
    var pMidX = player.getMidX();
    var pMidY = player.getMidY();
    var aMidX = entity.getMidX();
    var aMidY = entity.getMidY();

    // To find the side of entry calculate based on
    // the normalized sides
    var dx = (aMidX - pMidX) / entity.halfWidth;
    var dy = (aMidY - pMidY) / entity.halfHeight;

    // Calculate the absolute change in x and y
    var absDX = Math.abs(dx);
    var absDY = Math.abs(dy);

    // TODO edge case
    /*
    if (abs(absDX - absDY) < .1) {

        // If the player is approaching from positive X
        if (dx < 0) {

            // Set the player x to the right side
            player.x = entity.getRight();

        // If the player is approaching from negative X
        } else {

            // Set the player x to the left side
            player.x = entity.getLeft() - player.width;
        }

        // If the player is approaching from positive Y
        if (dy < 0) {

            // Set the player y to the bottom
            player.y = entity.getBottom();

        // If the player is approaching from negative Y
        } else {

            // Set the player y to the top
            player.y = entity.getTop() - player.height;
        }

        // Randomly select a x/y direction to reflect velocity on
        if (Math.random() < .5) {

            // Reflect the velocity at a reduced rate
            player.vx = -player.vx * entity.restitution;

            // If the object's velocity is nearing 0, set it to 0
            // STICKY_THRESHOLD is set to .0004
            if (abs(player.vx) < STICKY_THRESHOLD) {
                player.vx = 0;
            }
        } else {

            player.vy = -player.vy * entity.restitution;
            if (abs(player.vy) < STICKY_THRESHOLD) {
                player.vy = 0;
            }
        }

    // If the object is approaching from the sides
    }
    */
    if (absDX > absDY) {
        // If the player is approaching from positive X
        if (dx < 0) {
            player.x = entity.getRight();
        } else {
        // If the player is approaching from negative X
            player.x = entity.getLeft() - player.width;
        }
        // Velocity component
        player.vx = 0;
    // If this collision is coming from the top or bottom more
    } else {
        // If the player is approaching from positive Y
        if (dy < 0) {
            player.y = entity.getBottom();
        } else {
        // If the player is approaching from negative Y
            player.y = entity.getTop() - player.height;
        }
        // Velocity component
        player.vy = 0;
    }
};

module.exports.Solver = Solver;