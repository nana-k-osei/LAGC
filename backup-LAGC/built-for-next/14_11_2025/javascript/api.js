/**
 * API Module
 * Handles all fetch requests and data fetching
 * Ready for backend API integration
 */

class API {
    constructor(baseURL = "/api") {
        this.baseURL = baseURL;
        this.headers = {
            "Content-Type": "application/json",
        };
    }

    /**
     * Fetch products from local JSON or API
     */
    async getProducts() {
        try {
            const response = await fetch("data/products.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    /**
     * Fetch single product by ID
     */
    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find((product) => product.id === id);
        } catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }
    }

    /**
     * Fetch featured products
     */
    async getFeaturedProducts() {
        try {
            const products = await this.getProducts();
            return products.filter((product) => product.featured);
        } catch (error) {
            console.error("Error fetching featured products:", error);
            return [];
        }
    }

    /**
     * Generic GET request for future API calls
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: "GET",
                headers: this.headers,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    /**
     * Generic POST request for future API calls
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error posting data:", error);
            return null;
        }
    }

    /**
     * Generic PUT request for future API calls
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: "PUT",
                headers: this.headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error updating data:", error);
            return null;
        }
    }

    /**
     * Generic DELETE request for future API calls
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: "DELETE",
                headers: this.headers,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error deleting data:", error);
            return null;
        }
    }
}

export default API;
