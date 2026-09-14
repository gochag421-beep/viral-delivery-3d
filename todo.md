# Todo

- [x] Update hero title to include Fast Food clearly.
- [x] Update document title and description to reflect fast food delivery.
- [x] Run typecheck/build and save a new checkpoint.

# Current task

Fix website errors and improve the FASTMOVMENT portal.

- [x] Replace dead external image URLs (manus.space → 404) with local SVG brand assets.
- [x] Fix stale index.html title/description, broken analytics placeholder, favicon path, and zoom-blocking viewport.
- [x] Fix all hardcoded root-absolute links (`/`, `/order`, `/admin/payments`) to respect the GitHub Pages base path via wouter links.
- [x] Fix failing paymentSettings tests (missing JWT_SECRET) with a vitest setup file.
- [x] Verify typecheck, tests, and production build all pass.
