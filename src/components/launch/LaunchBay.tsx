import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseHref } from '../../data/courses';
import { useProgress } from '../../state/progress';
import { Monster } from '../crew/Monster';
import { useCrew } from '../crew/useCrew';
import { SkyLayer } from './SkyLayer';
import { orderedBays, resumeCourse } from './launchMath';
import './launchBay.css';

const XP_SEEN_KEY = 'math10x:crew:xpSeen';

const CARGO: { to: string; label: string }[] = [
  { to: '/practice', label: 'Practice' },
  { to: '/arcade', label: 'Arcade' },
  { to: '/finals', label: 'Finals' },
  { to: '/shop', label: 'Shop' },
  { to: '/rewards', label: 'Collection' },
  { to: '/stories', label: 'Stories' },
  { to: '/mathematicians', label: 'Mathematicians' },
  { to: '/videos', label: 'Videos' },
];

/**
 * Home's first screen: pick a course and go. Nine bays, one per course, fill
 * with hatching as stars are earned. The resume card points at the course in
 * progress. Goal, streak and coins are chips; everything else is the cargo
 * line. A small crew of monsters lives around the edges.
 */
export function LaunchBay({ displayName, chosen }: { displayName: string; chosen: string | null }) {
  const byDomain = useProgress((s) => s.byDomain);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const todaysXp = useProgress((s) => s.todaysXp());
  const dailyStreak = useProgress((s) => s.dailyStreak);
  const coins = useProgress((s) => s.coins);

  const bays = useMemo(() => orderedBays(byDomain), [byDomain]);
  const resume = resumeCourse(bays, chosen);
  const finished = bays.find((b) => b.pct >= 100);
  const untouched = bays.filter((b) => b.pct === 0 && b.course.id !== resume.course.id).at(-1);

  const frame = useRef<HTMLDivElement>(null);
  const { rewardNod } = useCrew(frame);
  const [colorIn, setColorIn] = useState(false);

  // Line art first, then the colour fades in.
  useEffect(() => {
    const t = window.setTimeout(() => setColorIn(true), 250);
    return () => window.clearTimeout(t);
  }, []);

  // Reward nod: if XP went up since the last time Home was seen this session,
  // the crew nods once the colour is in.
  useEffect(() => {
    let seen: number | null = null;
    try {
      const raw = sessionStorage.getItem(XP_SEEN_KEY);
      seen = raw === null ? null : Number(raw);
      sessionStorage.setItem(XP_SEEN_KEY, String(todaysXp));
    } catch {
      /* storage blocked: no reward nod, nothing else changes */
    }
    if (seen !== null && todaysXp > seen) {
      const t = window.setTimeout(rewardNod, 1900);
      return () => window.clearTimeout(t);
    }
  }, [todaysXp, rewardNod]);

  const goalMet = todaysXp >= dailyGoal;
  const resumeUnitTitle = `${resume.course.short} · Unit ${resume.nextUnit}`;

  return (
    <section ref={frame} className={`lb-frame ${colorIn ? 'crew-in' : ''}`} aria-label="Choose a course">
      <SkyLayer />

      <div className="lb-crew lb-pilot" aria-hidden="true">
        <svg className="lb-disc" viewBox="0 0 70 46">
          <ellipse cx="35" cy="32" rx="34" ry="8" fill="rgba(94,231,255,.35)" stroke="rgba(232,238,252,.7)" />
          <ellipse cx="35" cy="31" rx="22" ry="4.5" fill="rgba(232,238,252,.5)" />
          <path d="M18 28 Q35 4 52 28 Z" fill="rgba(94,231,255,.25)" stroke="rgba(94,231,255,.9)" />
          <g fill="#ffd166">
            <circle cx="12" cy="35" r="1.5" />
            <circle cx="24" cy="38" r="1.5" />
            <circle cx="46" cy="38" r="1.5" />
            <circle cx="58" cy="35" r="1.5" />
          </g>
        </svg>
        <div className="lb-rider">
          <Monster id="pilot" />
        </div>
      </div>

      <div className="lb-ui">
        <div className="lb-topbar">
          <div className="lb-crew lb-corner" aria-hidden="true">
            <Monster id="comet" />
          </div>
          <span className="lb-hello">Hi, {displayName}</span>
          <span className="lb-chip ghost">
            <i className="lb-led" style={{ color: 'var(--lb-cyan)' }} />
            STREAK {dailyStreak}
          </span>
          <span className="lb-spacer" />
          <span className={`lb-chip lime ${goalMet ? 'met' : ''}`} title="Daily goal">
            <i className="lb-led" />
            GOAL {Math.min(todaysXp, dailyGoal)}/{dailyGoal}
          </span>
          <Link to="/shop" className="lb-chip gold" title="Coins · Shop">
            π {coins.toLocaleString()}
          </Link>
        </div>

        <div className="lb-hero">
          <button type="button" className="lb-crew lb-mascot" onClick={rewardNod} aria-label="Make the crew nod">
            <Monster id="pi" />
          </button>
          <div className="lb-hero-text">
            <span className="lb-label">Resume mission</span>
            <h2>{resumeUnitTitle}</h2>
            <small>
              {resume.course.name.toUpperCase()} · {resume.pct}% COMPLETE
            </small>
          </div>
          <Link to={courseHref(resume.course)} className="lb-cta">
            Control center
          </Link>
        </div>

        <div className="lb-bays">
          {bays.map((b) => {
            const active = b.course.id === resume.course.id;
            const idle = b.pct === 0 && !active;
            return (
              <Link
                key={b.course.id}
                to={courseHref(b.course)}
                className={`lb-bay ${active ? 'active' : ''} ${idle ? 'idle' : ''}`}
                aria-label={`${b.course.name}, ${b.pct}% complete`}
              >
                {active && (
                  <span className="lb-crew lb-peek" aria-hidden="true">
                    <Monster id="butter" />
                  </span>
                )}
                {finished?.course.id === b.course.id && !active && (
                  <span className="lb-crew lb-cheer" aria-hidden="true">
                    <Monster id="starstruck" />
                  </span>
                )}
                {untouched?.course.id === b.course.id && (
                  <span className="lb-crew lb-sulk" aria-hidden="true">
                    <Monster id="grump" />
                  </span>
                )}
                <i className="lb-fill" style={{ height: `${b.pct}%` }} />
                <span className="lb-name">{b.course.short}</span>
                <span className="lb-pct">
                  {b.pct > 0 ? `${b.pct}%` : '—'}
                  {active ? ' ▲' : ''}
                </span>
              </Link>
            );
          })}
        </div>

        <nav className="lb-cargo" aria-label="More">
          <div className="lb-crew lb-sitter" aria-hidden="true">
            <Monster id="dozer" />
          </div>
          <div className="lb-crew lb-waver" aria-hidden="true">
            <Monster id="waver" className="waving" />
          </div>
          <span className="lb-label">Cargo</span>
          {CARGO.map((c, i) => (
            <span key={c.to} className="lb-cargo-item">
              {i > 0 && <span aria-hidden="true">·</span>}
              <Link to={c.to}>{c.label}</Link>
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
