// Mode picker. In the real product these are two devices (D33); in the prototype, two browser tabs.
import { useState } from 'react';
import { Icon } from '../components/Icon.tsx';
import { AppBar, Banner, Button } from '../components/ui.tsx';
import { resetDemo } from '../demo.ts';
import { canFrame } from '../frame/DeviceStage.tsx';
import type { Draft } from '../patient/flow.ts';
import { CARDS_KEY } from '../patient/intake-store.ts';
import { navigate } from '../router.ts';
import { useStored } from '../store.ts';

export function Home() {
  return (
    <div className="page">
      <AppBar eyebrow="Prototype" title="TuWulira" />
      <main className="page-body">
        <p className="t-body-lg">Choose which device this screen is acting as. Open each in its own tab to see the card move from patient to clinic.</p>
        <div className="mode-grid">
          <button type="button" className="mode" onClick={() => navigate('/intake')}>
            <span className="section-label">Intake phone</span>
            <span className="t-title">Patient intake</span>
            <span className="t-muted">Questions before the visit. Staff can help the patient answer.</span>
            <span className="mode-cta">
              Start <Icon name="chevron" />
            </span>
          </button>
          <button type="button" className="mode" onClick={() => navigate('/clinic')}>
            <span className="section-label">Clinic device · staff PIN</span>
            <span className="t-title">Clinic review</span>
            <span className="t-muted">Queue, patient-reported cards and staff entries.</span>
            <span className="mode-cta">
              Open <Icon name="chevron" />
            </span>
          </button>
        </div>
        {canFrame() && (
          <Button variant="outline" icon="chevron" onClick={() => navigate('/both')}>
            Show both devices side by side
          </Button>
        )}
        <Banner kind="info" title="Synthetic demo data only">
          No real patients. Not a medical device. TuWulira never gives a diagnosis or treatment; staff make every decision. Questions marked * in
          the clinic use wording that is not yet validated.
        </Banner>
        <DemoControls />
      </main>
    </div>
  );
}

function DemoControls() {
  const cards = useStored<Record<string, Draft>>(CARDS_KEY, {});
  const [confirm, setConfirm] = useState<'demo' | 'empty' | null>(null);
  const [done, setDone] = useState('');
  const run = (kind: 'demo' | 'empty') => {
    if (confirm !== kind) return setConfirm(kind);
    resetDemo(kind === 'demo');
    setConfirm(null);
    setDone(kind === 'demo' ? 'Demo reset: 4 sample patients loaded. Staff entries and any open intake were cleared.' : 'Everything cleared. The queue is empty.');
  };
  return (
    <section className="demo-box" aria-labelledby="demo-h">
      <h2 id="demo-h" className="section-label">
        Demo controls
      </h2>
      <p className="t-body-sm t-muted">
        This device holds {Object.keys(cards).length} card{Object.keys(cards).length === 1 ? '' : 's'}. Data stays in this browser only.
      </p>
      <div className="row">
        <Button variant={confirm === 'demo' ? 'primary' : 'outline'} icon="sync" onClick={() => run('demo')}>
          {confirm === 'demo' ? 'Tap again to reset' : 'Reset demo (4 sample patients)'}
        </Button>
        <Button variant={confirm === 'empty' ? 'primary' : 'outline'} icon="x" onClick={() => run('empty')}>
          {confirm === 'empty' ? 'Tap again to clear' : 'Clear everything'}
        </Button>
      </div>
      {done && (
        <p className="saved-line" role="status">
          <Icon name="check" size={18} /> {done}
        </p>
      )}
    </section>
  );
}
