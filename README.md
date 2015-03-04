# Concurrentjs

## use

```javascript

if (Concurrent.hasMultithreading) {
    // when multithreading is available
}

var thread = new Concurrent.Thread(function(){
    onmessage = function(e) {
        var data = e.data;
        // .. do stuff..
        postMessage(data);
    }
});

thread.onmessage(function(data) {
    // do stuff with data
});

thread.onerror(function(error){
    // do stuff ..
});

thread.terminate();

thread.close();

```

## performance

### Simple object roundtrip (t1 -> t2 -> t1)

* Chrome, Acer Travelmate |P, #47-Ubuntu x86_64 GNU/Linux, i7-4500U, 8GB ==> ~o.45 ms
* Safari, iPad mini, ios8, Safari ==> ~1.2 ms (WHEN ACTIVE)
* Chrome, Nexus 5 ==> ~2.8ms (WHEN ACTIVE)

### Big object roundtrip (t1 -> t2 -> t1)
Roughly 20.000 objects in an array

* Chrome, Acer Travelmate |P, #47-Ubuntu x86_64 GNU/Linux, i7-4500U, 8GB ==> ~124 ms
* Safari, iPad mini, ios8, Safari ==> ~311 ms (WHEN ACTIVE)
* Chrome, Nexus 5 ==> ~738ms (WHEN ACTIVE)

### postMessage (Big complex object)

* Chrome, Acer Travelmate |P, #47-Ubuntu x86_64 GNU/Linux, i7-4500U, 8GB ==> ~49 ms
* Safari, iPad mini, ios8, Safari ==> ~90 ms (WHEN ACTIVE)
* Chrome, Nexus 5 ==> ~261ms (WHEN ACTIVE)

### postMessage (Binary Data, 10kb)

* Chrome, Acer Travelmate |P, #47-Ubuntu x86_64 GNU/Linux, i7-4500U, 8GB ==> ~0.1 ms
* Safari, iPad mini, ios8, Safari ==> ~0.5 ms (WHEN ACTIVE)
* Chrome, Nexus 5 ==> ~1.8ms (WHEN ACTIVE)

### postMessage (Binary Data, 1mb)

* Chrome, Acer Travelmate |P, #47-Ubuntu x86_64 GNU/Linux, i7-4500U, 8GB ==> ~3.5 ms
* Safari, iPad mini, ios8, Safari ==> ~5 ms (WHEN ACTIVE)
* Chrome, Nexus 5 ==> ~35ms (WHEN ACTIVE)