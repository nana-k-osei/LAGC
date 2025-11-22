/**
 * Firebase Configuration
 * Contains all Firebase setup and initialization
 * Keys are loaded from environment variables for security
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

// Load Firebase config from environment variables
// On Netlify, environment variables are injected as window.ENV
const firebaseConfig = {
    apiKey: window.ENV?.VITE_FIREBASE_API_KEY || '',
    authDomain: window.ENV?.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: window.ENV?.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: window.ENV?.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: window.ENV?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: window.ENV?.VITE_FIREBASE_APP_ID || '',
    measurementId: window.ENV?.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
