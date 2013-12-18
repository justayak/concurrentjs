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