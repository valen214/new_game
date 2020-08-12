



self.addEventListener("install", (e) => {
  console.log("service worker installing");

  e.waitUntil(
    caches.open('v1').then(cache => {
      cache.addAll([
        "https://cdnjs.cloudflare.com/" +
            "ajax/libs/dat-gui/0.6.2/dat.gui.min.js",
        
      ])
    })
  );

})

self.addEventListener("activate", (e) => {
  console.log("service worker activated");
  e.waitUntil(clients.claim());
})


self.addEventListener("fetch", async e => {
  console.log('request:', e.request);
  e.respondWith((async () => {
    try{
      if(e.request.url === "https://scriptnotfound/a.js"){
        console.log("script not found redirect");
        return fetch("found.js");
      }


      let res = await caches.match(e.request);
      if(res) return res;

      res = await fetch(e.request.url).catch(async () => {
        return fetch(e.request);
      });
      if(!res.ok){
        switch(e.request.url){
        case "https://preview.babylonjs.com/babylon.js":
          res = await fetch("babylon.js");
          break;
        }
      }
      return res;
    } catch(e){
      console.error(e);
    }
  })());
})

console.log("??");