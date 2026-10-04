import type { ReactNode } from 'react';
import { ClinicPage } from './clinic/ClinicPage.tsx';
import { Gallery } from './pages/Gallery.tsx';
import { Home } from './pages/Home.tsx';
import { IntakeStart, IntakeStep } from './patient/IntakePage.tsx';
import { match, usePath } from './router.ts';

const ROUTES: [string, (p: Record<string, string>) => ReactNode][] = [
  ['/', () => <Home />],
  ['/components', () => <Gallery />],
  ['/intake', () => <IntakeStart />],
  ['/intake/:step', (p) => <IntakeStep id={p.step} />],
  ['/clinic', () => <ClinicPage view={{}} />],
  ['/clinic/walk-in', () => <ClinicPage view={{ screen: 'walk-in' }} />],
  ['/clinic/card/:id', (p) => <ClinicPage view={{ cardId: p.id, screen: 'overview' }} />],
  ['/clinic/card/:id/clerk', (p) => <ClinicPage view={{ cardId: p.id, screen: 'clerk' }} />],
  ['/clinic/card/:id/nurse', (p) => <ClinicPage view={{ cardId: p.id, screen: 'nurse' }} />],
  ['/clinic/card/:id/clinician', (p) => <ClinicPage view={{ cardId: p.id, screen: 'clinician' }} />],
  ['/clinic/card/:id/clinician/:tab', (p) => <ClinicPage view={{ cardId: p.id, screen: 'clinician', tab: p.tab }} />],
];

export function App() {
  const path = usePath();
  for (const [pattern, render] of ROUTES) {
    const params = match(pattern, path);
    if (params) return render(params);
  }
  return <Home />;
}
