// A Math Story played as a slide deck, so it uses the same player, layout and
// pacing as the Famous Mathematicians: title slide, one slide per beat with its
// figure, then "What you learned".
import type { MathematicianDeck } from './mathematicianDecks';
import type { Story } from './stories';
import { DOMAIN_LABELS, type Domain } from '../types/problem';

/** The story's unit page: the SAT has its own hub, every other course a unit route. */
export function storyUnitRoute(s: Story): string {
  return s.domain === 'SAT' ? `/sat/unit/${s.unit}` : `/unit/${s.domain}/${s.unit}`;
}

export function storyTitle(s: Story): string {
  return s.title.replace(/^Story[:\s]+/i, '');
}

export function storyToDeck(s: Story): MathematicianDeck {
  const course = DOMAIN_LABELS[s.domain as Domain] ?? s.domain;
  const slides = s.beats.map((b) => ({ head: b.head, body: b.body, figure: b.figure! }));
  if (s.learned && s.learnedFigure) {
    slides.push({ head: '✅ What you learned', body: s.learned, figure: s.learnedFigure });
  }
  return {
    id: s.id,
    name: storyTitle(s),
    era: `${s.domain} · Unit ${s.unit}`,
    emoji: s.emoji ?? '🌟',
    tagline: s.subtitle,
    tieIn: `${course} · Unit ${s.unit}`,
    tieInTo: storyUnitRoute(s),
    slides,
  };
}
