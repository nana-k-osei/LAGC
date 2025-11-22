/**
 * Paystack Configuration
 * Contains Paystack API keys for payment processing
 * Keys are loaded from Netlify Functions for security
 */

// Cache for config
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
            console.error('Error fetching Paystack config:', error);
            configPromise = null;
            throw error;
        });

    return configPromise;
}

/**
 * Get Paystack public key
 * @returns {Promise<string>} Paystack public key
 */
export async function getPaystackKey() {
    try {
        const config = await fetchConfig();
        if (!config.paystack?.publicKey) {
            console.error('Paystack public key is not configured');
            return null;
        }
        return config.paystack.publicKey;
    } catch (error) {
        console.error('Error getting Paystack key:', error);
        return null;
    }
}

export default { getPaystackKey };
