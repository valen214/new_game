



self.addEventListener("install", (e) => {
  console.log("service worker installing");
})

self.addEventListener("activate", (e) => {
  console.log("service worker activated");
})


self.addEventListener("fetch", async e => {
  console.log("service worker fetch");

  console.log("worker: fetch:", e.request.url);

  e.respondWith((async () => {
    try{
      let res = await caches.match(e.request);
      console.log(res, e.request);
      if(res) return res;

      res = await fetch(e.request);
      console.log(res);
      if(res.ok){
        return res;
      } else{
        console.log("resource not found");
        return null;
      }
    } catch(e){
      console.error(e);
    }
  })());
})

console.log("??");