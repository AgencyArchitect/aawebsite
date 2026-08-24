import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface StackMessage {
  /** Icoon: 'mail' | 'whatsapp' | 'agenda' */
  icon: 'mail' | 'whatsapp' | 'agenda';
  source: string;
  body: string;
  time: string;
}

const ICONS: Record<StackMessage['icon'], string> = {
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  whatsapp:
    'M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z M8.8 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.2-.2.3 0 .6.6 1 1.4 1.6 2.4 2 .3.1.4 0 .6-.2l.5-.6c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4 0 .9-.7 1.9-1.9 1.9-2 0-5.6-2.4-6-5.4z',
  agenda: 'M4 5h16v16H4z M4 9h16 M8 3v4 M16 3v4 M9 14l2 2 4-4',
};

/**
 * CTA "stapel berichten": de 3 stappen verschijnen als binnenkomende
 * notificaties (mail → WhatsApp → agenda), net als Magic UI animated stack.
 */
export default function MessageStack({ messages }: { messages: StackMessage[] }) {
  const [shown, setShown] = useState(1);

  useEffect(() => {
    if (shown >= messages.length) return;
    const id = window.setTimeout(() => setShown((s) => s + 1), 900);
    return () => window.clearTimeout(id);
  }, [shown, messages.length]);

  return (
    <ol className="mstack" aria-label="Zo werkt een kennismaking">
      <AnimatePresence>
        {messages.slice(0, shown).map((m, i) => (
          <motion.li
            key={m.source}
            className="mstack__item"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i === 0 ? 0 : 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mstack__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={ICONS[m.icon]} />
              </svg>
            </span>
            <div>
              <p className="mstack__source">{m.source}</p>
              <p className="mstack__body">{m.body}</p>
            </div>
            <span className="mstack__time">{m.time}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}
