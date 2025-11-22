/**
 * Inventory Management Module
 * Tracks product stock levels in Firebase Realtime Database
 * Prevents overselling and updates inventory when orders are completed
 */

import { firebasePromise, getDatabaseInstance } from "../config/firebaseConfig.js";
import { ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

class InventoryManager {
    constructor() {
        this.inventoryPath = "inventory";
        this.database = null;
        this.initPromise = this.init();
    }

    /**
     * Initialize Firebase connection
     */
    async init() {
        await firebasePromise;
        this.database = await getDatabaseInstance();
        await this.initializeInventory();
    }

    /**
     * Initialize inventory in Firebase on first load
     * Sets default stock for all products
     */
    async initializeInventory() {
        try {
            const inventoryRef = ref(this.database, this.inventoryPath);
            const snapshot = await get(inventoryRef);

            // If inventory doesn't exist, create it with default stock
            if (!snapshot.exists()) {
                const defaultInventory = {
                    "performance-tennis-shirt": {
                        productId: "performance-tennis-shirt",
                        name: "Uni Tee",
                        quantity: 100,
                        lastUpdated: new Date().toISOString(),
                    },
                    "love-cap": {
                        productId: "love-cap",
                        name: "Love Cap",
                        quantity: 100,
                        lastUpdated: new Date().toISOString(),
                    },
                    "tennis-tank-top": {
                        productId: "tennis-tank-top",
                        name: "Hot Top",
                        quantity: 100,
                        lastUpdated: new Date().toISOString(),
                    },
                };

                await set(inventoryRef, defaultInventory);
                console.log("✅ Inventory initialized with default stock");
            } else {
                console.log("📦 Inventory already exists:", snapshot.val());
            }
        } catch (error) {
            console.error("❌ Error initializing inventory:", error);
        }
    }

    /**
     * Get current stock for a product
     * @param {string} productId - Product ID
     * @returns {Promise<number>} Current stock quantity
     */
    async getStock(productId) {
        try {
            await this.initPromise;
            const productRef = ref(this.database, `${this.inventoryPath}/${productId}`);
            const snapshot = await get(productRef);

            if (snapshot.exists()) {
                return snapshot.val().quantity;
            } else {
                console.warn(`⚠️ Product ${productId} not found in inventory`);
                return 0;
            }
        } catch (error) {
            console.error("❌ Error getting stock:", error);
            return 0;
        }
    }

    /**
     * Check if product is in stock
     * @param {string} productId - Product ID
     * @param {number} quantity - Quantity needed
     * @returns {Promise<boolean>} True if stock available
     */
    async isInStock(productId, quantity = 1) {
        const currentStock = await this.getStock(productId);
        return currentStock >= quantity;
    }

    /**
     * Reduce stock when order is placed
     * @param {string} productId - Product ID
     * @param {number} quantity - Quantity to reduce
     * @returns {Promise<boolean>} True if successful
     */
    async reduceStock(productId, quantity = 1) {
        try {
            const currentStock = await this.getStock(productId);

            if (currentStock < quantity) {
                console.error(`❌ Insufficient stock for ${productId}. Available: ${currentStock}, Requested: ${quantity}`);
                return false;
            }

            const productRef = ref(this.database, `${this.inventoryPath}/${productId}`);
            await update(productRef, {
                quantity: currentStock - quantity,
                lastUpdated: new Date().toISOString(),
            });

            console.log(`✅ Stock reduced for ${productId}. New quantity: ${currentStock - quantity}`);
            return true;
        } catch (error) {
            console.error("❌ Error reducing stock:", error);
            return false;
        }
    }

    /**
     * Increase stock (for returns or admin updates)
     * @param {string} productId - Product ID
     * @param {number} quantity - Quantity to add
     * @returns {Promise<boolean>} True if successful
     */
    async increaseStock(productId, quantity = 1) {
        try {
            const currentStock = await this.getStock(productId);
            const productRef = ref(this.database, `${this.inventoryPath}/${productId}`);

            await update(productRef, {
                quantity: currentStock + quantity,
                lastUpdated: new Date().toISOString(),
            });

            console.log(`✅ Stock increased for ${productId}. New quantity: ${currentStock + quantity}`);
            return true;
        } catch (error) {
            console.error("❌ Error increasing stock:", error);
            return false;
        }
    }

    /**
     * Set stock to specific amount (admin function)
     * @param {string} productId - Product ID
     * @param {number} quantity - New stock quantity
     * @returns {Promise<boolean>} True if successful
     */
    async setStock(productId, quantity) {
        try {
            await this.initPromise;
            const productRef = ref(this.database, `${this.inventoryPath}/${productId}`);

            await update(productRef, {
                quantity: quantity,
                lastUpdated: new Date().toISOString(),
            });

            console.log(`✅ Stock set to ${quantity} for ${productId}`);
            return true;
        } catch (error) {
            console.error("❌ Error setting stock:", error);
            return false;
        }
    }

    /**
     * Get all inventory
     * @returns {Promise<Object>} All products and their stock
     */
    async getAllInventory() {
        try {
            await this.initPromise;
            const inventoryRef = ref(this.database, this.inventoryPath);
            const snapshot = await get(inventoryRef);

            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return null;
            }
        } catch (error) {
            console.error("❌ Error getting all inventory:", error);
            return null;
        }
    }

    /**
     * Display inventory in console (for testing)
     */
    async logInventory() {
        const inventory = await this.getAllInventory();
        if (inventory) {
            console.log("📦 Current Inventory:");
            Object.values(inventory).forEach((item) => {
                console.log(`  - ${item.name}: ${item.quantity} units (Last updated: ${item.lastUpdated})`);
            });
        }
    }
}

// Create and export singleton instance
const inventoryManager = new InventoryManager();

export default inventoryManager;
