import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { STORIES, totalSlides, type Story } from '../data/stories';
import { storyTitle, storyToDeck, storyUnitRoute } from '../data/storyDeck';
import { DOMAINS, DOMAIN_LABELS, type Domain } from '../types/problem';
import { MathematicianDeckPlayer } from '../components/MathematicianDeck';
import { useSeo } from '../lib/seo';

const EMOJI_BY_DOMAIN: Record<string, string> = {
  '5.F': '🧱',
  '6.RP': '⚖️',
  '6.NS': '🔢',
  '6.EE': '🧮',
  '6.G': '📐',
  '6.SP': '📊',
  A1: '🚀',
  GEO: '📏',
  TRIG: '📡',
  PC: '🎢',
  SAT: '🎯',
  CALC: '📈',
  STAT: '🧪',
};

export function Stories() {
  const [opened, setOpened] = useState<Story | null>(null);
  const location = useLocation();
  useSeo({
    title: 'Math Stories — The History & Wonder of Math | Math10x',
    description:
      'Illustrated math stories that bring math concepts to life — from Gauss and Galileo to Eratosthenes, Everest and Zeno: the origins and real-world magic behind ratios, geometry, algebra, trigonometry and calculus.',
    canonicalPath: '/stories',
  });

  // Auto-open a story when arriving with router state (e.g. from a
  // mathematician card linking to its matching story).
  useEffect(() => {
    const openStory = (location.state as { openStory?: string } | null)?.openStory;
    if (!openStory) return;
    const story = STORIES.find((s) => s.id === openStory);
    if (story) setOpened(story);
  }, [location.state]);

  const byDomain: Record<string, Story[]> = {};
  // A story is listed once every slide has its figure.
  const ready = STORIES.filter((s) => s.learnedFigure && s.beats.every((b) => b.figure));
  for (const s of ready) (byDomain[s.domain] ??= []).push(s);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-ink">🌟 Math Stories</h1>
        <Link to="/mathematicians" className="font-display text-sm font-bold text-accent hover:text-accent">
          🧑‍🔬 Mathematicians →
        </Link>
      </div>
      <p className="mb-5 text-sm text-ink-muted">
        True stories and clever puzzles behind the math you're learning. Tap{' '}
        <b>📖 Read the story</b> for a slide-by-slide tale with the math drawn on every slide. It
        never moves on its own: tap <b>Continue</b> when you're ready.
      </p>

      <div className="space-y-6">
        {DOMAINS.map((d: Domain) => {
          const list = (byDomain[d] ?? []).sort((a, b) => a.unit - b.unit);
          if (list.length === 0) return null;
          return (
            <section key={d}>
              <h2 className="mb-2 font-display font-extrabold text-ink">
                {EMOJI_BY_DOMAIN[d]} {DOMAIN_LABELS[d]}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {list.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl border-2 border-accent/35 bg-gradient-to-br from-purple-50 to-pink-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 text-4xl">{s.emoji}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-display font-extrabold text-ink">{storyTitle(s)}</div>
                        <div className="mt-0.5 font-display text-xs font-bold uppercase tracking-wider text-accent">
                          {s.domain} · Unit {s.unit}
                        </div>
                        {s.subtitle && <div className="mt-1.5 text-sm text-ink-muted">{s.subtitle}</div>}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setOpened(s)}
                            className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1.5 font-display text-xs font-extrabold text-white hover:bg-violet-700 active:translate-y-0.5"
                            data-haptic="tap"
                          >
                            📖 Read the story ({totalSlides(s)} slides) →
                          </button>
                          <Link
                            to={storyUnitRoute(s)}
                            className="inline-flex items-center gap-1 rounded-full border-2 border-accent/45 bg-surface px-3 py-1 font-display text-xs font-extrabold text-accent"
                            data-haptic="tap"
                          >
                            📘 Unit {s.unit}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <Link to="/" className="mt-8 inline-block font-display text-sm font-bold text-ink-muted hover:text-ink-muted">
        ← Back home
      </Link>

      {opened && (
        <MathematicianDeckPlayer deck={storyToDeck(opened)} kicker="🌟 Math Story" theme="light" onClose={() => setOpened(null)} />
      )}
    </div>
  );
}
