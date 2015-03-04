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