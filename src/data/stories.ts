// Every Math Story in one list. The 6th-grade stories live in mathStories.json
// with a rendered animation each; the high-school stories are authored in
// TypeScript with a drawn figure per beat and no video, so they ship the day
// they are written. The player handles both.
import storiesJson from './mathStories.json';
import type { MathFigure } from './mathFigure';
import { HS_STORIES } from './mathStoriesHS';

export interface Beat {
  head: string;
  body: string;
  /** The picture for this beat when there is no video: the mathematics, drawn. */
  figure?: MathFigure;
}

export interface Story {
  /** Stable key — the video file name for the animated stories. */
  id: string;
  domain: string;
  unit: number;
  title: string;
  subtitle?: string;
  beats: Beat[];
  learned?: string;
  /** The rendered animation, if there is one. Beats carry figures otherwise. */
  videoSrc?: string;
}

const ANIMATED: Story[] = (storiesJson as Omit<Story, 'id'>[]).map((s) => ({ ...s, id: s.videoSrc! }));

export const STORIES: Story[] = [...ANIMATED, ...HS_STORIES];

/** Total slides for a story: title + one slide per beat + the learned slide. */
export function totalSlides(story: Story): number {
  return 1 + story.beats.length + (story.learned ? 1 : 0);
}
