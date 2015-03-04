!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.Concurrent=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Julian on 3/4/15.
 */
"use strict";

var hasMultithreading = require('./hasMultithreading.js');

window.URL = window.URL || window.webkitURL;

/**
 * Converts a function into a string
 * @param threadFunction
 * @returns {String}
 */
function functionToString(threadFunction) {
    var temp = threadFunction.toString();
    //remove function parent
    var start = -1;
    for (var i = 0; i < temp.length; i++) {
        var c = temp.charAt(i);
        if (c === '{') {
            start = i;
            break;
        }
    }
    var end = -1;
    for (var i = temp.length; i > 0; i--) {
        var c = temp.charAt(i);
        if (c === '}') {
            end = i;
            break;
        }
    }
    temp = temp.substring(start + 1, end);
    return temp;
}

function Thread(threadFunction) {
    var functionIsAlreadyString = (typeof threadFunction === 'string');
    if (!functionIsAlreadyString && typeof threadFunction !== 'function') {
        throw "[concurrent.js] threadFunction must be a function!";
    }
    if (!functionIsAlreadyString) {
        threadFunction = functionToString(threadFunction);
    }

    var blob = new Blob([threadFunction], {
        type: 'application/javascript'
    });
    var worker = new Worker(URL.createObjectURL(blob));
    var self = this;

    this._onmessage = null;
    this._onerror = null;

    worker.onmessage = function (e) {
        if (self._onmessage !== null) {
            self._onmessage.call(self, e.data);
        }
    };

    worker.onerror = function (error) {
        if (self._onerror !== null) {
            self._onerror.call(self, error);
        } else {
            console.error("Threading error: ", error);
            throw new Error("Something went wrong!");
        }
    };

    this.worker = worker;
}

Thread.prototype.onmessage = function (callback) {
    this._onmessage = callback;
    return this;
};

Thread.prototype.onerror = function (callback) {
    this._onerror = callback;
};

Thread.prototype.postMessage = function (message) {
    this.worker.postMessage(message);
    return this;
};

Thread.prototype.terminate = function () {
    this.worker.terminate();
};

Thread.prototype.close = function () {
    this.worker.close();
};

