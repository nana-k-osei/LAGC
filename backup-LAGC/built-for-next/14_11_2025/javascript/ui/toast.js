/**
 * Toast Notification System
 * Modern, sleek popup notifications for cart actions and user feedback
 */

class Toast {
    constructor() {
        this.container = this.createContainer();
        this.toasts = [];
    }

    /**
     * Create the toast container
     */
    createContainer() {
        let container = document.getElementById("toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            container.className = "fixed right-4 z-50 flex flex-col gap-3 pointer-events-none";
            // Use inline styles to ensure positioning works
            container.style.cssText = `
                position: fixed;
                top: 120px;
                right: 16px;
                z-index: 50;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - Type of toast: 'success', 'error', 'info', 'warning'
     * @param {number} duration - How long to show the toast (ms), 0 = don't auto-dismiss
     */
    show(message, type = "info", duration = 3000) {
        const toastId = `toast-${Date.now()}-${Math.random()}`;

        // Create toast element
        const toast = document.createElement("div");
        toast.id = toastId;
        toast.className = `toast toast-${type} pointer-events-auto`;

        // Set background and icon based on type
        const bgColors = {
            success: "bg-green-600 border-green-700",
            error: "bg-red-600 border-red-700",
            info: "bg-blue-600 border-blue-700",
            warning: "bg-amber-600 border-amber-700"
        };

        const icons = {
            success: "✓",
            error: "✕",
            info: "ℹ",
            warning: "⚠"
        };

        toast.innerHTML = `
            <div class="flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg ${bgColors[type]} border border-current text-white" style="animation: slideInRight 0.3s ease forwards; pointer-events: auto;">
                <span class="text-lg font-bold flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
                    ${icons[type]}
                </span>
                <span class="text-sm font-medium flex-1">${message}</span>
                <button class="ml-2 text-white hover:opacity-75 transition font-bold text-lg leading-none" 
                        onclick="document.getElementById('${toastId}').remove()">
                    ×
                </button>
            </div>
        `;

        this.container.appendChild(toast);
        this.toasts.push(toastId);

        // Auto-dismiss if duration > 0
        if (duration > 0) {
            setTimeout(() => {
                this.dismiss(toastId);
            }, duration);
        }

        return toastId;
    }

    /**
     * Dismiss a specific toast
     */
    dismiss(toastId) {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            toastElement.style.animation = "slideOutRight 0.3s ease forwards";
            setTimeout(() => {
                toastElement.remove();
                this.toasts = this.toasts.filter(id => id !== toastId);
            }, 300);
        }
    }

    /**
     * Dismiss all toasts
     */
    dismissAll() {
        this.toasts.forEach(toastId => this.dismiss(toastId));
    }

    /**
     * Convenience methods
     */
    success(message, duration = 3000) {
        return this.show(message, "success", duration);
    }

    error(message, duration = 3000) {
        return this.show(message, "error", duration);
    }

    info(message, duration = 3000) {
        return this.show(message, "info", duration);
    }

    warning(message, duration = 3000) {
        return this.show(message, "warning", duration);
    }
}

// Create global toast instance
window.toast = new Toast();

export default Toast;
