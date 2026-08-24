import { useEffect, useRef, useState } from 'react';
import { Liveline, type LivelinePoint, type LivelineSeries } from 'liveline';

/**
 * Illustratief (geen echte klantdata): orders, met vs. zonder Agency
 * Architect, als een 45 seconden durende groei-reveal die zichzelf blijft
 * herhalen. Beide lijnen starten elke cyclus op 0 en groeien puur
 * DETERMINISTISCH (geen Math.random()) — een dip is dus letterlijk
 * onmogelijk, in tegenstelling tot een eerdere versie die een random walk
 * rond een golvend (sinusoïdaal) doel gebruikte en daardoor zichtbaar kon
 * dalen.
 *
 * Blauw ("Met Agency Architect", het imperial-blue-merkkleur uit de
 * huisstijl) blijft bewust vloeiend: een gladde hockey-stick curve (p³),
 * geen sprongen, blijft de volle 45s doorstijgen en landt op 1500 orders
 * (ruim boven het gevraagde minimum van 1200).
 * Brons ("Zonder Agency Architect") krijgt een onregelmatig
 * trapje-patroon: soms een plotselinge sprong, dan een paar seconden
 * niets, dan een tijdje gestaag +5 orders/seconde — zie BRONZE_BREAKPOINTS
 * hieronder. Ook dit is volledig monotoon (elke stap ≥ de vorige) en
 * blijft de volle 45s doorstijgen, alleen niet vloeiend — landt op 485
 * orders, ruim onder blauw.
 *
 * Liveline berekent zijn zichtbare tijdsvenster intern relatief aan het
 * WERKELIJKE Date.now() (rightEdge = now + buffer, leftEdge = rightEdge -
 * window — zie liveline/dist/index.js, meerdere plekken). Punten met pure
 * cyclus-lokale tijd (0..45) vielen daardoor buiten dat venster en toonden
 * niets. Daarom ankeren we `time` opnieuw aan de echte klok, ditmaal per
 * cyclus: `cycleStartRef` wordt bij elke reset ververst naar het actuele
 * Date.now(), zodat alle punten van de lopende cyclus altijd dicht bij de
 * echte "nu" blijven liggen. Dit raakt de SSR-render niet: bij i=0 is er
 * precies 1 punt en cycleStartRef start op 0 (pas na mount, in een effect,
 * gevuld met een echte timestamp) — en sowieso tekent Liveline op een
 * <canvas>, buiten React's JSX-diffing om, dus een andere `time`-waarde
 * tussen server- en client-render kan nooit een hydration-mismatch geven.
 */
const STEPS = 300;
const TICK_MS = 150; // 300 × 150ms = 45.000ms per cyclus
const CYCLE_SECONDS = 45;
const STEP_SECONDS = CYCLE_SECONDS / STEPS;

const BLUE_TARGET = 1500; // minimaal 1200 gevraagd; deze zit er comfortabel boven

/** Hockey-stick: traag begin, steil einde. Monotoon niet-dalend per constructie. */
function blue(p: number): number {
  return BLUE_TARGET * p ** 3;
}

/**
 * Trappetjes-patroon voor brons: [tijdstip in sec, cumulatieve waarde].
 * Twee opeenvolgende punten met HETZELFDE tijdstip = instant sprong.
 * Twee punten met verschillend tijdstip = lineaire tussenfase (waar de
 * waarde niet verandert = platte pauze; waar 'm wel verandert = een
 * gestage stijging van exact 5 orders/seconde). Met de hand nagerekend
 * zodat elk ramp-segment precies 5/sec oplevert. De eerste 30 seconden
 * (t=0–30, tot en met 350 orders) zijn ongewijzigd t.o.v. de vorige versie;
 * de laatste 15 seconden (t=30–45) zijn nieuw toegevoegd zodat deze lijn
 * blijft doorstijgen i.p.v. te stoppen — landt uiteindelijk op 485 orders.
 */
const BRONZE_BREAKPOINTS: [number, number][] = [
  [0, 0],
  [2, 0], // 2s niets
  [2, 15], // sprong +15
  [6, 35], // 4s @ 5/sec (+20)
  [8, 35], // 2s niets
  [8, 60], // sprong +25
  [12, 80], // 4s @ 5/sec (+20)
  [14, 80], // 2s niets
  [14, 125], // sprong +45
  [18, 145], // 4s @ 5/sec (+20)
  [20, 145], // 2s niets
  [20, 215], // sprong +70
  [25, 240], // 5s @ 5/sec (+25)
  [26, 240], // 1s niets
  [26, 330], // sprong +90
  [30, 350], // 4s @ 5/sec (+20)
  [32, 350], // 2s niets
  [32, 380], // sprong +30
  [37, 405], // 5s @ 5/sec (+25)
  [39, 405], // 2s niets
  [39, 455], // sprong +50
  [45, 485], // 6s @ 5/sec (+30)
];

