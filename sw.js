const CACHE_NAME = "studybuddy-shell-v1";

const APP_FILES = [
  "./index.html",
  "./css/styles.css",
  "./js/i18n.js",
  "./js/storage.js",
  "./js/onboarding.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

const APP_URLS = new Set(
  APP_FILES.map(function (path) {
    return new URL(path, self.registration.scope).href;
  })
);

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_FILES);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("fetch", function (event) {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  const appRoot = new URL("./", self.registration.scope).href;
  const indexURL = new URL("./index.html", self.registration.scope).href;

  const isAppNavigation =
    request.mode === "navigate" &&
    (url.href === appRoot || url.href === indexURL);

  if (isAppNavigation) {
    event.respondWith(
      fetch(request).catch(function () {
        return caches.open(CACHE_NAME).then(function (cache) {
          return cache.match(indexURL).then(function (cached) {
            return cached || Response.error();
          });
        });
      })
    );
    return;
  }

  if (!APP_URLS.has(url.href)) {
    return;
  }

  event.respondWith(
    fetch(request).catch(function () {
      return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (cached) {
          return cached || Response.error();
        });
      });
    })
  );
});
