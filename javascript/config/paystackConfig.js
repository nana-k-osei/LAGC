/**
 * Paystack Configuration
 * Contains Paystack API keys for payment processing
 * Keys are loaded from environment variables for security
 */

// Get Paystack public key from environment or use fallback
const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_e9dbc9998e38056f05975341385af2167ec9b75a';

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
