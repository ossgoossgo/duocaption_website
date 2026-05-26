// src/shared/card-storage.ts
import type { SentenceCard } from "./card-types";
import { DEFAULT_REVIEW_SETTINGS, type ReviewSettings } from "./card-types";

const DB_NAME = "duo-caption-db";
const DB_VERSION = 1;
const CARDS_STORE = "cards";
const SETTINGS_STORE = "settings";

const REVIEW_SETTINGS_KEY = "review-settings";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CARDS_STORE)) {
        db.createObjectStore(CARDS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCards(): Promise<SentenceCard[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readonly");
    const store = tx.objectStore(CARDS_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      db.close();
      resolve(req.result as SentenceCard[]);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function saveCard(
  data: Omit<SentenceCard, "id" | "correctCount" | "streak" | "wrongCount" | "lastReviewAt" | "savedAt">,
): Promise<SentenceCard> {
  const card: SentenceCard = {
    ...data,
    id: crypto.randomUUID(),
    correctCount: 0,
    streak: 0,
    wrongCount: 0,
    lastReviewAt: "",
    savedAt: new Date().toISOString(),
  };
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readwrite");
    const store = tx.objectStore(CARDS_STORE);
    store.put(card);
    tx.oncomplete = () => {
      db.close();
      resolve(card);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function deleteCard(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readwrite");
    const store = tx.objectStore(CARDS_STORE);
    store.delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function deleteCardByOriginal(original: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readwrite");
    const store = tx.objectStore(CARDS_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const cards = req.result as SentenceCard[];
      for (const card of cards) {
        if (card.original === original) {
          store.delete(card.id);
        }
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function updateCard(card: SentenceCard): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CARDS_STORE, "readwrite");
    const store = tx.objectStore(CARDS_STORE);
    store.put(card);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getReviewSettings(): Promise<ReviewSettings> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SETTINGS_STORE, "readonly");
    const store = tx.objectStore(SETTINGS_STORE);
    const req = store.get(REVIEW_SETTINGS_KEY);
    req.onsuccess = () => {
      db.close();
      resolve({ ...DEFAULT_REVIEW_SETTINGS, ...(req.result as Partial<ReviewSettings>) });
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function saveReviewSettings(
  partial: Partial<ReviewSettings>,
): Promise<void> {
  const current = await getReviewSettings();
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SETTINGS_STORE, "readwrite");
    const store = tx.objectStore(SETTINGS_STORE);
    store.put({ ...current, ...partial }, REVIEW_SETTINGS_KEY);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}
