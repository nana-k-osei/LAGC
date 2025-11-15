# Cart & Checkout System Documentation

## Overview

The cart and checkout system provides a complete e-commerce workflow with:
- Modern, responsive cart page with item management
- Professional checkout flow with form validation
- Real-time price calculations
- Secure localStorage persistence
- Promo code support
- Multiple shipping options

## Architecture

### Core Modules

#### 1. **Cart.js** - Data Layer
Location: `javascript/ui/cart.js`

Core class for managing shopping cart state and calculations.

**Key Methods:**
```javascript
addItem(product, quantity, size, color)     // Add item to cart
removeItem(itemIndex)                       // Remove item by index
updateQuantity(itemIndex, quantity)         // Update item quantity
getSubtotal()                               // Get subtotal (before tax/shipping)
getTax()                                    // Calculate 8% tax
getShipping()                               // Get shipping cost
getTotal()                                  // Get total (subtotal + tax + shipping)
applyPromoCode(code)                        // Apply promo code
```

**Properties:**
- `items` - Array of cart items
- `TAX_RATE` - 0.08 (8% tax)
- `FREE_SHIPPING_THRESHOLD` - $50 minimum for free shipping

**localStorage:**
- Key: `lagc_cart`
- Auto-persists on every change
- Dispatches `cartUpdated` event for UI synchronization

#### 2. **CartUI.js** - Cart Page
Location: `javascript/ui/cartUI.js`

Manages cart.html display and interactions.

**Key Features:**
- Renders cart items dynamically
- Quantity adjustment (buttons + direct input)
- Remove items
- Real-time price calculations
- Promo code input with validation
- Checkout button

**Key Methods:**
```javascript
render()              // Full cart re-render
renderItems()         // Render individual items
updateSummary()       // Update price totals
attachEventListeners() // Set up event handlers
```

**Empty Cart State:**
- Shows empty message
- Disables checkout button
- Provides "Continue Shopping" link

#### 3. **CheckoutUI.js** - Checkout Page
Location: `javascript/ui/checkoutUI.js`

Manages checkout.html form and order summary.

**Key Features:**
- Three-step checkout progress indicator
- Contact information form
- Shipping address form with auto-validation
- Shipping method selection (Free/Express/Overnight)
- Order summary with real-time updates
- Form validation with visual feedback

**Key Methods:**
```javascript
renderOrderSummary()  // Render items on checkout page
updateSummary()       // Update order totals based on shipping
validateForm()        // Validate all required fields
getFormData()         // Gather form data for payment
attachEventListeners() // Set up event handlers
```

**Shipping Methods:**
- Free Shipping: $0 (5-7 business days)
- Express: $15 (2-3 business days)
- Overnight: $35 (next business day)

## Pages

### Cart Page (`pages/cart.html`)

**URL:** `/pages/cart.html`

**Layout:**
```
┌─────────────────────────────────────────────┐
│         Navigation Bar (All Pages)          │
├────────────────────────┬────────────────────┤
│                        │                    │
│   Cart Items List      │  Order Summary     │
│   ├─ Item 1            │  ├─ Subtotal       │
│   ├─ Item 2            │  ├─ Shipping       │
│   └─ Item 3            │  ├─ Tax            │
│                        │  ├─ Total          │
│                        │  ├─ Promo Code     │
│                        │  └─ Checkout Btn   │
│                        │                    │
├────────────────────────┴────────────────────┤
│         Trust Badges & Benefits             │
├─────────────────────────────────────────────┤
│              Footer                         │
└─────────────────────────────────────────────┘
```

**Key Elements:**
- Empty cart state with continue shopping button
- Item cards with image, details, and quantity controls
- Remove item buttons with confirmation
- Side panel with order summary (sticky on desktop)
- Promo code input

**Responsive Design:**
- Mobile: Full-width layout, stacked items
- Tablet (md): Items take 2/3 width, summary sticky
- Desktop (lg): Items and summary side-by-side

### Checkout Page (`pages/checkout.html`)

**URL:** `/pages/checkout.html`

**Layout:**
```
┌─────────────────────────────────────────────┐
│         Navigation Bar (All Pages)          │
├─────────────────────────────────────────────┤
│    Cart → Checkout → Payment Progress       │
├────────────────────────┬────────────────────┤
│                        │                    │
│  1. Contact Info       │  Order Summary     │
│     ├─ First Name      │  ├─ Item Preview   │
│     ├─ Last Name       │  ├─ Subtotal       │
│     ├─ Email           │  ├─ Shipping       │
│     └─ Phone           │  ├─ Tax            │
│                        │  ├─ Total          │
│  2. Shipping Address   │  └─ Trust Badges   │
│     ├─ Street          │                    │
│     ├─ City, State     │                    │
│     ├─ ZIP             │                    │
│     └─ Country         │                    │
│                        │                    │
│  3. Shipping Method    │                    │
│     ├─ Free (Free)     │                    │
│     ├─ Express ($15)   │                    │
│     └─ Overnight ($35) │                    │
│                        │                    │
│  Continue to Payment → │                    │
└────────────────────────┴────────────────────┘
```

**Form Validation:**
- All fields required
- Visual feedback on errors (red border)
- Real-time total updates based on shipping

**Data Flow:**
1. User fills form
2. Clicks "Continue to Payment"
3. Form validates
4. Data stored in `sessionStorage` as `checkoutData`
5. Redirected to payment.html (future)

## Integration Points

### Product Detail Page Integration

**File:** `javascript/ui/productDetail.js`

