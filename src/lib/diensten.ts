export interface DienstVerdieping {
  title: string;
  url: string;
  summary: string;
}

export interface DienstWerkwijzeStep {
  nr: string;
  title: string;
  body: string;
}

/** De vier werkwijze-stappen, identiek over alle dienstpagina's. */
export const WERKWIJZE: DienstWerkwijzeStep[] = [
  {
    nr: '01',
    title: 'Analyse',
    body: 'We duiken in je Meta-ad account en toetsen de markt. Markt- en productonderzoek, samengebald tot één unieke creative strategy voor jouw merk.',
  },
  {
    nr: '02',
    title: 'Strategie',
    body: 'We bespreken de strategie én jouw echte doel: hoe vliegen we dit aan, waar wil je heen — ook internationaal. Eerst akkoord, dan pas bouwen.',
  },
  {
    nr: '03',
    title: 'Uitvoering',
    body: 'We schalen één campagne of land op en maken het proces overzichtelijk, zodat het daarna op élke campagne en land toepasbaar is. Een groeimachine.',
  },
  {
    nr: '04',
    title: 'Meten & schalen',
    body: 'Elke maand: nieuwe campagnes, producten, concurrent-acquisitie, cashflow. Blijven groeien, stap voor stap.',
  },
];

/** De twaalf variabelen onder je ads voor Facebook. */
export const VARIABELEN_FACEBOOK: string[] = [
  'De markt waarin je koopt',
  'Het product en zijn marge',
  'De persona die je aanspreekt',
  'Het offer dat je doet',
  'De awareness-fase waarin je iemand raakt',
  'De angle van je creative',
  'Het concept van je creative',
  'Het format',
  'Je testhypothese',
  'Je spend-verdeling',
  'Wat je uit eerdere tests geleerd hebt',
  'De bestemming waar je verkeer naartoe stuurt',
];

/** De twaalf variabelen onder je ads voor Instagram. */
export const VARIABELEN_INSTAGRAM: string[] = [
  'De markt waarin je koopt',
  'Het product en zijn marge',
  'De persona die je aanspreekt',
  'Het offer dat je doet',
  'De awareness-fase waarin je iemand raakt',
  'De angle van je creative',
  'Het concept van je creative',
  'Het format (Reels-first)',
  'Je testhypothese',
  'Je spend-verdeling',
  'Wat je uit eerdere tests geleerd hebt',
  'De route van ad naar profiel naar site',
];

export interface DisciplineDef {
  platform: 'facebook' | 'instagram';
  discipline: string;
  title: string;
  eyebrow: string;
  lede: string;
  valueBullets: string[];
  symptoms: { title: string; body: string }[];
  variabelenIntro: string;
  variabelen: string[];
  verdiepingTitle: string;
  verdieping: DienstVerdieping[];
  ctaHeading: string;
  ctaBody: string;
}

/**
 * Verdieping-links naar de zuster-disciplines + de platform-hoofdpagina.
 * Alles wijst naar live pagina's (de niche-onderwerpen zijn niet live en worden
 * hier niet aan gekoppeld, zodat er geen dode links ontstaan).
 */
export function disciplineLinks(
  platform: 'facebook' | 'instagram',
  current: 'adverteren' | 'funnels' | 'copywriting' | 'organisch',
): DienstVerdieping[] {
  const titles: Record<'adverteren' | 'funnels' | 'copywriting' | 'organisch', string> = {
    adverteren: `${platform === 'facebook' ? 'Facebook' : 'Instagram'} advertising`,
    funnels: `${platform === 'facebook' ? 'Facebook' : 'Instagram'} funnels`,
    copywriting: `${platform === 'facebook' ? 'Facebook' : 'Instagram'} copywriting`,
    organisch: `Organische ${platform === 'facebook' ? 'Facebook' : 'Instagram'} marketing`,
  };
  const order: ('adverteren' | 'funnels' | 'copywriting' | 'organisch')[] = [
    'adverteren',
    'funnels',
    'copywriting',
    'organisch',
  ];

  const siblings = order
    .filter((d) => d !== current)
    .map((d) => ({
      title: titles[d],
      url: `/${platform}-marketing/${d}/`,
      summary: `De ${titles[d].toLowerCase()}-discipline binnen ${platform === 'facebook' ? 'Facebook' : 'Instagram'} marketing.`,
    }));

  const platformLabel = platform === 'facebook' ? 'Facebook marketing' : 'Instagram marketing';
  siblings.unshift({
    title: platformLabel,
    url: `/${platform}-marketing/`,
    summary: `De hoofdpagina over ${platformLabel.toLowerCase()} voor e-commerce, waar alle vier disciplines samenkomen.`,
  });

  return siblings;
}

