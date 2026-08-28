// Homepage "How Math10x works" section. Doubles as SEO content (real <h2>,
// <ol>, keyword-rich About copy) and the user-facing explainer, with a short
// screen-recording walkthrough embedded (tap-to-play, no autoplay sound).

const STEPS: { emoji: string; title: string; body: string }[] = [
  {
    emoji: '🗺️',
    title: 'Pick a math trail',
    body: 'Choose a topic — ratios, fractions, decimals, geometry, expressions, or statistics.',
  },
  {
    emoji: '🎬',
    title: 'Watch the idea video',
    body: 'A short animated lesson builds the concept step by step, then works one example.',
  },
  {
    emoji: '✏️',
    title: 'Read the worked examples',
    body: 'See each problem solved line by line, with pro tips and common traps called out.',
  },
  {
    emoji: '🧠',
    title: 'Practice until it clicks',
    body: 'Answer adaptive practice questions with hints — earn stars, XP, and coins.',
  },
  {
    emoji: '🕹️',
    title: 'Earn arcade time',
    body: 'Learning unlocks the arcade — dozens of original games that reward what you know.',
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="mt-8 rounded-3xl border-2 border-line bg-surface p-5 sm:p-6"
    >
      <h2
        id="how-it-works-heading"
        className="text-xl sm:text-2xl font-display font-extrabold text-ink"
      >
        How Math10x works
      </h2>
      <p className="mt-1.5 text-sm sm:text-base text-ink-muted">
        Math10x is a free way for kids to learn math, from grade-5 foundations through Algebra 1 and Precalculus — animated video
        lessons, worked examples, and adaptive practice for ratios, fractions, decimals,
        geometry, expressions, and statistics — with an arcade kids unlock by learning.
      </p>

      {/* Short screen-recording walkthrough (tap to play). */}
      <div className="mt-4 overflow-hidden rounded-2xl border-2 border-line bg-slate-900">
        <video
          className="w-full h-auto block"
          controls
          playsInline
          preload="metadata"
          poster="/videos/how-it-works-poster.jpg"
        >
          <source src="/videos/how-it-works.mp4" type="video/mp4" />
          Your browser can’t play this video. Follow the steps below instead.
        </video>
      </div>

      {/* Crawlable step-by-step list. */}
      <ol className="mt-5 space-y-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 flex-none place-items-center rounded-full bg-ok-soft text-lg"
            >
              {s.emoji}
            </span>
            <div className="min-w-0">
              <h3 className="font-display font-extrabold text-ink text-sm sm:text-base">
                {i + 1}. {s.title}
              </h3>
              <p className="text-sm text-ink-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
