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
    ],
  },
  {
    label: 'Facebook',
    href: '/facebook-marketing/',
    links: [
      { label: 'Facebook marketing', href: '/facebook-marketing/' },
      { label: 'Facebook strategie', href: '/facebook-marketing/strategie/' },
      { label: 'Facebook advertising', href: '/facebook-marketing/adverteren/' },
      { label: 'Facebook funnels', href: '/facebook-marketing/funnels/' },
      { label: 'Facebook copywriting', href: '/facebook-marketing/copywriting/' },
      { label: 'Facebook organisch', href: '/facebook-marketing/organisch/' },
    ],
  },
  {
    label: 'Instagram',
    href: '/instagram-marketing/',
    links: [
      { label: 'Instagram marketing', href: '/instagram-marketing/' },
      { label: 'Instagram strategie', href: '/instagram-marketing/strategie/' },
      { label: 'Instagram advertising', href: '/instagram-marketing/adverteren/' },
      { label: 'Instagram funnels', href: '/instagram-marketing/funnels/' },
      { label: 'Instagram copywriting', href: '/instagram-marketing/copywriting/' },
      { label: 'Instagram organisch', href: '/instagram-marketing/organisch/' },
    ],
  },
];

/** De 4 straksten worden hergebruikt door Header.astro voor de hamburger. */
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'E-commerce marketing',
    href: '/facebook-marketing/',
    groups: ECOMMERCE_GROUPS,
  },
  { label: 'Inzichten', href: '/inzichten/' },
  { label: 'Over', href: '/over/' },
];