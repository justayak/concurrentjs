Simple Threading-Class for HTML5/Javascript.

* Attention! The Browser needs to support Blob and URL: http://caniuse.com/bloburls
* Only works on browser-side
* For better backward compatibility you should consider using Thread.Simple instead of Thread (see down below)

```javascript
// create a new Thread
var thread = new Thread(function(){
    self.onmessage = function(e){
        postMessage('worker : ' + e.data);
    };
});

// receive messages from the thread:
thread.onmessage(function(m){
   console.log(m.data);

   // this.-context points to the thread-object
   this.postMessage("lol!");
});

// send messages to the thread:
thread.postMessage("hallo welt!");

// terminate a thread:
thread.terminate();

```

You can check if threading is available:
```javascript
if (Thread.available){
    // Threading is available..
}else{
    // Threading is not available..
}
```

With this code you can run pretty much any Code in another Thread, including infinity loops (while(true){..) without blocking your actual program. Keep in mind that the creation of a new Thread is very expensive so its usually a good idea to reuse old threads. Furthermore the Thread-class only works when Webworkers are available, otherwise an Exeption will be thrown.
For a better backward compatibility you should consider using Thread.Simple: These allow you to use Multithreading when available, otherwise they fall back to Singlethreading calls. They only come with some minor restrictions:
==> You can only write the
```javascript
self.onmessage = function(e){ ... }
```
method of the Webworker.
In short: The function you pass to the Thread.Simple will be the only function listening to the Webworkers onmessage-event!

```javascript
var simple = new Thread.Simple(function(e){
    postMessage('simple worker: ' + e.data);
});

simple.onmessage(function(m){
    console.log(m.data);
});

simple.postMessage("hello world");

```

If you want you can join multiple threads:
```javascript
var simple = new Thread.Simple(function(e){
    postMessage('simple worker: ' + e.data );
});

var simple2 = new Thread.Simple(function(e){
    postMessage('simple worker2: ' + e.data );
});

var simple3 = new Thread.Simple(function(e){
    postMessage('simple worker3: ' + e.data );
});

// the callback gets called when all threads replied. The variable results is an array
// of the result outputs in same order as the threads in the input array
Thread.join([simple,simple2, simple3],function(results){
    console.log(results); //
});

simple2.postMessage("hallo welt 2");
simple.postMessage("hallo welt");
simple3.postMessage("hallo welt 3");
```

#Performance
Without question creating a Thread and calling its methods comes with costs.
To give an idea consider following very basic code:
```javascript
var simple = new Thread.Simple(function(e){
    postMessage('simple worker: ' + e.data );
});

simple.onmessage(function(e){
    var after = Date.now();
    var diff = after - now; // actual difference
});

var now = Date.now();
simple.postMessage("hallo welt");
```
diff is the actual time in milliseconds that passed to get to that position:
* Windows 7 x64 - Intel Core 2 Duo E8500 @3.16GHz + 8GB RAM // Firefox Nightly (29.0a1 (2013-12-19)) ==> 16ms - 48ms | ~ 36ms
* iOS 7.0.4 - iPad Mini // Safari ==> 26ms - 98ms | ~ 53ms
* Android 4.1.2 - Samsung Galaxy S3 ==> 81ms - 114ms | ~ 110ms

For a real-world-problem you need to add costs for passing the parameters to the thread too (JSON.stringify and JSON.parse).

The instantiation of a Thread depends on the size (literally size, not complexity) of its given function. In the simple example the creation of the Thread takes.
* Windows 7 x64 - Intel Core 2 Duo E8500 @3.16GHz + 8GB RAM // Firefox Nightly (29.0a1 (2013-12-19)) ==> 0ms - 1ms | ~ 1ms
* iOS 7.0.4 - iPad Mini // Safari ==> 1ms - 5ms | ~ 1ms
* Android 4.1.2 - Samsung Galaxy S3 ==> 2ms - 9ms | ~ 5ms
time