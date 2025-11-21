/**
 * Cart Module - Manages shopping cart functionality
 * Handles: adding/removing items, quantity updates, price calculations, localStorage persistence
 */

import Authentication from './authentication.js';

class Cart {
    constructor() {
        this.items = this.loadFromStorage();
        this.TAX_RATE = 0.08; // 8% tax
        this.FREE_SHIPPING_THRESHOLD = 50;
    }

    /**
     * Load cart from localStorage
     */
    loadFromStorage() {
        const stored = localStorage.getItem("lagc_cart");
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Save cart to localStorage
     */
    saveToStorage() {
        localStorage.setItem("lagc_cart", JSON.stringify(this.items));
        window.dispatchEvent(new Event("cartUpdated"));
    }

    /**
     * Add item to cart
     */
    addItem(product, quantity = 1, size = null, color = null) {
        const existingItem = this.items.find(
            (item) =>
                item.id === product.id && item.size === size && item.color === color
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity,
                size,
                color,
            });
        }

        this.saveToStorage();
    }

    /**
     * Remove item from cart
     */
    removeItem(itemIndex) {
        this.items.splice(itemIndex, 1);
        this.saveToStorage();
    }

    /**
     * Update item quantity
     */
    updateQuantity(itemIndex, quantity) {
        if (quantity <= 0) {
            this.removeItem(itemIndex);
        } else {
            this.items[itemIndex].quantity = quantity;
            this.saveToStorage();
        }
    }

    /**
     * Clear all items from cart
     */
    clear() {
        this.items = [];
        this.saveToStorage();
    }

    /**
     * Get subtotal (before tax and shipping, with member discount applied)
     */
    getSubtotal() {
        let subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Apply member discount if user is logged in and is a member
        if (Authentication.currentUser && Authentication.isMember) {
            const discount = Authentication.getDiscount();
            if (discount > 0) {
                subtotal = subtotal * (1 - discount / 100);
            }
        }

        return subtotal;
    }

    /**
     * Calculate shipping cost
     */
    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : 0; // Default to free
    }

    /**
     * Calculate tax (tax included in product prices, kept for reference)
     */
    getTax() {
        return 0; // Tax is included in product prices
    }

    /**
     * Get total (subtotal + shipping, tax included in prices)
     */
    getTotal() {
        return this.getSubtotal() + this.getShipping();
    }

    /**
     * Get item count
     */
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Check if cart is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Apply promo code (stub for future implementation)
     */
    applyPromoCode(code) {
        // Promo code logic can be implemented here
        // Return discount amount or false if invalid
        const promoCodes = {
            SAVE10: 0.1,
            SAVE20: 0.2,
            SUMMER15: 0.15,
        };

        return promoCodes[code.toUpperCase()] || false;
    }
}

export default Cart;
