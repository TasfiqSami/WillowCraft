# Troubleshooting

## `npm` or `node` is not recognized

Install Node.js 24 or newer, close and reopen the terminal, then run `node --version`. The Windows launcher also checks the major version before starting.

## Port 4173 is already in use

For a local run, set a different `PORT` in `.env` (for example `PORT=4180`) and open the matching address. On a host, use the platform-assigned `PORT` instead of hard-coding one.

## Hosting shows a blank page or 404 on nested routes

Confirm the app root contains `server.mjs`, `index.html`, `styles.css`, `src/`, and `assets/`; set the start command to `npm start`; use Node hosting rather than a static-only document root. Check `/runtime-config.js` and `/runtime-theme.css` in the browser and inspect application logs.

## Missing image or audio

Confirm exact filename casing and upload the full `assets/` directory plus `Banners.png` and `logo.png`. The audio file is approximately 10 MB, so check your host's upload and static asset limits.

## Environment changes do not appear

Restart/redeploy the Node process after changing settings. Check variable spelling against `.env.example`; colors must be hex values. Clear any host/CDN cache if it cached the generated HTML or assets unexpectedly. Runtime config and theme endpoints are marked `no-store`.

## Music does not start automatically

The browser may block audible autoplay. Use the navbar music control and press Play once. Check whether the browser tab is muted and confirm `assets/willowcraft-music.mp3` was uploaded.

## A purchase, live status, or voting button is unavailable

These services are not implemented in this package. Store checkout is deliberately disabled, live server status has no API integration, and the vote destination is not verified. Do not present a successful order or live status until the real backend/provider is connected.
