import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAINS, DOMAIN_EMOJI, DOMAIN_LABELS } from '../types/problem';
import { LESSONS, type Lesson } from '../data/lessons';
import { LessonCard } from '../components/LessonCard';
import { LessonVideo } from '../components/LessonVideo';
import { useSeo } from '../lib/seo';

// Learning library: every unit's Manim animations side-by-side with the
// written lesson plan (concept bullets + the full step-by-step deck).
// Videos live inside <details> so nothing downloads until a unit is opened.
export function Videos() {
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null);
  useSeo({
    title: 'Math Video Lessons — Grades 5-6 & Beyond | Math10x',
    description:
      'Watch free animated math video lessons for grades 5-6: ratios, fractions, decimals, geometry, expressions, and statistics — each with worked examples and practice.',
    canonicalPath: '/videos',
  });

  return (
    <div>
      {openLesson && (
        <LessonCard lesson={openLesson} onClose={() => setOpenLesson(null)} />
      )}

      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-2xl font-display font-extrabold text-ink">
          🎬 Video library
        </h1>
        <Link
          to="/stories"
          className="text-sm font-display font-bold text-accent hover:text-accent"
        >
          🌟 Famous Math Stories →
        </Link>
      </div>
      <p className="text-sm text-ink-muted mt-1 mb-5">
        Every unit has short animations <em>and</em> a written step-by-step
        lesson — watch, read, or both. Tap a unit to open it.
      </p>

      <div className="space-y-6">
        {DOMAINS.map((d) => {
          const lessons = LESSONS.filter((l) => l.domain === d).sort(
            (a, b) => a.unit - b.unit,
          );
          if (lessons.length === 0) return null;
          return (
            <section key={d}>
              <h2 className="font-display font-extrabold text-ink mb-2">
                {DOMAIN_EMOJI[d]} {DOMAIN_LABELS[d]}
              </h2>
              <div className="space-y-2">
                {lessons.map((l) => {
                  const vids = l.videos ?? [];
                  return (
                    <details
                      key={`${l.domain}-${l.unit}`}
                      className="bg-surface border-2 border-line rounded-2xl px-4 py-3"
                    >
                      <summary className="cursor-pointer font-display font-bold text-ink text-sm">
                        Unit {l.unit} · {l.title}
                        <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-ink-dim">
                          {vids.length > 0
                            ? `${vids.length} video${vids.length === 1 ? '' : 's'} + lesson`
                            : 'lesson'}
                        </span>
                      </summary>

                      {/* The written lesson plan, in brief */}
                      <div className="mt-3 rounded-2xl bg-accent-soft border border-accent/35 p-3">
                        <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-accent">
                          The key idea
                        </div>
                        <ul className="mt-1.5 space-y-1">
                          {l.concept.map((c, i) => (
                            <li key={i} className="text-sm text-ink flex gap-2">
                              <span className="text-accent font-display font-bold shrink-0">
                                {i + 1}.
                              </span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => setOpenLesson(l)}
                          className="mt-3 w-full min-h-11 rounded-xl bg-duo-blue hover:bg-duo-green-dark text-white font-display font-extrabold text-sm transition-colors"
                        >
                          📘 Read the step-by-step lesson
                        </button>
                      </div>

                      {/* The animations */}
                      {vids.length > 0 && (
                        <div className="mt-3 space-y-4">
                          {vids.map((v) => (
                            <div key={v.src}>
                              <div className="text-sm font-display font-extrabold text-ink mb-1.5">
                                ▶ {v.title}
                              </div>
                              <LessonVideo
                                src={v.src}
                                title={v.title}
                                objective={l.objective}
                                points={l.concept}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </details>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <Link
        to="/"
        className="mt-6 inline-block text-sm font-display font-bold text-ink-muted hover:text-ink-muted"
      >
        ← Back home
      </Link>
    </div>
  );
}
