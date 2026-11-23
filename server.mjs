import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRuntimeConfig, getRuntimeThemeCss, jsonForScript } from './src/runtime-env.js';
import { llmsTxt, normalizePath, renderPage, robotsTxt, sitemapXml, webManifest } from './src/seo.js';
import { fetchSkinPng, skinHeaders, SkinError } from './src/skin-service.js';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
try { process.loadEnvFile(resolve(root, '.env')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535.');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const headers = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https://render.crafty.gg; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Resource-Policy': 'same-origin',
  'Cache-Control': 'no-cache'
};
const runtimeConfig = getRuntimeConfig();
const seoOptions = { siteName: runtimeConfig.name, tagline: runtimeConfig.tagline, description: runtimeConfig.description, siteUrl: runtimeConfig.siteUrl };
const crawlerFiles = {
  '/robots.txt': [robotsTxt, 'text/plain; charset=utf-8'],
  '/sitemap.xml': [sitemapXml, 'application/xml; charset=utf-8'],
  '/llms.txt': [llmsTxt, 'text/plain; charset=utf-8'],
  '/manifest.webmanifest': [webManifest, 'application/manifest+json; charset=utf-8']
};

http.createServer(async (req, res) => {
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }).end('Method Not Allowed'); return; }
  let path;
  try { path = decodeURIComponent(new URL(req.url, `http://${host}`).pathname); }
  catch { res.writeHead(400).end('Bad Request'); return; }
  if (path.includes('\\') || path.includes('\0')) { res.writeHead(400).end('Bad Request'); return; }
  if (path === '/runtime-config.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(`window.WILLOWCRAFT_RUNTIME=${jsonForScript(runtimeConfig)};document.querySelector('meta[name="theme-color"]').content=${jsonForScript(runtimeConfig.themeColor)};document.querySelector('.preloader')?.setAttribute('aria-label',${jsonForScript(`Loading ${runtimeConfig.name}`)});`);
    return;
  }
  if (path === '/runtime-theme.css') {
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(getRuntimeThemeCss());
    return;
  }
  if (path.startsWith('/api/')) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (path.startsWith('/api/skin/')) {
    try {
      const { name, png } = await fetchSkinPng(path.slice('/api/skin/'.length));
      res.writeHead(200, skinHeaders(name, png.length));
      res.end(req.method === 'HEAD' ? undefined : png);
    } catch (error) {
      const known = error instanceof SkinError;
      res.writeHead(known ? error.status : 500, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(known ? error.message : 'Skin download failed');
    }
    return;
  }
  if (path === '/news' || path.startsWith('/news/')) { res.writeHead(308, { Location: `/announcements${path.slice('/news'.length)}` }).end(); return; }
  if (path === '/staff') { res.writeHead(308, { Location: '/team' }).end(); return; }
  if (crawlerFiles[path]) {
    const [build, type] = crawlerFiles[path];
    res.writeHead(200, { 'Content-Type': type });
    res.end(req.method === 'HEAD' ? undefined : build(seoOptions));
    return;
  }
  if (extname(path) === '') {
    try {
      const { status, html } = renderPage(await readFile(resolve(root, 'index.html'), 'utf8'), normalizePath(path), seoOptions);
      res.writeHead(status, { 'Content-Type': mime['.html'] });
      res.end(req.method === 'HEAD' ? undefined : html);
    } catch { res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Page could not be rendered'); }
    return;
  }
  const file = resolve(root, `.${path}`);
  if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end('Forbidden'); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not Found'); }
}).listen(port, host, () => console.log(`WillowCraft is ready at http://${host}:${port}`));
