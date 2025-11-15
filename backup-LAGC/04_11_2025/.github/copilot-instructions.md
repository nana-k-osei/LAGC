Project: Love All Girls Club (LAGC) — static marketing site

Purpose
- This repository is a small static website (HTML, Tailwind + custom CSS, and a tiny JS file) that promotes a women-only tennis club. The site is not a web app with a backend — treat it as a static marketing site.

Big picture architecture
- Single-page static site built from `index.html` as the entry point. Styles come from Tailwind (via CDN) plus `css/style.css` for small custom rules. Interactivity is minimal and lives in `javascript/script.js` — a simple carousel controller.
- Assets (images, logos, videos) live under `assets/` and are referenced with relative paths from `index.html`.

What AI agents should know before editing
- Keep changes lightweight and static-friendly: avoid adding servers, build tools, or heavy frameworks unless the user explicitly requests them.
- Preserve relative paths to assets (e.g., `assets/imgs/hero-3.jpg`, `assets/logos/LAG Black.png`, `assets/vids/hero-vid-2.mp4`). Update references if files are renamed or moved.
- Tailwind is loaded from CDN in `index.html`. If adding utility classes, prefer Tailwind-first patterns, but add minimal custom CSS only in `css/style.css`.

Code patterns & conventions (examples)
- Navigation uses simple anchor links and a centered logo: see `index.html` nav block. Keep navigation markup accessible (alt text for logo images, clear link text).
- Carousel: the DOM uses `.carousel`, `.carousel-inner`, `.carousel-item`. The JS expects these class names and that `.carousel-inner` is a flex container whose transform is updated by `javascript/script.js`.
  - When changing slide markup, ensure `javascript/script.js` still finds `.carousel-item` and `.carousel-inner` and that items remain equal-width slides (100%).
- Styling: small helper classes exist in `css/style.css` (e.g., `.nav-shadow`, `.underline-hover`, `.hover-fill`). Add new helpers here rather than sprinkling inline styles when possible.

Developer workflows & commands
- This is a static site — there is no build step by default. Quick checks:
  - Open `index.html` in a browser for visual verification.
  - Use a simple static server when testing cross-origin video/media or to replicate production paths (e.g., `npx http-server` or `python -m http.server`). Ask the user before adding dev-dependencies.

Edge cases & testing notes
- JS assumes at least one `.carousel-item`. If converting the hero to a single item, guard `javascript/script.js` against `totalSlides === 0` or `1` to avoid transform or dot updates that index out of range.
- Video autoplay is used. Some browsers block autoplay with sound — videos in `index.html` are muted which helps with autoplay.

Integration & external dependencies
- Tailwind is loaded from CDN (see head). No other package manager or lockfile present. Do not introduce package.json or node_modules unless requested.

When modifying content
- Use semantic HTML where possible. For copy updates, prefer editing `index.html` and keep inline styles minimal — move repeated inline rules into `css/style.css`.

What NOT to do
- Do not introduce a build pipeline, bundler, or server-side code without explicit user instruction. This repo is intentionally simple.

Files to reference when making changes
- `index.html` — main entry and primary markup to change.
- `css/style.css` — small custom styles.
- `javascript/script.js` — carousel and minimal interactivity.
- `assets/` — images, logos, and video files referenced by `index.html`.

If you need clarification
- Ask the user whether they want to keep the repo static or move to a build setup (e.g., npm + Tailwind CLI). Also ask before renaming/moving assets since many relative paths depend on current layout.

Thanks — request feedback from the repo owner for any missing patterns or conventions.
