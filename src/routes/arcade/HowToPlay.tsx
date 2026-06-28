export type HowToSection = { heading: string; body: string };

// Shared body: the readable rule sections + an optional controls line.
function Sections({ sections, controls }: { sections: HowToSection[]; controls?: string }) {
  return (
    <>
      {sections.map((s, i) => (
        <div key={i}>
          <div className="font-display font-extrabold text-slate-900 text-sm">{s.heading}</div>
          <div className="text-sm text-slate-600 mt-0.5 whitespace-pre-line leading-snug">{s.body}</div>
        </div>
      ))}
      {controls && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-600 leading-snug">
          <b>🎮 Controls:</b> {controls}
        </div>
      )}
    </>
  );
}

// A collapsible "How to play" drawer to drop at the BOTTOM of a running game,
// so players can scroll down during play to re-read the rules. Closed by
// default; opening reveals the same scrollable sections used on the start screen.
export function GameInstructions({
  emoji,
  title,
  sections,
  controls,
}: {
  emoji?: string;
  title?: string;
  sections: HowToSection[];
  controls?: string;
}) {
  return (
    <details className="max-w-sm mx-auto mt-4 rounded-2xl border-2 border-slate-200 bg-white">
      <summary className="cursor-pointer select-none list-none px-4 py-3 font-display font-extrabold text-slate-700 flex items-center justify-between">
        <span>{emoji ? `${emoji} ` : '📖 '}How to play{title ? ` — ${title}` : ''}</span>
        <span className="text-slate-400 text-sm">tap to read ▾</span>
      </summary>
      <div className="max-h-[44vh] overflow-y-auto border-t border-slate-100 p-4 space-y-3">
        <Sections sections={sections} controls={controls} />
      </div>
    </details>
  );
}

// A scrollable "how to play" screen shown before a game starts. Title hero +
// readable sections + a controls line + a big Start button. Used by the more
// involved games so kids can read the rules (and scroll) before diving in.
export function HowToPlay({
  emoji,
  title,
  gradient = 'from-indigo-500 to-purple-600',
  sections,
  controls,
  onStart,
}: {
  emoji: string;
  title: string;
  gradient?: string;
  sections: HowToSection[];
  controls?: string;
  onStart: () => void;
}) {
  return (
    <div className="max-w-sm mx-auto">
      <div className={`rounded-3xl bg-gradient-to-br ${gradient} text-white p-5 text-center shadow`}>
        <div className="text-5xl drop-shadow">{emoji}</div>
        <div className="font-display font-extrabold text-2xl mt-1">{title}</div>
        <div className="text-xs font-display font-bold text-white/80 mt-0.5">How to play</div>
      </div>
      <div className="mt-3 max-h-[44vh] overflow-y-auto rounded-2xl bg-white border-2 border-slate-200 p-4 space-y-3">
        <Sections sections={sections} controls={controls} />
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-3 w-full min-h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
      >
        ▶ Start!
      </button>
      <p className="text-center text-[11px] text-slate-400 mt-1">Scroll up to read everything ☝️</p>
    </div>
  );
}
