// Validates the built site in public/. Run after `npm run build:vercel`.
import { readFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRuntimeConfig } from '../src/runtime-env.js';
import { isIndexable, listRoutes } from '../src/seo.js';

const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const origin = getRuntimeConfig().siteUrl;
const errors = [];
const fail = (route, message) => errors.push(`${route}: ${message}`);
const exists = (file) => access(file).then(() => true, () => false);
const one = (html, re) => (html.match(re) || [])[1];

const titles = new Map();
const descriptions = new Map();
const indexable = [];

for (const route of listRoutes()) {
  const file = route === '/' ? resolve(out, 'index.html') : resolve(out, `.${route}/index.html`);
  if (!(await exists(file))) { fail(route, 'prerendered file is missing'); continue; }
  const html = await readFile(file, 'utf8');
  const title = one(html, /<title>([^<]*)<\/title>/);
  const description = one(html, /<meta name="description" content="([^"]*)"/);
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = one(html, /<meta name="robots" content="([^"]*)"/);
  const wantIndex = isIndexable(route);

  if ((html.match(/<title>/g) || []).length !== 1) fail(route, 'needs exactly one <title>');
  if (!title || title.length > 65) fail(route, `title missing or over 65 chars (${title?.length})`);
  if (!description || description.length < 50 || description.length > 170) fail(route, `description length ${description?.length} is outside 50-170`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(route, 'needs exactly one <h1> in the prerendered content');
  if (wantIndex) {
    indexable.push(route);
    if (canonical !== `${origin}${route === '/' ? '/' : route}`) fail(route, `canonical is ${canonical}`);
    if (robots && /noindex/.test(robots)) fail(route, 'indexable route is marked noindex');
    if (titles.has(title)) fail(route, `duplicate title with ${titles.get(title)}`);
    if (descriptions.has(description)) fail(route, `duplicate description with ${descriptions.get(description)}`);
    titles.set(title, route);
    descriptions.set(description, route);
  } else if (!/noindex/.test(robots || '')) fail(route, 'draft route must be noindex');

  const ld = one(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!ld) fail(route, 'missing JSON-LD');
  else {
    try { JSON.parse(ld); } catch { fail(route, 'JSON-LD does not parse'); }
  }
  if (!/og:image/.test(html) || !/twitter:card/.test(html)) fail(route, 'missing Open Graph / Twitter tags');
}

const notFound = await readFile(resolve(out, '404.html'), 'utf8').catch(() => '');
if (!/noindex/.test(notFound)) fail('404.html', 'missing or not noindex');

const sitemap = await readFile(resolve(out, 'sitemap.xml'), 'utf8').catch(() => '');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const expected = indexable.map((r) => `${origin}${r === '/' ? '/' : r}`);
for (const url of expected) if (!locs.includes(url)) fail('sitemap.xml', `missing ${url}`);
for (const url of locs) if (!expected.includes(url)) fail('sitemap.xml', `lists non-indexable ${url}`);

const robotsTxt = await readFile(resolve(out, 'robots.txt'), 'utf8').catch(() => '');
if (!robotsTxt.includes(`Sitemap: ${origin}/sitemap.xml`)) fail('robots.txt', 'missing Sitemap line');
for (const file of ['llms.txt', 'manifest.webmanifest', 'og-image.jpg', 'Banners.webp', 'favicon.ico', 'apple-touch-icon.png']) {
  if (!(await exists(resolve(out, file)))) fail(file, 'missing from build output');
}

if (errors.length) {
  console.error(`SEO check failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`SEO check passed: ${listRoutes().length} pages, ${indexable.length} indexable, ${locs.length} sitemap URLs.`);
