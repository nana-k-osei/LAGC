/**
 * Authentication Module
 * Handles user sign-up, login, logout, and member status verification
 */

import { firebasePromise, getAuthInstance, getDatabaseInstance } from '../config/firebaseConfig.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import {
    ref,
    set,
    get,
    update,
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';

class Authentication {
    constructor() {
        this.currentUser = null;
        this.isMember = false;
        this.membershipData = null;
        this.authReady = false;
        this.auth = null;
        this.database = null;
        this.initPromise = this.init();
    }

    /**
     * Initialize Firebase and auth listener
     */
    async init() {
        // Wait for Firebase to initialize
        await firebasePromise;
        this.auth = await getAuthInstance();
        this.database = await getDatabaseInstance();
        
        // Now set up auth listener
        this.initAuthListener();
    }

    /**
     * Listen for authentication state changes
     */
    initAuthListener() {
        onAuthStateChanged(this.auth, async (user) => {
            console.log('onAuthStateChanged fired, user:', user?.email);
            this.currentUser = user;
            if (user) {
                // User is logged in, check membership status
                await this.checkMembershipStatus(user.uid);
                console.log('User logged in:', user.email);
                console.log('membershipData after login:', this.membershipData);
                this.onUserLoggedIn(user);
            } else {
                this.isMember = false;
                this.membershipData = null;
                console.log('User logged out');
                this.onUserLoggedOut();
            }
            // Mark auth as ready after first state change
            this.authReady = true;
            console.log('Auth state is now ready');
        });
    }

    /**
     * Create a new user account (free membership)
     * Discount is fetched from global discount set by admin
     */
    async signUp(email, password, fullName) {
        try {
            // Ensure Firebase is ready
            await this.initPromise;
            
            // Create auth user
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const uid = userCredential.user.uid;

            // Get current global discount from Firebase
            let globalDiscount = 0;
            try {
                const discountRef = ref(this.database, 'discounts/global');
                const snapshot = await get(discountRef);
                if (snapshot.exists()) {
                    globalDiscount = snapshot.val().percentage || 0;
                }
            } catch (error) {
                console.log('Could not fetch global discount, using 0%');
            }

            // Store member data in database
            const memberData = {
                uid: uid,
                email: email,
                fullName: fullName,
                discountPercentage: globalDiscount, // Inherits current global discount
                joinDate: new Date().toISOString(),
                status: 'active',
                isAdmin: false, // New members are not admins by default
            };

            await set(ref(this.database, `members/${uid}`), memberData);

            this.currentUser = userCredential.user;
            this.isMember = true;
            this.membershipData = memberData;

            console.log('✅ Member account created:', email);
            return { success: true, user: userCredential.user, memberData };
        } catch (error) {
            console.error('❌ Sign-up error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Sign in existing user
     */
    async signIn(email, password) {
        try {
            // Ensure Firebase is ready
            await this.initPromise;
            
            console.log('Starting sign in for:', email);
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            console.log('Firebase sign in successful, waiting for listener to populate data...');
            this.currentUser = userCredential.user;

            // Call checkMembershipStatus but don't wait for auth listener
            // The listener will handle it and set membershipData
            await this.checkMembershipStatus(userCredential.user.uid);
            console.log('checkMembershipStatus completed, membershipData:', this.membershipData);
            console.log('User signed in successfully:', email);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Sign-in error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Sign out current user
     */
    async signOut() {
        try {
            await signOut(this.auth);
            this.currentUser = null;
            this.isMember = false;
            this.membershipData = null;
            console.log('User signed out');
            return { success: true };
        } catch (error) {
            console.error('Sign-out error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Check if user is a member and get membership data
     */
    async checkMembershipStatus(uid) {
        try {
            // Ensure Firebase is ready
            await this.initPromise;
            
            console.log('checkMembershipStatus called for uid:', uid);
            const memberRef = ref(this.database, `members/${uid}`);
            const snapshot = await get(memberRef);

            console.log('Firebase query result - exists:', snapshot.exists());
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('Member data retrieved:', data);
                this.membershipData = data;
                this.isMember = this.membershipData.status === 'active';
                console.log('Set membershipData and isMember:', { membershipData: this.membershipData, isMember: this.isMember });
            } else {
                console.log('No member record found for uid:', uid);
                this.isMember = false;
                this.membershipData = null;
            }

            return this.isMember;
        } catch (error) {
            console.error('Error checking membership status:', error.message);
            console.error('Error details:', error);
            return false;
        }
    }

    /**
     * Get discount percentage for current user
     * Discount is set by admin in Firebase database
     */
    getDiscount() {
        return this.isMember && this.membershipData
            ? this.membershipData.discountPercentage
            : 0;
    }

    /**
     * Get member data
     */
    getMemberData() {
        return this.membershipData;
    }

    /**
     * Get full name of current user
     */
    getFullName() {
        return this.membershipData ? this.membershipData.fullName : null;
    }

    /**
     * Check if current user is admin
     */
    isAdmin() {
        return this.membershipData ? this.membershipData.isAdmin === true : false;
    }

    /**
     * Wait for authentication state to be determined
     */
    async waitForAuthReady() {
        console.log('Waiting for auth to be ready...');
        let attempts = 0;
        while (!this.authReady && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        console.log('Auth ready after', attempts * 100, 'ms');
        return this.authReady;
    }

    /**
     * Wait for membership data to be populated after sign in
     */
    async waitForMemberData() {
        console.log('Waiting for member data...');
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds total (50 * 100ms)

        while (!this.membershipData && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
            if (attempts % 10 === 0) {
                console.log(`Still waiting for member data... attempt ${attempts}/${maxAttempts}`);
            }
        }

        if (this.membershipData) {
            console.log('Member data ready after', attempts * 100, 'ms:', this.membershipData);
        } else {
            console.warn('Member data not available after', attempts * 100, 'ms');
        }

        return this.membershipData;
    }

    /**
     * Callback when user logs in (override in app)
     */
    onUserLoggedIn(user) {
        // Override this in your app to handle login
    }

    /**
     * Callback when user logs out (override in app)
     */
    onUserLoggedOut() {
        // Override this in your app to handle logout
    }

    /**
     * Update member profile
     */
    async updateMemberProfile(uid, updates) {
        try {
            await update(ref(this.database, `members/${uid}`), updates);
            this.membershipData = { ...this.membershipData, ...updates };
            console.log('Member profile updated');
            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all members (admin only)
     */
    async getAllMembers() {
        try {
            const membersRef = ref(this.database, 'members');
            const snapshot = await get(membersRef);

            if (!snapshot.exists()) {
                return [];
            }

            const membersData = snapshot.val();
            const members = [];

            for (const [id, data] of Object.entries(membersData)) {
                members.push({
                    id,
                    ...data,
                });
            }

            return members;
        } catch (error) {
            console.error('Error fetching members:', error.message);
            return [];
        }
    }

    /**
     * Set admin status for a member (admin only)
     */
    async setAdminStatus(memberId, isAdmin) {
        try {
            await update(ref(this.database, `members/${memberId}`), {
                isAdmin: isAdmin,
            });
            console.log(`Member ${memberId} admin status updated to ${isAdmin}`);
            return { success: true };
        } catch (error) {
            console.error('Error updating admin status:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export default new Authentication();
