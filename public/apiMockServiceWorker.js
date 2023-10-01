self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (!url.pathname.startsWith("/api/")) {
    event.stopImmediatePropagation();
  }
});

importScripts("./mockServiceWorker.js");
