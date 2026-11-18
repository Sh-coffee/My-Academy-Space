const CACHE='academic-space-v2-2';
const BASE=new URL('./',self.registration.scope);
const ASSETS=[new URL('./',BASE).href,new URL('books.json',BASE).href,new URL('manifest.webmanifest',BASE).href];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>{if(e.request.method==='GET'&&new URL(e.request.url).origin===location.origin)e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{const copy=x.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return x}).catch(()=>caches.match(new URL('./',BASE).href))))});
