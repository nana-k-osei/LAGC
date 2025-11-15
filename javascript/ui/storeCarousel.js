/**
 * Store Carousel Controller
 * Manages horizontal scrolling carousel for product showcase with infinite loop
 */

class StoreCarousel {
    constructor(options = {}) {
        this.storeGrid = document.querySelector(".store-grid");
        this.prevBtn = document.querySelector(".store-carousel-control.prev");
        this.nextBtn = document.querySelector(".store-carousel-control.next");
        this.cardWidth = options.cardWidth || 340;
        this.scrollAmount = options.scrollAmount || this.cardWidth;
        this.originalItems = [];

        if (!this.storeGrid || !this.prevBtn || !this.nextBtn) {
            console.warn("StoreCarousel: Required elements not found.");
            return;
        }

        this.init();
    }

    init() {
        this.setupInfiniteScroll();
        this.attachEventListeners();
    }

    setupInfiniteScroll() {
        // Clone all items for infinite scroll
        this.originalItems = Array.from(this.storeGrid.children);
        const clonedItems = this.originalItems.map(item => item.cloneNode(true));

        // Append clones to create infinite effect
        clonedItems.forEach(clone => this.storeGrid.appendChild(clone));
    }

    attachEventListeners() {
        this.prevBtn.addEventListener("click", () => this.scroll(-this.scrollAmount));
        this.nextBtn.addEventListener("click", () => this.scroll(this.scrollAmount));

        // Handle infinite scroll wrapping
        this.storeGrid.addEventListener("scroll", () => this.handleInfiniteScroll());
    }

    scroll(amount) {
        this.storeGrid.scrollBy({ left: amount, behavior: "smooth" });
    }

    handleInfiniteScroll() {
        const scrollLeft = this.storeGrid.scrollLeft;
        const itemCount = this.originalItems.length;
        const totalWidth = this.storeGrid.scrollWidth;
        const containerWidth = this.storeGrid.clientWidth;

        // If scrolled past original items, reset to beginning
        if (scrollLeft > (totalWidth - containerWidth - 100)) {
            this.storeGrid.scrollLeft = 0;
        }
        // If scrolled too far back, jump to end of original items
        if (scrollLeft < 100) {
            this.storeGrid.scrollLeft = (totalWidth / 2) - containerWidth;
        }
    }
}

export default StoreCarousel;
