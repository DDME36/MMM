import { CONFIG } from '../config';

const escapeHtml = (value: string | number) => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

/** Rendered by Vite into the initial HTML so link crawlers do not need JavaScript. */
export function renderShareMetadata() {
  const { meta, person, theme } = CONFIG;
  const site = new URL(meta.siteUrl);
  if (site.protocol !== 'https:') throw new Error('CONFIG.meta.siteUrl must use https:// for the public sharing URL.');
  site.search = '';
  site.hash = '';
  if (!site.pathname.endsWith('/')) site.pathname += '/';
  const image = new URL(meta.image, site).href;
  const property = (name: string, value: string | number) => `<meta property="${name}" content="${escapeHtml(value)}" />`;
  const named = (name: string, value: string) => `<meta name="${name}" content="${escapeHtml(value)}" />`;
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    named('description', meta.description),
    named('theme-color', theme.paper),
    `<link rel="icon" type="image/x-icon" sizes="16x16 32x32 48x48" href="${escapeHtml(meta.faviconIco)}" />`,
    `<link rel="icon" type="image/png" sizes="32x32" href="${escapeHtml(meta.faviconPng)}" />`,
    `<link rel="icon" type="image/svg+xml" sizes="any" href="${escapeHtml(meta.favicon)}" />`,
    `<link rel="apple-touch-icon" sizes="180x180" href="${escapeHtml(meta.touchIcon)}" />`,
    `<link rel="canonical" href="${escapeHtml(site.href)}" />`,
    property('og:type', 'website'),
    property('og:locale', person.locale.replace(/-/g, '_')),
    property('og:site_name', meta.siteName),
    property('og:title', meta.shareTitle),
    property('og:description', meta.description),
    property('og:url', site.href),
    property('og:image', image),
    property('og:image:secure_url', image),
    property('og:image:type', 'image/jpeg'),
    property('og:image:width', meta.imageWidth),
    property('og:image:height', meta.imageHeight),
    property('og:image:alt', meta.imageAlt),
    named('twitter:card', 'summary_large_image'),
    named('twitter:title', meta.shareTitle),
    named('twitter:description', meta.description),
    named('twitter:image', image),
    named('twitter:image:alt', meta.imageAlt),
  ].join('\n    ');
}
