/**
 * ShopUI Module - Handles shop page functionality
 * Manages quick add-to-cart from product cards, product filtering, and navigation
 */

import Cart from "./cart.js";

class ShopUI {
    constructor(productDatabase) {
        this.productDatabase = productDatabase;
        this.cart = new Cart();
        this.addToCartButtons = document.querySelectorAll('button[title="Add to Cart"]');
        this.init();
    }

    /**
     * Initialize shop UI
     */
    init() {
        this.attachAddToCartListeners();
        this.updateCartCounter();
        window.addEventListener("cartUpdated", () => this.updateCartCounter());
    }

    /**
     * Attach listeners to all "Add to Cart" buttons on shop page
     */
    attachAddToCartListeners() {
        this.addToCartButtons.forEach((btn, index) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleQuickAddToCart(index);
            });
        });
    }

    /**
     * Handle quick add to cart from shop page
     * @param {number} productIndex - Index of product card
     */
    handleQuickAddToCart(productIndex) {
        try {
            // Get the product card element
            const productCard = this.addToCartButtons[productIndex].closest(
                ".group"
            );
            if (!productCard) {
                console.error("Product card not found");
                return;
            }

            // Get product ID from the card
            const productId = this.getProductIdFromCard(productCard);
            if (!productId) {
                console.error("Product ID not found");
                return;
            }

            // Get product from database
            const product = this.productDatabase[productId];
            if (!product) {
                console.error("Product not found in database:", productId);
                return;
            }

            // Add to cart with quantity 1
            this.cart.addItem(product, 1, null, null);

            // Show success feedback
            this.showAddToCartFeedback(this.addToCartButtons[productIndex]);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    /**
     * Get product ID from product card
     * @param {HTMLElement} card - Product card element
     * @returns {string} Product ID
     */
    getProductIdFromCard(card) {
        // First, try to get product ID from the link's href
        const productLink = card.querySelector("a[href*='product.html']");
        if (productLink) {
            const href = productLink.getAttribute("href");
            const urlParams = new URLSearchParams(href.split("?")[1]);
            const productId = urlParams.get("id");
            if (productId) {
                console.log("Found product ID from link:", productId);
                return productId;
            }
        }

        // Fallback: Look for product name in card
        const nameElement = card.querySelector("h4");
        if (!nameElement) {
            console.warn("Could not find product name in card");
            return null;
        }

        const productName = nameElement.textContent.trim();
        console.log("Looking for product by name:", productName);

        // Find matching product in database
        for (const [id, product] of Object.entries(this.productDatabase)) {
            if (product.name === productName) {
                console.log("Found product ID by name:", id);
                return id;
            }
        }

        console.warn("Product not found in database:", productName);
        return null;
    }

    /**
     * Show visual feedback when item added to cart
     * @param {HTMLElement} button - Add to cart button
     */
    showAddToCartFeedback(button) {
        const originalHTML = button.innerHTML;
        const wasDisabled = button.disabled;

        // Change button appearance
        button.innerHTML =
            '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12m-1.5 1.5l9 9 12-12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        button.classList.add("bg-green-500", "text-white");
        button.disabled = true;

        // Revert after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove("bg-green-500", "text-white");
            button.disabled = wasDisabled;
        }, 2000);
    }

    /**
     * Update cart counter in navbar
     */
    updateCartCounter() {
        const cartCountBadge = document.getElementById("cart-count");
        if (cartCountBadge) {
            const count = this.cart.getItemCount();
            if (count > 0) {
                cartCountBadge.textContent = count;
                cartCountBadge.style.display = "inline-flex";
            } else {
                cartCountBadge.style.display = "none";
            }
        }
    }
}

export default ShopUI;
