Simple Threading-Class for HTML5-complaint Javascript.

* Attention! The Browser needs to support Blob and URL: http://caniuse.com/bloburls
* Currently only works on Browser-side!

```javascript
var thread = new Thread(function(){
    self.onmessage = function(e){
        postMessage('worker : ' + e.data);
    };
});
```