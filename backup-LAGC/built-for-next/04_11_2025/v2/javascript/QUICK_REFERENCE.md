# Quick Reference Guide - JavaScript Modules

## File Locations
```
javascript/main.js              ← START HERE (app entry point)
javascript/api.js               ← Data fetching
javascript/utils.js             ← Helper functions
javascript/ui/carousel.js       ← Hero carousel
javascript/ui/storeCarousel.js  ← Store carousel
javascript/ui/navbar.js         ← Navigation
javascript/ui/scrollReveal.js   ← Animations
```

## How It Works

1. **index.html loads** → `<script type="module" src="javascript/main.js"></script>`
2. **main.js runs** → Imports and initializes all modules
3. **Modules initialize** → Each module sets up its functionality
4. **App is ready** → Users see normal, fully-functional site

## Module at a Glance

### Carousel (Hero Section)
```javascript
// Automatically initialized by main.js
// Features:
- 3-slide rotation
- Auto-play every 6 seconds
- Prev/Next buttons
- Dot indicators clickable
```

### StoreCarousel (Product Showcase)
```javascript
// Automatically initialized by main.js
// Features:
- Horizontal scrolling
- Smooth animations
- Prev/Next buttons responsive
```

### Navbar (Navigation Bar)
```javascript
// Automatically initialized by main.js
// Features:
- Sticky positioning
- Show/hide on scroll
- Scroll detection
- Responsive design
```

### ScrollReveal (Animations)
```javascript
// Automatically initialized by main.js
// Features:
- Intersection observer
- Staggered animations
- Configurable delays
```

### API (Data Fetching)
```javascript
// Usage:
const api = new API();
const products = await api.getProducts();
const featured = await api.getFeaturedProducts();
```

### Utils (Helpers)
```javascript
// Usage:
import { addClass, removeClass, debounce } from "./utils.js";
addClass(element, "active");
removeClass(element, "hidden");
const throttledScroll = throttle(handleScroll, 300);
```

## Testing Modules

Open browser console and type:
```javascript
window.app                          // App instance
window.app.modules.carousel         // Carousel module
window.app.modules.navbar           // Navbar module
window.app.modules.storeCarousel    // Store carousel module
window.app.modules.scrollReveal     // Scroll reveal module
```

## Adding a New Module

### 1. Create file: `javascript/ui/myModule.js`
```javascript
class MyModule {
  constructor() {
    this.init();
  }

  init() {
    console.log("MyModule initialized");
  }

  destroy() {
    // Cleanup code
  }
}

export default MyModule;
```

### 2. Import in `javascript/main.js`
```javascript
import MyModule from "./ui/myModule.js";
```

### 3. Initialize in App class
```javascript
this.modules.myModule = new MyModule();
```

### 4. Done! ✅

## Common Tasks

### DOM Selection
```javascript
import { querySelector, querySelectorAll } from "./utils.js";

const element = querySelector(".my-class");
const elements = querySelectorAll(".my-class");
```

### Adding Classes
```javascript
import { addClass, removeClass, toggleClass } from "./utils.js";

addClass(element, "active");
removeClass(element, "hidden");
toggleClass(element, "dark-mode");
```

### Debouncing/Throttling
```javascript
import { debounce, throttle } from "./utils.js";

// Debounce: wait until user stops typing (300ms no changes)
const handleSearch = debounce((query) => {
  console.log("Searching for:", query);
}, 300);

// Throttle: max once every 300ms
const handleResize = throttle(() => {
  console.log("Window resized");
}, 300);
```

### Fetching Data
```javascript
import API from "./api.js";

const api = new API();
const products = await api.getProducts();
const product = await api.getProductById("performance-tennis-shirt");
```

## Debugging

### Enable Verbose Logging
Check browser console for initialization messages:
```
Initializing LAGC App...
App initialized successfully
```

### Check Module Status
```javascript
// In browser console
console.log(window.app.modules);

// Output:
{
  carousel: Carousel,
  storeCarousel: StoreCarousel,
  navbar: Navbar,
  scrollReveal: ScrollReveal
}
```

### Test Individual Modules
```javascript
// Test carousel
window.app.modules.carousel.showSlide(0);
window.app.modules.carousel.showSlide(1);

// Test store carousel scroll
window.app.modules.storeCarousel.scroll(340);

// Test API
const api = new API();
api.getProducts().then(products => console.log(products));
```

## Performance Tips

1. **Modules are initialized immediately** - All modules load on page load
2. **Future optimization** - Can be changed to lazy loading if needed
3. **Tree-shaking ready** - Unused modules can be removed
4. **Code splitting** - Modules can be split into separate chunks

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ❌ IE 11 (not supported - uses ES6 modules)

## Need Help?

1. Check `javascript/README.md` for detailed module docs
2. Check `STRUCTURE.md` for project structure
3. Check `REFACTORING_REPORT.md` for background
4. Look at code comments in module files
5. Test in browser console

---

**Last Updated**: November 4, 2025
**Version**: 2.0 - Modular Architecture
