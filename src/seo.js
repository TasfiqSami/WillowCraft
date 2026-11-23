// Single source of truth for search and AI-answer metadata.
// Pure module (no DOM, no Node APIs) so the build, the dev server and the browser router all agree.
import { server, nav, guides, rules, faq, team } from './config.js';

export const DEFAULT_SITE_URL = 'https://www.willowcraft.top';
export const OG_IMAGE = { path: '/og-image.jpg', width: 1200, height: 630, type: 'image/jpeg' };

// Pages that are still drafts or placeholders. They stay reachable but are kept out of search
// (noindex) and out of the sitemap. Remove a path from this set once the owner has finished the page.
const DRAFT_PATHS = new Set(['/terms', '/privacy', '/shipping', '/refunds', '/maintenance']);

// FAQ answers that only say "not supplied / not confirmed" are not useful to search or AI engines.
// They stay on the page but are left out of the FAQPage structured data until a real answer exists.
const PLACEHOLDER_ANSWER = /\b(not (?:been )?(?:supplied|confirmed|verified|published|enabled|configured)|has not been|have not been|not yet|unavailable)\b/i;

export function normalizeSiteUrl(value) {
  try {
    const url = new URL(String(value || '').trim() || DEFAULT_SITE_URL);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin : DEFAULT_SITE_URL;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

const contextOf = (options = {}) => ({
  name: String(options.siteName || server.name),
  tagline: String(options.tagline || 'Find your place in the wild'),
  description: String(options.description || server.description),
  siteUrl: normalizeSiteUrl(options.siteUrl)
});

const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const branded = (text, ctx) => String(text).replaceAll('WillowCraft', ctx.name);
const joinList = items => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
const clip = (text, max) => {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 40 ? cut.lastIndexOf(' ') : cut.length).replace(/[,;:.\s-]+$/, '')}…`;
};
const teamBySlug = slug => team.find(member => member.slug === String(slug).toLowerCase());
const storeLive = () => Boolean(server.store?.paymentConfigured);

const PAGES = {
  '/': { title: 'WillowCraft – Cozy Minecraft Survival SMP (Java & Bedrock)', heading: 'WillowCraft — Find your place in the wild', description: () => `Join WillowCraft, a cozy Minecraft survival SMP with custom biomes, land claims and a player-driven economy. Java & Bedrock: ${server.javaAddress}.` },
  '/about': { title: 'About WillowCraft – A Community-First Survival SMP', heading: 'About WillowCraft', description: () => 'Learn what makes WillowCraft a welcoming Minecraft survival world: exploration, thoughtful building, custom biomes and a friendly community.' },
  '/features': { title: 'WillowCraft Features – Custom Biomes, Land Claims & Economy', heading: 'WillowCraft features', description: () => 'Explore what WillowCraft offers: land claiming, custom biomes, a player-driven economy, rank progression and a cozy survival experience.' },
  '/how-to-join': { title: 'How to Join WillowCraft – Java & Bedrock Server IP', heading: 'How to join WillowCraft', description: () => `Connect to WillowCraft in three steps. Java: ${server.javaAddress}. Bedrock: ${server.bedrockAddress}, port ${server.bedrockPort}. Start with ${server.startingCommands.join(' and ')}.` },
  '/guides': { title: 'WillowCraft Guides – Land Claims, Economy, Biomes & Ranks', heading: 'WillowCraft gameplay guides', description: () => 'Starter guides for life on WillowCraft: land claims, the player-driven economy, custom biomes and rank progression.' },
  '/rules': { title: 'WillowCraft Server Rules – Fair Play & Community Guidelines', heading: 'WillowCraft server rules', description: () => 'Read the WillowCraft rules on respect, fair play, building and land claims, chat and staff decisions so everyone can enjoy the world.' },
  '/faq': { title: 'WillowCraft FAQ – Server IP, Versions, Ranks & Support', heading: 'WillowCraft frequently asked questions', description: () => 'Answers to common questions about joining WillowCraft, game versions, ranks, rules, support and reporting players or bugs.', type: 'FAQPage' },
  '/community': { title: 'WillowCraft Community – Join the Official Discord', heading: 'The WillowCraft community', description: () => 'Meet the WillowCraft community on Discord for server updates, support tickets, player reports and staff applications.' },
  '/support': { title: 'WillowCraft Support – Get Help, Report Players & Bugs', heading: 'WillowCraft support', description: () => 'Need help? Join the official WillowCraft Discord and open a support ticket for gameplay questions, reports, appeals and store orders.', type: 'ContactPage' },
  '/announcements': { title: 'WillowCraft Announcements – Server Updates & Events', heading: 'WillowCraft announcements', description: () => 'Official updates, community highlights, events and notices from the WillowCraft team.', type: 'CollectionPage' },
  '/ranks': { title: 'WillowCraft Ranks – VIP, MVP & ELITE Compared', heading: 'WillowCraft ranks', description: () => `Compare the ${joinList(server.ranks.map(rank => rank.name))} lifetime ranks on WillowCraft: homes, chestshops, auction house slots and commands.` },
  '/store': { title: 'WillowCraft Store – Ranks & Points', heading: 'WillowCraft store', description: () => storeLive() ? 'Buy WillowCraft ranks and Points to upgrade your survival experience.' : 'Browse WillowCraft ranks and the Points currency. Checkout is not available yet, so nothing can be purchased from this page.' },
  '/leaderboard': { title: 'WillowCraft Supporter Leaderboard', heading: 'WillowCraft supporter leaderboard', description: () => 'Top WillowCraft supporters, shown only from verified, publishable purchase records.' },
  '/gallery': { title: 'WillowCraft Gallery – Community Builds', heading: 'WillowCraft community gallery', description: () => 'Builds and moments shared by the WillowCraft community.', type: 'CollectionPage' },
  '/team': { title: 'WillowCraft Team – Owners, Developers & Moderators', heading: 'The WillowCraft team', description: () => 'Meet the owners, managers, developers, marketers and moderators who run WillowCraft.', type: 'CollectionPage' },
  '/terms': { title: 'Terms of Service – WillowCraft', heading: 'Terms of service (draft)', description: () => 'Draft terms of service for WillowCraft, pending owner and legal review.' },
  '/privacy': { title: 'Privacy Policy – WillowCraft', heading: 'Privacy policy (draft)', description: () => 'Draft privacy policy for the WillowCraft website, pending owner confirmation.' },
  '/shipping': { title: 'Shipping & Delivery – WillowCraft', heading: 'Shipping and delivery', description: () => 'Delivery details for WillowCraft store items are still being confirmed.' },
  '/refunds': { title: 'Returns & Refunds – WillowCraft', heading: 'Returns and refunds', description: () => 'Refund terms for WillowCraft store items are still being confirmed.' },
  '/maintenance': { title: 'Maintenance – WillowCraft', heading: 'Maintenance', description: () => 'WillowCraft is taking a short break for maintenance. Check Discord for updates.' }
};

const GUIDE_SEO = {
  '/guides/land-claims': ['Land Claims Guide – Get Started on WillowCraft', 'Get started with the supplied land-claim command and confirm current claim details with WillowCraft staff.'],
  '/guides/economy': ['Economy Guide – WillowCraft Player-Driven Economy', 'A high-level introduction to WillowCraft’s player-driven economy. Ask the team for current mechanics.'],
  '/guides/custom-biomes': ['Custom Biomes Guide – Explore WillowCraft', 'Explore WillowCraft’s custom-biome feature. Specific locations and names are not published yet.'],
  '/guides/ranks': ['Ranks & Progression Guide – WillowCraft', 'Find current WillowCraft rank details through the official Discord community.']
};

const articleOf = slug => server.announcements.find(item => item.slug === slug);
const decodeSlug = value => { try { return decodeURIComponent(value); } catch { return null; } };

export function normalizePath(path) {
  const clean = String(path || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return clean || '/';
}

export function listRoutes() {
  return [
    ...Object.keys(PAGES),
    ...guides.map(guide => guide.path),
    ...team.map(member => `/team/${member.slug}`),
    ...server.announcements.map(item => `/announcements/${item.slug}`)
  ];
}

export function isIndexable(path) {
  const clean = normalizePath(path);
  if (DRAFT_PATHS.has(clean)) return false;
  if (clean === '/announcements') return server.announcements.length > 0;
  if (clean === '/leaderboard') return server.leaderboard.length > 0;
  if (clean === '/gallery') return server.gallery.length > 0;
  return listRoutes().includes(clean);
}

function breadcrumbs(path, title, ctx) {
  if (path === '/') return null;
  const trail = [{ name: ctx.name, path: '/' }];
  if (path.startsWith('/guides/')) trail.push({ name: 'Guides', path: '/guides' });
  if (path.startsWith('/team/')) trail.push({ name: 'Team', path: '/team' });
  if (path.startsWith('/announcements/')) trail.push({ name: 'Announcements', path: '/announcements' });
  trail.push({ name: title.replace(/\s+[–|-]\s+.*$/, ''), path });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${ctx.siteUrl}${path}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${ctx.siteUrl}${item.path === '/' ? '/' : item.path}` }))
  };
}

