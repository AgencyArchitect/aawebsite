/**
 * Gedeelde navigatie-structuur voor de Agency Architect site.
 * Zowel de desktop glass-nav (GlassmorphismNavBar) als de mobiele hamburger
 * (Header.astro) gebruiken deze data, zodat de menu's altijd consistent zijn.
 */

export interface NavLink {
  label: string;
  href: string;
}

/** Een categorie in het submenu, bijv. Facebook of Instagram, met zijn pagina's. */
export interface NavGroup {
  label: string;
  href: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href?: string;
  /** Wanneer groepen aanwezig zijn, wordt dit item een submenu-trigger. */
  groupLabel?: string;
}

/** De submenu-tak voor de "E-commerce marketing" trigger. */
export const ECOMMERCE_GROUPS: NavGroup[] = [
  {
    label: 'E-commerce marketing',
    href: '/e-commerce-marketing/',
    links: [
      { label: 'E-commerce marketing', href: '/e-commerce-marketing/' },
      { label: 'E-commerce strategie', href: '/e-commerce-marketing/strategie/' },
      { label: 'Black Friday strategie', href: '/e-commerce-marketing/black-friday-strategie/' },
    ],
  },
  {
    label: 'Facebook',
    href: '/e-commerce-marketing/facebook-marketing/',
    links: [
      { label: 'Facebook marketing', href: '/e-commerce-marketing/facebook-marketing/' },
      { label: 'Facebook strategie', href: '/e-commerce-marketing/facebook-marketing/strategie/' },
      { label: 'Facebook advertising', href: '/e-commerce-marketing/facebook-marketing/adverteren/' },
      { label: 'Facebook funnels', href: '/e-commerce-marketing/facebook-marketing/funnels/' },
      { label: 'Facebook copywriting', href: '/e-commerce-marketing/facebook-marketing/copywriting/' },
      { label: 'Facebook organisch', href: '/e-commerce-marketing/facebook-marketing/organisch/' },
    ],
  },
  {
    label: 'Instagram',
    href: '/e-commerce-marketing/instagram-marketing/',
    links: [
      { label: 'Instagram marketing', href: '/e-commerce-marketing/instagram-marketing/' },
      { label: 'Instagram strategie', href: '/e-commerce-marketing/instagram-marketing/strategie/' },
      { label: 'Instagram advertising', href: '/e-commerce-marketing/instagram-marketing/adverteren/' },
      { label: 'Instagram funnels', href: '/e-commerce-marketing/instagram-marketing/funnels/' },
      { label: 'Instagram copywriting', href: '/e-commerce-marketing/instagram-marketing/copywriting/' },
      { label: 'Instagram organisch', href: '/e-commerce-marketing/instagram-marketing/organisch/' },
    ],
  },
];

/** De 4 straksten worden hergebruikt door Header.astro voor de hamburger. */
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'E-commerce marketing',
    href: '/e-commerce-marketing/',
    groups: ECOMMERCE_GROUPS,
  },
  { label: 'Inzichten', href: '/inzichten/' },
  { label: 'Over', href: '/over/' },
];