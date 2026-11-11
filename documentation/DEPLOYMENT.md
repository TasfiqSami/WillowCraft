# Deployment

## Deploy to Vercel

Vercel uses a dedicated static build for the website. The build script copies the exact website runtime and its assets into `public/`, and generates `runtime-config.js` and `runtime-theme.css` from the Vercel Environment Variables. The original `server.mjs` remains unchanged for local development and traditional Node.js hosts.

### Import the project

1. Import `TasfiqSami/WillowCraft` in Vercel.
2. Set the Root Directory to the repository root.
3. Choose the **Other** framework preset.
4. The checked-in `vercel.json` sets the Build Command to `npm run build:vercel` and Output Directory to `public`. These settings override the dashboard values for this deployment.
5. Use Node.js 24.x for the build environment. The Vercel deployment is static and does not use Node.js Functions. The package engine range intentionally excludes Node.js 26 until the deployment toolchain is updated.
6. Add the optional branding and theme values from `.env.example` in Project Settings → Environment Variables. Apply the values to Preview and Production as needed. Only public branding and theme values are exposed in the generated browser files; never put secrets in them.

### What the build does

- Copies `index.html`, `styles.css`, `src/`, `assets/`, `logo.png`, and `Banners.png` into `public/`.
- Generates `public/runtime-config.js` and `public/runtime-theme.css` using the Vercel build environment.
- Publishes only the completed `public/` directory as the static website.
- Rewrites the known website routes to `index.html`, without catching asset requests or unknown paths.
- Keeps the legacy `/news` and `/staff` redirects.

This is a static Vercel deployment; it does not need serverless runtime endpoints. The generated runtime files are static build artifacts, so changing environment variables requires a new deployment.

### Verify the deployment

After deployment, check these URLs directly:

- `/`
- `/styles.css` (should return CSS, not HTML)
- `/src/app.js` (should return JavaScript, not HTML)
- `/runtime-config.js` (should return JavaScript, not HTML)
- `/runtime-theme.css` (should return CSS, not HTML)
- `/guides`
- `/guides/land-claims`
- `/announcements`

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
