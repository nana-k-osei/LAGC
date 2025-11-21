/**
 * Product Database
 * Contains all product information for the e-commerce store
 */

const productDatabase = {
    "performance-tennis-shirt": {
        id: "performance-tennis-shirt",
        name: "Uni Tee",
        category: "Women's Apparel",
        price: 120,
        originalPrice: null,
        image: "/assets/merch/shop/uni-tee.png",
        images: [
            "/assets/merch/shop/uni-tee.png",
            "/assets/merch/shop/uni-tee-1.jpg",
            "/assets/merch/shop/uni-tee-2.jpg"
        ],
        description:
            "Experience ultimate comfort and performance with our premium Uni Tee. Engineered for serious players who demand the best.",
        features: [
            "Breathable moisture-wicking fabric",
            "Premium comfort for extended play",
            "Flatlock seams prevent chafing",
            "Anatomical fit design",
            "Available in multiple colors",
            "Machine washable",
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Green"],
        isNew: true,
    },
    "love-cap": {
        id: "love-cap",
        name: "Love Cap",
        category: "Women's Apparel",
        price: 75,
        originalPrice: null,
        image: "/assets/merch/shop/cap.png",
        images: [
            "/assets/merch/shop/cap.png",
            "/assets/merch/shop/cap-1.jpg",
            "/assets/merch/shop/cap-2.jpg"
        ],
        description:
            "Stay stylish on and off the court with our premium Love Cap. Perfect for sunny days and completing your tennis look.",
        features: [
            "Adjustable strap closure",
            "UV protection",
            "Breathable material",
            "Moisture-wicking sweatband",
            "Classic fit design",
            "Available in multiple colors",
        ],
        sizes: null,
        colors: ["White"],
        isNew: false,
    },
    "tennis-tank-top": {
        id: "tennis-tank-top",
        name: "Hot Top",
        category: "Women's Apparel",
        price: 112,
        originalPrice: null,
        image: "/assets/merch/shop/hot-top.png",
        images: [
            "/assets/merch/shop/hot-top.png",
            "/assets/merch/shop/hot-top-1.jpg",
            "/assets/merch/shop/hot-top-2.jpg"
        ],
        description:
            "Stay cool and comfortable with our premium Hot Top. Perfect for warm weather matches and training sessions.",
        features: [
            "Lightweight breathable mesh",
            "UV protection for sun safety",
            "Moisture-wicking technology",
            "Racerback design",
            "Available in vibrant colors",
            "Durable construction",
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Green"],
        isNew: false,
    },
};

export default productDatabase;