function structuredData(path, entry, meta, ctx) {
  const orgId = `${ctx.siteUrl}/#organization`;
  const siteId = `${ctx.siteUrl}/#website`;
  const url = `${ctx.siteUrl}${path === '/' ? '/' : path}`;
  const sameAs = [server.discord].filter(Boolean);
  const graph = [
    { '@type': 'Organization', '@id': orgId, name: ctx.name, url: `${ctx.siteUrl}/`, logo: { '@type': 'ImageObject', url: `${ctx.siteUrl}/icon-512.png`, width: 512, height: 512 }, description: ctx.description, ...(sameAs.length ? { sameAs } : {}) },
    { '@type': 'WebSite', '@id': siteId, url: `${ctx.siteUrl}/`, name: ctx.name, description: ctx.description, inLanguage: 'en', publisher: { '@id': orgId } }
  ];

  const pageType = entry.kind === 'profile' ? 'ProfilePage' : entry.kind === 'article' ? 'Article' : entry.type || (path === '/about' ? 'AboutPage' : 'WebPage');
  const page = { '@type': pageType, '@id': `${url}#webpage`, url, name: meta.title, description: meta.description, inLanguage: 'en', isPartOf: { '@id': siteId }, about: { '@id': orgId }, primaryImageOfPage: { '@type': 'ImageObject', url: `${ctx.siteUrl}${OG_IMAGE.path}`, width: OG_IMAGE.width, height: OG_IMAGE.height } };
  const crumb = breadcrumbs(path, meta.title, ctx);
  if (crumb) page.breadcrumb = { '@id': crumb['@id'] };

  if (entry.kind === 'article') {
    page.headline = entry.item.title;
    page.publisher = { '@id': orgId };
    if (entry.item.date && !Number.isNaN(Date.parse(entry.item.date))) page.datePublished = new Date(entry.item.date).toISOString();
  }
  if (path === '/faq') {
    const answered = faq.filter(item => !PLACEHOLDER_ANSWER.test(item.a));
    if (answered.length) page.mainEntity = answered.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: branded(item.a, ctx) } }));
  }
  if (entry.kind === 'profile') {
    const member = entry.item;
    const skills = [...new Set((member.skills || []).flatMap(group => group.items))];
    const links = (member.links || []).map(link => link.href).filter(href => /^https:\/\//.test(href));
    const person = { '@type': 'Person', '@id': `${url}#person`, name: member.name, jobTitle: joinList(member.roles), description: clip([member.title, member.bio[0]].filter(Boolean).join('. '), 300), worksFor: { '@id': orgId }, ...(member.ign !== member.name ? { alternateName: member.ign } : {}), ...(links.length ? { sameAs: links } : {}), ...(skills.length ? { knowsAbout: skills } : {}) };
    page.mainEntity = { '@id': person['@id'] };
    graph.push(page, person);
    if (crumb) graph.push(crumb);
    return { '@context': 'https://schema.org', '@graph': graph };
  }
  graph.push(page);
  if (crumb) graph.push(crumb);
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function resolveRoute(path) {
  const clean = normalizePath(path);
  if (PAGES[clean]) return { path: clean, kind: 'page', page: PAGES[clean] };
  const guide = guides.find(item => item.path === clean);
  if (guide) return { path: clean, kind: 'guide', item: guide };
  if (clean.startsWith('/team/')) {
    const member = teamBySlug(clean.slice('/team/'.length));
    if (member) return { path: `/team/${member.slug}`, kind: 'profile', item: member };
  }
  if (clean.startsWith('/announcements/')) {
    const item = articleOf(decodeSlug(clean.slice('/announcements/'.length)));
    if (item) return { path: clean, kind: 'article', item };
  }
  return null;
}

export function pageMeta(path, options = {}) {
  const ctx = contextOf(options);
  const entry = resolveRoute(path);
  if (!entry) {
    return { known: false, path: normalizePath(path), title: branded('Page not found – WillowCraft', ctx), description: `This page does not exist on ${ctx.name}.`, canonical: null, indexable: false, robots: 'noindex, follow', ogType: 'website', jsonLd: null, ctx };
  }
  let title; let description; let ogType = 'website';
  if (entry.kind === 'page') {
    title = entry.page.title; description = entry.page.description();
  } else if (entry.kind === 'guide') {
    [title, description] = GUIDE_SEO[entry.path] || [`${entry.item.title} – WillowCraft`, entry.item.text];
  } else if (entry.kind === 'profile') {
    const member = entry.item;
    title = `${member.name}${member.ign !== member.name ? ` (${member.ign})` : ''} – WillowCraft Team`;
    description = clip(`${member.name} is ${joinList(member.roles)} at WillowCraft.${member.title ? ` ${member.title}.` : ` ${member.bio[0]}`}`, 158);
    ogType = 'profile';
  } else {
    title = `${entry.item.title} – WillowCraft`; description = clip(entry.item.summary || ctx.description, 158); ogType = 'article';
  }
  title = branded(title, ctx);
  description = branded(description, ctx);
  const indexable = isIndexable(entry.path);
  const meta = { known: true, path: entry.path, title, description, canonical: `${ctx.siteUrl}${entry.path === '/' ? '/' : entry.path}`, indexable, robots: indexable ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, follow', ogType, ctx };
  meta.jsonLd = structuredData(entry.path, entry, meta, ctx);
  return meta;
}

export const serializeJsonLd = data => JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, c => ({ '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029' })[c]);

const imageAlt = ctx => `${ctx.name}: a Minecraft world with snow-capped mountains, a pine forest, a lake and a wooden lodge`;

export function headTags(meta) {
  const { ctx } = meta;
  const image = `${ctx.siteUrl}${OG_IMAGE.path}`;
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${esc(meta.robots)}" />`,
    meta.canonical ? `<link rel="canonical" href="${esc(meta.canonical)}" />` : '',
    `<meta name="application-name" content="${esc(ctx.name)}" />`,
    `<meta property="og:site_name" content="${esc(ctx.name)}" />`,
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    meta.canonical ? `<meta property="og:url" content="${esc(meta.canonical)}" />` : '',
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:type" content="${OG_IMAGE.type}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${esc(imageAlt(ctx))}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(imageAlt(ctx))}" />`,
    '<link rel="icon" href="/favicon.ico" sizes="48x48" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />',
    '<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
    '<link rel="manifest" href="/manifest.webmanifest" />',
    meta.jsonLd ? `<script type="application/ld+json" id="seo-jsonld">${serializeJsonLd(meta.jsonLd)}</script>` : ''
  ];
  return lines.filter(Boolean).join('\n    ');
}

