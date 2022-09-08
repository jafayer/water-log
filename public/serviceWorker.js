// import workbox
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

// import dexie for db operations
importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.2/dexie.min.js"
);

console.log("STARTING SERVICE WORKER");

workbox.routing.registerRoute(
  workbox.routing.registerRoute(
    new RegExp("/.*"),
    new workbox.strategies.NetworkFirst()
  )
);

const db = new Dexie("WaterDB");

db.version(1).stores({
  events: "ts", // ts is an integer
});

self.addEventListener("message", async function (event) {
  console.log({ event });
  const { type } = event.data;
  if (type === "DRIP") {
    const ts = new Date().getTime();
    db.events.add({
      ts,
    });
    event.ports[0].postMessage({ ts });
  } else if (type === "DEL") {
    const midnight = new Date().setHours(0, 0, 0, 0);
    const toRemove = await db.events.where("ts").above(midnight).toArray();
    if (toRemove.length === 0) {
      return event.ports[0].postMessage({ toRemove: null });
    }
    const newToOld = toRemove.sort((a, b) => b.ts - a.ts);

    await db.events.delete(newToOld[0].ts);
    event.ports[0].postMessage({ toRemove });
  }
});
