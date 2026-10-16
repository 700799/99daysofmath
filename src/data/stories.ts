// Every Math Story in one list. The 6th-grade stories' words live in
// mathStories.json; their drawn figures live in storyFigures/. The high-school
// stories are authored in TypeScript with a figure on each beat. All of them
// play in the same slide player as the Famous Mathematicians.
import storiesJson from './mathStories.json';
import type { MathFigure } from './mathFigure';
import { HS_STORIES } from './mathStoriesHS';
import { STORY_FIGURES } from './storyFigures';

export interface Beat {
  head: string;
  body: string;
  /** The picture for this beat: the mathematics, drawn. */
  figure?: MathFigure;
}

export interface Story {
  /** Stable key — the old animation's file name for the 6th-grade stories. */
  id: string;
  domain: string;
  unit: number;
  title: string;
  subtitle?: string;
  beats: Beat[];
  learned?: string;
  /** The picture on the closing "What you learned" slide. */
  learnedFigure?: MathFigure;
  /** Icon on the story's card and title slide. */
  emoji?: string;
  /** The old rendered animation. Kept as the id; the player no longer shows it. */
  videoSrc?: string;
}

const STORY_EMOJI: Record<string, string> = {
  '5.F-3-story.mp4': '🍕',
  '5.F-6-story.mp4': '🏃',
  '6.EE-1-story.mp4': '🪙',
  '6.EE-6-story.mp4': '🐇',
  '6.EE-9-story.mp4': '🤝',
  '6.EE-10-story.mp4': '🌾',
  '6.G-1-story.mp4': '🔺',
  '6.G-2-story.mp4': '📜',
  '6.G-3-story.mp4': '👑',
  '6.G-4-story.mp4': '🌀',
  '6.G-6-story.mp4': '🐝',
  '6.NS-1-story.mp4': '🕰️',
  '6.NS-3-story.mp4': '🚕',
  '6.NS-4-story.mp4': '0️⃣',
  '6.NS-5-story.mp4': '🚀',
  '6.NS-7-story.mp4': '➕',
  '6.NS-10-story.mp4': '🪰',
  '6.RP-2-story.mp4': '⚾',
  '6.RP-4-story.mp4': '🔐',
  '6.RP-5-story.mp4': '⚽',
  '6.SP-1-story.mp4': '⭕',
  '6.SP-4-story.mp4': '🎂',
  '6.SP-9-story.mp4': '🏥',
  'A1-14-galileo': '🔭',
  'GEO-3-eratosthenes': '🌍',
  'TRIG-14-everest': '🏔️',
  'PC-14-zeno': '🐢',
  'SAT-11-fermi': '💥',
};

const ANIMATED: Story[] = (storiesJson as Omit<Story, 'id'>[]).map((s) => {
  const id = s.videoSrc!;
  const figs = STORY_FIGURES[id] ?? [];
  return {
    ...s,
    id,
    beats: s.beats.map((b, i) => ({ ...b, figure: figs[i] })),
    learnedFigure: figs[s.beats.length],
  };
});

export const STORIES: Story[] = [...ANIMATED, ...HS_STORIES].map((s) => ({
  ...s,
  emoji: STORY_EMOJI[s.id] ?? '🌟',
  learnedFigure: s.learnedFigure ?? s.beats[s.beats.length - 1]?.figure,
}));

/** Total slides for a story: title + one slide per beat + the learned slide. */
export function totalSlides(story: Story): number {
  return 1 + story.beats.length + (story.learned ? 1 : 0);
}
