// Resolves a Minecraft username to the player's real skin texture (a PNG), via Mojang's public APIs.
// Used by both server.mjs and api/skin.js. No credentials are needed.

const NAME = /^[A-Za-z0-9_]{1,16}$/;
const UUID = /^[0-9a-f]{32}$/i;
const TEXTURE_HOST = 'textures.minecraft.net';
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const MAX_BYTES = 256 * 1024;
const TIMEOUT_MS = 8000;

const LOOKUP_URLS = [
  name => `https://api.minecraftservices.com/minecraft/profile/lookup/name/${encodeURIComponent(name)}`,
  name => `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(name)}`
];

export class SkinError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function getJson(url) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { accept: 'application/json' } });
  } catch {
    throw new SkinError(502, 'Could not reach Mojang');
  }
  if (response.status === 204 || response.status === 404) throw new SkinError(404, 'Player not found');
  if (!response.ok) throw new SkinError(502, 'Mojang lookup failed');
  try {
    return await response.json();
  } catch {
    throw new SkinError(502, 'Unexpected response from Mojang');
  }
}

async function lookupProfile(name) {
  let lastError;
  for (const build of LOOKUP_URLS) {
    try {
      const profile = await getJson(build(name));
      if (UUID.test(profile?.id || '')) return profile;
      lastError = new SkinError(502, 'Unexpected profile response');
    } catch (error) {
      if (error.status === 404) throw error;
      lastError = error;
    }
  }
  throw lastError || new SkinError(502, 'Mojang lookup failed');
}

export async function fetchSkinPng(ign) {
  if (!NAME.test(ign)) throw new SkinError(400, 'Invalid Minecraft username');

  const profile = await lookupProfile(ign);
  const session = await getJson(`https://sessionserver.mojang.com/session/minecraft/profile/${profile.id}`);
  const property = Array.isArray(session?.properties) ? session.properties.find(item => item?.name === 'textures') : null;
  if (!property?.value) throw new SkinError(404, 'This player has no skin texture');

  let skinUrl;
  try {
    skinUrl = JSON.parse(Buffer.from(property.value, 'base64').toString('utf8'))?.textures?.SKIN?.url;
  } catch {
    throw new SkinError(502, 'Unexpected texture data');
  }
  if (!skinUrl) throw new SkinError(404, 'This player uses a default skin');

  let target;
  try {
    target = new URL(skinUrl);
  } catch {
    throw new SkinError(502, 'Unexpected texture URL');
  }
  if (target.protocol !== 'https:' || target.hostname !== TEXTURE_HOST) throw new SkinError(502, 'Unexpected texture host');

  let response;
  try {
    response = await fetch(target, { signal: AbortSignal.timeout(TIMEOUT_MS), redirect: 'error' });
  } catch {
    throw new SkinError(502, 'Could not download the skin texture');
  }
  if (!response.ok) throw new SkinError(502, 'Could not download the skin texture');

  const png = Buffer.from(await response.arrayBuffer());
  if (png.length === 0 || png.length > MAX_BYTES || !PNG_SIGNATURE.every((byte, index) => png[index] === byte)) {
    throw new SkinError(502, 'The skin texture was not a valid PNG');
  }

  const name = NAME.test(profile.name || '') ? profile.name : ign;
  return { name, png };
}

export function skinHeaders(name, length) {
  return {
    'Content-Type': 'image/png',
    'Content-Length': String(length),
    'Content-Disposition': `attachment; filename="${name}-skin.png"`,
    'Cache-Control': 'public, max-age=300, s-maxage=3600',
    'X-Content-Type-Options': 'nosniff'
  };
}
