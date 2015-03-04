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