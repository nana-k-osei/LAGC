/**
 * Navbar Controller
 * Manages navbar interactions, scroll behavior, and responsiveness
 */

class Navbar {
    constructor(options = {}) {
        this.nav = document.querySelector("#site-nav");
        this.scrollThreshold = options.scrollThreshold || 50;
        this.lastScrollTop = 0;

        if (!this.nav) {
            console.warn("Navbar: Navigation element not found.");
            return;
        }

        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        window.addEventListener("scroll", () => this.handleScroll());
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add scrolled state when scrolling down
        if (scrollTop > this.scrollThreshold) {
            this.nav.classList.add("scrolled");
        } else {
            this.nav.classList.remove("scrolled");
        }

        // Hide/show navbar on scroll
        if (scrollTop > this.lastScrollTop && scrollTop > this.scrollThreshold) {
            // Scrolling down
            this.nav.classList.add("nav-hidden");
        } else {
            // Scrolling up
            this.nav.classList.remove("nav-hidden");
        }

        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
}

export default Navbar;
