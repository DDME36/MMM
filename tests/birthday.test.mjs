import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { existsSync } from 'node:fs';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
after(() => server.close());
const { livedTime, graphemes } = await server.ssrLoadModule('/src/lib/birthday.ts');
const { CONFIG } = await server.ssrLoadModule('/src/config.ts');
const { default: App } = await server.ssrLoadModule('/src/App.tsx');
const { journeyStops, nextJourneyStop, readingStops } = await server.ssrLoadModule('/src/lib/journey.ts');

test('chapter scrolling keeps short chapters intact and adds reading stops in tall chapters', () => {
  assert.deepEqual(journeyStops([0, 800, 1600], 800, 2400), [0, 800, 1600]);
  const stops = journeyStops([0, 800, 2400, 4000], 800, 5200);
  assert.deepEqual(stops, [0, 800, 1600, 2400, 3200, 4000, 4400]);
  assert.equal(nextJourneyStop(stops, 805, 1), 1600);
  assert.equal(nextJourneyStop(stops, 805, -1), 0);
  assert.equal(nextJourneyStop(stops, 4400, 1), undefined);
  assert.equal(nextJourneyStop(stops, 0, -1), undefined);
  assert.deepEqual(journeyStops([], 0, 1000), [0]);
});

test('mobile wish stops keep whole cards clear of the sound control and bottom progress', () => {
  // Actual 390px layout: the old halfway stop at 5144 cut the top off card two.
  const chapterTop = 4523;
  const cards = [{ top: 4764, bottom: 5049 }, { top: 5072, bottom: 5357 }, { top: 5380, bottom: 5665 }];
  const stops = readingStops(cards, chapterTop, 844, 72, 80);
  assert.deepEqual(stops, [4950.5]);
  const target = Math.round(stops[0]);
  assert.ok(cards[1].top - target >= 72);
  assert.ok(cards[2].bottom - target <= 844 - 80);
  const merged = journeyStops([0, 844, 1991, 2835, 3679, 4523, 5765], 844, 6609, stops);
  assert.ok(merged.includes(target));
  assert.ok(!merged.includes(5144));
  for (const height of [568, 667, 740, 844, 932]) {
    const positions = [chapterTop, ...readingStops(cards, chapterTop, height, 72, 80)];
    for (const card of cards) assert.ok(positions.some(y => card.top >= y + 72 - 1 && card.bottom <= y + height - 80 + 1), `${height}: ${card.top}`);
  }
});

test('reading stops preserve desktop rows and cover letters taller than the viewport', () => {
  assert.deepEqual(readingStops([{ top: 200, bottom: 530 }, { top: 200, bottom: 530 }, { top: 200, bottom: 530 }], 0, 900, 72, 80), []);
  const stops = readingStops([{ top: 1300, bottom: 2900 }], 900, 700, 72, 80);
  assert.equal(stops[0], 1228);
  assert.equal(stops[stops.length - 1], 2280);
  for (let i = 1; i < stops.length; i++) assert.ok(stops[i] - stops[i - 1] <= 700 - 72 - 80);
  assert.deepEqual(readingStops([], 0, 100, 72, 80), []);
});

test('the lifetime counter honors the configured timezone, carry boundaries, and future dates', () => {
  const birth = '2001-10-22T00:00:00+07:00';
  assert.deepEqual(livedTime(birth, Date.parse('2001-10-21T17:00:00Z')), [0, 0, 0, 0]);
  assert.deepEqual(livedTime(birth, Date.parse(birth) + 90061000), [1, 1, 1, 1]);
  assert.deepEqual(livedTime(birth, Date.parse(birth) - 1000), [0, 0, 0, 0]);
  assert.deepEqual(livedTime('invalid-date', Date.now()), [0, 0, 0, 0]);
});

test('typewriter segments Thai combining marks and emoji without splitting visible letters', () => {
  assert.deepEqual(graphemes('กิ'), ['กิ']);
  assert.deepEqual(graphemes('💖'), ['💖']);
  assert.equal(graphemes(CONFIG.cake.mainWish).join(''), CONFIG.cake.mainWish);
});

test('the gate protects the story while all five chapters and requested interactions render', () => {
  const html = renderToString(createElement(App));
  assert.match(html, /inert=""/);
  assert.match(html, /invitation-envelope/);
  for (const id of ['hero', 'rewind', 'moments', 'wishes', 'birthday-cake']) assert.ok(html.includes(`id="${id}"`), id);
  assert.equal((html.match(/class="lane-photo /g) ?? []).length, 6);
  assert.equal((html.match(/class="secret-card /g) ?? []).length, 3);
  assert.equal((html.match(/class="candle-flame"/g) ?? []).length, 2);
  assert.ok(html.includes(CONFIG.bento.portrait));
  assert.ok(html.includes('PHROM'));
  assert.equal((html.match(/data-chapter="/g) ?? []).length, 7);
  assert.match(html, /class="bento-player /);
  assert.ok(html.includes(`aria-label="${CONFIG.labels.songPosition}"`));
  assert.ok(html.includes(`aria-label="${CONFIG.labels.songVolume}"`));
  assert.doesNotMatch(html, /<footer|<header/);
  for (const match of html.matchAll(/src="(\/assets\/[^\"]+)"/g)) assert.ok(existsSync(`public${decodeURI(match[1])}`), match[1]);
});

test('editing CONFIG changes the name, image, and secret copy without editing components', () => {
  const original = { name: CONFIG.person.name, portrait: CONFIG.hero.portrait, message: CONFIG.secrets.cards[0].message };
  try {
    CONFIG.person.name = 'คนพิเศษ';
    CONFIG.hero.portrait = '/custom-birthday-photo.jpg';
    CONFIG.secrets.cards[0].message = 'คำอวยพรที่แก้จาก CONFIG';
    const html = renderToString(createElement(App));
    assert.ok(html.includes('aria-label="คนพิเศษ"'));
    assert.ok(html.includes('src="/custom-birthday-photo.jpg"'));
    assert.ok(html.includes('คำอวยพรที่แก้จาก CONFIG'));
    assert.ok(html.includes(CONFIG.bento.portrait));
  } finally {
    CONFIG.person.name = original.name;
    CONFIG.hero.portrait = original.portrait;
    CONFIG.secrets.cards[0].message = original.message;
  }
});
