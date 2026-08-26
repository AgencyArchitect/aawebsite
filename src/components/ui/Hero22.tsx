'use client';

import { ArrowRight } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import AnimatedList, { type Notification } from '@/components/ecom-strategie/AnimatedList';

interface Hero22Props {
  headingLine1?: string;
  headingLine2Prefix?: string;
  headingHighlight?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  backgroundImage?: string;
}

const notificaties: Notification[] = [
  {
    source: 'Meta Ads Manager',
    title: 'Campagne “Persona A — Bundel”',
    body: 'ROAS 4.2 — stabiel na dag 14. Geen fatigue-signaal.',
    time: 'nu',
    color: '#0064e1',
    logo: '/images/logo-meta.svg',
  },
  {
    source: 'Shopify',
    title: 'Herhaalaankopen',
    body: '38% van de orders deze week komt van terugkerende klanten.',
    time: '1 u',
    color: '#1e6b3a',
    logo: '/images/logo-shopify.svg',
  },
  {
    source: 'Slack — #growth',
    title: 'Thomas: “Angle 2 wint de test”',
    body: 'Hook-rate 34%, CPA -22% t.o.v. vorige ronde. We schalen.',
    time: '2 u',
    color: '#8a5a2b',
    logo: '/images/logo-slack.svg',
  },
  {
    source: 'WhatsApp — Sanne',
    title: '“Dit voelt eindelijk als sturen”',
    body: 'Niet meer gokken, maar weten wat de volgende stap is. 🔥',
    time: '5 u',
    color: '#1e6b3a',
    logo: '/images/logo-whatsapp.svg',
  },
];

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.1,
    },
  },
};

const copyVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 200, damping: 26, mass: 1 },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 60, damping: 20, mass: 1.2 },
  },
};

export default function Hero22({
  headingLine1 = 'Niet nog meer creatives.',
  headingLine2Prefix = 'Wel weten wat de',
  headingHighlight = 'volgende',
  description = 'Agency Architect helpt founders van gezonde e-commerce merken een merk-eigen, schaalbare creative strategy voor Meta opbouwen.',
  primaryCtaLabel = 'Gratis Meta Audit',
  primaryCtaHref = '/creative-scale-audit/',
  secondaryCtaLabel = 'Over ons',
  secondaryCtaHref = '/over/',
  backgroundImage = 'https://assets.watermelon.sh/hero-22-bg.avif',
}: Hero22Props) {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-stone-50 font-sans text-[#001d51] antialiased">
      <motion.img
        src={backgroundImage}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        variants={imageVariants}
      />
      <motion.div
        className="relative flex min-h-screen w-full flex-col overflow-hidden px-7 py-5 sm:px-12 lg:px-[5.25rem]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.34 }}
        variants={sectionVariants}
      >
        <div className="relative z-10 grid flex-1 grid-cols-1 content-start items-start gap-10 pt-4 md:pt-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(28rem,1fr)] lg:pt-6 2xl:mt-6">
          <div className="max-w-4xl">
            <motion.p variants={copyVariants} className="eyebrow">
              E-commerce Meta marketing
            </motion.p>

            <motion.h1
              variants={copyVariants}
              className="max-w-4xl text-[clamp(2.2rem,2.9vw,3.6rem)] leading-[1.08] font-normal tracking-[-0.065em] text-balance text-[#001d51]"
            >
              <span className="block">{headingLine1}</span>
              <span className="block">
                {headingLine2Prefix}{' '}
                <span className="font-[Georgia,serif] text-[0.95em] font-normal tracking-[-0.075em] italic text-[#8a5a2b]">
                  {headingHighlight}
                </span>{' '}
                goede beslissing is.
              </span>
            </motion.h1>

            <motion.p
              variants={copyVariants}
              className="text-md mt-7 max-w-lg leading-[1.42] font-medium text-pretty text-[#33486d]"
            >
              {description}
            </motion.p>

            <motion.div
              variants={copyVariants}
              className="mt-7 flex flex-col items-start gap-4"
            >
              <a
                href={primaryCtaHref}
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-[#001d51] px-5 text-sm font-normal text-white shadow-[inset_0_2px_6px_0px_rgba(255,255,255,0.15),inset_0_-2px_6px_0px_rgba(0,0,0,0.15)] outline outline-black/20 transition-[background-color,box-shadow,transform] duration-200 ease-out text-shadow-2xs hover:bg-[#0a2f6e] active:scale-[0.96]"
              >
                {primaryCtaLabel}
                <ArrowRight className="size-4 -rotate-45 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={secondaryCtaHref}
                className="inline-flex min-h-11 items-center justify-center rounded-sm px-7 text-[0.78rem] font-semibold text-[#001d51] shadow-[inset_0_0_0_1.5px_#001d51] backdrop-blur-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[#001d51]/5 hover:shadow-[inset_0_0_0_1.5px_#001d51] active:scale-[0.96]"
              >
                {secondaryCtaLabel}
              </a>
            </motion.div>

            <motion.div
              variants={copyVariants}
              className="mt-8 flex flex-col items-start gap-3"
            >
              {['Merk-eigen strategie', 'Onderbouwd schalen', 'Geen afhankelijkheid van externe partijen'].map((usp) => (
                <span key={usp} className="inline-flex items-center gap-2 text-[clamp(0.82rem,0.75rem+0.3vw,0.95rem)] font-medium text-[#33486d]">
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-[#8a5a2b]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {usp}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-center">
            <motion.div variants={copyVariants} className="w-full max-w-[clamp(22rem,34vw,36rem)]">
              <AnimatedList items={notificaties} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}