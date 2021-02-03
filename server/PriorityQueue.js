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

PriorityQueue.prototype._sink = function(index) {
        const me = this._elements[index];
        var childIndex;
        while (index <= this._size) {
                childIndex = index*2;
                if (childIndex < this._size && 
                        this._compare(this._elements[childIndex].priority, 
                        this._elements[childIndex+1].priority) < 0) {
                        childIndex += 1;   // pick the larger child
                }
                if (this._elements[childIndex].priority <= me.priority) {
                        break;
                }
                this._elements[childIndex] = me;
                index = childIndex;
        }
        this._elements[index] = me;
        return index;
};

PriorityQueue.prototype._swim = function(index) {
        const root = 1;
        const me = this._elements[index];
        var parentIndex;
        while (index > root) {
                parentIndex = Math.floor(index/2);
                if (this._compare(me.priority, 
                        this._elements[parentIndex].priority) <= 0) {
                        break;
                }
                this._elements[index] = this._elements[parentIndex];
                index = parentIndex;
        }
        this._elements[index] = me;
        return index;
};

PriorityQueue.prototype._isValidSlot = function(slot) {
        return (typeof slot === 'number' && slot > 0 && slot <= this._size);
};

PriorityQueue.prototype.find = function(element) {
        var match = undefined;
        var queue = [];
        var index = 1;
        queue.push(this._elements[index]);
        while (queue.length > 0) {
                // visit parent
                index = queue.splice(0, 1);    // remove parent
                if (this._compare(this._elements[index].element, element) === 0) {
                        match = index;
                        break;
                }
                // add children
                var childIndex = index * 2;
                if (childIndex < this._size && this._elements[childIndex] !== undefined)
                        queue.push(this._elements[childIndex]);
                if (childIndex+1 < this._size && this._elements[childIndex+1] !== undefined)
                        queue.push(this._elements[childIndex + 1]);
        }
        return match;
};

PriorityQueue.prototype.add = function(element, priority) {
        var obj = { element: element, priority: priority };
        this._elements[++this._size] = obj;
        var slot = this._swim(this._size);
        return slot;
};

PriorityQueue.prototype.remove = function(id) {
        if (this._size < 1)
                return;
        if (!this._isValidSlot(id))
                throw new TypeError("'id' must be a valid handle");
        
        this._elements[id] = undefined;
        this._size -= 1;        // CONSIDER: before or after _sink()?
        this._sink(id);
};

PriorityQueue.prototype.removeMax = function() {
        return this.remove(1);
};

PriorityQueue.prototype.getMax = function() {
        return this.getElement(1);
};

PriorityQueue.prototype.getElement = function(id) {
        if (this._isValidSlot(id))
                return this._elements[id].element;
        return undefined;
};

PriorityQueue.prototype.changePriority = function(id, newPriority) {
        if (!this._isValidSlot(id))
                throw new TypeError("'slot' must be a valid handle");
        
        var current = this._elements[id];
        if (newPriority > current.priority)
                id = this._swim(id);
        else if (newPriority < current.priority)
                id = this._sink(id);

        return id;
};

PriorityQueue.prototype.isEmpty = function() {
        return (this._size === 0);
};
