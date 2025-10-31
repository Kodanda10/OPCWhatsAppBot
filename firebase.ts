import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, Storage } from 'firebase/storage';
import { firebaseConfig, isConfigured as isFirebaseConfigured } from './firebaseConfig';
import { BannerType, PostType, TabNode } from './types';

interface AppData {
    bannerData: BannerType;
    postsData: PostType[];
    tabsData: TabNode[];
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: Storage | null = null;
let firebaseError: Error | null = null;

// Initialize Firebase and services
try {
    // Fix: isFirebaseConfigured is a boolean constant, not a function.
    if (isFirebaseConfigured) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        storage = getStorage(app);
    }
} catch (e: any) {
    console.error("Firebase initialization failed:", e);
    firebaseError = e;
}

export { isFirebaseConfigured };

export const getFirebaseError = () => firebaseError;

/**
 * Tests the connection to Firebase services, specifically Firestore.
 * This helps diagnose setup issues like services not being enabled.
 */
export async function testFirebaseConnection(): Promise<{ success: boolean; error?: any }> {
    if (!db) {
        return { success: false, error: firebaseError || new Error("Firebase is not initialized.") };
    }
    try {
        // Attempt a simple read operation. We use the appData doc as a test.
        await getDoc(doc(db, 'channel-data', 'appData'));
        return { success: true };
    } catch (error: any) {
        console.error("Firebase connection test failed:", error);
        return { success: false, error };
    }
}

const DATA_DOC_REF = 'channel-data/appData';

/**
 * Fetches the entire application data object from Firestore.
 */
export async function getAppData(): Promise<AppData | null> {
    if (!db) throw new Error("Firestore is not initialized.");
    try {
        const docRef = doc(db, DATA_DOC_REF);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as AppData;
        }
        return null; // Document does not exist, e.g., on first run
    } catch (error) {
        console.error("Error getting app data from Firestore:", error);
        throw error; // Re-throw to be caught by the UI
    }
}

/**
 * Saves the entire application data object to Firestore.
 */
export async function setAppData(data: AppData): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized.");
    try {
        const docRef = doc(db, DATA_DOC_REF);
        await setDoc(docRef, data, { merge: true }); // Use merge to avoid overwriting fields unintentionally
    } catch (error) {
        console.error("Error setting app data in Firestore:", error);
        throw error;
    }
}

/**
 * Uploads a file (as a Base64 string) to Firebase Storage and returns the public URL.
 * @param base64String The Base64 encoded string of the file.
 * @param path The path in Firebase Storage where the file should be saved (e.g., 'images/profile.jpg').
 * @returns The downloadable URL of the uploaded file.
 */
export async function uploadFile(base64String: string, path: string): Promise<string> {
    if (!storage) throw new Error("Firebase Storage is not initialized.");
    try {
        const storageRef = ref(storage, path);
        // The 'data_url' string format is 'data:mime/type;base64,the-actual-base64-string'
        await uploadString(storageRef, base64String, 'data_url');
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error(`Error uploading file to ${path}:`, error);
        throw error;
    }
}