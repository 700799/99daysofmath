import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAINS, DOMAIN_EMOJI, DOMAIN_LABELS } from '../types/problem';
import { LESSONS, type Lesson } from '../data/lessons';
import { LessonCard } from '../components/LessonCard';
import { LessonVideo } from '../components/LessonVideo';

// Learning library: every unit's Manim animations side-by-side with the
// written lesson plan (concept bullets + the full step-by-step deck).
// Videos live inside <details> so nothing downloads until a unit is opened.
export function Videos() {
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null);

  return (
    <div>
      {openLesson && (
        <LessonCard lesson={openLesson} onClose={() => setOpenLesson(null)} />
      )}

      <h1 className="text-2xl font-display font-extrabold text-slate-900">
        🎬 Video & lesson library
      </h1>
      <p className="text-sm text-slate-600 mt-1 mb-5">
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
              <h2 className="font-display font-extrabold text-slate-900 mb-2">
                {DOMAIN_EMOJI[d]} {DOMAIN_LABELS[d]}
              </h2>
              <div className="space-y-2">
                {lessons.map((l) => {
                  const vids = l.videos ?? [];
                  return (
                    <details
                      key={`${l.domain}-${l.unit}`}
                      className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-3"
                    >
                      <summary className="cursor-pointer font-display font-bold text-slate-800 text-sm">
                        Unit {l.unit} · {l.title}
                        <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          {vids.length > 0
                            ? `${vids.length} video${vids.length === 1 ? '' : 's'} + lesson`
                            : 'lesson'}
                        </span>
                      </summary>

                      {/* The written lesson plan, in brief */}
                      <div className="mt-3 rounded-2xl bg-sky-50 border border-sky-200 p-3">
                        <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-sky-700">
                          The key idea
                        </div>
                        <ul className="mt-1.5 space-y-1">
                          {l.concept.map((c, i) => (
                            <li key={i} className="text-sm text-slate-800 flex gap-2">
                              <span className="text-sky-600 font-display font-bold shrink-0">
                                {i + 1}.
                              </span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => setOpenLesson(l)}
                          className="mt-3 w-full min-h-11 rounded-xl bg-duo-blue hover:bg-blue-600 text-white font-display font-extrabold text-sm transition-colors"
                        >
                          📘 Read the step-by-step lesson
                        </button>
                      </div>

                      {/* The animations */}
                      {vids.length > 0 && (
                        <div className="mt-3 space-y-4">
                          {vids.map((v) => (
                            <div key={v.src}>
                              <div className="text-sm font-display font-extrabold text-slate-900 mb-1.5">
                                ▶ {v.title}
                              </div>
                              <LessonVideo src={v.src} title={v.title} preload="none" />
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
        className="mt-6 inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700"
      >
        ← Back home
      </Link>
    </div>
  );
}
