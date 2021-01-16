/**
 *  This code is based off of the PhysicsEntity described in Mozilla's 2D JS Physics Engine tutorial
 *  https://developer.ibm.com/languages/javascript/tutorials/wa-build2dphysicsengine/
 */

// Enum to store CollisionTypes
const CollisionType = {
    // Displace collisions will force the collidee out of the collider, 
    // and set the collidee's velocity to 0. Displacement is completely inelastic.
    DISPLACE: 'displace'
}

// Enum to store EntityTypes
const EntityType = {
    // Kinematic entities maintain their mass/structure after a collision
    KINEMATIC: 'kinematic'
}

// This object maps the collisionTypes to the initialization method 
// an entity with the associated collisionType will need to execute
var Collision = {
    displace: function() {
        // nothing different to setup for displacement collision types
    }
}

/**
 * The physics entity will take on a shape, collision type
 * and entity type based on its parameters.
 * @param {number} width
 * @param {number} height
 * @param {CollisionType} collisionType
 * @param {EntityType} entityType 
 */
var PhysicsEntity = function(width, height, collisionType, entityType) {
    // Type represents the collision detector's handling
    this.type = entityType || EntityType.KINEMATIC;

    // Collision represents the type of collision another object will receive upon colliding
    this.collision = collisionType || CollisionType.DISPLACE;

    // Take in a width and height
    this.width  = width || 20;
    this.height = height || 20;

    // Store a half size for quicker calculations
    this.halfWidth = this.width * .5;
    this.halfHeight = this.height * .5;

    var collision = Collision[this.collision];
    collision.call(this);

    // Setup the positional data in 2D

    // Position
    this.x = 0;
    this.y = 0;

    // Velocity
    this.vx = 0;
    this.vy = 0;

    // Acceleration
    this.ax = 0;
    this.ay = 0;

    // Update the bounds of the object to recalculate
    // the half sizes and any other pieces
    this.updateBounds();
};

// Physics entity calculations
PhysicsEntity.prototype = {

    // Update bounds includes the rect's
    // boundary updates
    updateBounds: function() {
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;
    },

    // Getters for the mid point of the rect
    getMidX: function() {
        return this.halfWidth + this.x;
    },

    getMidY: function() {
        return this.halfHeight + this.y;
    },

    // Getters for the top, left, right, and bottom
    // of the rectangle
    getTop: function() {
        return this.y;
    },
    getLeft: function() {
        return this.x;
    },
    getRight: function() {
        return this.x + this.width;
    },
    getBottom: function() {
        return this.y + this.height;
    },

    setPos: function(x, y) {
        this.x = x;
        this.y = y;
    }
};


module.exports.PhysicsEntity = PhysicsEntity;
module.exports.CollisionType = CollisionType;
module.exports.EntityType = EntityType;