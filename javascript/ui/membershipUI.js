/**
 * Membership UI Handler
 * Manages membership signup and login UI interactions
 */

import Authentication from './authentication.js';
import Navbar from './navbar.js';

class MembershipUI {
    constructor() {
        this.navbar = new Navbar();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Sign up form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignUp(e));
        }

        // Sign in form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                try {
                    this.handleSignIn(e);
                } catch (error) {
                    console.error('Error in handleSignIn callback:', error);
                }
            });
        }

        // Toggle between sign up and sign in
        const toggleLogin = document.getElementById('toggle-login');
        const toggleSignup = document.getElementById('toggle-signup');

        if (toggleLogin) {
            toggleLogin.addEventListener('click', () => this.toggleForms());
        }
        if (toggleSignup) {
            toggleSignup.addEventListener('click', () => this.toggleForms());
        }
    }

    /**
     * Handle sign up form submission
     */
    async handleSignUp(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        const errorMsg = document.getElementById('error-message');
        const successMsg = document.getElementById('success-message');
        const submitBtn = document.querySelector('#signup-form button[type="submit"]');
        const btnText = document.getElementById('signup-btn-text');
        const loader = document.getElementById('signup-btn-loader');

        // Validation
        if (!terms) {
            this.showError('Please accept the terms and conditions', errorMsg);
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match', errorMsg);
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters', errorMsg);
            return;
        }

        // Show loader
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');

        // Attempt sign up (no tier required)
        const result = await Authentication.signUp(
            email,
            password,
            fullName
        );

        // Hide loader
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');

        if (result.success) {
            window.toast.success(`Welcome, ${fullName}! Your membership account has been created. Check your email for confirmation.`, 4000);

            // Clear form
            document.getElementById('signup-form').reset();

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/pages/shop.html';
            }, 2000);
        } else {
            this.showError(result.error, errorMsg);
        }
    }

    /**
     * Handle sign in form submission
     */
    async handleSignIn(e) {
        if (!e) {
            console.error('handleSignIn called without event');
            return;
        }

        e.preventDefault();

        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            console.error('Email or password missing');
            const errorMsg = document.getElementById('login-error-message');
            if (errorMsg) {
                this.showError('Please enter both email and password', errorMsg);
            }
            return;
        }

        const errorMsg = document.getElementById('login-error-message');
        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        const btnText = document.getElementById('login-btn-text');
        const loader = document.getElementById('login-btn-loader');

        try {
            // Show loader
            if (submitBtn && btnText && loader) {
                submitBtn.disabled = true;
                btnText.classList.add('hidden');
                loader.classList.remove('hidden');
            }

            console.log('Starting sign in for:', email);
            const result = await Authentication.signIn(email, password);
            console.log('Sign in result:', result);

            if (!result || typeof result !== 'object') {
                throw new Error('Invalid sign-in response');
            }

            if (!result.success) {
                // Hide loader
                if (submitBtn && btnText && loader) {
                    submitBtn.disabled = false;
                    btnText.classList.remove('hidden');
                    loader.classList.add('hidden');
                }

                console.error('Sign in failed:', result.error);
                if (errorMsg) {
                    this.showError(result.error || 'Sign in failed', errorMsg);
                }
                return;
            }

            // Sign in successful
            console.log('Sign in successful, waiting for member data...');

            // Wait for membership data to be populated
            const memberData = await Authentication.waitForMemberData();
            console.log('waitForMemberData returned:', memberData);

            // Get user data
            const currentMemberData = Authentication.getMemberData();
            console.log('Current member data after wait:', currentMemberData);

            // Prepare message
            let welcomeMessage = 'Signed in successfully!';
            if (currentMemberData && currentMemberData.fullName) {
                welcomeMessage = `Welcome back, ${currentMemberData.fullName}! You're signed in and discounts are applied.`;
            }

            // Show success message and redirect
            if (window.toast) {
                window.toast.success(welcomeMessage, 4000);
            }

            // Redirect after toast duration + buffer (4000 + 1500 = 5500ms)
            setTimeout(() => {
                window.location.href = '/pages/shop.html';
            }, 5500);

        } catch (error) {
            console.error('Error in handleSignIn:', error);

            // Hide loader
            if (submitBtn && btnText && loader) {
                submitBtn.disabled = false;
                btnText.classList.remove('hidden');
                loader.classList.add('hidden');
            }

            if (errorMsg) {
                this.showError('An unexpected error occurred. Please try again.', errorMsg);
            }
        }
    }

    /**
     * Toggle between sign up and sign in forms
     */
    toggleForms() {
        const signupForm = document.getElementById('signup-form');
        const loginFormContainer = document.getElementById('login-form-container');

        // Find the signup form container (parent div with class "bg-white p-8...")
        let signupContainer = signupForm.parentElement;
        while (signupContainer && !signupContainer.classList.contains('bg-white')) {
            signupContainer = signupContainer.parentElement;
        }

        // Toggle visibility
        if (signupContainer) {
            signupContainer.classList.toggle('hidden');
        }
        loginFormContainer.classList.toggle('hidden');
    }

    /**
     * Show error message
     */
    showError(message, element) {
        element.textContent = message;
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('hidden');
        }, 5000);
    }

    /**
     * Show success message
     */
    showSuccess(message, element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MembershipUI();
});

export default MembershipUI;
