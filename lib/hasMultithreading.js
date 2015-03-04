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