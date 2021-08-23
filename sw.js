const CACHE_ELEMENTS = [
    "./",            //Esto es importante porque estamos cacheando la pag de inicio de nuestra aplicacion
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js"
]

const CACHE_NAME = "v2_cache_contador_react"

//self constante igual a un this

self.addEventListener("install", (e) => { //primer parte de vida de un sw va a cachear toda la informacion
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(CACHE_ELEMENTS).then(() => {
                self.skipWaiting()
            }).catch(console.log)
        })
    );
});

self.addEventListener("activate", (e) => { 
    const cacheWhiteList = [CACHE_NAME];
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map(cacheName => {
            return (
                cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName)
              )
            })
          )
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (e) => { //se va adisparar cada que abramos o actualizemos la pagina y retornara cache vieja o que este guardada
    e.respondWith(
        caches.match(e.request).then((res) => res ? res : fetch(e.request))
    )
});
