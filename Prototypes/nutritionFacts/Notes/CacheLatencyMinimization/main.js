import { CacheManager } from './cacheManager.js';

const ACCESS_LOG_DB = 'CacheAccessLog';
const MAX_LOCALSTORAGE_ENTRIES = 100;

export async function set(key, value) {
  const now = Date.now();
  const stringValue = JSON.stringify(value);

  // Save to localStorage if there's space
  try {
    localStorage.setItem(key, stringValue);
  } catch (e) {
    console.warn('localStorage full, demoting to indexedDB');
    await setIndexedDB(key, stringValue);
  }

  await logAccess(key, now);
}

export async function get(key) {
  const now = Date.now();
  let value = localStorage.getItem(key);

  if (value != null) {
    await logAccess(key, now);
    return JSON.parse(value);
  }

  value = await getIndexedDB(key);
  if (value != null) {
    await logAccess(key, now);
    return JSON.parse(value);
  }

  value = await getCacheStorage(key);
  if (value != null) {
    await logAccess(key, now);
    return JSON.parse(value);
  }

  return null;
}

async function setIndexedDB(key, value) {
  const db = await openDB();
  const tx = db.transaction('store', 'readwrite');
  await tx.objectStore('store').put({ key, value, timestamp: Date.now() }, key);
  await tx.done;
}

async function getIndexedDB(key) {
  const db = await openDB();
  return (await db.get('store', key))?.value ?? null;
}

async function getCacheStorage(key) {
  const cache = await caches.open('cache-layer');
  const response = await cache.match(new Request(`/cache/${key}`));
  if (response) return await response.json();
  return null;
}

async function logAccess(key, timestamp) {
  const db = await openDB();
  const tx = db.transaction('accessLog', 'readwrite');
  await tx.objectStore('accessLog').put({ key, timestamp }, key);
  await tx.done;
}

async function openDB() {
  return await idb.openDB(ACCESS_LOG_DB, 1, {
    upgrade(db) {
      db.createObjectStore('store');
      db.createObjectStore('accessLog');
    }
  });
}

// Start background manager
CacheManager.start();

