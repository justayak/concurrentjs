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

    isPossible = false;

    function Thread(threadFunction) {
        var functionIsAlreadyString = (typeof threadFunction === 'string');
        if (!functionIsAlreadyString && typeof threadFunction !== 'function') throw "[concurrent.js] threadFunction must be a function!";
        this.onmessages = [];
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
                for (var i = 0; i < self.onmessages.length; i++) {
                    self.onmessages[i].call(self, e);
                }
            };
            this.worker = worker;
        } else {
            throw "[concurrent.js] Real multithreading is not available. Cannot create Thread. Try 'new Thread.Simple(..)'";
        }

    };

    Thread.available = isPossible;

    Thread.prototype.onmessage = function (callback) {
        this.onmessages.push(callback);
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
            this.onmessages = [];
        }
    };

    if (!isPossible){
        // this is bad :(
        window.postMessage = function(e){
            console.log(e);
            console.log(this);
        };
    }

    Simple.prototype.onmessage = function (callback) {
        if (isPossible) {
            this._innerThread.onmessage(callback);
        } else {
            this.onmessages.push(callback);
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
                self._onMessage({data:message});
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