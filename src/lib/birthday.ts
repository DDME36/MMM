import { CONFIG } from '../config';

export function livedTime(birthDate: string, now: number) {
  const birth = Date.parse(birthDate);
  const seconds = Number.isFinite(birth) ? Math.max(0, Math.floor((now - birth) / 1000)) : 0;
  return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}

export function birthdayDate(style: 'short' | 'long' | 'english' = 'long') {
  const date = new Date(CONFIG.person.celebrationDate);
  if (!Number.isFinite(date.getTime())) return '';
  return new Intl.DateTimeFormat(style === 'english' ? 'en-GB' : CONFIG.person.locale, {
    timeZone: CONFIG.person.timeZone, day: 'numeric', month: style === 'short' ? '2-digit' : 'long', year: 'numeric',
  }).format(date);
}

export function graphemes(text: string) {
  return typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter(CONFIG.person.locale, { granularity: 'grapheme' }).segment(text), part => part.segment)
    : Array.from(text);
}
