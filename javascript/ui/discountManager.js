/**
 * Discount Manager
 * Admin interface to manage global discount that gets applied to all active members
 * This allows setting a single discount percentage that inherits to all members
 */

import { database } from '../config/firebaseConfig.js';
import { ref, set, get, update } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';
import Authentication from './authentication.js';

class DiscountManager {
    constructor() {
        this.globalDiscount = 0;
        this.discountRecords = [];
        this.isAdmin = false;
    }

    /**
     * Initialize discount manager
     */
    async initialize() {
        await this.loadGlobalDiscount();
        await this.loadDiscountHistory();
    }

    /**
     * Load current global discount from Firebase
     */
    async loadGlobalDiscount() {
        try {
            const discountRef = ref(database, 'discounts/global');
            const snapshot = await get(discountRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                this.globalDiscount = data.percentage || 0;
                console.log('✅ Global discount loaded:', this.globalDiscount + '%');
            } else {
                console.log('No global discount set yet');
                this.globalDiscount = 0;
            }
            return this.globalDiscount;
        } catch (error) {
            console.error('❌ Error loading global discount:', error.message);
            return 0;
        }
    }

    /**
     * Set global discount (admin only)
     * This discount will be inherited by all active members
     */
    async setGlobalDiscount(discountPercentage) {
        try {
            if (discountPercentage < 0 || discountPercentage > 100) {
                throw new Error('Discount must be between 0 and 100');
            }

            const discountData = {
                percentage: discountPercentage,
                setBy: Authentication.currentUser?.email || 'admin',
                setAt: new Date().toISOString(),
                previousPercentage: this.globalDiscount,
            };

            // Update global discount
            await set(ref(database, 'discounts/global'), {
                percentage: discountPercentage,
                lastUpdated: new Date().toISOString(),
                updatedBy: Authentication.currentUser?.email || 'admin',
            });

            // Record in history
            const timestamp = new Date().getTime();
            await set(ref(database, `discounts/history/${timestamp}`), discountData);

            // Update all active members with new discount
            await this.applyDiscountToAllMembers(discountPercentage);

            this.globalDiscount = discountPercentage;
            console.log('✅ Global discount updated to:', discountPercentage + '%');
            return { success: true, message: 'Discount updated for all members' };
        } catch (error) {
            console.error('❌ Error setting discount:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Apply discount to all active members
     */
    async applyDiscountToAllMembers(discountPercentage) {
        try {
            const membersRef = ref(database, 'members');
            const snapshot = await get(membersRef);

            if (snapshot.exists()) {
                const members = snapshot.val();
                const updates = {};

                // Update each member's discount if they're active
                for (const [uid, memberData] of Object.entries(members)) {
                    if (memberData.status === 'active') {
                        updates[`members/${uid}/discountPercentage`] = discountPercentage;
                    }
                }

                // Apply all updates at once
                if (Object.keys(updates).length > 0) {
                    await update(ref(database), updates);
                    console.log(`✅ Applied ${discountPercentage}% discount to ${Object.keys(updates).length} active members`);
                }
            }
        } catch (error) {
            console.error('❌ Error applying discount to members:', error.message);
        }
    }

    /**
     * Load discount history
     */
    async loadDiscountHistory() {
        try {
            const historyRef = ref(database, 'discounts/history');
            const snapshot = await get(historyRef);

            if (snapshot.exists()) {
                this.discountRecords = Object.entries(snapshot.val()).map(([timestamp, data]) => ({
                    timestamp: new Date(data.setAt).toLocaleString(),
                    percentage: data.percentage,
                    previousPercentage: data.previousPercentage,
                    setBy: data.setBy,
                }));
                console.log('✅ Discount history loaded:', this.discountRecords);
            }
            return this.discountRecords;
        } catch (error) {
            console.error('Error loading discount history:', error.message);
            return [];
        }
    }

    /**
     * Get current global discount
     */
    getGlobalDiscount() {
        return this.globalDiscount;
    }

    /**
     * Get discount history
     */
    getDiscountHistory() {
        return this.discountRecords;
    }

    /**
     * Create discount table UI (for admin panel)
     */
    createDiscountTableUI() {
        const container = document.createElement('div');
        container.className = 'discount-management-table p-8 bg-white rounded-lg';

        container.innerHTML = `
            <h3 class="text-2xl font-bold mb-6">Discount Management</h3>
            
            <!-- Current Discount -->
            <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-sm text-gray-600">Current Global Discount</p>
                <p class="text-3xl font-bold text-blue-600">${this.globalDiscount}%</p>
                <p class="text-xs text-gray-500 mt-2">Applied to all active members</p>
            </div>

            <!-- Set New Discount -->
            <div class="mb-6">
                <label class="block text-sm font-bold mb-2">Set New Discount (%)</label>
                <div class="flex gap-2">
                    <input 
                        type="number" 
                        id="discount-input" 
                        min="0" 
                        max="100" 
                        placeholder="Enter discount percentage"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                    <button 
                        id="update-discount-btn"
                        class="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition"
                    >
                        Update
                    </button>
                </div>
            </div>

            <!-- History Table -->
            <div class="mt-8">
                <h4 class="text-lg font-bold mb-4">Discount History</h4>
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border border-gray-300 px-4 py-2 text-left text-sm font-bold">Timestamp</th>
                                <th class="border border-gray-300 px-4 py-2 text-left text-sm font-bold">New Discount</th>
                                <th class="border border-gray-300 px-4 py-2 text-left text-sm font-bold">Previous</th>
                                <th class="border border-gray-300 px-4 py-2 text-left text-sm font-bold">Set By</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.discountRecords.length > 0
                ? this.discountRecords
                    .reverse()
                    .map(
                        (record) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="border border-gray-300 px-4 py-2 text-sm">${record.timestamp}</td>
                                    <td class="border border-gray-300 px-4 py-2 text-sm font-bold">${record.percentage}%</td>
                                    <td class="border border-gray-300 px-4 py-2 text-sm">${record.previousPercentage}%</td>
                                    <td class="border border-gray-300 px-4 py-2 text-sm">${record.setBy}</td>
                                </tr>
                            `
                    )
                    .join('')
                : '<tr><td colspan="4" class="border border-gray-300 px-4 py-2 text-center text-gray-500">No discount history yet</td></tr>'
            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return container;
    }
}

export default new DiscountManager();
