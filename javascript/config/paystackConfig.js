/**
 * Paystack Configuration
 * Contains Paystack API keys for payment processing
 * Keys are loaded from environment variables for security
 */

// Get Paystack public key from environment
// On Netlify, environment variables are injected as window.ENV
const paystackPublicKey = window.ENV?.VITE_PAYSTACK_PUBLIC_KEY || '';

/**
 * Get Paystack public key
 * @returns {string} Paystack public key
 */
export function getPaystackKey() {
    if (!paystackPublicKey) {
        console.error('Paystack public key is not configured');
        return null;
    }
    return paystackPublicKey;
}

export default paystackPublicKey;
