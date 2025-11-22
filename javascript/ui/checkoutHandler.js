/**
 * Checkout Handler Module
 * Handles the complete checkout flow with Paystack payment integration
 * Includes inventory validation and order creation
 */

import Authentication from "./authentication.js";
import discountSystem from "./discountSystem.js";
import inventoryManager from "./inventory.js";
import { database } from "../config/firebaseConfig.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.0/database.js";
import { getPaystackKey } from "../config/paystackConfig.js";

class CheckoutHandler {
    constructor() {
        this.paymentBtn = document.getElementById("payment-btn");
        this.checkoutItemsContainer = document.getElementById("checkout-items");
        this.checkoutSubtotal = document.getElementById("checkout-subtotal");
        this.checkoutShipping = document.getElementById("checkout-shipping");
        this.checkoutTax = document.getElementById("checkout-tax");
        this.checkoutTotal = document.getElementById("checkout-total");

        this.paystackPublicKey = null;
        this.cart = null;
        this.userEmail = null;
        this.isMember = false;
        this.memberDiscount = 0;

        this.init();
    }

    /**
     * Initialize checkout handler
     */
    async init() {
        // Load Paystack key
        this.paystackPublicKey = await getPaystackKey();

        try {
            // Wait for Authentication to be ready
            await Authentication.initPromise;

            // Set up callback for when user logs in/out
            const originalOnLogin = Authentication.onUserLoggedIn;
            Authentication.onUserLoggedIn = (user) => {
                if (originalOnLogin) originalOnLogin.call(Authentication, user);
                this.updateMemberStatus();
            };

            const originalOnLogout = Authentication.onUserLoggedOut;
            Authentication.onUserLoggedOut = () => {
                if (originalOnLogout) originalOnLogout.call(Authentication);
                this.updateMemberStatus();
            };

            // Get cart from localStorage
            this.cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (this.cart.length === 0) {
                console.warn("⚠️ Cart is empty");
                this.paymentBtn.disabled = true;
                this.paymentBtn.textContent = "Cart is Empty";
                return;
            }

            // Initial load - get current member status
            await this.updateMemberStatus();

            // Attach payment button listener
            this.paymentBtn.addEventListener("click", () => this.initiatePayment());

            console.log("✅ Checkout handler initialized");
        } catch (error) {
            console.error("❌ Error initializing checkout:", error);
        }
    }

    /**
     * Update member status and refresh display
     */
    async updateMemberStatus() {
        try {
            const currentUser = Authentication.currentUser;
            if (currentUser) {
                this.userEmail = currentUser.email;
                const memberData = await Authentication.checkMembershipStatus(currentUser.uid);
                if (memberData) {
                    this.isMember = true;
                    this.memberDiscount = await Authentication.getDiscount();
                    console.log(`✅ Member logged in: ${memberData.tier} tier, ${this.memberDiscount}% discount`);
                } else {
                    this.isMember = false;
                    this.memberDiscount = 0;
                }
            } else {
                this.isMember = false;
                this.memberDiscount = 0;
            }

            // Refresh display with updated member status
            this.displayCheckoutItems();
            this.calculateTotal();
        } catch (error) {
            console.error("❌ Error updating member status:", error);
        }
    }

