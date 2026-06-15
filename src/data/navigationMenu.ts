export interface NavItem {
  label: string;
  icon: string;
  to: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_MENU: Record<string, NavSection> = {
  home: {
    title: '',
    items: [
      { label: 'Home', icon: '🏠', to: '/' },
    ],
  },
  trails: {
    title: '📚 Learn by Domain',
    items: [
      { label: '5.F - Fractions', icon: '🧱', to: '/trail/5.F' },
      { label: '6.EE - Expressions & Equations', icon: '🧮', to: '/trail/6.EE' },
      { label: '6.NS - Number System', icon: '🔢', to: '/trail/6.NS' },
      { label: '6.RP - Ratios & Proportions', icon: '⚖️', to: '/trail/6.RP' },
      { label: '6.G - Geometry', icon: '📐', to: '/trail/6.G' },
      { label: '6.SP - Statistics & Probability', icon: '📊', to: '/trail/6.SP' },
    ],
  },
  learn: {
    title: '🎓 Learn More',
    items: [
      { label: 'Videos', icon: '🎬', to: '/videos' },
      { label: 'Famous Mathematicians', icon: '👨‍🔬', to: '/mathematicians' },
      { label: 'Math Stories', icon: '🌟', to: '/stories' },
    ],
  },
  practice: {
    title: '🎯 Practice',
    items: [
      { label: 'Practice Mode', icon: '✏️', to: '/practice' },
      { label: 'Arcade Games', icon: '🎮', to: '/arcade' },
      { label: 'Finals/Quizzes', icon: '📝', to: '/finals' },
    ],
  },
  account: {
    title: '⚙️ Settings & More',
    items: [
      { label: 'Settings', icon: '⚙️', to: '/settings' },
      { label: 'My Progress', icon: '📊', to: '/report' },
    ],
  },
};

export const NAV_SECTIONS = [
  NAV_MENU.home,
  NAV_MENU.trails,
  NAV_MENU.learn,
  NAV_MENU.practice,
  NAV_MENU.account,
];