const navDescriptions = {
  '/': 'Home', '/about': 'About the server', '/guides': 'Gameplay guides', '/how-to-join': 'Server address and joining steps', '/rules': 'Server rules', '/team': 'The staff team', '/store': 'Ranks and Points', '/announcements': 'Updates and events', '/leaderboard': 'Supporter leaderboard'
};

const addressList = ctx => `<ul><li>Java Edition: <code>${esc(server.javaAddress)}</code></li><li>Bedrock Edition: <code>${esc(server.bedrockAddress)}</code>, port <code>${esc(server.bedrockPort)}</code></li></ul><p>${esc(branded(server.versionNote, ctx))}</p>`;
const discordParagraph = ctx => `<p>Join the official <a href="${esc(server.discord)}" rel="noopener noreferrer">${esc(ctx.name)} Discord</a> for help and updates.</p>`;
const featureList = ctx => `<ul>${server.features.map(feature => `<li><strong>${esc(feature.title)}</strong>: ${esc(branded(feature.text, ctx))}</li>`).join('')}</ul>`;
const rankList = ctx => `<ul>${server.ranks.map(rank => `<li><strong>${esc(rank.name)}</strong> (${rank.points.toLocaleString('en-US')} Points, lifetime rank): ${rank.homes} homes, ${rank.shops} chestshops, ${rank.ah} auction house items, commands ${esc(rank.commands.join(', '))}.</li>`).join('')}</ul>`;

