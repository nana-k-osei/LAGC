/**
 * Firebase Configuration
 * Contains all Firebase setup and initialization
 * Keys are loaded from Netlify Functions for security
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

// Cache for config to avoid multiple fetches
let configCache = null;
let configPromise = null;

/**
 * Fetch configuration from Netlify Function
 */
async function fetchConfig() {
    if (configCache) {
        return configCache;
    }

    if (configPromise) {
        return configPromise;
    }

    configPromise = fetch('/.netlify/functions/get-config')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch config');
            }
            return response.json();
        })
        .then(data => {
            configCache = data;
            configPromise = null;
            return data;
        })
        .catch(error => {
            console.error('Error fetching config:', error);
            configPromise = null;
            throw error;
        });

    return configPromise;
}

// Initialize Firebase (will be set after config is fetched)
let app = null;
let auth = null;
let database = null;

/**
 * Initialize Firebase with config from Netlify Function
 */
async function initializeFirebase() {
    if (app) {
        return { app, auth, database };
    }

    const config = await fetchConfig();
    
    app = initializeApp(config.firebase);
    auth = getAuth(app);
    database = getDatabase(app);

    return { app, auth, database };
}

// Auto-initialize
const firebasePromise = initializeFirebase();

// Export a promise that resolves to initialized services
export { firebasePromise };

// Export getters that wait for initialization
export async function getAuthInstance() {
    await firebasePromise;
    return auth;
}

export async function getDatabaseInstance() {
    await firebasePromise;
    return database;
}

export async function getAppInstance() {
    await firebasePromise;
    return app;
}

// For backward compatibility - export direct references (but they'll be null initially)
export { auth, database, app as default };
