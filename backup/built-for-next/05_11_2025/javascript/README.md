# LAGC JavaScript Architecture

This directory contains the modular JavaScript structure for the Love All Girls Club (LAGC) website.

## Directory Structure

```
javascript/
├── main.js              # Application entry point - initializes all modules
├── api.js              # API module for data fetching
├── utils.js            # Utility functions and helpers
├── ui/                 # UI component modules
│   ├── carousel.js     # Hero carousel controller
│   ├── storeCarousel.js # Product store carousel controller
│   ├── navbar.js       # Navigation bar controller
│   └── scrollReveal.js # Scroll reveal animation controller
└── script.js           # Legacy script (to be phased out)
```

## Modules Overview

### main.js
**Purpose**: Application entry point
**Initializes**: All UI modules and core functionality

```javascript
import Carousel from "./ui/carousel.js";
import StoreCarousel from "./ui/storeCarousel.js";
import Navbar from "./ui/navbar.js";
import ScrollReveal from "./ui/scrollReveal.js";
```

### api.js
**Purpose**: Centralized data fetching and API communication
**Methods**:
- `getProducts()` - Fetch all products
- `getProductById(id)` - Fetch specific product
- `getFeaturedProducts()` - Fetch featured items
- `get(endpoint)` - Generic GET request
- `post(endpoint, data)` - Generic POST request
- `put(endpoint, data)` - Generic PUT request
- `delete(endpoint)` - Generic DELETE request

### utils.js
**Purpose**: Reusable helper functions
**Exports**:
- DOM manipulation: `querySelector`, `querySelectorAll`, `addClass`, `removeClass`
- Optimization: `debounce`, `throttle`
- Class management: `hasClass`, `toggleClass`

### UI Modules (ui/)

#### carousel.js
Manages the hero carousel with auto-play, navigation buttons, and dot indicators.

**Features**:
- Auto-play every 6 seconds
- Previous/Next button navigation
- Dot indicator clicks
- Smooth transitions
- Optional auto-play disable

#### storeCarousel.js
Manages horizontal scrolling product showcase.

**Features**:
- Smooth horizontal scrolling
- Previous/Next button controls
- Configurable card width

#### navbar.js
Manages sticky navigation bar behavior.

**Features**:
- Scroll detection
- Navbar show/hide on scroll
- Scroll state styling
- Responsive behavior

#### scrollReveal.js
Handles reveal animations as content scrolls into view.

**Features**:
- Intersection observer implementation
- Staggered animations with delays
- Primary text immediate reveal
- Reusable for different sections

## Usage

### In HTML
```html
<script type="module" src="javascript/main.js"></script>
```

### Importing Modules
```javascript
import Carousel from "./ui/carousel.js";
import API from "./api.js";

// Use modules
const carousel = new Carousel();
const api = new API();
```

### Using Utils
```javascript
import { addClass, debounce, throttle } from "./utils.js";

// Add class to element
addClass(element, "active");

// Debounce scroll handler
const handleScroll = debounce(() => {
  console.log("Scrolled!");
}, 300);
```

## Adding New Modules

1. Create new file in `ui/` folder
2. Export class as default
3. Import in `main.js`
4. Initialize in `App` class

Example:
```javascript
// ui/newModule.js
class NewModule {
  constructor() {
    this.init();
  }

  init() {
    // Initialize logic
  }
}

export default NewModule;
```

Then in `main.js`:
```javascript
import NewModule from "./ui/newModule.js";

// In App init():
this.modules.newModule = new NewModule();
```

## Future Enhancements

- [ ] Cart functionality module
- [ ] User authentication module
- [ ] Product filtering module
- [ ] Search functionality
- [ ] Newsletter subscription
- [ ] User feedback/reviews module
- [ ] Backend API integration

## Browser Support

Uses modern JavaScript (ES6 modules, async/await, etc.)
Requires browsers that support:
- ES6 modules
- Intersection Observer API
- Fetch API

For older browser support, consider using a bundler like Webpack or Vite.
