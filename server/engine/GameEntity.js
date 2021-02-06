module.exports.GameEntity = function (input, physics, graphics, clock, initialState) {
    // Components
    this.input      = input;
    this.graphics   = graphics;
    this.physics    = physics;
    this.clock      = clock;

    // Shared state between components
    this.state      = initialState;
}

module.exports.GameEntity.prototype.update = function(engine) {
    if (this.clock) {
        this.clock.update(this.state, engine);
    }
    if (this.input) {
        this.input.update(this.state);
    }
    if (this.physics) {
        this.physics.update(this.state, engine);
    }
    if (this.graphics) {
        this.graphics.update(this.state, engine);
    }
}