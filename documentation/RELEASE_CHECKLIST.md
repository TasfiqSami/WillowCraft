# Release checklist

## Package

- [ ] Use Node.js 24 or newer.
- [ ] Run `npm run build` and inspect the generated `dist/` contents.
- [ ] Confirm there is no `.env`, `node_modules/`, local log, or editor folder in `dist/`.
- [ ] Create the deployment ZIP from the contents of `dist/`, not the source folder.
- [ ] Keep the production `.env` values in the host's private environment configuration.

## Content and brand

- [ ] Confirm site name, title, description, and color palette.
- [ ] Confirm server address, Bedrock port, Discord invite, staff names/roles, ranks, and rules with the owner.
- [ ] Confirm rights/approval for logo, banner, studio mark, music, and gallery media.
- [ ] Do not enable store purchases without approved prices, a backend/provider, fulfillment, and matching policies.
- [ ] Review legal and privacy drafts; replace placeholders with approved content.
- [ ] Keep unverified statistics, infrastructure claims, leaderboard entries, and voting unannounced.

## Deployment smoke check

- [ ] App starts with the host's Node.js 24+ runtime and assigned `PORT`.
- [ ] Homepage and a nested route load directly over HTTPS.
- [ ] Logo, banner, studio mark, music, and stylesheets load without 404s.
- [ ] Test narrow phone, tablet, and desktop layouts.
- [ ] Check copy-IP, navigation, announcement filters, theme, and audio controls.
- [ ] Check browser console and host logs for errors.
- [ ] Verify backup/restore path and domain HTTPS renewal are handled by the host.
