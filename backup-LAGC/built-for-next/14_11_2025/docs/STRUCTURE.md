# Project Structure Documentation

## Overview
The LAGC project has been restructured to follow a modular architecture that supports scalability, maintainability, and future framework migration.

## New Folder Structure

```
d:\sideHussle\Tennis\LAGC
├── assets/                     # Static assets
│   ├── imgs/                   # Images
│   ├── logos/                  # Logo files
│   ├── merch/                  # Merchandise images
│   └── vids/                   # Video files
│
├── css/
│   └── style.css               # Custom CSS styles (703 lines)
│
├── data/                       # **NEW** - Data storage
│   └── products.json           # Product database (mock data)
│
├── javascript/                 # JavaScript modules
│   ├── main.js                 # **NEW** - App entry point
│   ├── api.js                  # **NEW** - API/data fetching module
│   ├── utils.js                # **NEW** - Helper utilities
│   ├── script.js               # Legacy - still available but unused
│   ├── README.md               # **NEW** - JavaScript architecture docs
│   └── ui/                     # **NEW** - UI component modules
│       ├── carousel.js         # Hero carousel controller
│       ├── storeCarousel.js    # Store carousel controller
│       ├── navbar.js           # Navigation controller
│       └── scrollReveal.js     # Scroll reveal animations
│
├── pages/                      # Alternative page location (optional)
│   ├── index.html
│   ├── shop.html
│   └── product.html
│
├── index.html                  # Main landing page (635 lines)
├── shop.html                   # Shop page
├── product.html                # Product detail page
│
├── .github/
│   └── copilot-instructions.md # Updated AI instructions
│
└── README.md                   # Project documentation
```

## File Changes Summary

### New Files Created
1. `javascript/main.js` - Initializes all modules
2. `javascript/api.js` - Data fetching (local JSON + future API)
3. `javascript/utils.js` - Helper functions
4. `javascript/ui/carousel.js` - Hero carousel module
5. `javascript/ui/storeCarousel.js` - Store carousel module
6. `javascript/ui/navbar.js` - Navigation module
7. `javascript/ui/scrollReveal.js` - Scroll reveal animations
8. `javascript/README.md` - Module documentation
9. `data/products.json` - Product database

### Modified Files
1. `index.html` - Updated script reference from `script.js` to `main.js`
   - Changed: `<script src="javascript/script.js"></script>` 
   - To: `<script type="module" src="javascript/main.js"></script>`
   - Removed inline carousel and scroll reveal scripts (moved to modules)

2. `.github/copilot-instructions.md` - Updated with new refactoring guidelines

### Legacy Files (Still Available)
- `javascript/script.js` - Original inline carousel script (can be archived)

## Architecture Improvements

### Before (Monolithic)
- All JavaScript inline in HTML or single script.js file
- No separation of concerns
- Difficult to test individual features
- Hard to scale and maintain

### After (Modular)
- Separate modules for each feature
- ES6 imports/exports
- Clear dependencies
- Easy to test, scale, and maintain
- Ready for framework migration (React, Next.js, Vue)

## Module Responsibilities

| Module | Responsibility |
|--------|---|
| `main.js` | Initialize and coordinate all modules |
| `api.js` | Fetch and manage data |
| `utils.js` | Provide reusable helper functions |
| `carousel.js` | Manage hero carousel interactions |
| `storeCarousel.js` | Manage store carousel scrolling |
| `navbar.js` | Manage sticky navbar behavior |
| `scrollReveal.js` | Handle scroll-triggered animations |

## How Modules Work Together

```
main.js (Entry Point)
├── Carousel → Handles hero section
├── StoreCarousel → Handles product showcase
├── Navbar → Handles navigation bar
└── ScrollReveal → Handles animations

api.js
└── Provides data via fetch (products.json or future API)

utils.js
└── Utility helpers used by all modules
```

## Next Steps for Development

1. **Phase 2: Data Integration**
   - Connect API module to fetch real product data
   - Populate product cards dynamically

2. **Phase 3: Additional Modules**
   - Cart functionality
   - User authentication
   - Product filtering
   - Search

3. **Phase 4: Optimization**
   - Code splitting for faster loading
   - Remove unused CSS
   - Performance monitoring

4. **Phase 5: Framework Migration**
   - Gradually migrate to React/Next.js if needed
   - Modular structure makes this easier

## Running the Site

### Option 1: Direct File
```bash
# Simply open index.html in browser
```

### Option 2: Local Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000
```

## Browser Console Debugging

When the app loads, you can access modules in browser console:
```javascript
// Check app instance
window.app

// Access individual modules
window.app.modules.carousel
window.app.modules.navbar
window.app.modules.storeCarousel
```

## Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: Responsive design works on all screen sizes
- **JavaScript**: ES6 modules (supported in all modern browsers)

## What's Not Changed

- HTML markup remains semantic and clean
- Tailwind CSS still via CDN
- Custom CSS (style.css) untouched
- Asset paths remain the same
- Visual design identical

## Benefits of This Structure

✅ **Maintainability** - Easy to find and modify specific features
✅ **Scalability** - Simple to add new modules
✅ **Testability** - Each module can be tested independently
✅ **Performance** - Potential for lazy loading and code splitting
✅ **Team Collaboration** - Clear separation allows multiple developers
✅ **Future-Ready** - Easy migration to frameworks like React or Next.js
✅ **Documentation** - Each module is self-documented

---

**Last Updated**: November 4, 2025
**Version**: 2.0 (Modular Architecture)