function bronze(p: number): number {
  const t = p * CYCLE_SECONDS;
  let loIdx = 0;
  for (let idx = 0; idx < BRONZE_BREAKPOINTS.length; idx++) {
    if (BRONZE_BREAKPOINTS[idx][0] <= t) loIdx = idx;
    else break;
  }
  const [t0, v0] = BRONZE_BREAKPOINTS[loIdx];
  if (t0 === t || loIdx === BRONZE_BREAKPOINTS.length - 1) return v0;
  const [t1, v1] = BRONZE_BREAKPOINTS[loIdx + 1];
  return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
}

function buildPoints(
  i: number,
  curve: (p: number) => number,
  cycleStart: number,
): LivelinePoint[] {
  return Array.from({ length: i + 1 }, (_, k) => ({
    time: cycleStart + k * STEP_SECONDS,
    value: curve(k / STEPS),
  }));
}

function formatValue(v: number) {
  // De y-as blijft zichtbaar. Door de floor op 0 te zetten worden negatieve
  // waarden uitgesloten; deze formatter toont de waarde met context.
  return `${Math.max(0, Math.round(v))} orders`;
}

/**
 * Liveline schaalt de y-as automatisch rond de MOMENTEEL zichtbare waarden
 * (met maar ~12% marge — hardcoded in de package, geen prop om dat te
 * verruimen). Twee gevolgen daarvan, allebei nu opgelost:
 *
 * 1) Bovenkant: omdat de bronzen lijn vroeg in de cyclus met sprongen
 *    omhoogschiet terwijl blauw nog nauwelijks van 0 af is, was brons
 *    tijdelijk de hoogste waarde in beeld — de as sloot zich dan strak om
 *    die piek, waardoor blauw bij zo'n sprong bijna niet meer te
 *    onderscheiden was.
 *    Fix: een paar seconden vooruitkijken (LOOKAHEAD) naar waar beide
 *    lijnen sowieso naartoe gaan (volledig deterministisch, dus exact te
 *    berekenen) en daar comfortabele marge overheen (HEADROOM_MARGIN) —
 *    zo heeft de as altijd ademruimte boven de huidige waarden, zonder dat
 *    vroege kleine waarden juist plat worden door meteen naar de
 *    einduitkomst (1500) te schalen. Deze headroom-lijn staat altijd
 *    standaard aan, niet optioneel.
 *
 * 2) Onderkant: referenceLine={{value:0}} (zie onder) forceert 0 wél
 *    binnen het bereik, maar liveline's eigen automatische marge (~12%)
 *    bleek in pixels net te krap om buiten de fade-zone van de
 *    grid-labels te vallen (labels vlak bij de rand van de grafiek faden
 *    geleidelijk uit) — het laagste zichtbare label leek daardoor "5"
 *    i.p.v. "0". Fix: FLOOR hieronder is bewust negatief (10% van de
 *    ceiling eronder), zodat 0 sowieso ruim boven de effectieve onderrand
 *    komt te liggen, ongeacht liveline's eigen marge-berekening.
 */
const LOOKAHEAD_SECONDS = 5;
const HEADROOM_MARGIN = 1.15;
// De schaal begint exact op 0: geen negatieve y-aswaarden onder de x-as.
const FLOOR_BUFFER_FACTOR = 0;

function ceilingAtTime(t: number): number {
  const futureP = Math.min((t + LOOKAHEAD_SECONDS) / CYCLE_SECONDS, 1);
  return Math.max(blue(futureP), bronze(futureP)) * HEADROOM_MARGIN;
}

// X-as (tijdlijn) wordt via CSS gecropt weg (zie .hero-sales-chart-crop in
// strategie.astro); dit is een vangnet zodat er nooit onleesbare tijd-labels
// doorschemeren als de crop op een randgeval niet pixel-perfect zou zijn.
function formatTime() {
  return '';
}

