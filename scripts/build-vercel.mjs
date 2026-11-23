import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getRuntimeConfig,
  getRuntimeThemeCss,
  jsonForScript
} from '../src/runtime-env.js';
import { listRoutes, llmsTxt, renderPage, robotsTxt, sitemapXml, webManifest } from '../src/seo.js';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'public');

const staticFiles = [
  'index.html',
  'styles.css',
  'Banners.png',
  'Banners.webp',
  'logo.png',
  'og-image.jpg',
  'favicon.ico',
  'favicon-32.png',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'src',
  'assets'
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of staticFiles) {
  await cp(
    resolve(projectRoot, file),
    resolve(outputDirectory, file),
    { recursive: true, force: true }
  );
}

const config = getRuntimeConfig();
const configScript = `window.WILLOWCRAFT_RUNTIME=${jsonForScript(config)};document.querySelector('meta[name="theme-color"]').content=${jsonForScript(
  config.themeColor
)};document.querySelector('.preloader')?.setAttribute('aria-label',${jsonForScript(
  `Loading ${config.name}`
)});`;

await writeFile(resolve(outputDirectory, 'runtime-config.js'), configScript, 'utf8');
await writeFile(resolve(outputDirectory, 'runtime-theme.css'), getRuntimeThemeCss(), 'utf8');

// Search and AI crawlers: per-route HTML with unique metadata, structured data and readable content.
const seoOptions = {
  siteName: config.name,
  tagline: config.tagline,
  description: config.description,
  siteUrl: config.siteUrl
};
const template = await readFile(resolve(projectRoot, 'index.html'), 'utf8');

for (const route of listRoutes()) {
  const { html } = renderPage(template, route, seoOptions);
  const target = route === '/' ? resolve(outputDirectory, 'index.html') : resolve(outputDirectory, `.${route}`, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, 'utf8');
}
await writeFile(resolve(outputDirectory, '404.html'), renderPage(template, '/__not-found__', seoOptions).html, 'utf8');

await writeFile(resolve(outputDirectory, 'robots.txt'), robotsTxt(seoOptions), 'utf8');
await writeFile(resolve(outputDirectory, 'sitemap.xml'), sitemapXml(seoOptions), 'utf8');
await writeFile(resolve(outputDirectory, 'llms.txt'), llmsTxt(seoOptions), 'utf8');
await writeFile(resolve(outputDirectory, 'manifest.webmanifest'), webManifest(seoOptions), 'utf8');

console.log(`WillowCraft Vercel output created at ${outputDirectory}`);
