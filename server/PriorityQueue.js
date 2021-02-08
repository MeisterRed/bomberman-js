'use strict';

const ROOT = 1;
function stringify(obj) {
        if (typeof obj === "object") {
                let keys = Object.keys(obj);
                let values = Object.values(obj);
                let str = "{ ";
                for (let i = 0; i < keys.length; i++) {
                        str += keys[i] + ": " + stringify(values[i]);
                        if (i !== keys.length-1)
                                str += ", "
                }
                str += " }"
                return str;
        }
        else 
                return obj + "";
}


/**
 * Max Priority Queue data structure
 * @param {function} comparator: compares two elements
 */
function PriorityQueue(comparator) {
        this._nodes = [undefined];   // element [0] must always be empty
        this._size = 0;
        if (typeof comparator !== "function")
                throw new TypeError("'comparator' must be a function");
        this._comparator = comparator;
        this._nodemap = new Map();     // consider: Map or WeakMap?

        return this;
};

PriorityQueue.prototype._compare = function(a, b) {
        function isUsable(obj) {
                return !(obj === undefined || obj.priority === undefined);
        }

        let result;
        if (!isUsable(a) && !isUsable(b))
                result = 0;
        else if (!isUsable(a) || a.priority < b.priority)
                result = -1;
        else if (!isUsable(b) || a.priority > b.priority)
                result = 1;
        else {
                result = this._comparator(a.element, b.element);
                if (typeof result !== "number")
                        throw new TypeError("'comparator' callback return an integer");
        }
        return result;
};

PriorityQueue.prototype._swap = function (slotA, slotB) {
        let tmp = this._nodes[slotA];
        this._nodes[slotA] = this._nodes[slotB];
        this._nodes[slotB] = tmp;

        if (this._nodes[slotA])
                this._nodes[slotA].slot = slotB;
        if (this._nodes[slotB])
                this._nodes[slotB].slot = slotA;
};

PriorityQueue.prototype._sink = function(slot) {
        let childSlot = slot*2;
        while (childSlot <= this._size) {
                let debug = `mySlot: [${slot}] ${stringify(this._nodes[slot])}        childSlot: [${childSlot}] ${stringify(this._nodes[childSlot])}`;

                // FIRST COND: if there is only one child, then there is no other child to pick from
                if (childSlot < this._size && this._compare(this._nodes[childSlot], this._nodes[childSlot+1]) < 0) {
                        childSlot += 1;   // pick the larger child
                }
                if (this._compare(this._nodes[slot], this._nodes[childSlot]) >= 0) {
                        console.log(debug);
                        break;
                }
                this._swap(slot, childSlot);
                debug += "        SWAPPED";
                console.log(debug);
                
                slot = childSlot;
                childSlot = slot*2;
        }
        return slot;
};

PriorityQueue.prototype._swim = function(slot) {
        let parentSlot = Math.floor(slot/2);
        while (slot > ROOT) {
                let debug = `parentSlot: [${parentSlot}] ${stringify(this._nodes[parentSlot])}        mySlot: [${slot}] ${stringify(this._nodes[slot])}`;
                
                if (this._compare(this._nodes[slot], this._nodes[parentSlot]) <= 0) {
                        console.log(debug);
                        break;
                }
                this._swap(slot, parentSlot);
                debug += "        SWAPPED";
                console.log(debug);

                slot = parentSlot;
                parentSlot = Math.floor(slot/2);
        }
        return slot;
};

PriorityQueue.prototype._isValidHandle = function(id) {
        let isValidSlot = (typeof id.slot === "number" && id.slot >= ROOT && id.slot <= this._size);
        return (id && isValidSlot);
};

PriorityQueue.prototype.findAll = function(element) {     // consider function to search for field within element 
        let match = [];
        let queue = [];
        queue.push(this._nodes[ROOT]);
        while (queue.length > 0) {
                // visit parent
                let parent = queue.splice(0, 1);
                if (parent.element === element) {
                        match.push(parent);
                }
                // add children
                let childSlot = parent.slot*2;
                if (childSlot < this._size) { 
                        if (this._nodes[childSlot] !== undefined)
                                queue.push(this._nodes[childSlot]);
                        if (this._nodes[childSlot+1] !== undefined)
                                queue.push(this._nodes[childSlot+1]);
                }
        }
        return match;
};

PriorityQueue.prototype.add = function(element, priority) {
        console.log("Request to add {", element, "} with priority", priority);
        
        const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;  // taken from MDN
        if (this._size === MAX_SAFE_INTEGER)
                throw new RangeError("Integer overflow");
        if (typeof priority !== "number")
                throw new TypeError("'priority' must be a number");

        if (this._nodemap.has(element))
                throw new Error("Element is already in the priority queue");

        let id = {element: element, priority: priority, slot: undefined};
        this._nodes[++this._size] = id;
        id.slot = this._swim(this._size);
        this._nodemap.set(element) = id;    
        
        console.log("PQ: " + stringify(this._nodes));
        return id;
};

PriorityQueue.prototype.remove = function(element) {
        let id = this._nodemap.get(element);

        console.log("Request to remove", id);
        if (!this._isValidHandle(id))
                throw new TypeError("'id' must be a valid handle");
        if (this._size < 1)
                return;

        // self-balancing upon remove
        this._nodes[id.slot] = this._nodes[this._size];
        this._nodes.pop();
        this._sink(id.slot);
        this._size -= 1;
        this._nodemap.delete(element);
};

PriorityQueue.prototype.getMax = function() {
        return this.getElement(this._nodes[ROOT]);
};

PriorityQueue.prototype.getElement = function(element) {
        return this._nodemap.get(element);
};

PriorityQueue.prototype.changePriority = function(element, newPriority) {
        if (typeof newPriority !== "number")
                throw new TypeError("'newPriority' must be a number");
        
        let id = this._nodemap.get(element);
        if (id === undefined)
                throw new TypeError("Element does not exist");

        let current = this._nodes[id.slot];
        current.priority = newPriority;
        if (newPriority > current.priority)
                this._swim(id.slot);
        else if (newPriority < current.priority)
                this._sink(id.slot);
};

PriorityQueue.prototype.isEmpty = function() {
        return (this._size === 0);
};

PriorityQueue.prototype.toString = function() {
        let str = "";
        // TODO
};


function pqtest() {
        function createObj(value){
                return {val: value};
        }

        let pq = new PriorityQueue(function(a,b) {return a.val - b.val});
        pq.add(createObj(5), 10);
        pq.add(createObj(10), 3);
        pq.add(createObj(20), 20);

}
pqtest();



module.exports = { PriorityQueue: PriorityQueue, pqtest: pqtest};
