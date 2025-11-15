/**
 * Store Carousel Controller
 * Manages horizontal scrolling carousel for product showcase
 */

class StoreCarousel {
    constructor(options = {}) {
        this.storeGrid = document.querySelector(".store-grid");
        this.prevBtn = document.querySelector(".store-carousel-control.prev");
        this.nextBtn = document.querySelector(".store-carousel-control.next");
        this.cardWidth = options.cardWidth || 340;
        this.scrollAmount = options.scrollAmount || this.cardWidth;

        if (!this.storeGrid || !this.prevBtn || !this.nextBtn) {
            console.warn("StoreCarousel: Required elements not found.");
            return;
        }

        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.prevBtn.addEventListener("click", () => this.scroll(-this.scrollAmount));
        this.nextBtn.addEventListener("click", () => this.scroll(this.scrollAmount));
    }

    scroll(amount) {
        this.storeGrid.scrollBy({ left: amount, behavior: "smooth" });
    }
}

export default StoreCarousel;