export default function HeroSalesChart() {
  // i=0 op zowel server- als client-render vóór hydration → identieke eerste
  // render, dus geen hydration-mismatch. Alle verdere state-updates lopen
  // via useEffect/setInterval, puur client-side na mount.
  const [i, setI] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Liveline heeft vaste canvas-padding. Op mobiel heeft de y-as daarom meer
  // linker ruimte nodig voor labels als "1500 orders"; de grote desktop-
  // rechterpadding zou mobiel juist onnodig veel grafiekbreedte opeten.
  useEffect(() => {
    const media = window.matchMedia('(max-width: 969px)');
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  const cycleStartRef = useRef(0);

  useEffect(() => {
    cycleStartRef.current = Date.now() / 1000;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return; // spaart CPU op onzichtbare tabs
      setI((prev) => {
        if (prev >= STEPS) {
          cycleStartRef.current = Date.now() / 1000; // nieuwe cyclus, tijd-anker verversen
          return 0;
        }
        return prev + 1;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const metPoints = buildPoints(i, blue, cycleStartRef.current);
  const zonderPoints = buildPoints(i, bronze, cycleStartRef.current);

  // Onzichtbare 3e "headroom"-lijn: telt mee in liveline's y-as-berekening
  // (zie ceilingAtTime/FLOOR_BUFFER_FACTOR hierboven) maar wordt nergens
  // getekend — kleur is gelijk aan de paginabackground (--color-paper)
  // zodat 'm letterlijk onzichtbaar is. Staat altijd standaard aan (geen
  // aparte toggle) en is niet interactief — de toggle-chip-rij van
  // liveline zelf is via CSS volledig verborgen (zie strategie.astro),
  // dus geen van de drie series heeft een klikbaar chipje meer: alle
  // lijnen blijven te allen tijde zichtbaar, ook de echte twee.
  const elapsedSeconds = i * STEP_SECONDS;
  const ceiling = ceilingAtTime(elapsedSeconds);
  const floor = 0;
  const headroomPoints: LivelinePoint[] = [
    { time: cycleStartRef.current, value: floor },
    { time: cycleStartRef.current + elapsedSeconds, value: ceiling },
  ];

  const series: LivelineSeries[] = [
    {
      id: 'met-agency-architect',
      data: metPoints,
      value: metPoints[metPoints.length - 1].value,
      color: '#001d51', // = var(--color-ink), het imperial-blue merkkleur
      // Label wordt alleen naast het bewegende eindpunt getoond; de legenda
      // zelf wordt via CSS verborgen.
      label: 'Met Agency Architect',
    },
    {
      id: 'zonder-agency-architect',
      data: zonderPoints,
      value: zonderPoints[zonderPoints.length - 1].value,
      color: '#8a5a2b', // = var(--color-accent-warm) ("brons")
      // Label wordt alleen naast het bewegende eindpunt getoond; de legenda
      // zelf wordt via CSS verborgen.
      label: 'Zonder Agency Architect',
    },
    {
      id: 'headroom',
      data: headroomPoints,
      value: ceiling,
      color: '#faf8f5', // = var(--color-paper), onzichtbaar op de achtergrond
      label: '',
    },
  ];

  return (
    <div className="hero-sales-chart-crop">
      <div className="hero-sales-chart">
        <Liveline
          // data/value zijn verplichte props in het type, maar worden genegeerd
          // zodra `series` is meegegeven (zie liveline-docs). Placeholder om
          // TypeScript tevreden te houden.
          data={metPoints}
          value={series[0].value}
          series={series}
          theme="light"
          // Vast window={CYCLE_SECONDS} liet de x-as altijd het volledige
          // 45s-venster tonen, ook toen er pas een paar seconden data was —
          // de lijn stond dan samengeperst in een klein sliver rechts, met
          // het beginpunt (t=0) nauwelijks zichtbaar. Door het venster mee
          // te laten groeien met de verstreken cyclustijd blijft het altijd
          // exact van t=0 tot nu lopen, dus het begin van de lijn blijft
          // zichtbaar — en aan het eind van de cyclus is dit toch weer
          // gelijk aan CYCLE_SECONDS.
          window={Math.max(i * STEP_SECONDS, 2)}
          // De headroom-serie start exact op 0 en houdt de y-as op een
          // niet-negatieve ondergrens. Geen referenceLine: Liveline tekent
          // die namelijk als een horizontale gestippelde lijn.
          grid
          badge={false}
          momentum={false}
          scrub={false}
          lineWidth={2.5}
          formatValue={formatValue}
          formatTime={formatTime}
          // De y-aslabels hebben op mobiel extra ruimte nodig. Desktop heeft
          // vooral rechts ruimte nodig voor het laatste value-label; mobiel
          // krijgt een kleinere rechterpadding en grotere linkerpadding,
          // zodat de y-as en de 0-lijn zichtbaar blijven.
          padding={{
            top: isMobile ? 18 : 12,
            // Liveline tekent het label 8px ná de plot. 88px aan beide
            // kanten geeft mobiel genoeg ruimte voor "orders" én houdt de
            // grafiek visueel symmetrisch uitgelijnd.
            right: isMobile ? 88 : 100,
            bottom: isMobile ? 52 : 28,
            // Laat de plot links uitlijnen met de hero-container. De y-as
            // labels krijgen hun ruimte aan de rechterkant.
            left: isMobile ? 0 : 12,
          }}
        />
      </div>
    </div>
  );
}
