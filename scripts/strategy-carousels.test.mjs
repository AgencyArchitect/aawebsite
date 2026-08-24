import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pagePath = new URL('../src/pages/e-commerce-marketing/strategie.astro', import.meta.url);
const textCarouselPath = new URL('../src/components/ecom-strategie/TextCarousel.tsx', import.meta.url);

const read = (url) => readFile(url, 'utf8');

test('principles render as four static responsive tiles', async () => {
  const page = await read(pagePath);
  assert.doesNotMatch(page, /import Carousel/);
  assert.doesNotMatch(page, /<Carousel/);
  assert.match(page, /class="principes-grid"/);
  assert.match(page, /principes\.map\(\(principe, index\)/);
  assert.match(page, /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(page, /@media\s*\(max-width:\s*73\.125rem\)/);
  assert.match(page, /\.principes-grid\s*\{[\s\S]*grid-template-columns:\s*1fr/);
});

test('principle tiles have equal height and contained responsive copy', async () => {
  const page = await read(pagePath);
  assert.match(page, /\.principes-grid__tile[\s\S]*min-block-size:\s*clamp\(22rem,\s*32vw,\s*26rem\)/);
  assert.match(page, /\.principes-grid__content[\s\S]*min-block-size:\s*100%/);
  // Tekst staat bovenaan (align top), niet onderaan.
  assert.match(page, /\.principes-grid__content[\s\S]*justify-content:\s*flex-start/);
  // Op mobiel/gestapeld houden de tegels dezelfde (desktop)hoogte.
  assert.match(page, /@media\s*\(max-width:\s*73\.125rem\)[\s\S]*\.principes-grid__tile[\s\S]*min-block-size:\s*26rem/);
  // Gestapeld: tekst groeit mee zodat de tegel lekker vult (reactieve lettergrootte).
  assert.match(page, /@media\s*\(max-width:\s*73\.125rem\)[\s\S]*\.principes-grid__tile h3[\s\S]*font-size:[\s\S]*clamp\(1\.[456]/);
  assert.match(page, /@media\s*\(max-width:\s*73\.125rem\)[\s\S]*\.principes-grid__tile p[\s\S]*font-size:[\s\S]*clamp\(1\.0[5-9]/);
  assert.match(page, /\.principes-grid__tile h3[\s\S]*font-size:\s*clamp\(1\.15rem,\s*1\.55vw,\s*1\.65rem\)/);
  assert.match(page, /\.principes-grid__tile p[\s\S]*font-size:\s*clamp\(0\.9rem,\s*1\.05vw,\s*1rem\)/);
});

test('approach uses a dedicated one-card text carousel', async () => {
  const [page, textCarousel] = await Promise.all([read(pagePath), read(textCarouselPath)]);
  assert.match(page, /import TextCarousel/);
  assert.match(page, /<TextCarousel client:visible items=\{pijlers\}/);
  assert.doesNotMatch(page, /<LongPressReveal/);
  assert.match(textCarousel, /aria-roledescription="carrousel"/);
  assert.match(textCarousel, /className="tcrs__slide"/);
});

test('approach carousel uses stable proportions and responsive type', async () => {
  const page = await read(pagePath);
  assert.match(page, /\.tcrs__slide[\s\S]*min-block-size:\s*clamp\(26rem,\s*52vw,\s*32rem\)/);
  // Tile-vullend: de lettergrootte schaalt mee met het scherm (vw) en vult de tegel ruim.
  assert.match(page, /\.tcrs__slide h3[\s\S]*font-size:\s*clamp\(1\.6rem,\s*3\.2vw,\s*2\.75rem\)/);
  assert.match(page, /\.tcrs__slide p[\s\S]*font-size:\s*clamp\(1\.05rem,\s*1\.9vw,\s*1\.6rem\)/);
  // Tekst mag de volle tegelbreedte benutten (wijdere max-inline-size).
  assert.match(page, /\.tcrs__slide h3[\s\S]*max-inline-size:\s*40ch/);
  assert.match(page, /\.tcrs__slide p[\s\S]*max-inline-size:\s*70ch/);
  assert.match(page, /\.tcrs__controls/);
});

test('approach uses the full card and centers all step content', async () => {
  const page = await read(pagePath);
  assert.match(page, /\.tcrs__slide\s*\{[\s\S]*?justify-content:\s*center/);
  assert.match(page, /\.tcrs__content\s*\{[\s\S]*?display:\s*flex[\s\S]*?justify-content:\s*center[\s\S]*?text-align:\s*center/);
  assert.match(page, /\.tcrs__slide h3\s*\{[\s\S]*?margin-inline:\s*auto/);
  assert.match(page, /\.tcrs__slide p\s*\{[\s\S]*?margin-inline:\s*auto/);
});

test('approach controls stay above the floating nav so they remain clickable', async () => {
  const page = await read(pagePath);
  // De zwevende site-nav draagt z-index 50; de aanpak-knoppen liggen er bovenop
  // (position relative + z-index > 50), anders onderschept de nav de klikken.
  assert.match(page, /\.tcrs__controls\s*\{[\s\S]*?position:\s*relative[\s\S]*?z-index:\s*60/);
});

test('approach section intro and heading are centred', async () => {
  const page = await read(pagePath);
  // De eyebrow en de h2 van "De Aanpak" worden beide horizontaal gecentreerd.
  assert.match(page, /\.aanpak__intro\s*\{[\s\S]*?text-align:\s*center/);
  assert.match(page, /\.aanpak__intro\s*\{[\s\S]*?justify-content:\s*center/);
  assert.match(page, /\.aanpak__intro\s*\{[\s\S]*?flex-direction:\s*column[\s\S]*?align-items:\s*center/);
  assert.match(page, /\.aanpak__intro \.eyebrow[,{]?\s*\n?\s*\.aanpak__intro \.section-title\s*\{[\s\S]*?text-align:\s*center/);
});

test('hero chart canvas is responsive within its fixed wrapper and never exceeds the container', async () => {
  const page = await read(pagePath);
  // De container is vast (fixed wrapper, vaste hoogte), de grafiek is dynamisch.
  assert.match(page, /\.hero-sales-chart\s*\{[\s\S]*?inline-size:\s*100%[\s\S]*?block-size:\s*360px/);
  // De canvas vult de vaste wrapper en mag nooit breder worden dan de wrapper.
  assert.match(page, /\.hero-sales-chart canvas\s*\{[\s\S]*?inline-size:\s*100%[\s\S]*?max-inline-size:\s*100%/);
  assert.match(page, /\.hero-sales-chart canvas\s*\{[\s\S]*?block-size:\s*100%/);
  // Grid-tracks mogen krimpen tot 0 zodat een intrinsieke canvas de track niet
  // voorbij de viewport duwt; art/chart kunnen naar min-inline-size 0.
  assert.match(page, /grid-template-columns:\s*minmax\(0,\s*7fr\)\s*minmax\(0,\s*5fr\)/);
  assert.match(page, /\.hero-strategie__art\s*\{[\s\S]*?min-inline-size:\s*0/);
  assert.match(page, /\.hero-sales-chart\s*\{[\s\S]*?min-inline-size:\s*0/);
});

test('reviews section heading ("Klant aan het woord") is always centred', async () => {
  const page = await read(pagePath);
  // De reviews-container centreert zijn heading-kolom (eyebrow + titel) altijd.
  assert.match(page, /\.testimonials \.reviews\s*\{[\s\S]*?display:\s*flex[\s\S]*?flex-direction:\s*column[\s\S]*?align-items:\s*center/);
  assert.match(page, /\.testimonials \.reviews\s*\{[\s\S]*?text-align:\s*center/);
  assert.match(page, /\.testimonials \.eyebrow[\s\S]*?text-align:\s*center/);
  assert.match(page, /\.reviews__title[\s\S]*?text-align:\s*center/);
});
