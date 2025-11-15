/**
 * Main Application Entry Point
 * Initializes all modules and manages app lifecycle
 */

import Carousel from "./ui/carousel.js";
import StoreCarousel from "./ui/storeCarousel.js";
import Navbar from "./ui/navbar.js";
import ScrollReveal from "./ui/scrollReveal.js";

class App {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        console.log("Initializing LAGC App...");

        // Initialize modules
        this.modules.carousel = new Carousel({
            autoPlay: true,
            autoPlayInterval: 6000,
        });

        this.modules.storeCarousel = new StoreCarousel({
            cardWidth: 340,
        });

        this.modules.navbar = new Navbar({
            scrollThreshold: 50,
        });

        this.modules.scrollReveal = new ScrollReveal({
            revealDelay: 500,
            observerThreshold: 0.2,
        });

        console.log("App initialized successfully");
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
document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
});
