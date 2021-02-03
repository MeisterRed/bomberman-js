/**
 *  A rewrite of original messy "PriorityQueue" using the Crockford style 
 *  (i.e. no "prototype"; using "Object.create()" instead of "new"; 
 *   using "power constructors")
 */

var crockfordUtils = (function() {
        function newConstructor(inherit, init, methods) {
                // utility function taken from one of Crockford's keynotes
                var fn, proto = Object.create(inherit && inherit.prototype);

                if (typeof methods == 'object' && methods) {
                        Object.keys(methods).forEach(function(key) {
                                proto[key] = methods[key];
                        });
                }

                fn = function() {
                        var that = Object.create(inherit);
                        if (typeof init == 'function') {
                                init.apply(self, arguments);
                        }
                        return that;
                };
                
                fn.prototype = proto;
                proto.constructor = fn;
                return fn;
        }

        /**
         * An automated version of Crockford's "Power Constructor" pattern
         * @param {object} params: the parameters the constructor needs to privately store
         * @param {object} methods: the public methods exposed to the world (API)
         * @param {function} parent: the constructor of parent object 
         */
        function createPowerConstructor(params, methods, parent) {
                // TODO
                var powerConstructor = function(params) {
                        var private = params || {};   // modified purposefully for children to use
                        var public = parent(private) || {};

                        Object.keys(methods).forEach(function(i) {
                                public[i] = methods[i];
                        });

                        return public;
                };

                return powerConstructor;
        }

        return {
                createConstructor: newConstructor,
                createPowerConstructor: createPowerConstructor,
        };
}());



function createAbstractPriorityList(params, private) {
        private = params || {};   // purposefully modified for childen to use
        var public = {};

        private.compare = function(a, b) {
                if (typeof a.priority === 'undefined' && typeof b.priority === 'undefined')
                        return 0;
                if (typeof b.priority === 'undefined' || a.priority < b.priority)
                        return -1;
                if (typeof a.priority === 'undefined' || a.priority > b.priority)
                        return 1;
                
                var tiebreaker = params.comparator(a.element, b.element);
                if (typeof tiebreaker === 'undefined')
                        return 0;
                if (typeof tiebreaker !== 'number')
                        throw new TypeError("Comparator must return an integer");
                
                return tiebreaker;
        };

        private.packageElement = function(element, priority) {
                var obj = {};
                obj.element = element;
                obj.priority = priority;
                return obj;
        };

        

        public.add = function(element, priority) {
                throw new Error("A priority list must implement the 'add' method");
        };

        public.remove = function(element) {
                throw new Error("A priority list must implement the 'remove' method");
        };

        public.getTop = function() {
                throw new Error("A priority list must implement the 'getTop' method");
        };

        public.get = function(key) {
                throw new Error("A priority list must implement the 'get' method");
        };

        public.setPriority = function(priority) {
                throw new Error("A priority list must implement the 'setPriority' method");
        }

        public.toString = function() {
                throw new Error("A priority list must implement the 'toString' method");
        };

        public.size = function() {
                throw new Error("A priority list must implement the 'size method");
        };

        return public;
}

/**
 * DESCRIPTION: Implements priority list as sorted array
 * INHERITS: Object returned from createPQ() factory function
 * PARAMETERS: Object containing parameters:
 *               comparator (function):
 *                               Compares 2 objects and returns:
 *                                1 if the first object is greater than the second;
 *                                -1 if the first object is lesser than the second;
 *                                0 if both objects are equal
 * 
 */
function createPriorityList(params, private) {
        private = params || {};
        var public = createPQ(params, private);
        
        /**
         * DESCRIPTION: A modified binary search algorithm extended to give all search results.
         * PARAMETERS: A single element to find.
         * RETURNS: One of the following:
                1.	Returns array containing upper and lower bounds of hits.
                2.	Returns array with one element if bounds are the same.
                3.	Returns 'undefined' if miss.
        */
        private.search = function(key) {
                // [ 0, 0, 1, 2, 3, 4, 4, 4, 4, 5 ]
                var stage = function(key, start, end, callback) {
                        while (start <= end) {
                                var middle = Math.floor((end + start) / 2);
                                if (private.compare(key, private.elements[middle]) === 0) {
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
                                        if (private.compare(key, private.elements[middle]) > 0)
                                                start = middle + 1;
                                        else
                                                end = middle - 1;
                                }
                        }
                        return undefined;
                };

                var isLeftBoundary = function(index) {
                        return (index === 0 || private.compare(key, private.elements[index - 1]) !== 0);
                };
                var isRightBoundary = function(index) {
                        return (index === private.elements.length - 1 ||
                                private.compare(key, private.elements[index + 1]) !== 0);
                };


                // stage 1: find general vicinity
                var middle = stage(key, 0, private.elements.length - 1);
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
                var end = stage(key, middle, private.elements.length-1, function(i) {
                        if (isRightBoundary(i))
                                return 0;
                        else
                                return 1;
                });

                return [start, end];
        };

        private.sort = function() {
                private.elements.sort(inherited.compare);
        };

        public.add = function(element, priority) {
                var packaged = private.packageElement();
                private.elements.push(packaged);
                private.sort();
        };

        public.remove = function(element) {
                var found = private.search(element);
                if (found === undefined)
                        return undefined;
                var removed = private.elements[found];
                private.elements.splice(found, 1);
                return removed;
        };

        public.removeAll = function(element) {
                var found = private.search(element);
                if (found === undefined)
                        return undefined;
                var len = (found.length === 1 ? 1 : found[1] - found[0] + 1);
                var removed = private.elements.slice(found, len);
                private.elements.splice(found, len);

                return removed;
        };

        public.getTop = function() {
                return private.elements[0];
        };

        public.get = function(key) {
                var hits = private.search(key);
                if (hits === undefined)
                        return undefined;

                var arr = [];
                for (let i = hits[0]; i < hits[hits.length - 1]; i++) {
                        arr.push(private.elements[i]);
                }

                return arr;
        };


        public.toString = function() {
                var str = "{";
                for (let i = 0; i < private.elements.length; i++) {
                        str += "{element: " + e.element + ", priority: " + e.priority + "}";
                        if (i !== private.elements.length - 1)
                                str += ", "
                }
                str += "}"
                return str;
        };

        public.size = (function() {
                return private.elements.length;
        }());
        
        return public;
}




function test() {
        function handleError(fn) {
                var result;
                try { 
                        result = fn(); 
                } catch(err) {
                        console.log("Error was caught: " + err.toString());
                }
                return result;
        }

        var abstract = createPQ();
        console.log("abstract: "+abstract);
        handleError(console.log("abstract.size: "+abstract.size));
        handleError(abstract.packageElement('1', 0));
} 

module.exports = { utils: crockfordUtils, 
                createAbstractPriorityList: createAbstractPriorityList,
                createPriorityList: createPriorityList,
                test: test,
                };