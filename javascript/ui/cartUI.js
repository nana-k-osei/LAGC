/**
 * CartUI Module - Handles cart page rendering and interactions
 * Displays cart items, calculates totals, handles quantity updates and checkout
 */

import Cart from "./cart.js";

class CartUI {
    constructor() {
        this.cart = new Cart();
        this.cartItemsContainer = document.getElementById("cart-items");
        this.emptyCartMessage = document.getElementById("empty-cart");
        this.checkoutBtn = document.getElementById("checkout-btn");
        this.applyPromoBtn = document.getElementById("apply-promo");
        this.promoCodeInput = document.getElementById("promo-code");
        this.init();
    }

    /**
     * Initialize cart UI
     */
    init() {
        this.render();
        this.attachEventListeners();
        window.addEventListener("cartUpdated", () => this.render());
    }

    /**
     * Render cart items
     */
    render() {
        if (this.cart.isEmpty()) {
            this.emptyCartMessage.style.display = "block";
            this.cartItemsContainer.innerHTML = "";
            this.checkoutBtn.disabled = true;
            this.checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
        } else {
            this.emptyCartMessage.style.display = "none";
            this.checkoutBtn.disabled = false;
            this.checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
            this.renderItems();
        }

        this.updateSummary();
    }

    /**
     * Render individual cart items
     */
    renderItems() {
        this.cartItemsContainer.innerHTML = this.cart.items
            .map(
                (item, index) => `
        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
          <div class="flex flex-col sm:flex-row">
            <!-- Product Image -->
            <div class="sm:w-32 h-32 sm:h-auto bg-gray-100 flex-shrink-0">
              <img
                src="${item.image}"
                alt="${item.name}"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Product Details -->
            <div class="flex-1 p-6 flex flex-col">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">${item.category}</p>
                  <h3 class="text-lg font-bold">${item.name}</h3>
                </div>
                <button
                  class="text-gray-400 hover:text-red-500 transition remove-from-cart"
                  data-index="${index}"
                  title="Remove from cart"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>

              <!-- Size & Color -->
              <div class="flex gap-4 mb-4 text-sm">
                ${item.size ? `<span class="text-gray-600">Size: <strong>${item.size}</strong></span>` : ""}
                ${item.color ? `<span class="text-gray-600">Color: <strong>${item.color}</strong></span>` : ""}
              </div>

              <!-- Price & Quantity Controls -->
              <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div class="flex items-center gap-3">
                  <button
                    class="qty-decrease"
                    data-index="${index}"
                    class="w-8 h-8 rounded-lg border border-gray-300 hover:border-orange-500 flex items-center justify-center transition"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value="${item.quantity}"
                    min="1"
                    class="qty-input w-12 text-center px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    data-index="${index}"
                  />
                  <button
                    class="qty-increase"
                    data-index="${index}"
                    class="w-8 h-8 rounded-lg border border-gray-300 hover:border-orange-500 flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600 mb-1">Total</p>
                  <p class="text-2xl font-bold text-orange-500">
                    $${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
            )
            .join("");
    }

    /**
     * Update order summary
     */
    updateSummary() {
        const subtotal = this.cart.getSubtotal();
        const shipping = this.cart.getShipping();
        const tax = this.cart.getTax();
        const total = this.cart.getTotal();

        document.getElementById("summary-subtotal").textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById("summary-shipping").textContent =
            shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
        document.getElementById("summary-tax").textContent = `$${tax.toFixed(2)}`;
        document.getElementById("summary-total").textContent = `$${total.toFixed(2)}`;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Remove from cart
        this.cartItemsContainer.addEventListener("click", (e) => {
            if (e.target.closest(".remove-from-cart")) {
                const index = parseInt(e.target.closest(".remove-from-cart").dataset.index);
                this.cart.removeItem(index);
            }
        });

        // Update quantity - decrease
        this.cartItemsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("qty-decrease")) {
                const index = parseInt(e.target.dataset.index);
                const currentQty = this.cart.items[index].quantity;
                this.cart.updateQuantity(index, currentQty - 1);
            }
        });

        // Update quantity - increase
        this.cartItemsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("qty-increase")) {
                const index = parseInt(e.target.dataset.index);
                const currentQty = this.cart.items[index].quantity;
                this.cart.updateQuantity(index, currentQty + 1);
            }
        });

        // Update quantity - direct input
        this.cartItemsContainer.addEventListener("change", (e) => {
            if (e.target.classList.contains("qty-input")) {
                const index = parseInt(e.target.dataset.index);
                const qty = parseInt(e.target.value);
                this.cart.updateQuantity(index, qty);
            }
        });

        // Apply promo code
        if (this.applyPromoBtn) {
            this.applyPromoBtn.addEventListener("click", () => {
                const code = this.promoCodeInput.value.trim();
                const discount = this.cart.applyPromoCode(code);

                if (discount) {
                    this.applyPromoBtn.textContent = "Applied ✓";
                    this.applyPromoBtn.classList.add("bg-green-500");
                    this.applyPromoBtn.disabled = true;

                    // Show success toast
                    if (window.toast) {
                        window.toast.success(`Promo code "${code}" applied! You saved $${discount.toFixed(2)}`);
                    }

                    setTimeout(() => {
                        this.applyPromoBtn.textContent = "Apply";
                        this.applyPromoBtn.classList.remove("bg-green-500");
                        this.applyPromoBtn.disabled = false;
                    }, 3000);
                } else {
                    this.promoCodeInput.classList.add("border-red-500");

                    // Show error toast
                    if (window.toast) {
                        window.toast.error(`Invalid promo code "${code}"`);
                    }

                    setTimeout(() => {
                        this.promoCodeInput.classList.remove("border-red-500");
                    }, 2000);
                }
            });
        }

        // Checkout button
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener("click", () => {
                window.location.href = "checkout.html";
            });
        }
    }
}

export default CartUI;
