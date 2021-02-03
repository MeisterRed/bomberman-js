'use strict';

/**
 * Max Priority Queue data structure
 * @param {function} comparator: compares two elements
 */
function PriorityQueue(comparator) {
        var _self = this;
        _self._elements = [undefined];   // element [0] must always be empty
        _self._size = 0;
        if (typeof comparator !== 'function')
                throw new TypeError("Comparator must be a function");
        _self._comparator = comparator;

        return _self;
};

PriorityQueue.prototype._compare = function(a, b) {
        var result;
        if (a.priority === undefined && b.priority === undefined)
                result = 0;
        else if (a.priority < b.priority || a.priority === undefined)
                result = -1;
        else if (a.priority > b.priority || b.priority === undefined)
                result = 1;
        else {
                result = this._comparator(a.element, b.element);
                if (typeof result !== 'number')
                        throw new TypeError("Comparator callback return an integer");
        }
        return result;
};

PriorityQueue.prototype._sink = function(slot) {
        function swap(objA, objB) {
                var tmp = objA;
                objA = objB;
                objB = tmp;
        }

        var childSlot;
        while (slot <= this._size) {
                childSlot = slot*2;
                if (childSlot < this._size && 
                        this._compare(this._elements[childSlot].priority, 
                        this._elements[childSlot+1].priority) < 0) {
                        childSlot += 1;   // pick the larger child
                }
                if (this._compare(this._elements[slot], 
                        this._elements[childSlot]) >= 0) {
                        break;
                }
                swap(this._elements[slot], this._elements[childSlot]);
        }
        return slot;
};

PriorityQueue.prototype._swim = function(slot) {
        function swap(objA, objB) {
                var tmp = objA;
                objA = objB;
                objB = tmp;
        }

        const root = 1;
        var parentSlot;
        while (slot > root) {
                parentSlot = Math.floor(slot/2);
                if (this._compare(this._elements[slot].priority, 
                        this._elements[parentSlot].priority) <= 0) {
                        break;
                }
                swap(this._elements[slot], this._elements[childSlot]);
        }
        return slot;
};

PriorityQueue.prototype._isValidSlot = function(slot) {
        return (typeof slot === 'number' && slot > 0 && slot <= this._size);
};

PriorityQueue.prototype.find = function(element) {
        var match = undefined;
        var queue = [];
        var slot = 1;
        queue.push(this._elements[slot]);
        while (queue.length > 0) {
                // visit parent
                slot = queue.splice(0, 1);    // remove parent
                if (this._compare(this._elements[slot].element, element) === 0) {
                        match = this._elements[slot];
                        break;
                }
                // add children
                var childSlot = slot * 2;
                if (childSlot < this._size && this._elements[childSlot] !== undefined)
                        queue.push(this._elements[childSlot]);
                if (childSlot+1 < this._size && this._elements[childSlot+1] !== undefined)
                        queue.push(this._elements[childSlot + 1]);
        }
        return match;
};

PriorityQueue.prototype.add = function(element, priority) {
        var obj = {};
        obj.element = element;
        obj.priority = priority;
        this._elements[++this._size] = obj;
        obj.slot = this._swim(this._size);
        return obj;
};

PriorityQueue.prototype.remove = function(id) {
        id = id.slot;
        if (this._size < 1)
                return;
        if (!this._isValidSlot(id))
                throw new TypeError("'id' must be a valid handle");
        
        this._elements[id] = undefined;
        this._sink(id);
        this._size -= 1;
};

PriorityQueue.prototype.getMax = function() {
        return this.getElement(1);
};

PriorityQueue.prototype.getElement = function(id) {
        id = id.slot;
        if (!this._isValidSlot(id))
                return undefined;
        return this._elements[id].element;
};

PriorityQueue.prototype.changePriority = function(id, newPriority) {
        var obj = id;
        id = id.slot;
        if (!this._isValidSlot(id))
                throw new TypeError("'slot' must be a valid handle");
        
        var current = this._elements[id];
        if (newPriority > current.priority)
                obj.slot = this._swim(id);
        else if (newPriority < current.priority)
                obj.slot = this._sink(id);
};

PriorityQueue.prototype.isEmpty = function() {
        return (this._size === 0);
};
