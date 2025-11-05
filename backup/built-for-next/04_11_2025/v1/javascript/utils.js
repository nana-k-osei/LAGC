/**
 * Utility Functions
 * Helper functions for common tasks
 */

/**
 * Safely query elements with fallback
 */
export const querySelector = (selector) => {
    return document.querySelector(selector);
};

export const querySelectorAll = (selector) => {
    return document.querySelectorAll(selector);
};

/**
 * Add class with check
 */
export const addClass = (element, className) => {
    if (element) {
        element.classList.add(className);
    }
};

/**
 * Remove class with check
 */
export const removeClass = (element, className) => {
    if (element) {
        element.classList.remove(className);
    }
};

/**
 * Toggle class with check
 */
export const toggleClass = (element, className) => {
    if (element) {
        element.classList.toggle(className);
    }
};

/**
 * Check if element has class
 */
export const hasClass = (element, className) => {
    return element ? element.classList.contains(className) : false;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};
