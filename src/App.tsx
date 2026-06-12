import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { LoadingSplash } from './components/LoadingSplash';
import { Home } from './routes/Home';
import { Unit } from './routes/Unit';
import { UnitResults } from './routes/UnitResults';
import { Settings } from './routes/Settings';
import { NotFound } from './routes/NotFound';

// Phaser is ~1 MB minified, so every route that renders a Phaser canvas is
// lazy-loaded. The learning core (home, units, results) stays in the small
// initial bundle and the game engine downloads only when a game is opened.
const DomainTrail = lazy(() =>
  import('./routes/DomainTrail').then((m) => ({ default: m.DomainTrail })),
);
const RewardsArcade = lazy(() =>
  import('./routes/RewardsArcade').then((m) => ({ default: m.RewardsArcade })),
);
const MathParty = lazy(() =>
  import('./routes/MathParty').then((m) => ({ default: m.MathParty })),
);
const GrandPrix = lazy(() =>
  import('./routes/GrandPrix').then((m) => ({ default: m.GrandPrix })),
);

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingSplash />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trail/:domain" element={<DomainTrail />} />
          <Route path="/unit/:domain/:unit" element={<Unit />} />
          <Route path="/unit/:domain/:unit/results" element={<UnitResults />} />
          <Route path="/rewards" element={<RewardsArcade />} />
          <Route path="/rewards/math-party" element={<MathParty />} />
          <Route path="/rewards/grand-prix" element={<GrandPrix />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
