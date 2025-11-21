/**
 * Paystack Configuration Example
 * Copy this file to paystackConfig.js and add your actual Paystack keys
 * 
 * DO NOT commit paystackConfig.js to version control!
 * 
 * Test Key: Get from https://dashboard.paystack.com/#/settings/developer
 * Live Key: Only use after testing is complete
 */

// Your Paystack public key
// Test: pk_test_...
// Live: pk_live_...
const paystackPublicKey = 'YOUR_PAYSTACK_PUBLIC_KEY_HERE';

/**
 * Get Paystack public key
 * @returns {string} Paystack public key
 */
export function getPaystackKey() {
    if (!paystackPublicKey || paystackPublicKey === 'YOUR_PAYSTACK_PUBLIC_KEY_HERE') {
        console.error('Paystack public key is not configured. Please set it in paystackConfig.js');
        return null;
    }
    return paystackPublicKey;
}

export default paystackPublicKey;