```javascript
// Import Cart class
import Cart from "./cart.js";

class ProductDetail {
    constructor(productDatabase) {
        this.cart = new Cart();      // Initialize cart
        this.selectedSize = null;
        this.selectedColor = null;
        // ...
    }

    attachCartListeners() {
        // Add to cart button adds item with size/color
        this.cart.addItem(product, quantity, 
                         this.selectedSize, 
                         this.selectedColor);
    }
}
```

**User Flow:**
1. User selects size and color
2. Sets quantity
3. Clicks "Add to Cart"
4. Item added to cart with all options
5. Success feedback shown
6. Cart persists in localStorage

### Main.js Integration

**File:** `javascript/main.js`

```javascript
import CartUI from "./ui/cartUI.js";
import CheckoutUI from "./ui/checkoutUI.js";

class App {
    initializePageModules() {
        const cartItemsContainer = document.getElementById("cart-items");
        const checkoutItemsContainer = document.getElementById("checkout-items");

        if (cartItemsContainer) {
            this.modules.cartUI = new CartUI();
        }

        if (checkoutItemsContainer) {
            this.modules.checkoutUI = new CheckoutUI();
        }
    }
}
```

**Page Detection:**
- Cart page: Looks for `#cart-items` element
- Checkout page: Looks for `#checkout-items` element
- Initializes appropriate module automatically

## Data Structure

### Cart Item Object
```javascript
{
    id: "performance-tennis-shirt",
    name: "Performance Tennis Shirt",
    price: 49.99,
    image: "../assets/merch/shirt.jpg",
    category: "Apparel",
    quantity: 2,
    size: "M",           // Can be null if not applicable
    color: "Black",      // Can be null if not applicable
}
```

### Checkout Data (sessionStorage)
```javascript
{
    contact: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "(555) 123-4567"
    },
    shipping: {
        street: "123 Main Street",
        apt: "Suite 100",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "United States"
    },
    shippingMethod: "express",
    shippingCost: 15,
    cartItems: [...],
    orderSummary: {
        subtotal: 99.98,
        tax: 7.99,
        shipping: 15,
        total: 122.97
    }
}
```

## Promo Codes

**Supported Codes:**
```javascript
SAVE10  → 10% discount
SAVE20  → 20% discount
SUMMER15 → 15% discount
```

**Implementation:**
```javascript
// In CartUI.js
const discount = this.cart.applyPromoCode("SAVE10");
if (discount) {
    // Apply discount to total
    // Show success feedback
}
```

## Features

### ✅ Implemented
- Shopping cart with localStorage persistence
- Add/remove/update items
- Quantity management
- Price calculations (subtotal, tax, shipping)
- Promo code validation
- Responsive cart page
- Checkout form with validation
- Shipping method selection
- Order summary displays
- Real-time updates
- Mobile-optimized UI

### 🔄 Ready for Implementation
- **Payment Processing** - Stripe/PayPal integration
- **Order Confirmation Page** - POST checkout
- **Email Notifications** - Order confirmation emails
- **Inventory Management** - Stock tracking
- **Wishlist Feature** - Save items
- **Guest Checkout** - Optional account creation

## Styling

### Color Scheme
- **Primary:** Black (#000000)
- **Accent:** Orange (#FF6B35)
- **Background:** White (#FFFFFF)
- **Text:** Dark Gray (#374151)
- **Borders:** Light Gray (#E5E7EB)

### Responsive Breakpoints
- **Mobile:** 0-640px (sm)
- **Tablet:** 640px-1024px (md)
- **Desktop:** 1024px+ (lg)

### Key Classes
```css
/* Buttons */
.bg-orange-500 - Primary action buttons
.bg-black - Secondary buttons
.border-2 - Selected states

/* Cards */
.rounded-2xl - Large border radius
.border border-gray-200 - Light borders
.shadow-lg - Hover effects

/* Forms */
.focus:ring-2 focus:ring-orange-500 - Focus states
.border-red-500 - Error states
.bg-gray-50 - Input backgrounds
```

## Error Handling

### Cart Errors
1. Empty cart checkout prevented
2. Invalid quantity (≤0) removes item
3. Missing product data handled gracefully

### Checkout Errors
1. Required fields validated
2. Visual feedback for invalid fields
3. Form prevents submission on error

### Storage Errors
1. localStorage unavailable fallback (in-memory cart)
2. Corrupted data recovery

## Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ Limited (no ES6 modules)

## Performance Considerations

### Optimization
- Minimal DOM reflows
- Event delegation for cart items
- Efficient price calculations
- localStorage caching
- Sticky positioning for summary on desktop

### Load Time
- Cart page: < 200ms (with localStorage)
- Checkout page: < 150ms (form only)

## Future Enhancements

1. **Cart Abandonment**
   - Recovery emails
   - Auto-save drafts

2. **Advanced Analytics**
   - Track conversion rate
   - Average order value
   - Popular products

3. **Payment Integration**
   - Stripe payment gateway
   - PayPal checkout
   - Apple Pay/Google Pay

4. **Inventory Sync**
   - Real-time stock updates
   - Out-of-stock notifications
   - Backorder options

5. **Customer Accounts**
   - Save addresses
   - Order history
   - Saved payment methods

## Testing Checklist

- [ ] Add item to cart
- [ ] View cart page
- [ ] Update quantity
- [ ] Remove item
- [ ] Apply promo code
- [ ] Proceed to checkout
- [ ] Fill form fields
- [ ] Change shipping method
- [ ] Price updates correctly
- [ ] Cart persists on page reload
- [ ] Mobile layout responsive
- [ ] Empty cart state displays
- [ ] Form validation works
- [ ] All links functional
