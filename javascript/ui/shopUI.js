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

            // If product requires size selection, show size picker modal
            if (product.sizes && product.sizes.length > 0) {
                this.showSizePickerModal(product, productIndex);
                return;
            }

            // Add to cart with quantity 1 (no size needed)
            this.cart.addItem(product, 1, null, null);

            // Show success feedback
            this.showAddToCartFeedback(this.addToCartButtons[productIndex]);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    /**
     * Show size picker modal for products with sizes
     * @param {Object} product - Product object
     * @param {number} productIndex - Index of product card
     */
    showSizePickerModal(product, productIndex) {
        // Remove existing modal if any
        const existingModal = document.getElementById("size-picker-modal");
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modalHTML = `
            <div id="size-picker-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                    <h3 class="text-2xl font-bold mb-2">${product.name}</h3>
                    <p class="text-gray-600 mb-6">Select your size</p>

                    <div class="grid grid-cols-3 gap-3 mb-6">
                        ${product.sizes.map(size => `
                            <button class="size-btn py-3 px-4 border-2 border-gray-300 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-500 transition" data-size="${size}">
                                ${size}
                            </button>
                        `).join('')}
                    </div>

                    <div class="flex gap-3">
                        <button id="cancel-size-btn" class="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">
                            Cancel
                        </button>
                        <button id="confirm-size-btn" class="flex-1 py-3 bg-black text-white rounded-lg font-semibold hover:bg-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insert modal into page
        document.body.insertAdjacentHTML("beforeend", modalHTML);
        const modal = document.getElementById("size-picker-modal");
        let selectedSize = null;

        // Attach size selection listeners
        const sizeBtns = modal.querySelectorAll(".size-btn");
        const confirmBtn = document.getElementById("confirm-size-btn");
        const cancelBtn = document.getElementById("cancel-size-btn");

        sizeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Remove previous selection
                sizeBtns.forEach(b => {
                    b.classList.remove("bg-black", "text-white", "border-black");
                    b.classList.add("border-gray-300", "text-gray-700", "bg-white");
                });
                // Add selection to clicked button
                btn.classList.remove("border-gray-300", "text-gray-700", "bg-white");
                btn.classList.add("bg-black", "text-white", "border-black");
                selectedSize = btn.getAttribute("data-size");
                confirmBtn.disabled = false;
            });
        });

        // Handle confirm
        confirmBtn.addEventListener("click", () => {
            if (selectedSize) {
                this.cart.addItem(product, 1, selectedSize, null);
                this.showAddToCartFeedback(this.addToCartButtons[productIndex]);
                modal.remove();
            }
        });

        // Handle cancel
        cancelBtn.addEventListener("click", () => {
            modal.remove();
        });

        // Close modal on background click
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
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

        // Show modern toast notification
        const productName = button.closest(".group")?.querySelector("h4")?.textContent?.trim() || "Item";
        if (window.toast) {
            window.toast.success(`${productName} added to cart!`);
        }

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
        const cartCountMobileBadge = document.getElementById("cart-count-mobile");
        const count = this.cart.getItemCount();

        if (cartCountBadge) {
            if (count > 0) {
                cartCountBadge.textContent = count;
                cartCountBadge.style.display = "inline-flex";
            } else {
                cartCountBadge.style.display = "none";
            }
        }

        if (cartCountMobileBadge) {
            if (count > 0) {
                cartCountMobileBadge.textContent = count;
                cartCountMobileBadge.style.display = "inline-flex";
            } else {
                cartCountMobileBadge.style.display = "none";
            }
        }
    }
}

export default ShopUI;
