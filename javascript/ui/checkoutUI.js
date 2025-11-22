/**
 * CheckoutUI Module - Handles checkout page rendering and form submission
 * Displays order summary, handles form validation, and processes checkout
 */

import Cart from "./cart.js";
import Authentication from "./authentication.js";

class CheckoutUI {
    constructor() {
        this.cart = new Cart();
        this.checkoutItemsContainer = document.getElementById("checkout-items");
        this.paymentBtn = document.getElementById("payment-btn");
        this.shippingRadios = document.querySelectorAll('input[name="shipping"]');
        this.shippingCost = 0;
        this.isMember = false;
        this.memberDiscount = 0;
        this.init();
    }

    /**
     * Initialize checkout UI
     */
    async init() {
        // Wait for Authentication to be ready
        await Authentication.initPromise;

        // Get member status from Authentication
        if (Authentication.currentUser && Authentication.isMember && Authentication.membershipData) {
            this.isMember = true;
            this.memberDiscount = Authentication.membershipData.discountPercentage || 0;
            console.log(`✅ CheckoutUI: Member with ${this.memberDiscount}% discount`);
        }

        this.renderOrderSummary();
        this.attachEventListeners();
    }

    /**
     * Render order summary items with member discount applied
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
                (item) => {
                    // Apply member discount if applicable
                    const finalPrice = this.isMember
                        ? item.price * (1 - this.memberDiscount / 100)
                        : item.price;
                    const itemTotal = finalPrice * item.quantity;

                    return `
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
              ${this.isMember ? `<p class="text-xs text-green-600 font-medium">-${this.memberDiscount}%</p>` : ""}
            </div>
          </div>
          <p class="font-bold text-sm">₵${itemTotal.toFixed(2)}</p>
        </div>
      `;
                }
            )
            .join("");

        this.updateSummary();
    }

    /**
     * Calculate subtotal with member discount
     */
    calculateSubtotal() {
        let subtotal = 0;
        let originalSubtotal = 0;

        this.cart.items.forEach((item) => {
            originalSubtotal += item.price * item.quantity;
            const finalPrice = this.isMember
                ? item.price * (1 - this.memberDiscount / 100)
                : item.price;
            subtotal += finalPrice * item.quantity;
        });

        return { subtotal, originalSubtotal };
    }

    /**
     * Update checkout summary with discount and shipping
     */
    updateSummary() {
        const { subtotal, originalSubtotal } = this.calculateSubtotal();
        const discountAmount = originalSubtotal - subtotal;
        const tax = this.cart.getTax();
        const total = subtotal + this.shippingCost + tax;

        console.log('💰 CheckoutUI Summary:', {
            originalSubtotal: originalSubtotal.toFixed(2),
            subtotal: subtotal.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            isMember: this.isMember,
            memberDiscount: this.memberDiscount,
            total: total.toFixed(2)
        });

        // Update display - show DISCOUNTED subtotal
        document.getElementById("checkout-subtotal").textContent = `₵${subtotal.toFixed(2)}`;

        // Show/hide discount section
        const discountSection = document.getElementById('checkout-discount-section');
        const discountElement = document.getElementById('checkout-discount');

        if (this.isMember && discountAmount > 0) {
            console.log('✅ Showing discount section');
            if (discountSection) discountSection.classList.remove('hidden');
            if (discountElement) discountElement.textContent = `-₵${discountAmount.toFixed(2)}`;
        } else {
            console.log('❌ Hiding discount section');
            if (discountSection) discountSection.classList.add('hidden');
        }

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
