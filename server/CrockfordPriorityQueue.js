/**
 *  A rewrite of original messy "PriorityQueue" using the Crockford style 
 *  (i.e. no "prototype"; using "Object.create()" instead of "new"; 
 *   using "power constructors")
 */

var crockfordUtils = (function() {
        function createClass(inherit, init, methods) {
                // utility function taken from one of Crockford's keynotes
                var fn;
                var proto = Object.create(inherit && inherit.prototype);

                if (typeof methods == 'object' && methods) {
                        methods.keys().forEach(function(key) {
                                proto[key] = methods[key];
                        });
                }

                fn = function() {
                        var self = Object.create(inherit);
                        if (typeof init == 'function') {
                                init.apply(self, arguments);
                        }
                        return self;
                };
                
                fn.prototype = proto;
                proto.constructor = fn;
                return fn;
        }

        /**
         * An automated version of Crockford's "Power Constructor" pattern
         * @param params: the parameters the constructor needs to privately store
         * @param methods: the public methods exposed to the world 
         * @param parent: the parent of the object 
         */
        function createPowerConstructor(params, methods, parent) {
                var clone = Object.create;   // easier to see the prototypal inheritance pattern in action
                var inherited = parent.inherited || {};     // inherited privates shared along the prototype chain
                
                return (function (privates, inherited) {
                        privates = clone(privates);
                        var myMethods = {};
                        if (typeof methods == 'object' && methods) {
                                methods.keys().forEach(function(key) {
                                        myMethods[key] = methods[key];
                                });
                        }

                        return myMethods;
                }(params, inherited));
        }

        return {
                construct: createClass,
                createPowerConstructor: createPowerConstructor,
        };
}());



function createPQ(params, inherited) {
        params = params || {};
        inherited = inherited || {};
        
        inherited.compare = function(a, b) {
                if(typeof a.priority != 'undefined' && typeof b.priority != 'undefined') {
                        if (a.priority < b.priority)
                                return -1;
                        if (a.priority > b.priority)
                                return 1;
                }
                return params.compare(a.element, b.element);
        };
        inherited.packageElement = function(element, priority) {
                var obj = {};
                obj.element = element;
                obj.priority = priority;
                return obj;
        };

        return {
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
        };
}

/**
 * DESCRIPTION: Implements priority queue as sorted array
 * INHERITS: Abstract
 * PARAMETERS: comparator (function):
                Compares 2 objects and returns:
                1 if the first object is greater than the second;
                -1 if the first object is lesser than the second;
                0 if both objects are equal
 */
function createPQArray(params, inherited) {
        inherited = {};
        var privates = Object.create(params);
        var self = createPQ(params, inherited);
        
        /**
         * DESCRIPTION: A modified binary search algorithm extended to give all search results.
         * PARAMETERS: A single element to find.
         * RETURNS: One of the following:
                1.	Returns array containing upper and lower bounds of hits.
                2.	Returns array with one element if bounds are the same.
                3.	Returns 'undefined' if miss.
        */
        privates.search = function(key) {
                // [ 0, 0, 1, 2, 3, 4, 4, 4, 4, 5 ]
                var stage = function(key, start, end, callback) {
                        while (start <= end) {
                                var middle = Math.floor((end + start) / 2);
                                if (this.compare(key, privates.elements[middle]) === 0) {
                                        if (!callback)
                                                return middle;
                                        // deal with custom logic (inside callback)
                                        var ret = callback(middle);
                                        if (ret > 0)
                                                start = middle + 1;
                                        else if (ret < 0)
                                                end = middle - 1;
                                        else
                                                return ret;
                                }
                                else {
                                        if (this.compare(key, privates.elements[middle]) > 0)
                                                start = middle + 1;
                                        else
                                                end = middle - 1;
                                }
                        }
                        return undefined;
                };

                var isLeftBoundary = function(index) {
                        return (index === 0 || this.compare(key, privates.elements[index - 1]) !== 0);
                };
                var isRightBoundary = function(index) {
                        return (index === privates.elements.length - 1 ||
                                this.compare(key, privates.elements[index + 1]) !== 0);
                };


                // stage 1: find general vicinity
                var middle = stage(key, 0, privates.elements.length - 1);
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
                var end = stage(key, middle, privates.elements.length - 1, function(i) {
                        if (isRightBoundary(i))
                                return 0;
                        else
                                return 1;
                });

                return [start, end];
        };

        privates.sort = function() {
                privates.elements.sort(inherited.compare);
        };

        self.add = function(element, priority) {
                var packaged = this._packageElement();
                privates.elements.push(packaged);
                privates.sort();
        };

        self.remove = function(element) {
                var found = privates.search(element);
                var len = (found.length === 1 ? 1 : found[1] - found[0] + 1);
                var removed = privates.elements.slice(found, len);
                if (found !== undefined)
                        privates.elements.splice(found, len);

                return removed;
        };

        self.getTop = function() {
                return privates.elements[0];
        };

        self.get = function(key) {
                var hits = privates.search(key);
                if (hits === undefined)
                        return undefined;

                var arr = [];
                for (let i = hits[0]; i < hits[hits.length - 1]; i++) {
                        arr.push(privates.elements[i]);
                }

                return arr;
        };

        self.toString = function() {
                var str = "{";
                for (let i = 0; i < privates.elements.length; i++) {
                        str += "{element: " + e.element + ", priority: " + e.priority + "}";
                        if (i !== privates.elements.length - 1)
                                str += ", "
                }
                str += "}"
                return str;
        };

        self.size = (function() {
                return privates.elements.length;
        }());
        
        return self;
}

function createPQHeap() {
        // TODO
}