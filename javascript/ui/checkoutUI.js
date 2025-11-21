/**
 * CheckoutUI Module - Handles checkout page rendering and form submission
 * Displays order summary, handles form validation, and processes checkout
 */

import Cart from "./cart.js";

class CheckoutUI {
    constructor() {
        this.cart = new Cart();
        this.checkoutItemsContainer = document.getElementById("checkout-items");
        this.paymentBtn = document.getElementById("payment-btn");
        this.shippingRadios = document.querySelectorAll('input[name="shipping"]');
        this.shippingCost = 0;
        this.init();
    }

    /**
     * Initialize checkout UI
     */
    init() {
        this.renderOrderSummary();
        this.attachEventListeners();
    }

    /**
     * Render order summary items
     */
    renderOrderSummary() {
        if (this.cart.isEmpty()) {
            this.checkoutItemsContainer.innerHTML = `
        <div class="text-center py-4">
          <p class="text-gray-600 mb-4">Your cart is empty</p>
          <a href="shop.html" class="text-orange-500 font-semibold hover:underline">Continue Shopping</a>
        </div>
      `;
            this.paymentBtn.disabled = true;
            return;
        }

        this.checkoutItemsContainer.innerHTML = this.cart.items
            .map(
                (item) => `
        <div class="flex justify-between items-start pb-4 mb-4 border-b border-gray-300 last:border-b-0">
          <div class="flex gap-3 flex-1">
            <div class="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-sm">${item.name}</p>
              <p class="text-xs text-gray-600">
                ${item.size ? `Size: ${item.size}` : ""} 
                ${item.color ? `Color: ${item.color}` : ""}
              </p>
              <p class="text-xs text-gray-500 mt-1">Qty: ${item.quantity}</p>
            </div>
          </div>
          <p class="font-bold text-sm">₵${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `
            )
            .join("");

        this.updateSummary();
    }

    /**
     * Update checkout summary
     */
    updateSummary() {
        const subtotal = this.cart.getSubtotal();
        const tax = this.cart.getTax();
        const total = subtotal + this.shippingCost + tax;

        document.getElementById("checkout-subtotal").textContent = `₵${subtotal.toFixed(2)}`;
        document.getElementById("checkout-shipping").textContent =
            this.shippingCost === 0 ? "FREE" : `₵${this.shippingCost.toFixed(2)}`;
        document.getElementById("checkout-tax").textContent = `₵${tax.toFixed(2)}`;
        document.getElementById("checkout-total").textContent = `₵${total.toFixed(2)}`;
    }

    /**
     * Validate form fields
     */
    validateForm() {
        const requiredFields = [
            "first-name",
            "last-name",
            "email",
            "phone",
            "street",
            "city",
            "state",
            "zip",
            "country",
        ];

        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.classList.add("border-red-500");
                setTimeout(() => field.classList.remove("border-red-500"), 3000);
                return false;
            }
        }

        return true;
    }

    /**
     * Get form data
     */
    getFormData() {
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');

        return {
            contact: {
                firstName: document.getElementById("first-name").value,
                lastName: document.getElementById("last-name").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
            },
            shipping: {
                street: document.getElementById("street").value,
                apt: document.getElementById("apt").value,
                city: document.getElementById("city").value,
                state: document.getElementById("state").value,
                zip: document.getElementById("zip").value,
                country: document.getElementById("country").value,
            },
            shippingMethod: selectedShipping.value,
            shippingCost: this.shippingCost,
            cartItems: this.cart.items,
            orderSummary: {
                subtotal: this.cart.getSubtotal(),
                tax: this.cart.getTax(),
                shipping: this.shippingCost,
                total:
                    this.cart.getSubtotal() + this.cart.getTax() + this.shippingCost,
            },
        };
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Handle shipping method changes
        this.shippingRadios.forEach((radio) => {
            radio.addEventListener("change", (e) => {
                const method = e.target.value;

                if (method === "free") {
                    this.shippingCost = 0;
                } else if (method === "express") {
                    this.shippingCost = 15;
                } else if (method === "overnight") {
                    this.shippingCost = 35;
                }

                this.updateSummary();
            });
        });

        // Handle payment button
        if (this.paymentBtn) {
            this.paymentBtn.addEventListener("click", () => {
                if (this.validateForm()) {
                    const formData = this.getFormData();

                    // Store in sessionStorage for payment page
                    sessionStorage.setItem(
                        "checkoutData",
                        JSON.stringify(formData)
                    );

                    // Redirect to payment page (to be created)
                    window.location.href = "payment.html";
                }
            });
        }
    }
}

export default CheckoutUI;
