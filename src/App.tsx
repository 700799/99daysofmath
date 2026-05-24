import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Home } from './routes/Home';
import { DomainTrail } from './routes/DomainTrail';
import { Unit } from './routes/Unit';
import { UnitResults } from './routes/UnitResults';
import { Settings } from './routes/Settings';
import { DailyMix } from './routes/DailyMix';
import { MockTest } from './routes/MockTest';
import { Review } from './routes/Review';
import { NotFound } from './routes/NotFound';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trail/:domain" element={<DomainTrail />} />
        <Route path="/unit/:domain/:unit" element={<Unit />} />
        <Route path="/unit/:domain/:unit/results" element={<UnitResults />} />
        <Route path="/mix" element={<DailyMix />} />
        <Route path="/test" element={<MockTest />} />
        <Route path="/review" element={<Review />} />
        <Route path="/review/:domain" element={<Review />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
