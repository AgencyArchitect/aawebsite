import { Calligraph } from 'calligraph';

interface HeroTitleWordProps {
  text: string;
  /** Warme underline-behandeling (zie .hero-word--stable in strategie.astro). */
  accent?: boolean;
}

/**
 * Dunne wrapper om Calligraph. Nodig omdat client:*-eilanden in Astro tekst
 * die als JSX-children tussen de tags staat niet als kale string doorgeven
 * over de hydration-grens (levert "[object Object]" op) — via een gewone,
 * serialiseerbare prop werkt het wel, net als bij de andere eilanden op
 * deze pagina (AnimatedList/MessageStack/Carousel nemen ook props, geen
 * children).
 */
export default function HeroTitleWord({ text, accent }: HeroTitleWordProps) {
  return (
    <Calligraph initial className={accent ? 'hero-word--stable' : undefined}>
      {text}
    </Calligraph>
  );
}
