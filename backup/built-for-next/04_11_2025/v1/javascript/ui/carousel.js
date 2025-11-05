/**
 * Carousel Controller
 * Manages hero carousel with slide navigation, dots, and auto-play
 */

class Carousel {
    constructor(options = {}) {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll(".carousel-item");
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = options.autoPlayInterval || 6000;
        this.isAutoPlaying = options.autoPlay !== false;

        if (this.totalSlides === 0) {
            console.warn("Carousel: No slides found.");
            return;
        }

        this.init();
    }

    init() {
        this.attachEventListeners();
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }

    showSlide(index) {
        if (index >= this.totalSlides) this.currentSlide = 0;
        else if (index < 0) this.currentSlide = this.totalSlides - 1;
        else this.currentSlide = index;

        const carouselInner = document.querySelector(".carousel-inner");
        if (carouselInner) {
            carouselInner.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }

        this.updateDots();
    }

    updateDots() {
        const dots = document.querySelectorAll(".absolute.bottom-10 span");
        dots.forEach((dot, i) => {
            if (i === this.currentSlide) {
                dot.classList.add("bg-orange-500");
                dot.classList.remove("bg-gray-300");
            } else {
                dot.classList.add("bg-gray-300");
                dot.classList.remove("bg-orange-500");
            }
        });
    }

    attachEventListeners() {
        // Previous button
        const prevBtn = document.querySelector(".carousel-prev");
        if (prevBtn) {
            prevBtn.addEventListener("click", () => this.showSlide(this.currentSlide - 1));
        }

        // Next button
        const nextBtn = document.querySelector(".carousel-next");
        if (nextBtn) {
            nextBtn.addEventListener("click", () => this.showSlide(this.currentSlide + 1));
        }

        // Dot indicators
        const dots = document.querySelectorAll(".absolute.bottom-10 span");
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => this.showSlide(index));
        });
    }

    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            this.showSlide(this.currentSlide + 1);
        }, this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
    }

    destroy() {
        this.stopAutoPlay();
    }
}

export default Carousel;
