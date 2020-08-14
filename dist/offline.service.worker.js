

const CACHE_VERSION = "v1";

  
const BABYLON_BASE = "https://preview.babylonjs.com";
const BABYLON_SCRIPT = [
  "https://code.jquery.com/pep/0.4.2/pep.min.js",
  `${BABYLON_BASE}/ammo.js`,
  `${BABYLON_BASE}/cannon.js`,
  `${BABYLON_BASE}/Oimo.js`,
  `${BABYLON_BASE}/libktx.js`,
  `${BABYLON_BASE}/earcut.min.js`,
];
const BABYLON_MAIN_SCRIPT = `${BABYLON_BASE}/babylon.js`;
const BABYLON_DEPENDENT_SCRIPT = [
  `${BABYLON_BASE}/inspector/babylon.inspector.bundle.js`,
  `${BABYLON_BASE}/materialsLibrary/babylonjs.materials.min.js`,
  `${BABYLON_BASE}/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js`,
  `${BABYLON_BASE}/postProcessesLibrary/` +
      `babylonjs.postProcess.min.js`,
  `${BABYLON_BASE}/loaders/babylonjs.loaders.js`,
  `${BABYLON_BASE}/serializers/babylonjs.serializers.min.js`,
  `${BABYLON_BASE}/gui/babylon.gui.min.js`,
];


self.addEventListener("install", (e) => {
  console.log("service worker installing");


  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      cache.addAll([
        "https://cdnjs.cloudflare.com/" +
            "ajax/libs/dat-gui/0.6.2/dat.gui.min.js",
        ...BABYLON_SCRIPT,
        BABYLON_MAIN_SCRIPT,
        ...BABYLON_DEPENDENT_SCRIPT,
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
      caches.open(CACHE_VERSION).then(cache => {
        cache.put(e.request, res.clone());
      })
      return res;
    } catch(e){
      console.error(e);
    }
  })().catch(e => {
    console.error(e);
    return new Response("no content");
  }));
})

console.log("??");