export const CacheManager = (() => {
  const DB_NAME = 'CacheAccessLog';
  const MAX_LOCAL_ENTRIES = 100;

  async function step() {
    const db = await openDB();
    const tx = db.transaction(['accessLog', 'store'], 'readwrite');
    const store = tx.objectStore('store');
    const log = tx.objectStore('accessLog');

    const allKeys = await log.getAllKeys();
    const timestamps = await Promise.all(allKeys.map(k => log.get(k)));
    const keyAccessPairs = allKeys.map((key, i) => [key, timestamps[i]?.timestamp ?? 0]);

    // Sort least recently used → most
    keyAccessPairs.sort((a, b) => a[1] - b[1]);

    if (keyAccessPairs.length > MAX_LOCAL_ENTRIES) {
      const demoteKeys = keyAccessPairs.slice(0, keyAccessPairs.length - MAX_LOCAL_ENTRIES);
      for (const [key] of demoteKeys) {
        // Move from localStorage to IndexedDB (if present)
        const val = localStorage.getItem(key);
        if (val) {
          await store.put({ key, value: val }, key);
          localStorage.removeItem(key);
        }

        // Cold demotion (to CacheStorage) — optional
        const data = await store.get(key);
        if (data?.value) {
          const cache = await caches.open('cache-layer');
          await cache.put(`/cache/${key}`, new Response(data.value, {
            headers: { 'Content-Type': 'application/json' }
          }));
          await store.delete(key);
        }
      }
    }

    await tx.done;
  }

  function schedule() {
    requestIdleCallback(async () => {
      try {
        await step();
      } catch (e) {
        console.warn('CacheManager error:', e);
      }
      schedule(); // Reschedule itself
    }, { timeout: 500 });
  }

  async function openDB() {
    return await idb.openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('store')) db.createObjectStore('store');
        if (!db.objectStoreNames.contains('accessLog')) db.createObjectStore('accessLog');
      }
    });
  }

  return {
    start: () => schedule()
  };
})();

