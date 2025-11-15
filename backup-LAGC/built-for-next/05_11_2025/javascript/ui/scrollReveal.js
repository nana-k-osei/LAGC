/**
 * Scroll Reveal Animation Controller
 * Handles reveal animations for text and content when scrolling into view
 */

class ScrollReveal {
    constructor(options = {}) {
        this.revealDelay = options.revealDelay || 500;
        this.observerThreshold = options.observerThreshold || 0.2;
        this.init();
    }

    init() {
        this.initializeRevealText();
        this.initializeFeatureObserver();
    }

    initializeRevealText() {
        // Reveal primary text immediately
        setTimeout(() => {
            const primary = document.querySelector(".reveal-text.primary");
            if (primary) {
                primary.classList.add("visible");
            }
        }, this.revealDelay);

        // Set up observer for other reveal texts
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay
                            ? parseFloat(entry.target.dataset.delay) * 1000
                            : 0;
                        setTimeout(() => {
                            entry.target.classList.add("visible");
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: this.observerThreshold,
                rootMargin: "0px",
            }
        );

        // Observe all secondary and tertiary reveal texts
        document
            .querySelectorAll(".reveal-text:not(.primary)")
            .forEach((el) => {
                observer.observe(el);
            });
    }

    initializeFeatureObserver() {
        const featureObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        featureObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: this.observerThreshold,
                rootMargin: "0px",
            }
        );

        // Observe all scroll-reveal elements
        document.querySelectorAll(".scroll-reveal").forEach((el) => {
            featureObserver.observe(el);
        });
    }
}

export default ScrollReveal;
