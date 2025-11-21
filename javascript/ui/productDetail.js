/**
 * Product Detail Controller
 * Manages product detail page interactions (size selection, color selection, quantity, cart, etc.)
 */

import Cart from "./cart.js";
import { database } from '../config/firebaseConfig.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

class ProductDetail {
    constructor(productDatabase) {
        this.productDatabase = productDatabase; // Fallback to local database
        this.cart = new Cart();
        this.selectedSize = null;
        this.selectedColor = null;
        this.init();
    }

    init() {
        this.loadProduct();
        this.updateCartCounter();

        // Listen for cart updates and refresh counter
        window.addEventListener("cartUpdated", () => {
            this.updateCartCounter();
        });
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
    async loadProduct() {
        const productId = this.getProductFromURL();
        console.log('Product ID from URL:', productId);

        const loader = document.getElementById('product-loader');
        const productSection = document.getElementById('product-section');

        // Show loader, hide content
        if (loader) loader.style.display = 'flex';
        if (productSection) productSection.classList.add('hidden');

        let product = null;

        // Try to load from Firebase first
        try {
            const productRef = ref(database, `products/${productId}`);
            const snapshot = await get(productRef);
            if (snapshot.exists()) {
                product = snapshot.val();
                console.log('Product loaded from Firebase:', product);
            }
        } catch (error) {
            console.warn('Error loading from Firebase, falling back to local database:', error);
        }

        // Fallback to local database if Firebase fails or product not found
        if (!product) {
            console.log('Available products in local DB:', Object.keys(this.productDatabase));
            product = this.productDatabase[productId];
            if (product) {
                console.log('Product loaded from local database:', product);
            }
        }

        if (!product) {
            console.error('Product not found:', productId);
            if (loader) loader.style.display = 'none';
            document.body.innerHTML =
                '<div class="flex items-center justify-center h-screen"><h1>Product not found: ' + productId + '</h1></div>';
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

        // Hide loader, show content
        if (loader) loader.style.display = 'none';
        if (productSection) productSection.classList.remove('hidden');
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
        const imageEl = document.getElementById("product-image-main");
        const priceEl = document.getElementById("product-price");
        const descEl = document.getElementById("product-description");

        if (categoryEl) categoryEl.textContent = product.category;
        if (nameEl) nameEl.textContent = product.name;
        if (imageEl) {
            imageEl.src = product.image;
            imageEl.alt = product.name;
        }
        if (priceEl) priceEl.textContent = `₵${product.price}`;
        if (descEl) descEl.textContent = product.description;

        // Initialize image gallery
        this.initializeImageGallery(product);
    }

    /**
     * Update pricing display
     */
    updatePricing(product) {
        const originalPriceEl = document.getElementById("product-original-price");
        if (originalPriceEl) {
            if (product.originalPrice) {
                originalPriceEl.textContent = `₵${product.originalPrice}`;
                originalPriceEl.style.display = "block";
            } else {
                originalPriceEl.style.display = "none";
            }
        }
    }

    /**
     * Initialize image gallery with thumbnails
     */
    initializeImageGallery(product) {
        const thumbnailsContainer = document.getElementById("product-thumbnails-container");
        const mainImage = document.getElementById("product-image-main");

        if (!thumbnailsContainer || !mainImage) return;

        // Use product images array if available, otherwise fallback to single image
        const images = product.images || [product.image, product.image, product.image];

        let currentImageIndex = 0;

        thumbnailsContainer.innerHTML = images
            .map(
                (img, index) => `
            <button 
                class="thumbnail-btn flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 border-2 rounded-lg overflow-hidden transition-all ${index === 0 ? "border-orange-500" : "border-gray-200"
                    } hover:border-orange-500"
                data-image="${img}"
                data-index="${index}"
            >
                <img 
                    src="${img}" 
                    alt="Product view ${index + 1}"
                    class="w-full h-full object-cover"
                />
            </button>
        `
            )
            .join("");

        // Add click handlers to thumbnails
        const thumbnailBtns = document.querySelectorAll(".thumbnail-btn");
        thumbnailBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(btn.getAttribute("data-index"));
                this.switchImage(index, thumbnailBtns, mainImage, images);
                currentImageIndex = index;
            });
        });

        // Add navigation arrow handlers
        const prevBtn = document.getElementById("gallery-prev");
        const nextBtn = document.getElementById("gallery-next");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                this.switchImage(currentImageIndex, thumbnailBtns, mainImage, images);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                this.switchImage(currentImageIndex, thumbnailBtns, mainImage, images);
            });
        }
    }

    /**
     * Switch to a specific image and update thumbnails
     */
    switchImage(index, thumbnailBtns, mainImage, images) {
        mainImage.src = images[index];

        // Update active border on thumbnail
        thumbnailBtns.forEach((btn, i) => {
            if (i === index) {
                btn.classList.remove("border-gray-200");
                btn.classList.add("border-orange-500");
            } else {
                btn.classList.remove("border-orange-500");
                btn.classList.add("border-gray-200");
            }
        });

        // Scroll thumbnail into view on mobile
        const activeThumbnail = thumbnailBtns[index];
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
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
            <button class="size-btn px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition font-semibold flex items-center justify-center min-w-16" data-size="${size}">
              ${size}
              <span class="checkmark ml-2 hidden">✓</span>
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

        // Define the three signature pieces
        const signaturePieces = [
            "performance-tennis-shirt",
            "love-cap",
            "tennis-tank-top",
        ];

        // If current product is one of the signature pieces, show the other two
        if (signaturePieces.includes(currentProductId)) {
            const relatedIds = signaturePieces.filter((id) => id !== currentProductId);
            const products = relatedIds
                .map((id) => this.productDatabase[id])
                .filter((p) => p);

            relatedContainer.innerHTML = products
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
                  <p class="text-2xl font-bold">₵${product.price}</p>
                  ${product.originalPrice
                            ? `<p class="text-gray-400 line-through text-sm">₵${product.originalPrice}</p>`
                            : ""
                        }
                </div>
              </div>
            `
                )
                .join("");
        } else {
            // For non-signature pieces, show random products (fallback behavior)
            const products = Object.values(this.productDatabase).filter(
                (p) => p.id !== currentProductId
            );

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

                // Show modern toast notification
                if (window.toast) {
                    window.toast.success(`${product.name} added to cart!`);
                }

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
        const sizeButtons = document.querySelectorAll("#size-options .size-btn");

        // Auto-select if only one size available
        if (sizeButtons.length === 1) {
            sizeButtons[0].classList.add("border-orange-500", "bg-orange-50");
            sizeButtons[0].querySelector(".checkmark").classList.remove("hidden");
            this.selectedSize = sizeButtons[0].textContent.trim();
        }

        sizeButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                sizeButtons.forEach((b) => {
                    b.classList.remove("border-orange-500", "bg-orange-50");
                    b.querySelector(".checkmark").classList.add("hidden");
                });
                btn.classList.add("border-orange-500", "bg-orange-50");
                btn.querySelector(".checkmark").classList.remove("hidden");
                this.selectedSize = btn.getAttribute("data-size");
            });
        });
    }    /**
     * Color selection event listeners
     */
    attachColorListeners() {
        const colorButtons = document.querySelectorAll("#color-options button");

        // Auto-select if only one color available
        if (colorButtons.length === 1) {
            colorButtons[0].classList.add("border-orange-500", "bg-orange-50");
            this.selectedColor = colorButtons[0].dataset.color || colorButtons[0].textContent.trim();
        }

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
