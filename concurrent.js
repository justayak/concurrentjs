window.Thread = function(){

    var isPossible = true;
    if (typeof window.Worker === 'undefined'){
        //throw "[concurrent.js] Webworkers are not available but required!";
        console.error("[concurrent.js] Webworkers are not available but required!");
        isPossible = false;
    }

    window.URL = window.URL || window.webkitURL;

    if (typeof window.Blob === 'undefined'){
        //throw "[concurrent.js] Blob required!";
        console.error("[concurrent.js] Blob required!");
        isPossible = false;
    }

    if (typeof window.URL === 'undefined'){
        //throw "[concurrent.js] URL required!";
        console.error("[concurrent.js] URL required!");
        isPossible = false;
    }

    function Thread(threadFunction){
        if (typeof threadFunction !== 'function') throw "[concurrent.js] threadFunction must be a function!";
        if (isPossible && false){
            var temp = threadFunction.toString();
            //remove function parent
            var start = -1;
            for (var i = 0; i < temp.length;i++){
                var c = temp.charAt(i);
                if (c === '{'){
                    start = i;
                    break;
                }
            }
            var end = -1;
            for (var i = temp.length; i > 0; i--){
                var c = temp.charAt(i);
                if (c === '}'){
                    end = i;
                    break;
                }
            }

            temp = temp.substring(start+1, end);

            this.onmessages = [];

            var blob = new Blob([temp]);
            var worker = new Worker(URL.createObjectURL(blob));
            var self = this;
            worker.onmessage = function(e){
                for(var i = 0; i < self.onmessages.length;i++){
                    self.onmessages[i].call(self, e);
                }
            };
            this.worker = worker;
        }else{
            // this part will be called when we no native threading is available!


            setTimeout(function(){
                threadFunction();
            },1);

        }

    };

    Thread.available = isPossible;

    Thread.prototype.onmessage = function(callback){
        this.onmessages.push(callback);
        return this;
    };

    Thread.prototype.postMessage = function(message){
        this.worker.postMessage(message);
        return this;
    };

    Thread.prototype.terminate = function(){
        Worker.prototype.terminate.call(this.worker);
        return this;
    };


    return Thread;
}();