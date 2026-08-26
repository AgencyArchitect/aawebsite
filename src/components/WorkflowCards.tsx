import { useEffect, useState } from 'react';

const STEPS = [
  {
    nr: '01',
    title: 'Analyse',
    body: 'We duiken in je Meta-ad account en toetsen de markt. Markt- en productonderzoek, en dat brengen we samen tot één unieke creative strategy voor jouw merk.',
  },
  {
    nr: '02',
    title: 'Strategie',
    body: 'We bespreken de strategie én jouw echte doel: hoe vliegen we dit aan, waar wil je heen — ook internationaal. Eerst akkoord, dan pas bouwen.',
  },
  {
    nr: '03',
    title: 'Uitvoering',
    body: 'We schalen één campagne of land op en maken het proces overzichtelijk — zodat het daarna op élke campagne en land toepasbaar is. Een groeimachine.',
  },
  {
    nr: '04',
    title: 'Meten & schalen',
    body: 'Elke maand: nieuwe campagnes, producten, concurrent-acquisitie, cashflow. Blijven groeien, stap voor stap.',
  },
];

/**
 * Vaste, niet bewegende stapelkaarten die één voor één van boven naar beneden
 * aflopen. De actieve kaart is donkerblauw; de rest blijft licht met brons
 * accent en donkerblauwe tekst. Klik op een kaart om naar die stap te springen.
 */
export default function WorkflowCards() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (STEPS.length < 2) return;
    // Volgende stap onder de cursieve: van boven naar beneden, dan weer bovenin.
    const id = window.setInterval(() => setActive((i) => (i + 1) % STEPS.length), 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="wf">
      <div className="wf__stack">
        {STEPS.map((step, i) => {
          const isActive = i === active;
          return (
            <button
              key={step.nr}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={`wf__card${isActive ? ' wf__card--active' : ''}`}
            >
              <span className="wf__nr">{step.nr}</span>
              <span className="wf__body">
                <span className="wf__title">{step.title}</span>
                <span className="wf__text">{step.body}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="wf__dots">
        {STEPS.map((s, i) => (
          <button
            key={s.nr}
            type="button"
            className={`wf__dot${i === active ? ' is-active' : ''}`}
            aria-label={`Stap ${s.nr}: ${s.title}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}