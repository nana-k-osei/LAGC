# Copilot Instructions — E-commerce Web App Refactoring

This project is an existing e-commerce website using **HTML**, **Tailwind CSS**, **custom CSS**, and **vanilla JavaScript**. The goal is to **refactor** the code to be more modular, responsive, and maintainable, while **keeping the existing styling and functionality intact**.

## Key Guidelines:
- **Do not break existing functionality** or styling.
- **Respect current custom CSS** unless Tailwind CSS can replace it. If Tailwind can achieve the same styling, prefer using Tailwind.
- **Go through the existing code** before making any changes. Only refactor when confident that functionality is intact.
- Ensure **responsiveness** is built-in using Tailwind's breakpoint classes (`sm:`, `md:`, `lg:`, etc.).
- Refactor **incrementally**, preserving the look and feel of the current site.

## Folder Structure:
```
assets/
├─ imgs/
├─ logos/
├─ merch/
└─ vids/

css/
└─ style.css           → keep this for now, don't delete custom styles unless Tailwind can fully replace them

data/
└─ products.json       → mock data for now (to be replaced by backend API later)

javascript/
├─ main.js             → initializes app and links modules
├─ api.js              → handles fetch requests and data fetching
├─ utils.js            → helper functions
├─ ui/
│   ├─ navbar.js       → handles navbar interactions
│   ├─ productList.js  → renders product cards dynamically
│   ├─ cart.js         → handles cart logic
│   └─ auth.js         → handles user authentication
└─ script.js           → leave existing code here temporarily

pages/
├─ index.html
├─ shop.html
└─ product.html
```

## Refactoring Strategy:
1. **Review Existing Code:**
   - Examine all HTML, CSS, and JS code to ensure the core functionality and styling are respected.
   - Identify areas where **Tailwind CSS** can be used to replace custom CSS (e.g., layout, spacing, flexbox, grids).
   
2. **Gradual Refactoring:**
   - Start by refactoring smaller, isolated sections like buttons, cards, or forms to use Tailwind.
   - For custom CSS, migrate styles to **Tailwind** where possible and remove redundant rules.
   - Keep **legacy code** (`script.js`, `style.css`) for now, but organize and move new code into appropriate modules.

3. **Ensure Responsiveness:**
   - Implement Tailwind's responsive utilities where needed to handle mobile, tablet, and desktop breakpoints.
   - Use **Tailwind classes** like `lg:`, `sm:`, `md:` to ensure the site is mobile-friendly.

## Goals:
- Maintain **current look and feel** of the website during the refactor.
- **Modularize** JavaScript code into components (UI, API, logic) for scalability.
- Transition gradually from custom CSS to Tailwind where possible.
- **Ensure responsiveness** for all screen sizes.
- Make the code **framework-ready**, especially for future migration to **Next.js** or **React**.
