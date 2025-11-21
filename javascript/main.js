/**
 * Main Application Entry Point
 * Initializes all modules and manages app lifecycle
 */

import Carousel from "./ui/carousel.js";
import StoreCarousel from "./ui/storeCarousel.js";
import Navbar from "./ui/navbar.js";
import ScrollReveal from "./ui/scrollReveal.js";
import ProductDetail from "./ui/productDetail.js";
import ShopUI from "./ui/shopUI.js";
import CartUI from "./ui/cartUI.js";
import CheckoutUI from "./ui/checkoutUI.js";
import Cart from "./ui/cart.js";
import Toast from "./ui/toast.js";
import productDatabase from "./data/productDatabase.js";
import Authentication from "./ui/authentication.js";
import discountSystem from "./ui/discountSystem.js";
import inventoryManager from "./ui/inventory.js";

class App {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        console.log("Initializing LAGC App...");

        // Initialize Navbar (on all pages)
        this.modules.navbar = new Navbar({
            scrollThreshold: 50,
        });

        // Initialize cart counter on all pages
        this.initializeCartCounter();

        // Initialize page-specific modules based on current page
        this.initializePageModules();

        console.log("App initialized successfully");
    }

    /**
     * Initialize cart counter badge on all pages
     */
    initializeCartCounter() {
        const cartCountBadge = document.getElementById("cart-count");
        const cartCountMobileBadge = document.getElementById("cart-count-mobile");

        if (cartCountBadge || cartCountMobileBadge) {
            const cart = new Cart();
            const count = cart.getItemCount();

            if (cartCountBadge) {
                this.updateCartCounterDisplay(cartCountBadge, count);
            }
            if (cartCountMobileBadge) {
                this.updateCartCounterDisplay(cartCountMobileBadge, count);
            }

            // Update counter when cart changes - refetch elements to avoid stale references
            window.addEventListener("cartUpdated", () => {
                const updatedCount = cart.getItemCount();
                const badge = document.getElementById("cart-count");
                const mobileBadge = document.getElementById("cart-count-mobile");

                if (badge) {
                    this.updateCartCounterDisplay(badge, updatedCount);
                }
                if (mobileBadge) {
                    this.updateCartCounterDisplay(mobileBadge, updatedCount);
                }
            });
        }
    }

    /**
     * Update cart counter display with animation
     */
    updateCartCounterDisplay(badge, count) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = "inline-flex";
        } else {
            badge.style.display = "none";
        }
    }

    initializePageModules() {
        // Check if elements exist to determine which page we're on
        const carouselElement = document.querySelector(".carousel-inner");
        const productDetailElement = document.getElementById("product-category");
        const storeCarouselElement = document.querySelector(".store-carousel-wrapper");
        const cartItemsContainer = document.getElementById("cart-items");
        const checkoutItemsContainer = document.getElementById("checkout-items");
        const shopProductCards = document.querySelectorAll('button[title="Add to Cart"]');

        console.log('ProductDetail element found:', !!productDetailElement);

        // Initialize ScrollReveal on ALL pages (not just homepage)
        this.modules.scrollReveal = new ScrollReveal({
            revealDelay: 500,
            observerThreshold: 0.2,
        });

        // Homepage/Index modules
        if (carouselElement) {
            this.modules.carousel = new Carousel({
                autoPlay: true,
                autoPlayInterval: 6000,
            });

            this.modules.storeCarousel = new StoreCarousel({
                cardWidth: 340,
            });
        }

        // Shop page modules
        if (shopProductCards.length > 0 && !productDetailElement) {
            this.modules.shopUI = new ShopUI(productDatabase);
        }

        // Product detail page modules
        if (productDetailElement) {
            console.log('Initializing ProductDetail module...');
            this.modules.productDetail = new ProductDetail(productDatabase);
            console.log('ProductDetail module initialized');
        }

        // Cart page modules
        if (cartItemsContainer) {
            this.modules.cartUI = new CartUI();
        }

        // Checkout page modules
        if (checkoutItemsContainer) {
            this.modules.checkoutUI = new CheckoutUI();
        }
    }

    destroy() {
        // Clean up modules
        if (this.modules.carousel) {
            this.modules.carousel.destroy();
        }

        console.log("App destroyed");
    }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        window.app = new App();
    });
} else {
    window.app = new App();
}
