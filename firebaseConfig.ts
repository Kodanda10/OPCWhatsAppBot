// firebaseConfig.ts

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDBlAFzUrigOZInd52tPXJy8kkMzx0mIw0",
  authDomain: "opc-whatsapp-bot.firebaseapp.com",
  projectId: "opc-whatsapp-bot",
  storageBucket: "opc-whatsapp-bot.firebasestorage.app",
  messagingSenderId: "341402364775",
  appId: "1:341402364775:web:e3f1cbd0358674ccf79dc2",
  measurementId: "G-Y533LL1Q4V"
};

/**
 * A simple check to determine if the Firebase config has been populated.
 * The app will show a setup screen if this is false.
 */
export const isConfigured = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId);
