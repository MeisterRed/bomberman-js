'use strict';
/**
 *  MODULE: PriorityQueue
 */


function Abstract (comparator) {
	if (this.constructor === Abstract)    // abstract class pattern
		throw new TypeError("Cannot instantiate this class");

	if (typeof comparator != 'function')
		throw new TypeError("Comparator callback must be a function");
	if (comparator.length !== 2 || (typeof comparator()) != 'number')
		throw new Error("Comparator callback must have 2 parameters and return a number");

	// ========= private instance fields =========
	this._compare = comparator;
	this._elements = [];
};
Abstract.prototype = {
	// ======== interface =========
	add: function(element, priority) {
		throw new Error("A priority queue must implement the 'add' method");
	},

	remove: function(element) {
		throw new Error("A priority queue must implement the 'remove' method");
	},

	getTop: function() {
		throw new Error("A priority queue must implement the 'getTop' method");
	},

	get: function(key) {
		throw new Error("A priority queue must implement the 'get' method");
	},

	toString: function() {
		throw new Error("A priority queue must implement the 'toString' method");
	},

	// ========= bases ==========
	constructor: Abstract,  // mitigates 'this' weirdness

	compare: function(a, b) {
		if (typeof a.priority != 'undefined' && typeof b.priority != 'undefined') {
			if (a.priority < b.priority)
				return -1;
			if (a.priority > b.priority)
				return 1;
		}
		return constructor._compare(a.element,b.element);
	},

	// ======== private inherited ============
	_packageElement: function(element /* , priority */) {
		var obj = {};
		obj.element = element;
		obj.priority = arguments[1] || undefined;
		return obj;
	}
};



/**
 * DESCRIPTION: Implements priority queue as sorted array
 * INHERITS: Abstract
 * PARAMETERS: comparator (function):
  			Compares 2 objects and returns:
 			1 if the first object is greater than the second;
 			-1 if the first object is lesser than the second;
 			0 if both objects are equal
 */
function Array(comparator) {
	Abstract.call(this, comparator);

	var self = this;

	// ========= private functions =========
	function _sort() {
		return _elements.sort(this.compare);
	}

	/**
	 * DESCRIPTION: A modified binary search algorithm extended to give all search results.
	 * PARAMETERS: A single element to find.
	 * RETURNS: One of the following:
	 	    1.	Returns array containing upper and lower bounds of hits.
	 	    2.	Returns array with one element if bounds are the same.
		    3.	Returns 'undefined' if miss.
	*/
	function _search(key) {
		// [ 0, 0, 1, 2, 3, 4, 4, 4, 4, 5 ]
		var stage = function(key, start, end /* , callback */) {
			var callback = arguments[3];    // 'arguments' array is built-in

			while (start <= end) {
				var middle = Math.floor((end+start)/2);
				if (this.compare(key, _elements[middle]) === 0) {
					if (!callback)
						return middle;
					// deal with custom logic (inside callback)
					var ret = callback(middle);
					if (ret > 0)
						start = middle+1;
					else if (ret < 0)
						end = middle-1;
					else
						return ret;
				}
				else {
					if (this.compare(key, _elements[middle]) > 0)
						start = middle+1;
					else
						end = middle-1;
				}
			}
			return undefined;
		};

		var isLeftBoundary = function(index) {
			return (index === 0 || this.compare(key, _elements[index-1]) !== 0);
		};
		var isRightBoundary = function(index) {
			return (index === _elements.length-1 ||
				this.compare(key, _elements[index+1]) !== 0);
		};


		// stage 1: find general vicinity
		var middle = stage(key, 0, _elements.length-1);
		if (middle === undefined)
			return undefined;
		if (isLeftBoundary(middle) && isRightBoundary(middle))
			return [middle];

		// stage 2: find array boundaries (guarenteed)
		var start = stage(key, 0, middle, function(i) {
			if (isLeftBoundary(i))
				return 0;
			else
				return -1;
		});
		var end = stage(key, middle, _elements.length-1, function(i) {
			if (isRightBoundary(i))
				return 0;
			else
				return 1;
		});

		return [start, end];
	}


	// ========== public functions ============
	self.add = function(element, priority) {
		var packaged = this._packageElement();
		self._elements.push(packaged);
		_sort();
	}

	self.remove = function(element) {
		var found = _search(element);
		var len = (found.length === 1 ? 1 : found[1]-found[0]+1);
		var removed = _elements.slice(found, len);
		if (found !== undefined)
			_elements.splice(found, len);

		return removed;
	}

	self.getTop = function() {
		return _elements[0];
	}

	self.get = function(key) {
		var hits = search(key);
		if (hits === undefined)
			return undefined;

		var arr = [];
		for (let i = hits[0]; i < hits[hits.length-1]; i++) {
			arr.push(_elements[i]);
		}

		return arr;
	}

	self.toString = function() {
		var str = "{";
		for (let i = 0 ; i < _elements.length ; i++) {
			str += "{element: "+e.element+", priority: "+e.priority+"}";
			if (i !== _elements.length-1)
				str += ", "
		}
		str += "}"
		return str;
	}

	self.size = (function() {
		return _elements.length;
	})();
};
Array.prototype = Object.create(Abstract.prototype);
Array.prototype.constructor = Array;



/**
 * DESCRIPTION: Implements priority queue as heap
 * INHERITS: Abstract
 * PARAMETERS: comparator (function):
 			Compares 2 objects and returns:
			1 if the first object is greater than the second;
			-1 if the first object is lesser than the second;
			0 if both objects are equal
 */
function Heap(comparator) {
	Abstract.call(this, comparator);
	var _self = this;
	var _elements = [];
	// TODO
}
Heap.prototype = Object.create(Abstract.prototype);
Heap.prototype.constructor = Heap;



module.exports = { Abstract: Abstract, Array: Array, Heap: Heap };



