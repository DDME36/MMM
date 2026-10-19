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
const { journeyStops, nextJourneyStop } = await server.ssrLoadModule('/src/lib/journey.ts');

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
