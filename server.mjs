import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { server as content, nav, footerNav, guides } from './src/config.js';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
try { process.loadEnvFile(resolve(root, '.env')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535.');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };
const headers = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Resource-Policy': 'same-origin',
  'Cache-Control': 'no-cache'
};
const pagePaths = new Set([
  '/', '/about', '/features', '/how-to-join', '/guides', '/rules', '/faq', '/community', '/support', '/announcements', '/ranks', '/store', '/leaderboard', '/gallery', '/shipping', '/refunds', '/team', '/terms', '/privacy', '/maintenance',
  ...nav.map(item => item.href),
  ...Object.values(footerNav).flat().filter(item => !item.external).map(item => item.href),
  ...guides.map(item => item.path)
]);

const defaults = {
  siteName: content.name,
  siteTagline: 'Find your place in the wild',
  siteDescription: content.description,
  colors: {
    THEME_DARK_BG: '#07110f', THEME_DARK_BG2: '#0c1916', THEME_DARK_SURFACE: '#10231e', THEME_DARK_SURFACE2: '#142b24',
    THEME_DARK_TEXT: '#f3f8f4', THEME_DARK_MUTED: '#a8b9ae', THEME_DARK_SOFT: '#71867a', THEME_DARK_ACCENT: '#70dfa0', THEME_DARK_ACCENT2: '#acf0bf', THEME_DARK_PURPLE: '#8877cb',
    THEME_LIGHT_BG: '#f3f6ef', THEME_LIGHT_BG2: '#e8eee5', THEME_LIGHT_SURFACE: '#fffefa', THEME_LIGHT_SURFACE2: '#edf4eb',
    THEME_LIGHT_TEXT: '#15271d', THEME_LIGHT_MUTED: '#52675a', THEME_LIGHT_SOFT: '#718479', THEME_LIGHT_ACCENT: '#217b4a', THEME_LIGHT_ACCENT2: '#286e43', THEME_LIGHT_PURPLE: '#7064a0'
  }
};
const textSetting = (key, fallback, limit) => (process.env[key] || fallback).trim().slice(0, limit);
const safeColor = (key) => {
  const candidate = process.env[key] || '';
  return /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(candidate) ? candidate : defaults.colors[key];
};
const runtimeConfig = {
  name: textSetting('SITE_NAME', defaults.siteName, 80),
  tagline: textSetting('SITE_TAGLINE', defaults.siteTagline, 120),
  description: textSetting('SITE_DESCRIPTION', defaults.siteDescription, 300),
  themeColor: safeColor('THEME_DARK_BG')
};
const jsonForScript = (value) => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, c => ({ '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029' })[c]);
const runtimeThemeCss = () => {
  const names = { BG: '--bg', BG2: '--bg2', SURFACE: '--surface', SURFACE2: '--surface2', TEXT: '--text', MUTED: '--muted', SOFT: '--soft', ACCENT: '--accent', ACCENT2: '--accent2', PURPLE: '--purple' };
  const rules = (mode) => Object.entries(names).map(([key, variable]) => `${variable}:${safeColor(`THEME_${mode}_${key}`)}`).join(';');
  return `:root{${rules('DARK')}}:root[data-theme="light"]{${rules('LIGHT')}}`;
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
    res.end(`window.WILLOWCRAFT_RUNTIME=${jsonForScript(runtimeConfig)};document.title=${jsonForScript(`${runtimeConfig.name} — ${runtimeConfig.tagline}`)};document.querySelector('meta[name="description"]').content=${jsonForScript(runtimeConfig.description)};document.querySelector('meta[property="og:title"]').content=document.title;document.querySelector('meta[property="og:description"]').content=${jsonForScript(runtimeConfig.description)};document.querySelector('meta[name="theme-color"]').content=${jsonForScript(runtimeConfig.themeColor)};document.querySelector('.preloader')?.setAttribute('aria-label',${jsonForScript(`Loading ${runtimeConfig.name}`)});`);
    return;
  }
  if (path === '/runtime-theme.css') {
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(runtimeThemeCss());
    return;
  }
  if (path === '/news' || path.startsWith('/news/')) { res.writeHead(308, { Location: `/announcements${path.slice('/news'.length)}` }).end(); return; }
  if (path === '/staff') { res.writeHead(308, { Location: '/team' }).end(); return; }
  const candidate = resolve(root, `.${path}`);
  if (candidate !== root && !candidate.startsWith(root + sep)) { res.writeHead(403).end('Forbidden'); return; }
  let file = candidate;
  let responseStatus = 200;
  try { if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html'); }
  catch {
    const route = path.replace(/\/$/, '') || '/';
    const announcementPath = route.startsWith('/announcements/') && content.announcements.some(item => item.slug === (() => { try { return decodeURIComponent(route.slice('/announcements/'.length)); } catch { return null; } })());
    file = resolve(root, 'index.html');
    if (!pagePaths.has(route) && !announcementPath) responseStatus = 404;
  }
  if (!file.startsWith(root + sep) && file !== root) { res.writeHead(403).end('Forbidden'); return; }
  try {
    const body = await readFile(file);
    res.writeHead(responseStatus, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not Found'); }
}).listen(port, host, () => console.log(`WillowCraft is ready at http://${host}:${port}`));
