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

/** Het submenu voor de "E-commerce marketing" trigger. */
export const ECOMMERCE_GROUPS: NavGroup[] = [
  {
    label: 'E-commerce marketing',
    href: '/e-commerce-marketing/',
    links: [
      { label: 'E-commerce marketing', href: '/e-commerce-marketing/' },
      { label: 'E-commerce strategie', href: '/e-commerce-marketing/strategie/' },
      { label: 'Creative strategist', href: '/e-commerce-marketing/creative-strategist/' },
      { label: 'Black Friday strategie', href: '/e-commerce-marketing/black-friday-strategie/' },
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
  { label: 'Over', href: '/over/' },
];