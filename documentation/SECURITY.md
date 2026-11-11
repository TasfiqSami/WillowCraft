# Security and privacy

## Current protections

- The Node server accepts `GET` and `HEAD` only.
- It decodes and resolves paths and rejects traversal outside the app root.
- Content Security Policy restricts scripts, styles, connections, and frames to the site origin (with `data:` allowed for images).
- `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, COOP, and CORP headers are set.
- Environment values are not served wholesale. Only site name/tagline/description are exposed in `/runtime-config.js`; theme values are validated as hex colors before CSS generation.
- No credentials, payment data, account linking, third-party embeds, analytics, or user-submitted forms are present.

## Before adding a backend

The current CSP is intentionally restrictive. If a future integration needs external images, scripts, APIs, fonts, a payment provider, or embedded media, update the allowlist only for the verified origin and required directive. Do not add broad wildcards or `unsafe-eval` to make an integration work.

Do not put secrets in `.env.example`, `src/config.js`, or client-visible runtime values. Secret values must stay server-side and must never be returned by `/runtime-config.js`.

## Operational responsibilities

- Terminate TLS at the hosting provider or a correctly configured reverse proxy.
- Keep Node.js and the host operating system patched.
- Review provider access logs, retention, backup, and privacy settings.
- Supply and publish owner-approved privacy/legal content and a genuine support contact before launch.
- Use a real provider-backed server-side checkout and order validation if purchases are added. Never trust a price or fulfillment request coming from the browser alone.

The browser stores the visitor's theme and audio preferences in local storage. Hosting providers may collect request logs; the owner must confirm those practices and update the privacy page accordingly.
