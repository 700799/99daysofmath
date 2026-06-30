import { create } from 'zustand';

export interface StorySession {
  storyId: string | null;
  slideIndex: number;
  totalSlides: number;
  isPlaying: boolean;
  animationDone: boolean;
}

interface StoryPlayerStore extends StorySession {
  setStory: (storyId: string, totalSlides: number) => void;
  setSlideIndex: (idx: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  setTotalSlides: (total: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setAnimationDone: (done: boolean) => void;
  resetSession: () => void;
}

export const useStoryPlayer = create<StoryPlayerStore>((set) => {
  // Try to restore from sessionStorage on init
  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('storySession') : null;
  const initial = stored ? JSON.parse(stored) : {};

  const persistSession = (state: Partial<StorySession>) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('storySession', JSON.stringify(state));
    }
  };

  return {
    storyId: initial.storyId ?? null,
    slideIndex: initial.slideIndex ?? 0,
    totalSlides: initial.totalSlides ?? 0,
    isPlaying: initial.isPlaying ?? false,
    animationDone: initial.animationDone ?? false,

    setStory: (storyId: string, totalSlides: number) =>
      set(() => {
        const newState = { storyId, slideIndex: 0, totalSlides };
        persistSession(newState);
        return newState;
      }),

    setSlideIndex: (idx: number) =>
      set((state) => {
        const clamped = Math.max(0, Math.min(idx, state.totalSlides - 1));
        persistSession({ ...state, slideIndex: clamped });
        return { slideIndex: clamped };
      }),

    nextSlide: () =>
      set((state) => {
        const next = Math.min(state.slideIndex + 1, state.totalSlides - 1);
        if (next !== state.slideIndex) {
          persistSession({ ...state, slideIndex: next });
          return { slideIndex: next };
        }
        return state;
      }),

    prevSlide: () =>
      set((state) => {
        const prev = Math.max(state.slideIndex - 1, 0);
        if (prev !== state.slideIndex) {
          persistSession({ ...state, slideIndex: prev });
          return { slideIndex: prev };
        }
        return state;
      }),

    setTotalSlides: (total: number) =>
      set((state) => {
        persistSession({ ...state, totalSlides: total });
        return { totalSlides: total };
      }),

    setIsPlaying: (playing: boolean) =>
      set(() => ({ isPlaying: playing })),

    setAnimationDone: (done: boolean) =>
      set(() => ({ animationDone: done })),

    resetSession: () =>
      set(() => {
        sessionStorage.removeItem('storySession');
        return {
          storyId: null,
          slideIndex: 0,
          totalSlides: 0,
          isPlaying: false,
          animationDone: false,
        };
      }),
  };
});
