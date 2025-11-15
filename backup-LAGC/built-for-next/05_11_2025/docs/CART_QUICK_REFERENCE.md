# Quick Reference: Cart & Checkout

## File Structure
```
javascript/
├── ui/
│   ├── cart.js           (Data layer - cart logic)
│   ├── cartUI.js         (Cart page rendering)
│   └── checkoutUI.js     (Checkout page rendering)
│   └── productDetail.js  (Updated to use Cart)
└── main.js               (Updated with cart/checkout detection)

pages/
├── cart.html             (Shopping cart page)
├── checkout.html         (Checkout form page)
└── product.html          (Integration point)
```

## Quick Start for Developers

### Adding Items to Cart
```javascript
// From product detail page
import Cart from "./ui/cart.js";

const cart = new Cart();
cart.addItem(product, quantity, size, color);
```

### Accessing Cart Data
```javascript
// Load cart
const cart = new Cart();

// Get totals
console.log(cart.getSubtotal());    // Pre-tax/shipping
console.log(cart.getTax());         // 8% of subtotal
console.log(cart.getShipping());    // Shipping cost
console.log(cart.getTotal());       // Final total
```

### Persisting Data
```javascript
// Automatic - just call these methods:
cart.addItem(product, qty, size, color);
cart.removeItem(index);
cart.updateQuantity(index, qty);
cart.clear();

// Data auto-saved to localStorage under "lagc_cart"
```

### Listening for Cart Updates
```javascript
// Listen for cart changes
window.addEventListener("cartUpdated", () => {
    console.log("Cart updated!");
});
```

## Page URLs
- **Cart:** `/pages/cart.html`
- **Checkout:** `/pages/checkout.html`
- **Product:** `/pages/product.html?id=PRODUCT_ID`

## Common Tasks

### Task: Render Cart Items
**File:** `cartUI.js` → `renderItems()` method
```javascript
// Automatically loops through cart.items and creates HTML
// Called whenever cart updates
```

### Task: Calculate Order Total
**File:** `cart.js` → `getTotal()` method
```javascript
const total = cart.getSubtotal() + cart.getTax() + cart.getShipping();
```

### Task: Apply Shipping Cost
**File:** `checkoutUI.js` → Shipping radio buttons
```javascript
// When user selects shipping:
// free → $0
// express → $15
// overnight → $35
```

### Task: Validate Checkout Form
**File:** `checkoutUI.js` → `validateForm()` method
```javascript
// Checks all required fields
// Adds red border to invalid fields
// Prevents form submission
```

## Promo Code System

### Available Codes
| Code | Discount |
|------|----------|
| SAVE10 | 10% |
| SAVE20 | 20% |
| SUMMER15 | 15% |

### Add New Code
**File:** `cart.js` → `applyPromoCode()` method
```javascript
applyPromoCode(code) {
    const promoCodes = {
        SAVE10: 0.1,      // Add here
        NEWYEAR25: 0.25,  // Like this
    };
    return promoCodes[code.toUpperCase()] || false;
}
```

## Data Flow

### Adding Item to Cart
```
Product Page
    ↓
User clicks "Add to Cart"
    ↓
ProductDetail.attachCartListeners()
    ↓
cart.addItem(product, qty, size, color)
    ↓
Saves to localStorage
    ↓
Dispatches "cartUpdated" event
    ↓
Success feedback shown
```

### Viewing Cart
```
User navigates to cart.html
    ↓
Main.js detects cart page
    ↓
Initializes CartUI module
    ↓
CartUI.render() displays items
    ↓
Event listeners attached
    ↓
Ready for interactions
```

### Checking Out
```
User clicks "Proceed to Checkout"
    ↓
Redirects to checkout.html
    ↓
CheckoutUI renders order summary
    ↓
User fills form + selects shipping
    ↓
Clicks "Continue to Payment"
    ↓
Form validated
    ↓
Data stored in sessionStorage
    ↓
Ready for payment integration
```

## Key Classes