if (hasMultithreading) {
    module.exports = Thread;
} else {
    module.exports = null;
}
},{"./hasMultithreading.js":2}],2:[function(require,module,exports){
/**
 * Created by Julian on 3/4/15.
 */
"use strict";

var isPossible = true;
if (typeof window.Worker === 'undefined') {
    console.error("[concurrent.js] Webworkers are not available but required!");
    isPossible = false;
}

window.URL = window.URL || window.webkitURL;

if (typeof window.Blob === 'undefined') {
    console.error("[concurrent.js] Blob required!");
    isPossible = false;
}

if (typeof window.URL === 'undefined') {
    console.error("[concurrent.js] URL required!");
    isPossible = false;
}

module.exports = isPossible;
},{}],3:[function(require,module,exports){
/**
 * This function will be executed in the main thread
 * Created by Julian on 3/4/15.
 */
"use strict";

var Thread = require('./Thread.js');
var hasMultithreading = require('./hasMultithreading.js');

module.exports = {
    Thread: Thread,
    hasMultithreading: hasMultithreading
};
},{"./Thread.js":1,"./hasMultithreading.js":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImxpYi9UaHJlYWQuanMiLCJsaWIvaGFzTXVsdGl0aHJlYWRpbmcuanMiLCJsaWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBKdWxpYW4gb24gMy80LzE1LlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGhhc011bHRpdGhyZWFkaW5nID0gcmVxdWlyZSgnLi9oYXNNdWx0aXRocmVhZGluZy5qcycpO1xuXG53aW5kb3cuVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgZnVuY3Rpb24gaW50byBhIHN0cmluZ1xuICogQHBhcmFtIHRocmVhZEZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBmdW5jdGlvblRvU3RyaW5nKHRocmVhZEZ1bmN0aW9uKSB7XG4gICAgdmFyIHRlbXAgPSB0aHJlYWRGdW5jdGlvbi50b1N0cmluZygpO1xuICAgIC8vcmVtb3ZlIGZ1bmN0aW9uIHBhcmVudFxuICAgIHZhciBzdGFydCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IHRlbXAuY2hhckF0KGkpO1xuICAgICAgICBpZiAoYyA9PT0gJ3snKSB7XG4gICAgICAgICAgICBzdGFydCA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgZW5kID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IHRlbXAubGVuZ3RoOyBpID4gMDsgaS0tKSB7XG4gICAgICAgIHZhciBjID0gdGVtcC5jaGFyQXQoaSk7XG4gICAgICAgIGlmIChjID09PSAnfScpIHtcbiAgICAgICAgICAgIGVuZCA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICB0ZW1wID0gdGVtcC5zdWJzdHJpbmcoc3RhcnQgKyAxLCBlbmQpO1xuICAgIHJldHVybiB0ZW1wO1xufVxuXG5mdW5jdGlvbiBUaHJlYWQodGhyZWFkRnVuY3Rpb24pIHtcbiAgICB2YXIgZnVuY3Rpb25Jc0FscmVhZHlTdHJpbmcgPSAodHlwZW9mIHRocmVhZEZ1bmN0aW9uID09PSAnc3RyaW5nJyk7XG4gICAgaWYgKCFmdW5jdGlvbklzQWxyZWFkeVN0cmluZyAmJiB0eXBlb2YgdGhyZWFkRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgXCJbY29uY3VycmVudC5qc10gdGhyZWFkRnVuY3Rpb24gbXVzdCBiZSBhIGZ1bmN0aW9uIVwiO1xuICAgIH1cbiAgICBpZiAoIWZ1bmN0aW9uSXNBbHJlYWR5U3RyaW5nKSB7XG4gICAgICAgIHRocmVhZEZ1bmN0aW9uID0gZnVuY3Rpb25Ub1N0cmluZyh0aHJlYWRGdW5jdGlvbik7XG4gICAgfVxuXG4gICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbdGhyZWFkRnVuY3Rpb25dLCB7XG4gICAgICAgIHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0J1xuICAgIH0pO1xuICAgIHZhciB3b3JrZXIgPSBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuX29ubWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5fb25lcnJvciA9IG51bGw7XG5cbiAgICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHNlbGYuX29ubWVzc2FnZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgc2VsZi5fb25tZXNzYWdlLmNhbGwoc2VsZiwgZS5kYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB3b3JrZXIub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBpZiAoc2VsZi5fb25lcnJvciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgc2VsZi5fb25lcnJvci5jYWxsKHNlbGYsIGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaHJlYWRpbmcgZXJyb3I6IFwiLCBlcnJvcik7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTb21ldGhpbmcgd2VudCB3cm9uZyFcIik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy53b3JrZXIgPSB3b3JrZXI7XG59XG5cblRocmVhZC5wcm90b3R5cGUub25tZXNzYWdlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25tZXNzYWdlID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5UaHJlYWQucHJvdG90eXBlLm9uZXJyb3IgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vbmVycm9yID0gY2FsbGJhY2s7XG59O1xuXG5UaHJlYWQucHJvdG90eXBlLnBvc3RNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cblRocmVhZC5wcm90b3R5cGUudGVybWluYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpO1xufTtcblxuVGhyZWFkLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLndvcmtlci5jbG9zZSgpO1xufTtcblxuaWYgKGhhc011bHRpdGhyZWFkaW5nKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBUaHJlYWQ7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gbnVsbDtcbn0iLCIvKipcbiAqIENyZWF0ZWQgYnkgSnVsaWFuIG9uIDMvNC8xNS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc1Bvc3NpYmxlID0gdHJ1ZTtcbmlmICh0eXBlb2Ygd2luZG93LldvcmtlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiW2NvbmN1cnJlbnQuanNdIFdlYndvcmtlcnMgYXJlIG5vdCBhdmFpbGFibGUgYnV0IHJlcXVpcmVkIVwiKTtcbiAgICBpc1Bvc3NpYmxlID0gZmFsc2U7XG59XG5cbndpbmRvdy5VUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XG5cbmlmICh0eXBlb2Ygd2luZG93LkJsb2IgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc29sZS5lcnJvcihcIltjb25jdXJyZW50LmpzXSBCbG9iIHJlcXVpcmVkIVwiKTtcbiAgICBpc1Bvc3NpYmxlID0gZmFsc2U7XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LlVSTCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiW2NvbmN1cnJlbnQuanNdIFVSTCByZXF1aXJlZCFcIik7XG4gICAgaXNQb3NzaWJsZSA9IGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUG9zc2libGU7IiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgZXhlY3V0ZWQgaW4gdGhlIG1haW4gdGhyZWFkXG4gKiBDcmVhdGVkIGJ5IEp1bGlhbiBvbiAzLzQvMTUuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgVGhyZWFkID0gcmVxdWlyZSgnLi9UaHJlYWQuanMnKTtcbnZhciBoYXNNdWx0aXRocmVhZGluZyA9IHJlcXVpcmUoJy4vaGFzTXVsdGl0aHJlYWRpbmcuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgVGhyZWFkOiBUaHJlYWQsXG4gICAgaGFzTXVsdGl0aHJlYWRpbmc6IGhhc011bHRpdGhyZWFkaW5nXG59OyJdfQ==
