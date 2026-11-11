# Project overview

## What this is

WillowCraft is a responsive public website for a Minecraft Survival SMP community. It gives players server connection details, guides, rules, FAQ answers, team and rank information, announcements, support information, and store/leaderboard/gallery pages with honest empty or disabled states where live data or services are not configured.

## Technology

- **HTML5** for the document shell and semantic page structure.
- **CSS3** for layout, responsive breakpoints, visual styling, and motion.
- **Browser JavaScript with ES modules** for client-side navigation, content rendering, filters, copy controls, audio/theme settings, and particles.
- **Node.js 24 or newer** for the dependency-free static/SPA HTTP server and build script.
- **Node built-in modules only**; no `node_modules` is required.
- **PNG and MP3 assets** for the hero image, logo, studio mark, and background music.

## Current state and limits

- Routes are rendered by the browser after the Node server provides `index.html` fallback for known pages.
- Server facts and approved content are in `src/config.js`.
- Announcements, gallery, and leaderboard use empty states until real approved entries are added.
- Store checkout is intentionally unavailable until the owner supplies a complete price table and a real payment/order integration.
- Legal and store policy pages are drafts requiring owner review.
- Statistics and infrastructure claims marked unverified are not published as facts.
- The vote URL is not activated because its service has not been verified.
- Background audio may require a user interaction because browsers can block audible autoplay.

## Package contents

The generated `dist/` folder and `WillowCraft-Deploy.zip` are deployment bundles. They contain the server, frontend, configuration data, media assets, `.env.example`, and documentation. They exclude `node_modules`, local `.env` values, editor files, and the build script.
