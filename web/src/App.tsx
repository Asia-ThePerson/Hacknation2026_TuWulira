import { Component, useEffect, type ReactNode } from 'react';
import { ASK_A_PERSON } from '../../app/safety/index.ts';
import { CallPage } from './call/CallPage.tsx';
import { ClinicPage } from './clinic/ClinicPage.tsx';
import { AudioEvidence } from './pages/AudioEvidence.tsx';
import { Gallery } from './pages/Gallery.tsx';
import { Home } from './pages/Home.tsx';
import { IntakeStart, IntakeStep } from './patient/IntakePage.tsx';
import { match, usePath } from './router.ts';

const ROUTES: [string, (p: Record<string, string>) => ReactNode][] = [
  ['/', () => <Home />],
  ['/components', () => <Gallery />],
  ['/call', () => <CallPage />],
  ['/evaluation/audio', () => <AudioEvidence />],
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

function Routes() {
  const path = usePath();
  // On every screen change, move focus to the screen's main heading so screen readers announce it.
  useEffect(() => {
    const el = ['main .alert-title', 'main h2.t-prompt', 'main h2.t-title', 'h1'].map((q) => document.querySelector<HTMLElement>(q)).find(Boolean);
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.tabIndex = -1;
    el.focus({ preventScroll: true });
  }, [path]);
  for (const [pattern, render] of ROUTES) {
    const params = match(pattern, path);
    if (params) return render(params);
  }
  return <Home />;
}

// Clears this app's saved data (all "tuwulira." keys) and starts again on the home screen.
function resetAndReload() {
  for (const store of [localStorage, sessionStorage]) {
    try {
      Object.keys(store)
        .filter((k) => k.startsWith('tuwulira.'))
        .forEach((k) => store.removeItem(k));
    } catch {
      /* blocked storage: nothing saved to clear */
    }
  }
  window.location.hash = '/';
  window.location.reload();
}

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="page">
        <main className="page-body">
          <h1 className="t-title" tabIndex={-1}>
            Something went wrong. {ASK_A_PERSON}
          </h1>
          <p className="t-body-lg">Reset demo clears the data saved by this prototype in this browser, then starts again.</p>
          <button type="button" className="btn btn-primary btn-block" onClick={resetAndReload}>
            Reset demo
          </button>
        </main>
      </div>
    );
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <Routes />
    </ErrorBoundary>
  );
}
