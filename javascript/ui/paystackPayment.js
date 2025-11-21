/**
 * Paystack Payment Integration
 * Handles payment processing with member discount verification
 */

import Authentication from './authentication.js';
import discountSystem from './discountSystem.js';

class PaystackPayment {
    constructor() {
        this.publicKey = 'pk_test_e9dbc9998e38056f05975341385af2167ec9b75a';
        this.loadPaystackScript();
    }

    /**
     * Load Paystack script
     */
    loadPaystackScript() {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        document.head.appendChild(script);
    }

    /**
     * Initialize payment with member discount verification
     */
    async initiatePayment(config) {
        // Verify member status before processing
        const isMember = Authentication.isUserMember();
        const user = Authentication.getCurrentUser();

        if (!user) {
            alert('Please sign in to complete checkout');
            window.location.href = '/pages/membership.html';
            return;
        }

        // Get discount
        const discount = discountSystem.getDiscount();
        const originalAmount = config.amount;
        const discountAmount = (originalAmount * discount) / 100;
        const finalAmount = originalAmount - discountAmount;

        // Prepare payment configuration
        const paymentConfig = {
            email: user.email,
            amount: Math.round(finalAmount * 100), // Paystack expects amount in kobo
            publicKey: this.publicKey,
            ref: this.generateReference(),
            onClose: function () {
                console.log('Payment window closed');
            },
            onSuccess: async (response) => {
                await this.handlePaymentSuccess(response, {
                    originalAmount,
                    discountAmount,
                    finalAmount,
                    userEmail: user.email,
                    userId: user.uid,
                    isMember,
                    discount,
                });
            },
        };

        // Add custom metadata
        paymentConfig.metadata = {
            custom_fields: [
                {
                    display_name: 'Member Discount',
                    variable_name: 'member_discount',
                    value: `${discount}%`,
                },
                {
                    display_name: 'Discount Amount',
                    variable_name: 'discount_amount',
                    value: `₦${discountAmount.toFixed(2)}`,
                },
                {
                    display_name: 'Original Amount',
                    variable_name: 'original_amount',
                    value: `₦${originalAmount.toFixed(2)}`,
                },
                {
                    display_name: 'Final Amount',
                    variable_name: 'final_amount',
                    value: `₦${finalAmount.toFixed(2)}`,
                },
            ],
        };

        // Add user-provided config
        Object.assign(paymentConfig, config);

        // Initialize Paystack
        this.openPaystack(paymentConfig);
    }

    /**
     * Open Paystack payment modal
     */
    openPaystack(config) {
        // Wait for Paystack script to load
        const checkPaystack = setInterval(() => {
            if (typeof PaystackPop !== 'undefined') {
                clearInterval(checkPaystack);
                const handler = PaystackPop.setup(config);
                handler.openIframe();
            }
        }, 100);
    }

    /**
     * Handle successful payment
     */
    async handlePaymentSuccess(response, paymentDetails) {
        console.log('Payment successful!', response);

        // Verify payment reference
        const verified = await this.verifyPayment(response.reference);

        if (verified) {
            // Save transaction to Firebase
            await this.saveTransaction(paymentDetails, response.reference);

            // Show success message
            alert(
                `Payment successful! Your order has been confirmed.\nReference: ${response.reference}`
            );

            // Redirect to order confirmation
            window.location.href = `/pages/order-confirmation.html?ref=${response.reference}`;
        } else {
            alert('Payment verification failed. Please contact support.');
        }
    }

    /**
     * Verify payment with Paystack backend
     */
    async verifyPayment(reference) {
        try {
            // In production, this would call your backend which verifies with Paystack
            // For now, we trust the client-side response (not recommended for production)
            console.log('Verifying payment reference:', reference);
            return true;
        } catch (error) {
            console.error('Payment verification error:', error);
            return false;
        }
    }

    /**
     * Save transaction to Firebase
     */
    async saveTransaction(paymentDetails, paystackReference) {
        // This would be implemented with Firebase Realtime Database
        // storing transaction history for auditing
        console.log('Saving transaction:', {
            ...paymentDetails,
            paystackReference,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Generate unique payment reference
     */
    generateReference() {
        return `LAGC_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    /**
     * Get payment summary for display
     */
    getPaymentSummary(cartTotal) {
        const discount = discountSystem.getDiscount();
        const discountAmount = (cartTotal * discount) / 100;
        const finalAmount = cartTotal - discountAmount;

        return {
            subtotal: cartTotal,
            discount: discount,
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            total: parseFloat(finalAmount.toFixed(2)),
            isMemberDiscount: discount > 0,
        };
    }

    /**
     * Format amount for display
     */
    formatAmount(amount) {
        return `₦${parseFloat(amount).toFixed(2)}`;
    }
}

export default new PaystackPayment();
