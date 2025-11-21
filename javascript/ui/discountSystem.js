/**
 * Member Discount System
 * Handles discount calculations and application to cart totals
 */

import Authentication from './authentication.js';

class DiscountSystem {
    constructor() {
        this.memberDiscount = 0;
        this.initializeDiscount();
    }

    /**
     * Initialize member discount on page load
     */
    initializeDiscount() {
        this.updateDiscount();
    }

    /**
     * Update discount based on current user membership
     */
    updateDiscount() {
        if (Authentication.isMember) {
            this.memberDiscount = Authentication.getDiscount();
            console.log(`Member discount applied: ${this.memberDiscount}%`);
            this.updateUIWithDiscount();
        } else {
            this.memberDiscount = 0;
            this.removeDiscountUI();
        }
    }

    /**
     * Calculate final price with member discount
     */
    calculateDiscountedPrice(originalPrice) {
        if (this.memberDiscount === 0) {
            return {
                originalPrice,
                discountAmount: 0,
                finalPrice: originalPrice,
            };
        }

        const discountAmount = (originalPrice * this.memberDiscount) / 100;
        const finalPrice = originalPrice - discountAmount;

        return {
            originalPrice,
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            finalPrice: parseFloat(finalPrice.toFixed(2)),
            discountPercentage: this.memberDiscount,
        };
    }

    /**
     * Calculate cart total with member discount
     */
    calculateCartTotal(cartItems) {
        let subtotal = 0;

        // Calculate subtotal
        cartItems.forEach((item) => {
            subtotal += item.price * item.quantity;
        });

        // Apply member discount if applicable
        if (this.memberDiscount === 0) {
            return {
                subtotal: parseFloat(subtotal.toFixed(2)),
                discountAmount: 0,
                total: parseFloat(subtotal.toFixed(2)),
            };
        }

        const discountAmount = (subtotal * this.memberDiscount) / 100;
        const total = subtotal - discountAmount;

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            discountPercentage: this.memberDiscount,
            total: parseFloat(total.toFixed(2)),
        };
    }

    /**
     * Update UI to show member discount
     */
    updateUIWithDiscount() {
        const memberBadges = document.querySelectorAll('[data-discount-badge]');
        memberBadges.forEach((badge) => {
            badge.innerHTML = `
        <div class="bg-orange-100 border border-orange-500 rounded px-3 py-2 text-sm font-bold text-orange-700">
          🎉 Member Discount: ${this.memberDiscount}% OFF
        </div>
      `;
        });

        // Update product prices if on shop page
        this.updateProductPrices();

        // Update cart if visible
        this.updateCartDisplay();
    }

    /**
     * Remove discount UI elements
     */
    removeDiscountUI() {
        const memberBadges = document.querySelectorAll('[data-discount-badge]');
        memberBadges.forEach((badge) => {
            badge.innerHTML = '';
        });
    }

    /**
     * Update product prices in shop to show discount
     */
    updateProductPrices() {
        const productCards = document.querySelectorAll('[data-product-price]');
        productCards.forEach((card) => {
            const originalPrice = parseFloat(card.getAttribute('data-product-price'));
            const calculation = this.calculateDiscountedPrice(originalPrice);

            // Find price element
            const priceElement = card.querySelector('.product-price');
            if (priceElement) {
                if (this.memberDiscount > 0) {
                    priceElement.innerHTML = `
            <div>
              <span class="line-through text-gray-400 text-sm">₦${originalPrice.toFixed(2)}</span>
              <span class="text-orange-600 font-bold ml-2">₦${calculation.finalPrice.toFixed(2)}</span>
              <span class="text-xs text-orange-500">(-${this.memberDiscount}%)</span>
            </div>
          `;
                } else {
                    priceElement.textContent = `₦${originalPrice.toFixed(2)}`;
                }
            }
        });
    }

    /**
     * Update cart display with discount
     */
    updateCartDisplay() {
        const cartTotal = document.getElementById('cart-total');
        const discountElement = document.getElementById('discount-line');

        if (cartTotal && this.memberDiscount > 0) {
            // Assume cart data is available globally or fetch it
            // This is a placeholder - actual implementation depends on your cart structure
            if (discountElement) {
                discountElement.classList.remove('hidden');
            }
        }
    }

    /**
     * Get member discount percentage
     */
    getDiscount() {
        return this.memberDiscount;
    }

    /**
     * Check if user has member discount
     */
    hasMemberDiscount() {
        return this.memberDiscount > 0;
    }

    /**
     * Format price with currency
     */
    formatPrice(amount) {
        return `₦${parseFloat(amount).toFixed(2)}`;
    }

    /**
     * Get discount summary for display
     */
    getDiscountSummary() {
        if (this.memberDiscount === 0) {
            return {
                message: 'Sign up for membership to get discounts!',
                discount: 0,
                isMember: false,
            };
        }

        return {
            message: `You're saving ${this.memberDiscount}% as a member!`,
            discount: this.memberDiscount,
            isMember: true,
        };
    }
}

// Create singleton instance
const discountSystem = new DiscountSystem();

// Update discount when authentication state changes
Authentication.onUserLoggedIn = function () {
    discountSystem.updateDiscount();
};

Authentication.onUserLoggedOut = function () {
    discountSystem.updateDiscount();
};

export default discountSystem;
