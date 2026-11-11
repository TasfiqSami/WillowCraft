# Deployment

## Deploy to Vercel

Vercel is supported using static delivery from the repository root and two small Node.js Functions for the runtime configuration endpoints. The original `server.mjs` remains available for local development and for traditional Node.js hosts.

### Import the project

1. Import `TasfiqSami/WillowCraft` in Vercel.
2. Set the Root Directory to the repository root.
3. Choose the **Other** framework preset.
4. Leave the Build Command empty. The checked-in `vercel.json` explicitly sets `outputDirectory` to `.` (the repository root), overriding any stale Output Directory value saved in Project Settings. There is no Vercel build step or dependency installation required.
5. Use Node.js 24.x for Functions. The package engine range intentionally excludes Node.js 26 until the deployment CLI/toolchain is updated.
6. Add optional branding and theme variables from `.env.example` in Project Settings → Environment Variables. Do not add private secrets as browser-facing site settings.

The root output setting is important: if the Output Directory is set to a missing folder such as `dist`, Vercel can publish the HTML fallback without the CSS, JavaScript, or image files. Deploy the project after confirming the Root Directory is the repository root. Do not use a legacy `builds` array in `vercel.json`: when `builds` is configured, Vercel includes only the build outputs explicitly produced by those builders, which can omit the website's static files.

### How the Vercel deployment works

- Vercel serves `index.html`, `styles.css`, `src/`, `assets/`, `logo.png`, and `Banners.png` as static files.
- `api/runtime-config.js` backs the public `/runtime-config.js` URL.
- `api/runtime-theme.js` backs the public `/runtime-theme.css` URL.
- `vercel.json` rewrites application routes to `index.html`, while existing files are served directly. It also keeps the legacy `/news` and `/staff` redirects.
- Runtime endpoints return `Cache-Control: no-store` so environment changes are not held in a stale browser/CDN cache.

### Verify the deployment

After deploying, open the homepage and refresh these URLs directly:

- `/guides`
- `/guides/land-claims`
- `/announcements`
- `/runtime-config.js`
- `/runtime-theme.css`

Also verify that `Banners.png`, `logo.png`, `assets/syxlor-mark.png`, and `assets/willowcraft-music.mp3` load. Check desktop and mobile layouts, and confirm the dark/light theme switch works.

## Deploy to a traditional Node.js host

The original Node server can also run on a Node.js application host with Node.js 24 or newer. Upload the full runtime source tree, including `server.mjs`, `index.html`, `styles.css`, `src/`, `assets/`, `logo.png`, and `Banners.png`.

Set the app start command to:

```sh
npm start
```

Set `HOST=0.0.0.0` (or the bind address required by the provider) and use the host-provided `PORT`. The server otherwise defaults to loopback and port `4173` for local preview. Add optional environment variables in the host dashboard or provide a private `.env` file based on `.env.example`.

Do not upload a local `.env` file or publish secrets in source control.

## Updating a deployed release

Push the updated source to GitHub and redeploy through Vercel, or replace the files on a traditional Node.js host. Keep a backup of production environment settings before changing them. No database migration is involved in the current app.
