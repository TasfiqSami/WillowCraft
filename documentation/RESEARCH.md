# Design research and benchmarks

## Scope and honesty note

The brief asked for research across at least 100 Minecraft sites. That was **not** done. This was built in a sandbox with a restricted web fetcher (only pages returned by search could be opened) and no browser, so no live site could be visually inspected.

What actually happened:

- 9 web searches (staff pages, Tebex store design, SMP websites, Hypixel store ranks, Mojang skin APIs) returned lists of results. Those lists were not opened one by one.
- 5 pages were opened and read: the MineStoreCMS staff-page docs, reviews and the product page for two BuiltByBit Tebex themes (Cube, Allay), the alinea.gg team page, and a BuiltByBit SMP landing-page listing.
- The rest of the design is based on general knowledge of Minecraft network storefronts and the existing WillowCraft identity (dark forest greens, serif headings, `logo.png`).

Do not treat this as a 100-site study. Treat it as a small, honest set of references.

## Findings and where they were applied

| Reference | Useful idea | Applied to WillowCraft |
| --- | --- | --- |
| MineStoreCMS staff page docs (docs.minestorecms.com/features/staff-page) | Staff are grouped by role group, each with username and UUID; ordering is deliberate. | Team directory is ordered owners, management, technical, moderation, with a department filter. |
| alinea.gg team page | A plain text bio per member (role, join info). It has no avatars or filters, which reads as thin. | Used as the thing to improve on: heads on every card, role badges, filters, dedicated profiles. |
| BuiltByBit: Cube Tebex theme reviews | Buyers single out the rank comparison table and mobile responsiveness as the valued parts. | Rank comparison table built from real rank data; responsive grids and a horizontally scrollable table on small screens. |
| BuiltByBit: Allay Tebex theme | Optional modular sections (rank table, FAQ/rules, staff page) and both light and dark themes. | Store sections are modular (catalog, compare, top-up, trust info); existing light/dark themes are respected. |
| BuiltByBit: Lifesteal SMP landing page | A one-click "Copy IP" with brief confirmation, and a store button that scrolls to the ranks. | WillowCraft already has Copy IP; the store hero uses anchor buttons to the catalog and comparison table. |
| Mojang API references (wiki.vg and mirrors) | A username resolves to a UUID, then the session server returns base64 texture data containing the skin URL on textures.minecraft.net. | `src/skin-service.js` follows exactly this chain, server-side. |

## Design decisions that came from this

- Everything shown in the store is real data from `src/config.js`. Nothing was invented to make it look fuller.
- Gold is a restrained accent used for owners, featured members and store notices; greens remain the primary brand colour.
- A faint pixel-grid motif (CSS only) is the Minecraft nod; no copied assets or other servers' branding.