### Cart Class
```javascript
new Cart()
├── items[]
├── TAX_RATE = 0.08
├── FREE_SHIPPING_THRESHOLD = $50
├── addItem(product, qty, size, color)
├── removeItem(index)
├── updateQuantity(index, qty)
├── getSubtotal()
├── getTax()
├── getShipping()
├── getTotal()
└── applyPromoCode(code)
```

### CartUI Class
```javascript
new CartUI()
├── cart (Cart instance)
├── render()
├── renderItems()
├── updateSummary()
└── attachEventListeners()
```

### CheckoutUI Class
```javascript
new CheckoutUI()
├── cart (Cart instance)
├── renderOrderSummary()
├── updateSummary()
├── validateForm()
├── getFormData()
└── attachEventListeners()
```

## Testing Scenarios

### Test 1: Add Item to Cart
1. Go to product page
2. Select size and color
3. Change quantity to 2
4. Click "Add to Cart"
5. ✅ Should show success message
6. ✅ Should redirect? (or stay on page)

### Test 2: View Cart
1. Navigate to cart.html
2. ✅ Items should display
3. ✅ Totals should calculate
4. ✅ Should show subtotal, tax, shipping

### Test 3: Update Quantity
1. Click +/- buttons
2. Or type directly in input
3. ✅ Total should update
4. ✅ localStorage should update

### Test 4: Checkout
1. Click "Proceed to Checkout"
2. ✅ Go to checkout.html
3. Fill form
4. Select shipping method
5. ✅ Total should update
6. Click "Continue to Payment"
7. ✅ Should validate form
8. ✅ Data in sessionStorage

## Debugging Tips

### Check localStorage
```javascript
// In browser console
localStorage.getItem("lagc_cart")
// Shows cart items as JSON
```

### Watch Cart Events
```javascript
// In browser console
window.addEventListener("cartUpdated", () => {
    console.log("Cart changed!");
});
```

### Verify Cart State
```javascript
// In browser console
window.app.modules.cartUI.cart.items
// Shows current cart items
```

### Test Promo Code
```javascript
// In browser console
const cart = new Cart();
cart.applyPromoCode("SAVE10")
// Returns: 0.1 (or false if invalid)
```

## Browser DevTools Tricks

### View Form Data
```javascript
// Open DevTools → Console
const form = document.querySelectorAll("input");
form.forEach(input => console.log(input.id, input.value));
```

### Simulate Cart Scenarios
```javascript
// Empty cart
localStorage.removeItem("lagc_cart");
location.reload();

// Pre-populate cart (for testing)
const testCart = [{
    id: "performance-tennis-shirt",
    name: "Test Shirt",
    price: 49.99,
    quantity: 2,
    size: "M",
    color: "Black"
}];
localStorage.setItem("lagc_cart", JSON.stringify(testCart));
```

## Common Issues & Solutions

### Issue: Cart not persisting
**Solution:** Check localStorage is enabled
```javascript
localStorage.setItem("test", "value");
localStorage.getItem("test");
localStorage.removeItem("test");
```

### Issue: Prices not calculating
**Solution:** Verify product has price property
```javascript
console.log(cart.items);  // Check all items have price
console.log(cart.getTotal());  // Should be > 0
```

### Issue: Form validation not working
**Solution:** Check all required fields have correct IDs
```javascript
// Required IDs: first-name, last-name, email, phone,
//               street, city, state, zip, country
```

### Issue: Mobile menu overlapping cart
**Solution:** Check z-index values in CSS
```css
nav { z-index: 50; }
cart-modal { z-index: 40; }
```

## Integration Checklist

- [x] Cart.js module created
- [x] CartUI.js module created
- [x] CheckoutUI.js module created
- [x] cart.html page created
- [x] checkout.html page created
- [x] ProductDetail.js updated
- [x] main.js updated with cart/checkout detection
- [ ] Payment.html page (next phase)
- [ ] Payment processing (next phase)
- [ ] Email confirmations (future)
- [ ] Order history (future)
- [ ] Wishlist feature (future)
