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
const HungryHippo = lazy(() => import('./routes/arcade/HungryHippo').then((m) => ({ default: m.HungryHippo })));
const LeapFrog = lazy(() => import('./routes/arcade/LeapFrog').then((m) => ({ default: m.LeapFrog })));
const GemDigger = lazy(() => import('./routes/arcade/GemDigger').then((m) => ({ default: m.GemDigger })));
const Twenty48 = lazy(() => import('./routes/arcade/Twenty48').then((m) => ({ default: m.Twenty48 })));
const Snake = lazy(() => import('./routes/arcade/Snake').then((m) => ({ default: m.Snake })));
const BrickBreaker = lazy(() => import('./routes/arcade/BrickBreaker').then((m) => ({ default: m.BrickBreaker })));
const Sudoku = lazy(() => import('./routes/arcade/Sudoku').then((m) => ({ default: m.Sudoku })));
const Tetris = lazy(() => import('./routes/arcade/Tetris').then((m) => ({ default: m.Tetris })));
const BubblePop = lazy(() => import('./routes/arcade/BubblePop').then((m) => ({ default: m.BubblePop })));
const BobaShop = lazy(() => import('./routes/arcade/BobaShop').then((m) => ({ default: m.BobaShop })));
const SushiMatch = lazy(() => import('./routes/arcade/SushiMatch').then((m) => ({ default: m.SushiMatch })));
const TaikoTap = lazy(() => import('./routes/arcade/TaikoTap').then((m) => ({ default: m.TaikoTap })));
const Tangram = lazy(() => import('./routes/arcade/Tangram').then((m) => ({ default: m.Tangram })));
const TicTacToe = lazy(() => import('./routes/arcade/TicTacToe').then((m) => ({ default: m.TicTacToe })));
const KpopDressMatch = lazy(() => import('./routes/arcade/KpopDressMatch').then((m) => ({ default: m.KpopDressMatch })));
const NotFound = lazy(() => import('./routes/NotFound').then((m) => ({ default: m.NotFound })));

// Warm-up gate wraps every arcade game with a short adaptive quiz.
const ArcadeGate = lazy(() => import('./routes/arcade/ArcadeWarmup').then((m) => ({ default: m.ArcadeGate })));

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
          <Route path="/arcade/connect4" element={<ArcadeGate title="Connect 4"><ConnectFour /></ArcadeGate>} />
          <Route path="/arcade/wheel" element={<ArcadeGate title="Prize Wheel"><Wheel /></ArcadeGate>} />
          <Route path="/arcade/memory" element={<ArcadeGate title="Memory Match"><MemoryMatch /></ArcadeGate>} />
          <Route path="/arcade/shootout" element={<ArcadeGate title="Shootout"><Shootout /></ArcadeGate>} />
          <Route path="/arcade/zapper" element={<ArcadeGate title="Zombie Zapper"><ZombieZapper /></ArcadeGate>} />
          <Route path="/arcade/fishing" element={<ArcadeGate title="Fishing"><Fishing /></ArcadeGate>} />
          <Route path="/arcade/runner" element={<ArcadeGate title="Math Runner"><MathRunner /></ArcadeGate>} />
          <Route path="/arcade/platformer" element={<ArcadeGate title="Platformer"><Platformer /></ArcadeGate>} />
          <Route path="/arcade/racer" element={<ArcadeGate title="Race Car"><RaceCar /></ArcadeGate>} />
          <Route path="/arcade/hippo" element={<ArcadeGate title="Hungry Hippo"><HungryHippo /></ArcadeGate>} />
          <Route path="/arcade/frogger" element={<ArcadeGate title="Leap Frog"><LeapFrog /></ArcadeGate>} />
          <Route path="/arcade/digger" element={<ArcadeGate title="Gem Digger"><GemDigger /></ArcadeGate>} />
          <Route path="/arcade/2048" element={<ArcadeGate title="2048"><Twenty48 /></ArcadeGate>} />
          <Route path="/arcade/snake" element={<ArcadeGate title="Math Snake"><Snake /></ArcadeGate>} />
          <Route path="/arcade/bricks" element={<ArcadeGate title="Brick Breaker"><BrickBreaker /></ArcadeGate>} />
          <Route path="/arcade/sudoku" element={<ArcadeGate title="Sudoku"><Sudoku /></ArcadeGate>} />
          <Route path="/arcade/tetris" element={<ArcadeGate title="Alien Tetris"><Tetris /></ArcadeGate>} />
          <Route path="/arcade/bubbles" element={<ArcadeGate title="Bubble Pop"><BubblePop /></ArcadeGate>} />
          <Route path="/arcade/boba" element={<ArcadeGate title="Boba Shop"><BobaShop /></ArcadeGate>} />
          <Route path="/arcade/sushi" element={<ArcadeGate title="Sushi Match"><SushiMatch /></ArcadeGate>} />
          <Route path="/arcade/taiko" element={<ArcadeGate title="Taiko Tap"><TaikoTap /></ArcadeGate>} />
          <Route path="/arcade/tangram" element={<ArcadeGate title="Tangram"><Tangram /></ArcadeGate>} />
          <Route path="/arcade/tictactoe" element={<ArcadeGate title="Tic Tac Toe"><TicTacToe /></ArcadeGate>} />
          <Route path="/arcade/kpop" element={<ArcadeGate title="K-Pop Dress-Up"><KpopDressMatch /></ArcadeGate>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
