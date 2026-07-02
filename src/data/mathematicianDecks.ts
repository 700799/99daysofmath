// Story-style slide decks for the Famous Mathematicians page. Each deck has
// 12–20 slides (~3 short sentences each) telling: their life → the big idea →
// how it works (worked mini-examples a 6th grader can follow) → why it matters
// today → how it ties to this app's units. `visual` is an emoji scene (2–4
// emoji) rendered LARGE in the illustration pane, matching the app's art style.
export interface MathSlide {
  head: string;
  body: string;
  visual: string; // 2–4 emoji drawn big in the right pane
}

export interface MathematicianDeck {
  id: string; // matches the name in Mathematicians.tsx
  name: string;
  era: string;
  emoji: string;
  tieIn: string; // which app unit(s) this connects to, shown on the title slide
  slides: MathSlide[];
}

export const MATHEMATICIAN_DECKS: MathematicianDeck[] = [];
