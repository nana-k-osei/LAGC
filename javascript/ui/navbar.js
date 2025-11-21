/**
 * Navbar Controller
 * Manages navbar interactions, scroll behavior, and mobile menu
 */

class Navbar {
    constructor(options = {}) {
        this.nav = document.querySelector("#site-nav");
        this.filterBar = document.querySelector("section[class*='sticky']");
        this.mobileMenuBtn = document.querySelector("#mobile-menu-btn");
        this.mobileMenu = document.querySelector("#mobile-menu");
        this.scrollThreshold = options.scrollThreshold || 50;
        this.lastScrollTop = 0;
        this.mobileMenuOpen = false;
        this.navbarHeight = 0;

        console.log('Navbar initialized:', {
            nav: !!this.nav,
            mobileMenuBtn: !!this.mobileMenuBtn,
            mobileMenu: !!this.mobileMenu
        });

        // Only initialize if nav element exists
        if (!this.nav) {
            console.warn("Navbar: Navigation element not found. Skipping initialization.");
            return;
        }

        this.init();
    }

    init() {
        this.calculateNavbarHeight();
        this.attachEventListeners();
        window.addEventListener("resize", () => this.calculateNavbarHeight());
    }

    /**
     * Calculate navbar height for positioning filter bar
     */
    calculateNavbarHeight() {
        if (this.nav) {
            this.navbarHeight = this.nav.offsetHeight;
        }
    }

    attachEventListeners() {
        window.addEventListener("scroll", () => this.handleScroll());

        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener("click", () => this.toggleMobileMenu());
        }

        // Close mobile menu when link is clicked
        if (this.mobileMenu) {
            const links = this.mobileMenu.querySelectorAll("a");
            links.forEach(link => {
                link.addEventListener("click", () => this.closeMobileMenu());
            });
        }
    }

    toggleMobileMenu() {
        console.log('toggleMobileMenu called, mobileMenuOpen:', this.mobileMenuOpen);
        this.mobileMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
    }

    openMobileMenu() {
        if (!this.mobileMenu) {
            console.error('Mobile menu element not found');
            return;
        }
        console.log('Opening mobile menu, scrollHeight:', this.mobileMenu.scrollHeight);
        this.mobileMenuOpen = true;
        this.mobileMenu.style.maxHeight = this.mobileMenu.scrollHeight + "px";
        this.mobileMenuBtn.classList.add("active");
    }

    closeMobileMenu() {
        if (!this.mobileMenu) return;
        console.log('Closing mobile menu');
        this.mobileMenuOpen = false;
        this.mobileMenu.style.maxHeight = "0";
        this.mobileMenuBtn.classList.remove("active");
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add scrolled state when scrolling down
        if (scrollTop > this.scrollThreshold) {
            this.nav.classList.add("scrolled");
        } else {
            this.nav.classList.remove("scrolled");
        }

        // Hide/show navbar and filter bar on scroll
        if (scrollTop > this.lastScrollTop && scrollTop > this.scrollThreshold) {
            // Scrolling down
            this.nav.classList.add("nav-hidden");
            if (this.filterBar) {
                this.filterBar.classList.add("nav-hidden");
                // When navbar is hidden, filter bar should be at top of viewport
                this.filterBar.style.top = "0";
            }
        } else {
            // Scrolling up
            this.nav.classList.remove("nav-hidden");
            if (this.filterBar) {
                this.filterBar.classList.remove("nav-hidden");
                // When navbar is visible, filter bar should be below it
                this.filterBar.style.top = (this.navbarHeight) + "px";
            }
        }

        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
}

export default Navbar;

