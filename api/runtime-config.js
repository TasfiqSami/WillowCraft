import { getRuntimeConfig, jsonForScript } from '../src/runtime-env.js';

export default function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    response.statusCode = 405;
    response.end(request.method === 'HEAD' ? undefined : 'Method Not Allowed');
    return;
  }

  const config = getRuntimeConfig();
  const body = `window.WILLOWCRAFT_RUNTIME=${jsonForScript(config)};document.title=${jsonForScript(
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

  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(request.method === 'HEAD' ? undefined : body);
}
