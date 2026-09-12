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
  /** id of a matching Math Story, if one exists. Adds a story link. */
  storyId?: string;
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
    storyId: '6.NS-7-story.mp4',
  },
  {
    name: 'Srinivasa Ramanujan',
    era: '1887–1920',
    contribution: 'Extraordinary intuition in number theory',
    emoji: '✨',
    storyId: '6.NS-3-story.mp4',
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
  // One for each high-school course.
  {
    name: 'Al-Khwarizmi',
    era: 'c. 780–850',
    contribution: 'Wrote the book that named algebra, and the word algorithm',
    emoji: '⚖️',
  },
  {
    name: 'Thales of Miletus',
    era: 'c. 624–546 BC',
    contribution: 'The first proofs: similar triangles and the angle in a semicircle',
    emoji: '🔺',
    storyId: 'GEO-3-eratosthenes',
  },
  {
    name: 'Hipparchus',
    era: 'c. 190–120 BC',
    contribution: 'Father of trigonometry: the first table of chords',
    emoji: '🔭',
    storyId: 'TRIG-14-everest',
  },
  {
    name: 'John Napier',
    era: '1550–1617',
    contribution: 'Invented logarithms, turning multiplication into addition',
    emoji: '🧮',
  },
  {
    name: 'George Pólya',
    era: '1887–1985',
    contribution: 'How to Solve It: understand, plan, carry out, look back',
    emoji: '🧭',
    storyId: 'SAT-11-fermi',
  },
];

const deckFor = (name: string): MathematicianDeck | undefined =>
  MATHEMATICIAN_DECKS.find((d) => d.id === name);

export function Mathematicians() {
  const [open, setOpen] = useState<MathematicianDeck | null>(null);
  useSeo({
    title: 'Famous Mathematicians for Kids — Thales to Pólya | Math10x',
    description:
      'Meet the minds who shaped math: Euclid, Newton, Euler, Gauss, Ramanujan, Noether, Hilbert, Cantor, Al-Khwarizmi, Thales, Hipparchus, Napier & Pólya — slide-by-slide stories of what they did and why it matters.',
    canonicalPath: '/mathematicians',
  });

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h1 className="text-2xl font-display font-extrabold text-ink">
          🧑‍🔬 Famous Mathematicians
        </h1>
        <Link
          to="/stories"
          className="text-sm font-display font-bold text-accent hover:text-accent"
        >
          🌟 Math Stories →
        </Link>
      </div>
      <p className="text-sm text-ink-muted mb-5">
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
              className="rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-accent/35"
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl shrink-0">{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-extrabold text-ink">{m.name}</div>
                  <div className="text-xs font-display font-bold text-accent uppercase tracking-wider mt-0.5">
                    {m.era}
                  </div>
                  <div className="text-sm text-ink-muted mt-1.5">{m.contribution}</div>
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
                    {m.storyId && (
                      <Link
                        to="/stories"
                        state={{ openStory: m.storyId }}
                        className="inline-flex items-center gap-1 rounded-full bg-surface border-2 border-accent/45 text-accent text-xs font-display font-extrabold px-3 py-1"
                        data-haptic="tap"
                      >
                        🌟 Math story
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
        className="inline-block text-sm font-display font-bold text-ink-muted hover:text-ink-muted"
      >
        ← Back home
      </Link>

      {open && <MathematicianDeckPlayer deck={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
