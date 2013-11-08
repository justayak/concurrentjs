Simple Threading-Class for HTML5/Javascript.

* Attention! The Browser needs to support Blob and URL: http://caniuse.com/bloburls
* Currently only works on browser-side!

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

You can test, if threading is available by
```javascript
if (Thread.available){
    // Threading is available..
}else{
    // Threading is not available..
}
```