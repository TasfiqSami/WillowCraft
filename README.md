# WillowCraft deployment package

This is the ready-to-run Node.js deployment bundle. It was prepared from the source project; no separate build step or `npm install` is required here.

## Run locally

Requires Node.js 24 or newer. Run `npm start` and open `http://127.0.0.1:4173`. On Windows, `Start WillowCraft.bat` opens a local preview.

## Deploy to Node.js hosting

Set this directory as the app root, use Node.js 24 or newer, set `HOST=0.0.0.0` (unless the host specifies a different bind address), use the platform's `PORT`, and set the start command to `npm start`. The host terminates HTTPS/domain traffic. No dependencies need to be installed.

## Customize

Copy `.env.example` to `.env` for local configuration, then set the site name, tagline, description, and dark/light theme colors. For hosting, private environment settings in the control panel take precedence. Edit `src/config.js` for the server facts and detailed site content. Restart the app after config changes.

## Documentation and launch limits

Start at [documentation/README.md](documentation/README.md). The store, payment processing, order delivery, live status, voting, and supporter records are not connected. Owner approval is required for statistics, infrastructure claims, and legal/policy content. Browsers may require a click before audible background music plays.
