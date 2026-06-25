import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { AuthBootstrap } from './components/AuthBootstrap';
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
const Videos = lazy(() => import('./routes/Videos').then((m) => ({ default: m.Videos })));
const Stories = lazy(() => import('./routes/Stories').then((m) => ({ default: m.Stories })));
const Mathematicians = lazy(() => import('./routes/Mathematicians').then((m) => ({ default: m.Mathematicians })));
const Finals = lazy(() => import('./routes/Finals').then((m) => ({ default: m.Finals })));
const FinalQuiz = lazy(() => import('./routes/FinalQuiz').then((m) => ({ default: m.FinalQuiz })));
const ArcadeHub = lazy(() => import('./routes/arcade/ArcadeHub').then((m) => ({ default: m.ArcadeHub })));
const ConnectFour = lazy(() => import('./routes/arcade/ConnectFour').then((m) => ({ default: m.ConnectFour })));
const Wheel = lazy(() => import('./routes/arcade/Wheel').then((m) => ({ default: m.Wheel })));
const MemoryMatch = lazy(() => import('./routes/arcade/MemoryMatch').then((m) => ({ default: m.MemoryMatch })));
const Shootout = lazy(() => import('./routes/arcade/Shootout').then((m) => ({ default: m.Shootout })));
const ZombieZapper = lazy(() => import('./routes/arcade/ZombieZapper').then((m) => ({ default: m.ZombieZapper })));
const Fishing = lazy(() => import('./routes/arcade/Fishing').then((m) => ({ default: m.Fishing })));
const MathRunner = lazy(() => import('./routes/arcade/MathRunner').then((m) => ({ default: m.MathRunner })));
const Platformer = lazy(() => import('./routes/arcade/Platformer').then((m) => ({ default: m.Platformer })));
const RaceCar = lazy(() => import('./routes/arcade/RaceCar').then((m) => ({ default: m.RaceCar })));
const TicTacToe = lazy(() => import('./routes/arcade/TicTacToe').then((m) => ({ default: m.TicTacToe })));
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
      <AuthBootstrap />
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
          <Route path="/videos" element={<Videos />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/mathematicians" element={<Mathematicians />} />
          <Route path="/finals" element={<Finals />} />
          <Route path="/finals/:n" element={<FinalQuiz />} />
          <Route path="/arcade" element={<ArcadeHub />} />
          <Route path="/arcade/connect4" element={<ConnectFour />} />
          <Route path="/arcade/wheel" element={<Wheel />} />
          <Route path="/arcade/memory" element={<MemoryMatch />} />
          <Route path="/arcade/shootout" element={<Shootout />} />
          <Route path="/arcade/zapper" element={<ZombieZapper />} />
          <Route path="/arcade/fishing" element={<Fishing />} />
          <Route path="/arcade/runner" element={<MathRunner />} />
          <Route path="/arcade/platformer" element={<Platformer />} />
          <Route path="/arcade/racer" element={<RaceCar />} />
          <Route path="/arcade/tictactoe" element={<TicTacToe />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
