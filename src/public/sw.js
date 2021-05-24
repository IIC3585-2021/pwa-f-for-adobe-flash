importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js");

const cacheName = 'PWA';
const toCache = [
  '/',
  '/index.ejs',
  '/manifest.json'
];

const firebaseConfig = {
  apiKey: "AIzaSyDZjf72IPar7wmZ-ff3_2b0RK32x1-7Mvw",
  authDomain: "pwa-f-for-adobe-flash.firebaseapp.com",
  projectId: "pwa-f-for-adobe-flash",
  storageBucket: "pwa-f-for-adobe-flash.appspot.com",
  messagingSenderId: "814318270480",
  appId: "1:814318270480:web:88ec52886ee297e98b3295",
  measurementId: "G-K7407ZFNEM"
};

// API push: Cuando firebase manda notificación
self.addEventListener("push", function (event) {
    /* Acá se podría hacer una consulta al backend con los detalles de
    la notificación */
    console.info("Event: Push");
    let title = "Bienvenido!";
    let body = {
      body: "Te has suscrito a las notificaciones",
      tag: "pwa",
      icon: "./images/icon-72x72.png",
    };
    event.waitUntil(self.registration.showNotification(title, body));
  });



// Cache all the files to make a PWA
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
    .then(cache => {
      // Our application only has two files here index.html and manifest.json
      // but you can add more such as style.css as your app grows
      return cache.addAll(toCache);
    })
    .catch(e => {
      console.log(e)
    })
  );
});

self.addEventListener('activate', function (event) {
  // clear cache when active
  // const cacheWhitelist = ['<%= name %>'];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        // if (cacheWhitelist.indexOf(key) === -1) {
        return caches.delete(key);
        // }
      }))
    )
  );
});

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});