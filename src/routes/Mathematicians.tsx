import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MATHEMATICIAN_DECKS, type MathematicianDeck } from '../data/mathematicianDecks';
import { MathematicianDeckPlayer } from '../components/MathematicianDeck';
import { useSeo } from '../lib/seo';

interface Mathematician {
  name: string;
  era: string;
  contribution: string;
  emoji: string;
  /** videoSrc of a matching Math Story, if one exists. Adds a story link. */
  storySrc?: string;
}

const MATHEMATICIANS: Mathematician[] = [
  {
    name: 'Euclid',
    era: '300 BC',
    contribution: 'Founded geometry and systematic mathematical proof',
    emoji: '📐',
  },
  {
    name: 'Isaac Newton',
    era: '1642–1727',
    contribution: 'Invented calculus and laws of motion',
    emoji: '🍎',
  },
  {
    name: 'Leonhard Euler',
    era: '1707–1783',
    contribution: 'Prolific in every area of mathematics',
    emoji: '📊',
  },
  {
    name: 'Carl Friedrich Gauss',
    era: '1777–1855',
    contribution: 'Prince of mathematicians, advanced many fields',
    emoji: '👑',
    storySrc: '6.NS-7-story.mp4',
  },
  {
    name: 'Srinivasa Ramanujan',
    era: '1887–1920',
    contribution: 'Extraordinary intuition in number theory',
    emoji: '✨',
    storySrc: '6.NS-3-story.mp4',
  },
  {
    name: 'Emmy Noether',
    era: '1882–1935',
    contribution: 'Revolutionized abstract algebra',
    emoji: '⭐',
  },
  {
    name: 'David Hilbert',
    era: '1862–1943',
    contribution: 'Shaped modern mathematics and logic',
    emoji: '🧩',
  },
  {
    name: 'Georg Cantor',
    era: '1845–1918',
    contribution: 'Created set theory and infinity concepts',
    emoji: '♾️',
  },
];

const deckFor = (name: string): MathematicianDeck | undefined =>
  MATHEMATICIAN_DECKS.find((d) => d.id === name);

export function Mathematicians() {
  const [open, setOpen] = useState<MathematicianDeck | null>(null);
  useSeo({
    title: 'Famous Mathematicians for Kids — Euclid to Ramanujan | Math10x',
    description:
      'Meet the brilliant minds who shaped math: Euclid, Newton, Euler, Gauss, Ramanujan, Noether, Hilbert & Cantor — slide-by-slide stories of what they did and why it matters.',
    canonicalPath: '/mathematicians',
  });

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h1 className="text-2xl font-display font-extrabold text-slate-900">
          🧑‍🔬 Famous Mathematicians
        </h1>
        <Link
          to="/stories"
          className="text-sm font-display font-bold text-violet-700 hover:text-violet-900"
        >
          🌟 Math Stories →
        </Link>
      </div>
      <p className="text-sm text-slate-600 mb-5">
        Learn about the brilliant minds who shaped mathematics throughout
        history — tap <b>📖 Their story</b> for a slide-by-slide tale of what
        they did, why it matters, and how it connects to what you're learning.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {MATHEMATICIANS.map((m) => {
          const deck = deckFor(m.name);
          return (
            <div
              key={m.name}
              className="rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl shrink-0">{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-extrabold text-slate-900">{m.name}</div>
                  <div className="text-xs font-display font-bold text-purple-700 uppercase tracking-wider mt-0.5">
                    {m.era}
                  </div>
                  <div className="text-sm text-slate-700 mt-1.5">{m.contribution}</div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {deck && (
                      <button
                        type="button"
                        onClick={() => setOpen(deck)}
                        className="inline-flex items-center gap-1 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-display font-extrabold px-3 py-1.5 active:translate-y-0.5"
                        data-haptic="tap"
                      >
                        📖 Their story ({deck.slides.length + 1} slides) →
                      </button>
                    )}
                    {m.storySrc && (
                      <Link
                        to="/stories"
                        state={{ openStory: m.storySrc }}
                        className="inline-flex items-center gap-1 rounded-full bg-white border-2 border-violet-300 text-violet-700 text-xs font-display font-extrabold px-3 py-1"
                        data-haptic="tap"
                      >
                        🌟 Animated story
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        to="/"
        className="inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700"
      >
        ← Back home
      </Link>

      {open && <MathematicianDeckPlayer deck={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
