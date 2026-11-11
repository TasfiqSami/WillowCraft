# Configuration

## Environment file

Copy `.env.example` to `.env` and edit the values. The Node server loads `.env` on startup. Variables supplied by the hosting platform take precedence over values in `.env`. Do not put secrets in a public frontend setting; only the listed brand values are exposed to the browser.

### Site identity

- `SITE_NAME`: site name used in the browser title, primary header/footer wordmarks, and branded accessibility labels.
- `SITE_TAGLINE`: default document title tagline.
- `SITE_DESCRIPTION`: document and social metadata description and shared site description.

Changing the shell name does not rewrite all game-specific prose or server content. Update WillowCraft-specific content in `src/config.js` and the page templates in `src/app.js` when creating a full rebrand.

### Runtime

- `HOST`: bind address. Defaults to `127.0.0.1` for a local-only preview. Set it to `0.0.0.0` on a Node host unless the platform specifies another bind address.
- `PORT`: HTTP port. Defaults to `4173`; invalid values stop startup with an error.

The Windows local launcher uses localhost for its preview.

### Theme colors

All theme variables accept `#RGB`, `#RGBA`, `#RRGGBB`, or `#RRGGBBAA`. Invalid values fall back to the built-in palette. After changing colors, restart the server or redeploy so the generated theme stylesheet reflects the environment.

Available variables are `THEME_DARK_BG`, `THEME_DARK_BG2`, `THEME_DARK_SURFACE`, `THEME_DARK_SURFACE2`, `THEME_DARK_TEXT`, `THEME_DARK_MUTED`, `THEME_DARK_SOFT`, `THEME_DARK_ACCENT`, `THEME_DARK_ACCENT2`, `THEME_DARK_PURPLE`, and the corresponding `THEME_LIGHT_*` variables.

The visitor theme preference is kept in local storage under `willowcraft-theme`; changing the palette does not clear that preference.

## Game and content settings

Edit `src/config.js` for the server name/description, connection addresses, Bedrock port, Discord invite, ranks, approved team roster, guides, rules, FAQ, game features, and store configuration. Restart the server after changes. Never publish unverified statistics, unsupported claims, private player/order details, or invented prices.

## Media

- Replace `Banners.png` and `logo.png` with owner-approved artwork, preserving those names or updating references in `index.html`, `src/app.js`, and `styles.css`.
- Replace `assets/willowcraft-music.mp3` to change the background track; keep the filename or update the audio element in `index.html`.
- Add approved gallery assets under `assets/` and provide entries in `server.gallery` in `src/config.js`.