// Plain-HTML summary placed inside <main> so crawlers that do not run JavaScript still see the page's
// real content. The client router replaces it as soon as the app renders.
export function staticContent(path, options = {}) {
  const ctx = contextOf(options);
  const meta = pageMeta(path, options);
  const entry = resolveRoute(path);
  const heading = entry?.kind === 'page' ? entry.page.heading : entry?.kind === 'guide' ? entry.item.title : entry?.kind === 'profile' ? entry.item.name : entry?.kind === 'article' ? entry.item.title : 'Page not found';
  const parts = [`<h1>${esc(branded(heading, ctx))}</h1>`, `<p>${esc(meta.description)}</p>`];
  const kind = entry?.path;

  if (!entry) {
    parts.push('<p>The page may have moved, or the link may be out of date.</p>', `<p><a href="/">Back to the ${esc(ctx.name)} home page</a></p>`);
  } else if (kind === '/') {
    parts.push('<h2>Join the server</h2>', addressList(ctx), '<h2>What you will find</h2>', featureList(ctx), '<h2>Explore</h2>', `<ul>${nav.filter(item => item.href !== '/').map(item => `<li><a href="${esc(item.href)}">${esc(item.label)}</a>: ${esc(navDescriptions[item.href] || item.label)}</li>`).join('')}</ul>`, discordParagraph(ctx));
  } else if (kind === '/about' || kind === '/features') {
    parts.push('<h2>Features</h2>', featureList(ctx), '<p><a href="/how-to-join">How to join</a></p>');
  } else if (kind === '/how-to-join') {
    parts.push('<h2>Server addresses</h2>', addressList(ctx), '<h2>Three quick steps</h2><ol><li>Choose your edition (Java or Bedrock).</li><li>Add the server address in your multiplayer server list.</li><li>Start with ' + server.startingCommands.map(command => `<code>${esc(command)}</code>`).join(' or ') + ' and ask in Discord if you need help.</li></ol>', discordParagraph(ctx));
  } else if (kind === '/guides') {
    parts.push(`<ul>${guides.map(guide => `<li><a href="${esc(guide.path)}">${esc(guide.title)}</a>: ${esc(branded(guide.text, ctx))}</li>`).join('')}</ul>`);
  } else if (entry.kind === 'guide') {
    parts.push(`<p>${esc(branded(entry.item.text, ctx))}</p>`, '<p><a href="/guides">All guides</a></p>', discordParagraph(ctx));
  } else if (kind === '/rules') {
    parts.push(...rules.map(group => `<h2>${esc(group.title)}</h2><ul>${group.items.map(item => `<li>${esc(branded(item, ctx))}</li>`).join('')}</ul>`));
  } else if (kind === '/faq') {
    parts.push(...faq.map(item => `<h2>${esc(item.q)}</h2><p>${esc(branded(item.a, ctx))}</p>`));
  } else if (kind === '/ranks' || kind === '/store') {
    parts.push('<h2>Ranks</h2>', rankList(ctx), `<p>${storeLive() ? 'Ranks are purchased with Points.' : 'Checkout is not available yet; no payment is taken and nothing is delivered from this website.'}</p>`);
  } else if (kind === '/team') {
    parts.push(`<ul>${team.map(member => `<li><a href="/team/${esc(member.slug)}">${esc(member.name)}</a> (${esc(member.ign)}): ${esc(joinList(member.roles))}</li>`).join('')}</ul>`);
  } else if (entry.kind === 'profile') {
    const member = entry.item;
    parts.push(`<p>Minecraft username: <code>${esc(member.ign)}</code>. Roles: ${esc(joinList(member.roles))}.</p>`, ...member.bio.map(paragraph => `<p>${esc(branded(paragraph, ctx))}</p>`));
    if (member.responsibilities?.length) parts.push('<h2>Responsibilities</h2>', `<ul>${member.responsibilities.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`);
    if (member.skills?.length) parts.push('<h2>Skills and technologies</h2>', ...member.skills.map(group => `<h3>${esc(group.title)}</h3><p>${esc(group.items.join(', '))}</p>`));
    if (member.links?.length) parts.push(`<p>${member.links.map(link => `<a href="${esc(link.href)}" rel="noopener noreferrer">${esc(link.label)}</a>`).join(' · ')}</p>`);
    parts.push('<p><a href="/team">Back to the team</a></p>');
  } else if (kind === '/announcements') {
    parts.push(server.announcements.length ? `<ul>${server.announcements.map(item => `<li><a href="/announcements/${esc(item.slug)}">${esc(item.title)}</a></li>`).join('')}</ul>` : '<p>No announcements have been published yet.</p>', discordParagraph(ctx));
  } else if (entry.kind === 'article') {
    parts.push(`<p>${esc(entry.item.summary || '')}</p>`);
  } else {
    parts.push(discordParagraph(ctx));
  }
  return `<div class="seo-static">${parts.join('')}</div>`;
}

