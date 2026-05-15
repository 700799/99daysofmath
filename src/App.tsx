import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Home } from './routes/Home';
import { DomainTrail } from './routes/DomainTrail';
import { Unit } from './routes/Unit';
import { UnitResults } from './routes/UnitResults';
import { Settings } from './routes/Settings';
import { NotFound } from './routes/NotFound';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trail/:domain" element={<DomainTrail />} />
        <Route path="/unit/:domain/:unit" element={<Unit />} />
        <Route path="/unit/:domain/:unit/results" element={<UnitResults />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
