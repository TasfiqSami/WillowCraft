import { getRuntimeThemeCss } from '../src/runtime-env.js';

export default function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    response.statusCode = 405;
    response.end(request.method === 'HEAD' ? undefined : 'Method Not Allowed');
    return;
  }

  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/css; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(request.method === 'HEAD' ? undefined : getRuntimeThemeCss());
}
