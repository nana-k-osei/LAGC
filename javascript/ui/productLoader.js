/**
 * Product Loader
 * Loads product data from URL parameters and displays it on the product page
 */

class ProductLoader {
    constructor() {
        this.productData = null;
        this.currentImageIndex = 0;
    }

    /**
     * Get product ID from URL
     */
    getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    /**
     * Load product data (mock data for now)
     * In production, this would fetch from an API
     */
    async loadProduct(productId) {
        try {
            // Mock product data - replace with API call later
            const mockProducts = {
                'apparel-1': {
                    id: 'apparel-1',
                    name: 'Premium Performance Racket',
                    category: 'Apparel',
                    price: 249.99,
                    originalPrice: 329.99,
                    description: 'Professional-grade tennis racket designed for advanced players. Engineered with aerospace materials for maximum power and control.',
                    images: [
                        '/assets/imgs/hero-1.jpg',
                        '/assets/imgs/hero-2.jpg',
                        '/assets/imgs/hero-3.jpg'
                    ],
                    features: [
                        'Lightweight aluminum frame',
                        'Carbon fiber reinforced strings',
                        'Ergonomic grip design',
                        'Vibration dampening technology'
                    ],
                    inStock: true,
                    rating: 4.8,
                    reviews: 156
                },
                'apparel-2': {
                    id: 'apparel-2',
                    name: 'Women\'s Performance Tank',
                    category: 'Clothing',
                    price: 79.99,
                    originalPrice: 99.99,
                    description: 'Moisture-wicking performance tank top designed for competitive tennis. Breathable fabric keeps you cool and dry during intense matches.',
                    images: [
                        '/assets/imgs/hero-1.jpg',
                        '/assets/imgs/hero-2.jpg'
                    ],
                    features: [
                        'Moisture-wicking fabric',
                        '4-way stretch',
                        'Seamless construction',
                        'UPF 50+ sun protection'
                    ],
                    inStock: true,
                    rating: 4.6,
                    reviews: 89
                }
            };

            this.productData = mockProducts[productId] || this.getDefaultProduct(productId);
            return this.productData;
        } catch (error) {
            console.error('Error loading product:', error);
            return null;
        }
    }

    /**
     * Get default product if not found
     */
    getDefaultProduct(productId) {
        return {
            id: productId,
            name: 'Premium Product',
            category: 'Apparel',
            price: 99.99,
            originalPrice: 149.99,
            description: 'High-quality tennis product designed for performance and comfort.',
            images: ['/assets/imgs/hero-1.jpg'],
            features: [
                'Premium quality',
                'Professional design',
                'Durable construction'
            ],
            inStock: true,
            rating: 4.5,
            reviews: 42
        };
    }

    /**
     * Render product data to page
     */
    renderProduct() {
        if (!this.productData) return;

        const data = this.productData;

        // Update breadcrumb
        document.getElementById('breadcrumb-category').textContent = data.category;
        document.getElementById('breadcrumb-name').textContent = data.name;

        // Update product category
        document.getElementById('product-category').textContent = data.category;

        // Update product name
        document.getElementById('product-name').textContent = data.name;

        // Update prices
        document.getElementById('product-price').textContent = `₵${data.price.toFixed(2)}`;
        if (data.originalPrice) {
            document.getElementById('product-original-price').textContent = `₵${data.originalPrice.toFixed(2)}`;
        }

        // Update description
        document.getElementById('product-description').textContent = data.description;

        // Update images
        this.renderImageGallery();

        // Update features
        this.renderFeatures();

        // Update stock status
        const stockEl = document.getElementById('product-stock-status');
        if (stockEl) {
            if (data.inStock) {
                stockEl.innerHTML = '<span class="text-green-600 font-bold">✓ In Stock</span>';
            } else {
                stockEl.innerHTML = '<span class="text-red-600 font-bold">Out of Stock</span>';
            }
        }

        // Update page title
        document.title = `${data.name} - Love All Girls Club`;
    }

    /**
     * Render image gallery
     */
    renderImageGallery() {
        if (!this.productData || !this.productData.images) return;

        const container = document.getElementById('product-thumbnails-container');
        const mainImage = document.getElementById('product-image-main');

        if (!container) return;

        // Clear existing thumbnails
        container.innerHTML = '';

        // Create thumbnails
        this.productData.images.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.src = image;
            thumb.alt = `Product ${index + 1}`;
            thumb.className = `cursor-pointer rounded-lg border-2 ${index === 0 ? 'border-orange-500' : 'border-gray-200'
                } hover:border-orange-500 transition`;
            thumb.style.height = '80px';
            thumb.style.width = '80px';
            thumb.style.objectFit = 'cover';

            thumb.addEventListener('click', () => {
                this.currentImageIndex = index;
                mainImage.src = image;

                // Update thumbnail borders
                document.querySelectorAll('#product-thumbnails-container img').forEach((t, i) => {
                    if (i === index) {
                        t.classList.add('border-orange-500');
                        t.classList.remove('border-gray-200');
                    } else {
                        t.classList.add('border-gray-200');
                        t.classList.remove('border-orange-500');
                    }
                });
            });

            container.appendChild(thumb);
        });

        // Set main image
        mainImage.src = this.productData.images[0];

        // Setup navigation arrows
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentImageIndex =
                    (this.currentImageIndex - 1 + this.productData.images.length) %
                    this.productData.images.length;
                mainImage.src = this.productData.images[this.currentImageIndex];
                this.updateThumbnailSelection();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentImageIndex =
                    (this.currentImageIndex + 1) % this.productData.images.length;
                mainImage.src = this.productData.images[this.currentImageIndex];
                this.updateThumbnailSelection();
            });
        }
    }

    /**
     * Update thumbnail selection
     */
    updateThumbnailSelection() {
        document.querySelectorAll('#product-thumbnails-container img').forEach((t, i) => {
            if (i === this.currentImageIndex) {
                t.classList.add('border-orange-500');
                t.classList.remove('border-gray-200');
            } else {
                t.classList.add('border-gray-200');
                t.classList.remove('border-orange-500');
            }
        });
    }

    /**
     * Render features list
     */
    renderFeatures() {
        if (!this.productData || !this.productData.features) return;

        const featuresList = document.getElementById('product-features');
        if (!featuresList) return;

        featuresList.innerHTML = this.productData.features
            .map(
                (feature) => `
            <li class="flex items-start gap-3">
                <svg
                    class="w-5 h-5 text-orange-500 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M9 16.2L4.8 12m-1.5 1.5l9 9 12-12"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                    />
                </svg>
                <span>${feature}</span>
            </li>
        `
            )
            .join('');
    }
}

export default ProductLoader;
