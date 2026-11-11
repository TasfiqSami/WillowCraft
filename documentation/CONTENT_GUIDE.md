# Content guide

## Source of truth

`src/config.js` is the central data module for server facts, navigation, staff, ranks, features, FAQ, and rules. Keep frequently changed content in that module instead of scattering duplicate data across components.

The page templates live in `src/app.js`. Update a template only when changing page presentation, page structure, or content that is intentionally editorial rather than data-driven.

## Adding announcements

Add verified entries to `server.announcements` in `src/config.js`. Each entry should use a unique URL-safe `slug`, approved `title`, `category`, `date`, `summary`, and `body` array. If there are no posts, the shared announcements page shows its empty state. Do not create a separate blog or news route.

## Adding gallery media

Add the supplied, approved image to `assets/`, then add an entry to `server.gallery` with `src` rooted at `/assets/`, descriptive `alt`, approved `caption`, and creator attribution only when known and authorized. The gallery empty state is intentional until actual media is supplied.

## Leaderboard

Do not add sample or invented entries. The current frontend has no verified purchase data source; its empty state should remain until a real backend/API and publication approval exist.

## Store and ranks

Rank perks and point costs are listed in `src/config.js`. Store packages and prices must be owner-approved. `paymentConfigured` must not be treated as a payment implementation; enabling live purchases requires a trusted backend, provider integration, order validation, fulfillment, support process, and matching approved policies.

## Staff, rules, and policies

Keep the staff roster exact and approved. Minecraft skin images, biographies, social links, and new staff names require supplied/approved content. The Rules page and policy pages should be reviewed by the WillowCraft owner before being treated as authoritative or legally final.
