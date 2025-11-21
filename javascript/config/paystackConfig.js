/**
 * Paystack Configuration
 * Contains Paystack API keys for payment processing
 * 
 * This file is ignored by .gitignore to protect keys
 * DO NOT commit this file to version control!
 */

// Your Paystack public key (test or live)
const paystackPublicKey = 'pk_test_e9dbc9998e38056f05975341385af2167ec9b75a';

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
