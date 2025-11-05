/**
 * Product Detail Controller
 * Manages product detail page interactions (size selection, color selection, quantity, cart, etc.)
 */

import Cart from "./cart.js";

class ProductDetail {
    constructor(productDatabase) {
        this.productDatabase = productDatabase;
        this.cart = new Cart();
        this.selectedSize = null;
        this.selectedColor = null;
        this.init();
    }

    init() {
        this.loadProduct();
    }

    /**
     * Get product ID from URL query parameter
     */
    getProductFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    /**
     * Load and display product details
     */
    loadProduct() {
        const productId = this.getProductFromURL();
        const product = this.productDatabase[productId];

        if (!product) {
            document.body.innerHTML =
                '<div class="flex items-center justify-center h-screen"><h1>Product not found</h1></div>';
            return;
        }

        // Update breadcrumb
        this.updateBreadcrumb(product);

        // Update product details
        this.updateProductDetails(product);

        // Update original price or hide it
        this.updatePricing(product);

        // Populate features
        this.populateFeatures(product);

        // Show size section if sizes exist
        if (product.sizes) {
            this.showSizeOptions(product);
        }

        // Show color section if colors exist
        if (product.colors) {
            this.showColorOptions(product);
        }

        // Update page title
        document.title = `${product.name} - Love All Girls Club`;

        // Load related products
        this.loadRelatedProducts(productId);

        // Attach event listeners
        this.attachEventListeners();
    }

    /**
     * Update breadcrumb navigation
     */
    updateBreadcrumb(product) {
        const categoryEl = document.getElementById("breadcrumb-category");
        const nameEl = document.getElementById("breadcrumb-name");

        if (categoryEl) categoryEl.textContent = product.category;
        if (nameEl) nameEl.textContent = product.name;
    }

    /**
     * Update product details section
     */
    updateProductDetails(product) {
        const categoryEl = document.getElementById("product-category");
        const nameEl = document.getElementById("product-name");
        const imageEl = document.getElementById("product-image");
        const priceEl = document.getElementById("product-price");
        const descEl = document.getElementById("product-description");

        if (categoryEl) categoryEl.textContent = product.category;
        if (nameEl) nameEl.textContent = product.name;
        if (imageEl) {
            imageEl.src = product.image;
            imageEl.alt = product.name;
        }
        if (priceEl) priceEl.textContent = `$${product.price}`;
        if (descEl) descEl.textContent = product.description;
    }

    /**
     * Update pricing display
     */
    updatePricing(product) {
        const originalPriceEl = document.getElementById("product-original-price");
        if (originalPriceEl) {
            if (product.originalPrice) {
                originalPriceEl.textContent = `$${product.originalPrice}`;
                originalPriceEl.style.display = "block";
            } else {
                originalPriceEl.style.display = "none";
            }
        }
    }

    /**
     * Populate product features list
     */
    populateFeatures(product) {
        const featuresContainer = document.getElementById("product-features");
        if (!featuresContainer) return;

        featuresContainer.innerHTML = product.features
            .map(
                (feature) => `
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.2L4.8 12m-1.5 1.5l9 9 12-12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-700">${feature}</span>
          </li>
        `
            )
            .join("");
    }

    /**
     * Show and populate size options
     */
    showSizeOptions(product) {
        const sizeSection = document.getElementById("size-section");
        if (!sizeSection) return;

        sizeSection.style.display = "block";
        const sizeOptions = document.getElementById("size-options");
        if (!sizeOptions) return;

        sizeOptions.innerHTML = product.sizes
            .map(
                (size) => `
            <button class="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition font-semibold">
              ${size}
            </button>
          `
            )
            .join("");
    }

    /**
     * Show and populate color options
     */
    showColorOptions(product) {
        const colorSection = document.getElementById("color-section");
        if (!colorSection) return;

        colorSection.style.display = "block";
        const colorOptions = document.getElementById("color-options");
        if (!colorOptions) return;

        colorOptions.innerHTML = product.colors
            .map(
                (color) => `
            <button class="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition font-semibold">
              ${color}
            </button>
          `
            )
            .join("");
    }

