import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface Notification {
  /** Platform-label, bv. 'Meta Ads' */
  source: string;
  title: string;
  body: string;
  time: string;
  /** Kleur van het platform-icoontje / stip */
  color: string;
  /** Optioneel pad naar een SVG-logo; als gezet vervangt dit de stip */
  logo?: string;
}

const VISIBLE = 3;

/**
 * Magic UI "Animated List"-stijl. Per tick wordt er maar EÉN bericht
 * vernieuwd: een nieuw bericht glijdt bovenin binnen, de rest zakt netjes
 * één positie naar beneden, het onderste glijdt er zacht uit.
 *
 * Stabiele keys per bericht (op index, niet op positie) zijn essentieel:
 * daardoor herkent framer-motion de bestaande kaarten en verloopt alleen de
 * nieuwe kaart initial en de vertrekkende exit. De overige schuiven puur mee
 * via layout (position verandert -> y-animatie).
 */
export default function AnimatedList({ items }: { items: Notification[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    // 4 berichten × 3,5s = 14s voor één complete rotatie (10-15s gewenst)
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 3500);
    return () => window.clearInterval(id);
  }, [items.length]);

  // Toon maximaal 3 kaarten, keys stabiel per bericht. Mapping is
  // DESCENDEREND (index - offset): het nieuwste staat bovenaan (pos 0),
  // oudere zakken één plek naar beneden. Bij elke tick schuift de bovenste
  // dus omlaag en valt de onderste er beneden uit: motion van boven → benen.
  const visible = Array.from({ length: Math.min(VISIBLE, items.length) }, (_, offset) => {
    const i = (index - offset + items.length) % items.length;
    return { ...items[i], key: `n-${i}` };
  });

  return (
    <div className="anim-list" aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map((item, pos) => (
          <motion.article
            key={item.key}
            className={pos === 0 ? 'anim-card anim-card--is-new' : 'anim-card'}
            layout
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1 - pos * 0.22, y: pos * 12 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{ zIndex: 30 - pos }}
          >
            {pos === 0 && <span className="anim-new-badge" aria-label="Nieuw bericht" />}
            {item.logo ? (
              <img className="anim-logo" src={item.logo} alt="" loading="lazy" decoding="async" width="28" height="28" />
            ) : (
              <span className="anim-dot" style={{ backgroundColor: item.color }} aria-hidden="true" />
            )}
            <div className="anim-body">
              <p className="anim-source">{item.source}</p>
              <p className="anim-title">{item.title}</p>
              <p className="anim-text">{item.body}</p>
            </div>
            <span className="anim-time">{item.time}</span>
          </motion.article>
        ))}
      </AnimatePresence>
    </div>
  );
}