    /**
     * Display cart items in checkout
     */
    displayCheckoutItems() {
        this.checkoutItemsContainer.innerHTML = "";

        this.cart.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.className = "flex justify-between items-start text-sm pb-3 border-b border-gray-200";

            // Apply member discount if applicable
            const finalPrice = this.isMember
                ? item.price * (1 - this.memberDiscount / 100)
                : item.price;
            const itemTotal = finalPrice * item.quantity;

            itemElement.innerHTML = `
                <div>
                    <p class="font-semibold">${item.name}</p>
                    <p class="text-gray-600">Qty: ${item.quantity}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold">₵${itemTotal.toFixed(2)}</p>
                    ${this.isMember ? `<p class="text-green-600 text-xs">-${this.memberDiscount}%</p>` : ""}
                </div>
            `;

            this.checkoutItemsContainer.appendChild(itemElement);
        });
    }

    /**
     * Calculate order total with tax and shipping
     */
    calculateTotal() {
        let subtotal = 0;
        let originalSubtotal = 0;

        this.cart.forEach((item) => {
            originalSubtotal += item.price * item.quantity;
            const finalPrice = this.isMember
                ? item.price * (1 - this.memberDiscount / 100)
                : item.price;
            subtotal += finalPrice * item.quantity;
        });

        const discountAmount = originalSubtotal - subtotal;
        const shipping = 0; // Free shipping for now
        const tax = 0; // Tax is included in prices
        const total = subtotal + shipping + tax;

        console.log(`📊 Checkout Totals:`, {
            originalSubtotal,
            subtotal,
            discountAmount,
            isMember: this.isMember,
            memberDiscount: this.memberDiscount,
            total,
            cartItems: this.cart.length
        });

        // Update display - show DISCOUNTED subtotal
        this.checkoutSubtotal.textContent = `₵${subtotal.toFixed(2)}`;

        // Show/hide discount section
        const discountSection = document.getElementById('checkout-discount-section');
        const discountElement = document.getElementById('checkout-discount');

        console.log('🔍 Discount section check:', {
            sectionExists: !!discountSection,
            elementExists: !!discountElement,
            isMember: this.isMember,
            discountAmount,
            shouldShow: this.isMember && discountAmount > 0
        });

        if (this.isMember && discountAmount > 0) {
            console.log('✅ Showing discount section');
            if (discountSection) discountSection.classList.remove('hidden');
            if (discountElement) discountElement.textContent = `-₵${discountAmount.toFixed(2)}`;
        } else {
            console.log('❌ Hiding discount section', {
                isMember: this.isMember,
                discountAmount,
                memberDiscount: this.memberDiscount
            });
            if (discountSection) discountSection.classList.add('hidden');
        }

        this.checkoutShipping.textContent = shipping === 0 ? "FREE" : `₵${shipping.toFixed(2)}`;
        this.checkoutTax.textContent = `₵${tax.toFixed(2)}`;
        this.checkoutTotal.textContent = `₵${total.toFixed(2)}`;

        // Store totals for payment
        this.totals = { subtotal, shipping, tax, total, discount: discountAmount };
    }

    /**
     * Validate cart against inventory before checkout
     */
    async validateInventory() {
        for (const item of this.cart) {
            const inStock = await inventoryManager.isInStock(item.id, item.quantity);
            if (!inStock) {
                const currentStock = await inventoryManager.getStock(item.id);
                window.toast.error(`${item.name} has only ${currentStock} units available, but you have ${item.quantity} in cart.`);
                return false;
            }
        }
        return true;
    }

    /**
     * Initiate Paystack payment
     */
    async initiatePayment() {
        try {
            // Validate inventory
            const inventoryValid = await this.validateInventory();
            if (!inventoryValid) {
                return;
            }

            // Get user email from form if not logged in
            const emailInput = document.getElementById("email");
            const email = this.userEmail || emailInput.value;

            if (!email) {
                window.toast.error('Please enter an email address');
                return;
            }

            // Disable button
            this.paymentBtn.disabled = true;
            this.paymentBtn.textContent = "Processing...";

            // Convert cedis to pesewas (Paystack uses smallest currency unit)
            const amountInPesewas = Math.round(this.totals.total * 100);

            // Prepare Paystack configuration
            const paystackConfig = {
                email: email,
                amount: amountInPesewas,
                currency: "GHS",
                publicKey: this.paystackPublicKey,
                ref: `order_${Date.now()}`,
                onClose: () => {
                    console.log("❌ Payment window closed");
                    this.paymentBtn.disabled = false;
                    this.paymentBtn.textContent = "Pay Now with Paystack";
                    window.toast.warning('Payment cancelled');
                },
                onSuccess: (response) => {
                    console.log("✅ Payment successful:", response);
                    this.handlePaymentSuccess(response, email);
                }
            };

            // Open Paystack modal
            this.openPaystackModal(paystackConfig);

        } catch (error) {
            console.error("❌ Error initiating payment:", error);
            window.toast.error('Error initiating payment. Please try again.');
            this.paymentBtn.disabled = false;
            this.paymentBtn.textContent = "Pay Now with Paystack";
        }
    }

    /**
     * Open Paystack payment modal
     */
    openPaystackModal(config) {
        // Load Paystack script if not already loaded
        if (!window.PaystackPop) {
            const script = document.createElement("script");
            script.src = "https://js.paystack.co/v1/inline.js";
            script.onload = () => {
                window.PaystackPop.setup(config).openIframe();
            };
            document.head.appendChild(script);
        } else {
            window.PaystackPop.setup(config).openIframe();
        }
    }

    /**
     * Handle successful payment
     */
    async handlePaymentSuccess(response, email) {
        try {
            console.log("💳 Processing payment success...");

            // Verify payment reference
            const isVerified = await this.verifyPayment(response.reference);

            if (!isVerified) {
                window.toast.error('Payment verification failed');
                this.paymentBtn.disabled = false;
                this.paymentBtn.textContent = "Pay Now with Paystack";
                return;
            }

            // Reduce inventory for each item
            for (const item of this.cart) {
                await inventoryManager.reduceStock(item.id, item.quantity);
            }

            // Save transaction to Firebase
            await this.saveTransaction(response, email);

            // Clear cart
            localStorage.removeItem("cart");

            // Show success message
            window.toast.success('Payment successful! Your order has been placed.', 4000);

            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);

        } catch (error) {
            console.error("❌ Error handling payment success:", error);
            window.toast.error('Error processing payment. Please contact support.');
            this.paymentBtn.disabled = false;
            this.paymentBtn.textContent = "Pay Now with Paystack";
        }
    }

    /**
     * Verify payment with Paystack (client-side)
     * In production, this should be done server-side
     */
    async verifyPayment(reference) {
        try {
            // For now, we'll trust Paystack's onSuccess callback
            // In production, implement server-side verification
            console.log("✅ Payment reference:", reference);
            return true;
        } catch (error) {
            console.error("❌ Error verifying payment:", error);
            return false;
        }
    }

    /**
     * Save transaction to Firebase
     */
    async saveTransaction(paystackResponse, email) {
        try {
            const transactionRef = ref(database, "transactions");
            const newTransactionRef = push(transactionRef);

            const transactionData = {
                id: paystackResponse.reference,
                email: email,
                userId: Authentication.currentUser?.uid || null,
                isMember: this.isMember,
                memberDiscount: this.memberDiscount,
                items: this.cart,
                subtotal: this.totals.subtotal,
                tax: this.totals.tax,
                shipping: this.totals.shipping,
                total: this.totals.total,
                paymentStatus: "completed",
                paymentMethod: "Paystack",
                paystackReference: paystackResponse.reference,
                createdAt: new Date().toISOString(),
            };

            await set(newTransactionRef, transactionData);
            console.log("✅ Transaction saved to Firebase");

        } catch (error) {
            console.error("❌ Error saving transaction:", error);
            throw error;
        }
    }
}

// Initialize checkout handler when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        new CheckoutHandler();
    });
} else {
    new CheckoutHandler();
}

export default CheckoutHandler;
