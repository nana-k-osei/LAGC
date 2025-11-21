/**
 * Firebase Configuration
 * Contains all Firebase setup and initialization
 * Keys are loaded from environment variables for security
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

// Load Firebase config from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAUT5rt3wn78hct0n2sVqv1JNN-16pIUvg",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lagc-5421c.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lagc-5421c",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lagc-5421c.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "361163285674",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:361163285674:web:7e0f41b93151c05ca6dcd3",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BJGZZQN4LB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
