Simple Threading-Class for HTML5-complaint Javascript.
Need Blob and URL: http://caniuse.com/bloburls

```Javascript
var thread = new Thread(function(){
    self.onmessage = function(e){
        postMessage('worker : ' + e.data);
    };
});
```