import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getRuntimeConfig,
  getRuntimeThemeCss,
  jsonForScript
} from '../src/runtime-env.js';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'public');

const staticFiles = [
  'index.html',
  'styles.css',
  'Banners.png',
  'logo.png',
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
const configScript = `window.WILLOWCRAFT_RUNTIME=${jsonForScript(config)};document.title=${jsonForScript(
  `${config.name} — ${config.tagline}`
)};document.querySelector('meta[name="description"]').content=${jsonForScript(
  config.description
)};document.querySelector('meta[property="og:title"]').content=document.title;document.querySelector('meta[property="og:description"]').content=${jsonForScript(
  config.description
)};document.querySelector('meta[name="theme-color"]').content=${jsonForScript(
  config.themeColor
)};document.querySelector('.preloader')?.setAttribute('aria-label',${jsonForScript(
  `Loading ${config.name}`
)});`;

await writeFile(resolve(outputDirectory, 'runtime-config.js'), configScript, 'utf8');
await writeFile(resolve(outputDirectory, 'runtime-theme.css'), getRuntimeThemeCss(), 'utf8');

console.log(`WillowCraft Vercel output created at ${outputDirectory}`);
