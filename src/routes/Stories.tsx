import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import storiesData from '../data/mathStories.json';
import { DOMAINS, DOMAIN_LABELS, type Domain } from '../types/problem';
import { StorySlide } from '../components/StorySlide';
import { useStoryPlayer } from '../state/storyPlayer';
import { useSeo } from '../lib/seo';

interface Beat {
  head: string;
  body: string;
  visual?: string;
}
interface Story {
  domain: string;
  unit: number;
  title: string;
  subtitle?: string;
  beats: Beat[];
  learned?: string;
  videoSrc: string;
}

const STORIES = storiesData as Story[];

/** Total slides for a story: title + one slide per beat + the learned slide. */
function getTotalSlides(story: Story): number {
  return 1 + story.beats.length + (story.learned ? 1 : 0);
}

const EMOJI_BY_DOMAIN: Record<string, string> = {
  '5.F': '🧱',
  '6.RP': '⚖️',
  '6.NS': '🔢',
  '6.EE': '🧮',
  '6.G': '📐',
  '6.SP': '📊',
  A1: '🚀',
  PC: '🎢',
};

export function Stories() {
  const [opened, setOpened] = useState<Story | null>(null);
  const setStory = useStoryPlayer((s) => s.setStory);
  const location = useLocation();
  useSeo({
    title: 'Math Stories — The History & Wonder of Math | Math10x',
    description:
      'Illustrated math stories that bring math concepts to life — the origins and real-world magic behind ratios, fractions, geometry, and more.',
    canonicalPath: '/stories',
  });

  const handleStoryClick = (story: Story) => {
    const totalSlides = getTotalSlides(story);
    setStory(story.videoSrc, totalSlides);
    setOpened(story);
  };

  // Auto-open a story when arriving with router state (e.g. from a
  // mathematician card linking to its matching story).
  useEffect(() => {
    const openStory = (location.state as { openStory?: string } | null)
      ?.openStory;
    if (!openStory) return;
    const story = STORIES.find((s) => s.videoSrc === openStory);
    if (story) handleStoryClick(story);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const byDomain: Record<string, Story[]> = {};
  for (const s of STORIES) {
    (byDomain[s.domain] ??= []).push(s);
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h1 className="text-2xl font-display font-extrabold text-ink">
          🌟 Famous Math Stories
        </h1>
        <Link
          to="/videos"
          className="text-sm font-display font-bold text-accent hover:text-accent"
        >
          🎬 Video library →
        </Link>
      </div>
      <p className="text-sm text-ink-muted mb-5">
        Quick stories about famous math people and clever scenarios — animated,
        one whole idea at a time. They never move on their own: tap{' '}
        <b>Continue</b> when you're ready for the next slide.
      </p>

      <div className="space-y-6">
        {DOMAINS.map((d: Domain) => {
          const list = (byDomain[d] ?? []).sort((a, b) => a.unit - b.unit);
          if (list.length === 0) return null;
          return (
            <section key={d}>
              <h2 className="font-display font-extrabold text-ink mb-2">
                {EMOJI_BY_DOMAIN[d]} {DOMAIN_LABELS[d]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {list.map((s) => (
                  <button
                    key={s.videoSrc}
                    type="button"
                    onClick={() => handleStoryClick(s)}
                    className="text-left rounded-3xl p-4 bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    data-haptic="tap"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-4xl shrink-0">🌟</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-extrabold text-base sm:text-lg leading-tight">
                          {s.title.replace(/^Story[:\s]+/i, '')}
                        </div>
                        <div className="text-xs opacity-90 mt-0.5 line-clamp-2">
                          {s.subtitle}
                        </div>
                        <div className="text-[10px] opacity-80 mt-1 font-display font-bold uppercase tracking-wider">
                          {s.domain} · Unit {s.unit} · {s.beats.length} beats
                        </div>
                      </div>
                      <div className="text-2xl shrink-0">→</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <Link
        to="/"
        className="mt-8 inline-block text-sm font-display font-bold text-ink-muted hover:text-ink-muted"
      >
        ← Back home
      </Link>

      {opened &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[70]">
            <StorySlide story={opened} onClose={() => setOpened(null)} />
          </div>,
          document.body,
        )}
    </div>
  );
}
