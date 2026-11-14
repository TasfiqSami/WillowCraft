import { fetchSkinPng, skinHeaders, SkinError } from '../src/skin-service.js';

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    response.statusCode = 405;
    response.end('Method Not Allowed');
    return;
  }

  const ign = String(request.query?.ign ?? new URL(request.url, 'http://localhost').searchParams.get('ign') ?? '');
  try {
    const { name, png } = await fetchSkinPng(ign);
    response.statusCode = 200;
    for (const [key, value] of Object.entries(skinHeaders(name, png.length))) response.setHeader(key, value);
    response.end(request.method === 'HEAD' ? undefined : png);
  } catch (error) {
    const status = error instanceof SkinError ? error.status : 500;
    response.statusCode = status;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.end(error instanceof SkinError ? error.message : 'Skin download failed');
  }
}
