
/**
 * Max Priority Queue data structure
 * @param {function} comparator: compares two elements
 */
function PriorityQueue(comparator) {
        this._elements = [undefined];   // element [0] must be empty
        this._size = 0;
        if (typeof comparator !== 'function')
                throw new TypeError("Comparator must be a function");
        this._comparator = comparator;
};

PriorityQueue.prototype._packageElement = function(element, priority) {
        var obj = {};
        obj.priority = priority;
        obj.element = element;
        return obj;
};

PriorityQueue.prototype._compare = function(a, b) {
        var result;
        if (a.priority === undefined && b.priority === undefined)
                result = 0;
        else if (a.priority < b.priority || b.priority === undefined)
                result = -1;
        else if (a.priority > b.priority || a.priority === undefined)
                result = 1;
        else {
                var result = this._comparator(a, b);
                if (typeof result !== 'number')
                        throw new TypeError("Comparator callback return an integer");
        }
        return result;
};

PriorityQueue.prototype._findElement = function (element) {

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
};

PriorityQueue.prototype.add = function(element, priority) {
        var obj = this._packageElement(element, priority);
        this._elements[++this._size] = obj;
        this._swim(this._size);
};

PriorityQueue.prototype.remove = function(element) {
        var index = this._findElement(element);
        // TODO
};