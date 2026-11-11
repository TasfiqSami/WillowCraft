import { server as content } from './config.js';

const defaults = {
  siteName: content.name,
  siteTagline: 'Find your place in the wild',
  siteDescription: content.description,
  colors: {
    THEME_DARK_BG: '#07110f',
    THEME_DARK_BG2: '#0c1916',
    THEME_DARK_SURFACE: '#10231e',
    THEME_DARK_SURFACE2: '#142b24',
    THEME_DARK_TEXT: '#f3f8f4',
    THEME_DARK_MUTED: '#a8b9ae',
    THEME_DARK_SOFT: '#71867a',
    THEME_DARK_ACCENT: '#70dfa0',
    THEME_DARK_ACCENT2: '#acf0bf',
    THEME_DARK_PURPLE: '#8877cb',
    THEME_LIGHT_BG: '#f3f6ef',
    THEME_LIGHT_BG2: '#e8eee5',
    THEME_LIGHT_SURFACE: '#fffefa',
    THEME_LIGHT_SURFACE2: '#edf4eb',
    THEME_LIGHT_TEXT: '#15271d',
    THEME_LIGHT_MUTED: '#52675a',
    THEME_LIGHT_SOFT: '#718479',
    THEME_LIGHT_ACCENT: '#217b4a',
    THEME_LIGHT_ACCENT2: '#286e43',
    THEME_LIGHT_PURPLE: '#7064a0'
  }
};

const textSetting = (env, key, fallback, limit) =>
  (env[key] || fallback).trim().slice(0, limit);

const safeColor = (env, key) => {
  const candidate = env[key] || '';
  return /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(candidate)
    ? candidate
    : defaults.colors[key];
};

export function getRuntimeConfig(env = process.env) {
  return {
    name: textSetting(env, 'SITE_NAME', defaults.siteName, 80),
    tagline: textSetting(env, 'SITE_TAGLINE', defaults.siteTagline, 120),
    description: textSetting(env, 'SITE_DESCRIPTION', defaults.siteDescription, 300),
    themeColor: safeColor(env, 'THEME_DARK_BG')
  };
}

export function getRuntimeThemeCss(env = process.env) {
  const names = {
    BG: '--bg',
    BG2: '--bg2',
    SURFACE: '--surface',
    SURFACE2: '--surface2',
    TEXT: '--text',
    MUTED: '--muted',
    SOFT: '--soft',
    ACCENT: '--accent',
    ACCENT2: '--accent2',
    PURPLE: '--purple'
  };

  const rules = mode =>
    Object.entries(names)
      .map(([key, variable]) => `${variable}:${safeColor(env, `THEME_${mode}_${key}`)}`)
      .join(';');

  return `:root{${rules('DARK')}}:root[data-theme="light"]{${rules('LIGHT')}}`;
}

export function jsonForScript(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, character =>
    ({
      '<': '\\u003c',
      '>': '\\u003e',
      '&': '\\u0026',
      '\u2028': '\\u2028',
      '\u2029': '\\u2029'
    })[character]
  );
}
