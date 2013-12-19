window.Thread = function () {

    var isPossible = true;
    if (typeof window.Worker === 'undefined') {
        //throw "[concurrent.js] Webworkers are not available but required!";
        console.error("[concurrent.js] Webworkers are not available but required!");
        isPossible = false;
    }

    window.URL = window.URL || window.webkitURL;

    if (typeof window.Blob === 'undefined') {
        //throw "[concurrent.js] Blob required!";
        console.error("[concurrent.js] Blob required!");
        isPossible = false;
    }

    if (typeof window.URL === 'undefined') {
        //throw "[concurrent.js] URL required!";
        console.error("[concurrent.js] URL required!");
        isPossible = false;
    }

    function Thread(threadFunction) {
        var functionIsAlreadyString = (typeof threadFunction === 'string');
        if (!functionIsAlreadyString && typeof threadFunction !== 'function') throw "[concurrent.js] threadFunction must be a function!";
        this.onmessages = null;
        if (isPossible) {
            if (functionIsAlreadyString) {
                var temp = threadFunction;
            } else {
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
            }

            var blob = new Blob([temp]);
            var worker = new Worker(URL.createObjectURL(blob));
            var self = this;
            worker.onmessage = function (e) {
                /*for (var i = 0; i < self.onmessages.length; i++) {
                    self.onmessages[i].call(self, e);
                }*/
                if (self.onmessages !== null)self.onmessages.call(self, e);
            };
            this.worker = worker;
        } else {
            throw "[concurrent.js] Real multithreading is not available. Cannot create Thread. Try 'new Thread.Simple(..)'";
        }
    };

    Thread.available = isPossible;

    Thread.prototype.onmessage = function (callback) {
        //this.onmessages.push(callback);
        this.onmessages = callback;
        return this;
    };

    Thread.prototype.postMessage = function (message) {
        this.worker.postMessage(message);
        return this;
    };

    Thread.prototype.terminate = function () {
        Worker.prototype.terminate.call(this.worker);
        return this;
    };

    function buildJoin(thread, i, results, callback){
        thread.onmessage(function(e){
            thread.onmessages = null; // cleanup listener
            results[i] = e;
            callback();
        });
    };

    Thread.join = function(threads, callback){
        if (typeof callback != 'function') throw "[concurrent.js] 2. Parameter must be a function";
        if (! (threads instanceof Array)) throw  "[concurrent.js] 1. Parameter must be an Array of Threads";

        var results = new Array(threads.length);
        var counter = threads.length ;
        for (var i = 0; i < threads.length; i++){
            buildJoin(threads[i], i, results, function(){
                counter -= 1;
                if (counter == 0){
                    callback(results);
                }
            });
        }
    };

    // === SIMPLE THREAD ===

    /**
     * @param onMessage {function}
     */
    function Simple (onMessage) {
        if (typeof onMessage !== 'function') throw "[concurrent.js] threadFunction must be a function!";
        if (isPossible) {
            var code = "self.onmessage=" + onMessage.toString();
            this._innerThread = new Thread(code);
        } else {
            this._onMessage = onMessage;
            this.onmessages = null;
        }
    };

    if (!isPossible){
        // this is bad :(
        window.__currentCtx = null;
        window.postMessage = function(e){
            if (__currentCtx === null) throw "[concurrent.js] Thread Error --> undetermined threading target!";
            /*for(var i = 0; i < __currentCtx.onmessages.length;i++){
                __currentCtx.onmessages[i].call(__currentCtx, {data:e});
            }*/
            if (self.onmessages !== null)__currentCtx.onmessages.call(__currentCtx,{data:e});
            __currentCtx = null;
        };
    }

    Simple.prototype.onmessage = function (callback) {
        if (isPossible) {
            this._innerThread.onmessage(callback);
        } else {
            //this.onmessages.push(callback);
            this.onmessages = callback;
        }
        return this;
    };

    Simple.prototype.postMessage = function (message) {
        if (isPossible) {
            this._innerThread.postMessage(message);
        } else {
            var self = this;
            setTimeout(function(){
                // async call
                __currentCtx = self;
                self._onMessage.call(self, {data:message});
            },1);
        }
        return this;
    };

    Simple.prototype.terminate = function () {
        if (isPossible) {
            this._innerThread.terminate();
        } else {

        }
        return this;
    };


    Thread.Simple = Simple;

    return Thread;
}();