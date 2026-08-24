import { useCallback, useEffect, useRef, useState } from 'react';

interface TextCarouselItem {
  title: string;
  body: string;
}

interface TextCarouselProps {
  items: TextCarouselItem[];
  label: string;
}

/** One-card carousel for longer, text-only strategy cards. */
export default function TextCarousel({ items, label }: TextCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track || items.length === 0) return;
      const next = ((index % items.length) + items.length) % items.length;
      const slide = track.children[next] as HTMLElement | undefined;
      if (slide) {
        track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        setActive(next);
      }
    },
    [items.length],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const slides = Array.from(track.children) as HTMLElement[];
      const currentX = track.scrollLeft;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft - track.offsetLeft - currentX);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActive(closest);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="tcrs" aria-roledescription="carrousel" aria-label={label}>
      <p className="sr-only">Gebruik de knoppen of veeg om tussen de drie pijlers te navigeren.</p>
      <div className="tcrs__track" ref={trackRef}>
        {items.map((item, index) => (
          <article className="tcrs__slide" key={item.title} aria-hidden={index !== active}>
            <div className="tcrs__content">
              <span className="tcrs__nr">{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="tcrs__controls">
        <button type="button" className="tcrs__arrow" onClick={() => goTo(active - 1)} aria-label="Vorige pijler">
          ←
        </button>
        <div className="tcrs__dots" role="tablist" aria-label="Kies een pijler">
          {items.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Ga naar ${item.title}`}
              className={`tcrs__dot${index === active ? ' is-active' : ''}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <button type="button" className="tcrs__arrow" onClick={() => goTo(active + 1)} aria-label="Volgende pijler">
          →
        </button>
      </div>
    </div>
  );
}