    /**
     * Load related products (exclude current product)
     */
    loadRelatedProducts(currentProductId) {
        const relatedContainer = document.getElementById("related-products");
        if (!relatedContainer) return;

        const products = Object.values(this.productDatabase).filter(
            (p) => p.id !== currentProductId
        );

        // Shuffle and limit to 3 products
        const shuffled = products.sort(() => 0.5 - Math.random()).slice(0, 3);

        relatedContainer.innerHTML = shuffled
            .map(
                (product) => `
          <div class="group">
            <a href="product.html?id=${product.id}" class="block">
              <div class="relative bg-white aspect-square rounded-2xl overflow-hidden mb-6 border border-gray-100 hover:shadow-2xl transition duration-300">
                <img
                  src="${product.image}"
                  alt="${product.name}"
                  class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                ${product.isNew
                        ? '<div class="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">NEW</div>'
                        : ""
                    }
              </div>
            </a>
            <a href="product.html?id=${product.id}" class="block">
              <h4 class="font-factoria font-bold text-lg group-hover:text-orange-500 transition">
                ${product.name}
              </h4>
            </a>
            <div class="flex items-end gap-2 pt-2">
              <p class="text-2xl font-bold">$${product.price}</p>
              ${product.originalPrice
                        ? `<p class="text-gray-400 line-through text-sm">$${product.originalPrice}</p>`
                        : ""
                    }
            </div>
          </div>
        `
            )
            .join("");
    }

    /**
     * Attach event listeners for interactive elements
     */
    attachEventListeners() {
        this.attachQuantityListeners();
        this.attachCartListeners();
        this.attachSizeListeners();
        this.attachColorListeners();
    }

    /**
     * Quantity selector event listeners
     */
    attachQuantityListeners() {
        const qtyDecrease = document.getElementById("qty-decrease");
        const qtyIncrease = document.getElementById("qty-increase");
        const quantityInput = document.getElementById("quantity");

        if (qtyDecrease) {
            qtyDecrease.addEventListener("click", () => {
                if (!quantityInput) return;
                let qty = parseInt(quantityInput.value);
                if (qty > 1) {
                    quantityInput.value = qty - 1;
                }
            });
        }

        if (qtyIncrease) {
            qtyIncrease.addEventListener("click", () => {
                if (!quantityInput) return;
                let qty = parseInt(quantityInput.value);
                quantityInput.value = qty + 1;
            });
        }
    }

    /**
     * Add to cart and favorites event listeners
     */
    attachCartListeners() {
        const addToCartBtn = document.getElementById("add-to-cart-btn");
        const addToFavBtn = document.getElementById("add-to-favorites-btn");
        const quantityInput = document.getElementById("quantity");
        const productId = this.getProductFromURL();
        const product = this.productDatabase[productId];

        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", () => {
                if (!quantityInput || !product) return;

                const quantity = parseInt(quantityInput.value);

                // Add item to cart with selected size and color
                this.cart.addItem(product, quantity, this.selectedSize, this.selectedColor);

                // Show success feedback
                const originalText = addToCartBtn.textContent;
                addToCartBtn.textContent = "✓ Added to Cart";
                addToCartBtn.classList.add("bg-green-500");

                setTimeout(() => {
                    addToCartBtn.textContent = originalText;
                    addToCartBtn.classList.remove("bg-green-500");
                }, 2000);
            });
        }

        if (addToFavBtn) {
            addToFavBtn.addEventListener("click", () => {
                addToFavBtn.classList.toggle("bg-orange-500");
                addToFavBtn.classList.toggle("text-white");
                addToFavBtn.classList.toggle("border-orange-500");
            });
        }
    }

    /**
     * Size selection event listeners
     */
    attachSizeListeners() {
        const sizeButtons = document.querySelectorAll("#size-options button");
        sizeButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                sizeButtons.forEach((b) =>
                    b.classList.remove("border-orange-500", "bg-orange-50")
                );
                btn.classList.add("border-orange-500", "bg-orange-50");
                this.selectedSize = btn.textContent.trim();
            });
        });
    }

    /**
     * Color selection event listeners
     */
    attachColorListeners() {
        const colorButtons = document.querySelectorAll("#color-options button");
        colorButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                colorButtons.forEach((b) =>
                    b.classList.remove("border-orange-500", "bg-orange-50")
                );
                btn.classList.add("border-orange-500", "bg-orange-50");
                this.selectedColor = btn.dataset.color || btn.textContent.trim();
            });
        });
    }
}

export default ProductDetail;
