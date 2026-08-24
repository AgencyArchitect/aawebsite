import { useCallback, useEffect, useRef, useState } from 'react';

interface CarouselItem {
  title: string;
  body: string;
  image: string;
  alt: string;
}

interface CarouselProps {
  items: CarouselItem[];
  /** Automatisch doorschijven (pauzeert bij interactie). */
  autoplayMs?: number;
  label: string;
}

/** Lichte, responsive principes-carrousel met beeldtiles en linksonder
 * uitgelijnde tekst-overlay. */
export default function Carousel({ items, autoplayMs = 6000, label }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = ((i % items.length) + items.length) % items.length;
    const child = track.children[clamped] as HTMLElement | undefined;
    if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const x = track.scrollLeft;
      let best = 0;
      let bestDist = Infinity;
      children.forEach((child, i) => {
        const distance = Math.abs(child.offsetLeft - track.offsetLeft - x);
        if (distance < bestDist) {
          bestDist = distance;
          best = i;
        }
      });
      setActive(best);
      pausedRef.current = true;
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!autoplayMs || items.length < 2) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) goTo(active + 1);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [active, autoplayMs, goTo, items.length]);

  return (
    <div className="crs" aria-roledescription="carrousel" aria-label={label}>
      <div className="crs__track" ref={trackRef}>
        {items.map((item, i) => (
          <article className="crs__slide" key={item.title} aria-hidden={i !== active}>
            <img className="crs__image" src={item.image} alt={item.alt} width={1254} height={1254} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
            <div className="crs__overlay">
              <span className="crs__nr">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="crs__controls">
        <button type="button" className="crs__arrow" onClick={() => goTo(active - 1)} aria-label="Vorige">←</button>
        <div className="crs__dots" role="tablist">
          {items.map((item, i) => (
            <button key={item.title} type="button" role="tab" aria-selected={i === active} aria-label={`Ga naar ${item.title}`} className={`crs__dot${i === active ? ' is-active' : ''}`} onClick={() => goTo(i)} />
          ))}
        </div>
        <button type="button" className="crs__arrow" onClick={() => goTo(active + 1)} aria-label="Volgende">→</button>
      </div>
    </div>
  );
}
        
        