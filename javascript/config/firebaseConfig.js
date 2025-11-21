/**
 * Firebase Configuration
 * Contains all Firebase setup and initialization
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyAUT5rt3wn78hct0n2sVqv1JNN-16pIUvg",
    authDomain: "lagc-5421c.firebaseapp.com",
    projectId: "lagc-5421c",
    storageBucket: "lagc-5421c.firebasestorage.app",
    messagingSenderId: "361163285674",
    appId: "1:361163285674:web:7e0f41b93151c05ca6dcd3",
    measurementId: "G-BJGZZQN4LB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
