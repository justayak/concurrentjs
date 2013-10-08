window.Thread = function(){

    if (typeof window.Worker === 'undefined'){
        throw "[concurrent.js] Webworkers are not available but required!";
    }

    window.URL = window.URL || window.webkitURL;

    if (typeof window.Blob === 'undefined'){
        throw "[concurrent.js] Blob required!";
    }

    if (typeof window.URL === 'undefined'){
        throw "[concurrent.js] URL required!";
    }

    function Thread(threadFunction){
        if (typeof threadFunction !== 'function') throw "[concurrent.js] threadFunction must be a function!";
        var str = threadFunction.toString();
        //remove function parent
        var start = -1;
        for (var i = 0; i < str.length;i++){
            var char = str.charAt(i);
            if (char === '{'){
                start = i;
                break;
            }
        }
        var end = -1;
        for (var i = str.length; i > 0; i--){
            var char = str.charAt(i);
            if (char === '}'){
                end = i;
                break;
            }
        }

        str = str.substring(start+1, end);

        this.onmessages = [];

        var blob = new Blob([str]);
        var worker = new Worker(URL.createObjectURL(blob));
        var self = this;
        worker.onmessage = function(e){
            for(var i = 0; i < self.onmessages.length;i++){
                self.onmessages[i].call(self, e);
            }
        };
        this.worker = worker;
    };

    Thread.prototype.onmessage = function(callback){
        this.onmessages.push(callback);
    };

    Thread.prototype.postMessage = function(message){
        this.worker.postMessage(message);
    };

    Thread.prototype.terminate = function(){
        Worker.prototype.terminate.call(this.worker);
    };


    return Thread;
}();