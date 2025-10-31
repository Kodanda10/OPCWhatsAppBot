// This file now acts as a simple IndexedDB key-value store wrapper.
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'whatsapp-channel-db';
const STORE_NAME = 'app-data';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDbPromise(): Promise<IDBPDatabase> {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
        });
    }
    return dbPromise;
}

/**
 * Gets a value from the IndexedDB store.
 * @param key The key of the item to retrieve.
 * @returns The stored value, or undefined if not found.
 */
export async function get<T>(key: string): Promise<T | undefined> {
    try {
        const db = await getDbPromise();
        return await db.get(STORE_NAME, key);
    } catch (error) {
        console.error(`Failed to get data for key "${key}" from IndexedDB:`, error);
        return undefined;
    }
}

/**
 * Sets a value in the IndexedDB store.
 * @param key The key of the item to set.
 * @param value The value to store.
 */
export async function set(key: string, value: any): Promise<void> {
    try {
        const db = await getDbPromise();
        await db.put(STORE_NAME, value, key);
    } catch (error) {
        console.error(`Failed to set data for key "${key}" in IndexedDB:`, error);
    }
}

// NOTE: The usePersistentState hook has been removed and replaced by these IndexedDB utilities.
