import { motion } from 'framer-motion';

interface LongPressRevealProps {
  pillars: { title: string; body: string }[];
}

/** De aanpak is bewust direct zichtbaar. Framer Motion blijft alleen voor
 * een subtiele entree van de drie kaarten behouden. */
export default function LongPressReveal({ pillars }: LongPressRevealProps) {
  return (
    <div className="lpr">
      <motion.div
        id="pijlers-detail"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="lpr__grid">
          {pillars.map((p, i) => (
            <motion.article
              key={p.title}
              className="lpr__card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="lpr__nr">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
