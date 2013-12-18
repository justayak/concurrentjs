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