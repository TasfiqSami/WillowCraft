# Deployment

## Hosting requirements

- A Node.js application host with Node.js 24 or newer.
- Ability to run `npm start` (or `node server.mjs`).
- The host-provided `PORT` environment variable must be honored.
- A custom domain and HTTPS can be configured in the hosting control panel after deployment.
- No database, package install, build tool, or `node_modules` directory is required on the server.

## Produce the upload bundle

This section applies when working from the full source project. A deployment ZIP is already built and can be extracted into the host app root; do not try to run the source build commands from inside that ZIP.

From the source project root:

```sh
npm run build
```

The command writes a fresh `dist/` directory containing the application runtime and documentation. On Windows, `npm run package` performs both steps and writes `WillowCraft-Deploy.zip` beside the source files. On other systems, create an archive from the contents of `dist/` with hidden files included (especially `.env.example`).

Upload the contents of `dist/` or extract `WillowCraft-Deploy.zip` into the Node application root. Do not upload the source `node_modules`, local `.env`, ZIP itself, or editor folders.

## Configure the Node app

Set the host's app root to the extracted package directory, runtime to Node.js 24+, and start command to:

```sh
npm start
```

The package also works with `node server.mjs`. Set `HOST=0.0.0.0` (or the bind address required by the provider) and use the host's assigned `PORT`; the server otherwise defaults to loopback and port `4173` for a private local preview. Add environment variables in the host dashboard or provide a private `.env` file based on `.env.example`. Do not upload a `.env` containing local or secret values to public source control.

## After deployment

1. Attach the custom domain and enable HTTPS at the host.
2. Visit the homepage and a nested route such as `/guides` directly to confirm route fallback works.
3. Verify `Banners.png`, `logo.png`, `assets/syxlor-mark.png`, and `assets/willowcraft-music.mp3` load.
4. Check the site name and dark/light palettes; verify on desktop and mobile.
5. Check host logs and the health/status tools provided by your hosting service.
6. Complete the [release checklist](RELEASE_CHECKLIST.md) and owner review items before public launch.

## Static hosting

The provided production target is Node hosting. This app generates `/runtime-config.js` and `/runtime-theme.css` from environment settings and needs the Node server for those endpoints and route fallback. A static host would need equivalents for the runtime config/theme files and rewrites for all application routes; copying only the static files is not a complete deployment.

## Updating a deployed release

Update the source project, run `npm run build`, and replace the deployed application files with the new `dist/` contents. Keep a backup of the currently deployed package and your production environment settings before replacing files. No database migration is involved in the current app.
