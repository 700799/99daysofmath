import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Home } from './routes/Home';
import { Mascot } from './components/Mascot';

const DomainTrail = lazy(() => import('./routes/DomainTrail').then((m) => ({ default: m.DomainTrail })));
const Unit = lazy(() => import('./routes/Unit').then((m) => ({ default: m.Unit })));
const UnitResults = lazy(() => import('./routes/UnitResults').then((m) => ({ default: m.UnitResults })));
const Settings = lazy(() => import('./routes/Settings').then((m) => ({ default: m.Settings })));
const DailyMix = lazy(() => import('./routes/DailyMix').then((m) => ({ default: m.DailyMix })));
const MockTest = lazy(() => import('./routes/MockTest').then((m) => ({ default: m.MockTest })));
const Review = lazy(() => import('./routes/Review').then((m) => ({ default: m.Review })));
const Practice = lazy(() => import('./routes/Practice').then((m) => ({ default: m.Practice })));
const Report = lazy(() => import('./routes/Report').then((m) => ({ default: m.Report })));
const NotFound = lazy(() => import('./routes/NotFound').then((m) => ({ default: m.NotFound })));

function RouteFallback() {
  return (
    <div className="text-center py-12">
      <Mascot mood="thinking" size={72} />
      <div className="mt-3 text-slate-500 font-display font-bold">Loading…</div>
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trail/:domain" element={<DomainTrail />} />
          <Route path="/unit/:domain/:unit" element={<Unit />} />
          <Route path="/unit/:domain/:unit/results" element={<UnitResults />} />
          <Route path="/mix" element={<DailyMix />} />
          <Route path="/test" element={<MockTest />} />
          <Route path="/review" element={<Review />} />
          <Route path="/review/:domain" element={<Review />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/report" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