const HEAD_BLOCK = /<!--seo:head-->[\s\S]*?<!--\/seo:head-->/;
const CONTENT_BLOCK = /<!--seo:content-->[\s\S]*?<!--\/seo:content-->/;

export function renderPage(template, path, options = {}) {
  const meta = pageMeta(path, options);
  const html = template
    .replace(HEAD_BLOCK, () => headTags(meta))
    .replace(CONTENT_BLOCK, () => staticContent(path, options));
  return { status: meta.known ? 200 : 404, html, meta };
}

export function robotsTxt(options = {}) {
  const ctx = contextOf(options);
  return [
    `# ${ctx.name} robots.txt`,
    '# Search and AI answer-engine crawlers are welcome on the public site.',
    '# To opt out of a specific crawler (for example an AI training crawler), add a block such as:',
    '#   User-agent: GPTBot',
    '#   Disallow: /',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${ctx.siteUrl}/sitemap.xml`,
    ''
  ].join('\n');
}

export function sitemapXml(options = {}) {
  const ctx = contextOf(options);
  const urls = listRoutes().filter(isIndexable).map(path => `${ctx.siteUrl}${path === '/' ? '/' : path}`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${esc(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
}

export function llmsTxt(options = {}) {
  const ctx = contextOf(options);
  const at = path => `${ctx.siteUrl}${path}`;
  const lines = [
    `# ${ctx.name}`,
    '',
    `> ${ctx.description}`,
    '',
    `${ctx.name} is a community-focused Minecraft survival SMP. Java Edition address: ${server.javaAddress}. Bedrock Edition address: ${server.bedrockAddress}, port ${server.bedrockPort}. ${branded(server.versionNote, ctx)}`,
    '',
    `Official community and support: ${server.discord}`,
    '',
    '## Play',
    `- [How to join](${at('/how-to-join')}): server addresses for Java and Bedrock, and the first steps after connecting`,
    `- [Rules](${at('/rules')}): conduct, fair play, building, chat and staff decisions`,
    `- [FAQ](${at('/faq')}): common questions about joining, versions, ranks and support`,
    `- [Guides](${at('/guides')}): land claims, the economy, custom biomes and rank progression`,
    '',
    '## About',
    `- [About ${ctx.name}](${at('/about')}): what the server is and who it is for`,
    `- [Features](${at('/features')}): ${joinList(server.features.map(feature => feature.title.toLowerCase()))}`,
    `- [Team](${at('/team')}): owners, managers, developers, marketers and moderators`,
    '',
    '## Ranks and store',
    `- [Ranks](${at('/ranks')}): ${joinList(server.ranks.map(rank => rank.name))} lifetime ranks and what each includes`,
    `- [Store](${at('/store')}): ${storeLive() ? 'buy ranks and Points' : 'ranks and Points; checkout is not available yet'}`,
    '',
    '## Support',
    `- [Support](${at('/support')}): how to get help, report players or bugs, and ask about orders through Discord`,
    ''
  ];
  return lines.join('\n');
}

export function webManifest(options = {}) {
  const ctx = contextOf(options);
  return JSON.stringify({
    name: ctx.name,
    short_name: ctx.name,
    description: ctx.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#07110f',
    theme_color: '#07110f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  }, null, 2);
}
