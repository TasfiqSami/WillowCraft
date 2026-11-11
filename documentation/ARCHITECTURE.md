# Architecture

## Request flow

1. `server.mjs` loads environment settings, applies security headers, and serves files from the project root.
2. `/runtime-config.js` returns safe public branding values for the browser. `/runtime-theme.css` returns validated theme color variables.
3. Existing static assets are served with their MIME types. Known site routes that are not files receive `index.html`; the browser then renders the route.
4. `src/app.js` imports the content model, renders the header, footer, and current page, and binds interactions.

## Important files

| Path | Responsibility |
| --- | --- |
| `index.html` | Shared HTML shell, metadata, stylesheet/module links, audio element, skeleton and preloader |
| `styles.css` | Design tokens, dark/light themes, page layouts, responsive rules, and component states |
| `src/app.js` | Page templates, route table, client navigation, interactions, and theme/audio controls |
| `src/config.js` | Server details, navigation, footer links, ranks, staff, features, guides, rules, FAQ, and store data |
| `src/theme.js` | Restores the visitor's locally saved light/dark selection before rendering |
| `src/particles.js` | Hero canvas particles; pauses when hidden and follows reduced-motion preference |
| `server.mjs` | Node HTTP server, route fallback, headers, MIME mapping, and runtime environment configuration |
| `scripts/build.mjs` (source project only) | Recreates `dist/` from an explicit allowlist of runtime files |
| `assets/` | Studio mark and background music |
| `Banners.png`, `logo.png` | Supplied hero and server logo artwork |

## Routing and state

The server permits `GET` and `HEAD` only. It serves known pages through the same HTML shell and returns 404 for unknown application routes. Client navigation uses the History API. Theme and music preferences are stored locally in each visitor's browser; they are not sent to a WillowCraft backend.

## External services

Discord is an external link. There is no database, account system, server status API, store payment provider, order fulfillment service, or CMS in this project.
