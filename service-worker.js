const CACHE='soratabi-v2';
const SHELL=['./','./index.html','./manifest.webmanifest','./assets/logo.png','./assets/hero.jpg','./assets/icon-192.png','./assets/icon-512.png','./assets/hotel1.jpg','./assets/hotel2.jpg','./assets/hotel3.jpg','./assets/attraction1.jpg','./assets/attraction2.jpg','./assets/attraction3.jpg','./assets/attraction4.jpg','./assets/attraction5.jpg','./assets/feature1.jpg','./assets/feature2.jpg','./assets/feature3.jpg','./data/places.json'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 const isFresh=req.mode==='navigate'||url.pathname.endsWith('/data/places.json');
 if(isFresh){
  event.respondWith(fetch(req).then(resp=>{if(resp.ok){const cp=resp.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return resp;}).catch(()=>caches.match(req)));
  return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(resp=>{if(resp.ok){const cp=resp.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return resp;})));
});
