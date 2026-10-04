// Desktop demo view: shows the app inside the device it runs on (D33), like the Figma frames.
// The patient answers on their own basic phone (D38); staff-assisted intake runs on the intake phone
// (Android smartphone); clinic screens on the clinic tablet, landscape.
// Each screen is the real app in an iframe at the device's size, so the app's own phone and tablet
// layouts apply. Phones, small windows and ?frame=off get the plain app, unchanged.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { App } from '../App.tsx';
import { CallConsole } from '../call/CallConsole.tsx';
import { navigate, usePath } from '../router.ts';

type Kind = 'basic' | 'phone' | 'tablet' | 'both';
type DeviceKind = Exclude<Kind, 'both'>;

const DEVICES: Record<DeviceKind, { w: number; h: number; label: string; note: string; bare?: boolean }> = {
  // The basic phone draws its own body and keypad (src/call/), so it gets no shell here.
  basic: { w: 332, h: 880, label: 'Patient’s basic phone', note: 'Own phone · voice call and keypad · no app, no AI', bare: true },
  phone: { w: 360, h: 720, label: 'Intake phone', note: 'Android smartphone · all AI runs here' },
  tablet: { w: 900, h: 600, label: 'Clinic device', note: 'Android tablet, landscape · no AI' },
};
const BEZEL = 14; // px around the screen
const GAP = 40; // between devices in side by side
const LABEL_H = 52; // label under each device

const DESKTOP = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const embedded = (() => {
  try {
    return window.self !== window.top || new URLSearchParams(location.search).has('embed');
  } catch {
    return true; // cross-origin parent: never nest frames
  }
})();
// Inside a frame the page background goes transparent, so the basic phone sits on the stage.
if (embedded) document.documentElement.dataset.embed = '1';
const frameOff = new URLSearchParams(location.search).get('frame') === 'off';

function kindOf(path: string): Kind | null {
  if (path === '/both') return 'both';
  if (path === '/call') return 'basic';
  if (path === '/intake' || path.startsWith('/intake/')) return 'phone';
  if (path === '/clinic' || path.startsWith('/clinic/')) return 'tablet';
  return null;
}

function useMedia(query: string) {
  const [on, setOn] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const fn = () => setOn(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, [query]);
  return on;
}

export function Root() {
  const path = usePath();
  const desktop = useMedia(DESKTOP);
  const kind = kindOf(path);
  if (embedded || frameOff || !desktop || !kind) return <App />;
  // The basic phone draws itself, so on desktop it gets the full walkthrough console instead of a frame.
  if (kind === 'basic') return <StageShell kind={kind} path={path}><CallConsole /></StageShell>;
  return <DeviceStage kind={kind} path={path} />;
}

// Called from Home: the side-by-side view exists on desktop only.
export const canFrame = () => !embedded && !frameOff && window.matchMedia(DESKTOP).matches;

function StageShell({ kind, path, children }: { kind: Kind; path: string; children: ReactNode }) {
  const plain = `?frame=off#${kind === 'both' ? '/' : path}`;
  return (
    <div className="stage-page">
      <header className="stage-bar">
        <a className="stage-home" href="#/">
          TuWulira prototype
        </a>
        <nav className="stage-switch" aria-label="Device view">
          <Switch to="/call" on={kind === 'basic'}>
            Basic phone
          </Switch>
          <Switch to="/clinic" on={kind === 'tablet'}>
            Clinic device
          </Switch>
          <Switch to="/both" on={kind === 'both'}>
            Side by side
          </Switch>
        </nav>
        <a className="stage-plain" href={plain}>
          Show without frame
        </a>
      </header>
      {children}
    </div>
  );
}

function DeviceStage({ kind, path }: { kind: Kind; path: string }) {
  const area = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const shown: DeviceKind[] = kind === 'both' ? ['basic', 'tablet'] : [kind];
  const pad = (k: DeviceKind) => (DEVICES[k].bare ? 0 : BEZEL * 2);
  const needW = shown.reduce((w, k) => w + DEVICES[k].w + pad(k), 0) + GAP * (shown.length - 1);
  const needH = Math.max(...shown.map((k) => DEVICES[k].h + pad(k))) + LABEL_H;

  // Shrink the whole stage to fit the window; the screens keep their real size inside.
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, (el.clientWidth - 32) / needW, (el.clientHeight - 32) / needH));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [needW, needH]);

  return (
    <StageShell kind={kind} path={path}>
      <div className="stage-area" ref={area}>
        <div className="stage-fit" style={{ width: needW * scale, height: needH * scale }}>
          <div className="stage-row" style={{ width: needW, gap: GAP, transform: `scale(${scale})` }}>
            {shown.map((k) => (
              <Device key={`${kind}-${k}`} kind={k} start={kind === 'both' ? (k === 'basic' ? '/call' : '/clinic') : path} follow={kind !== 'both'} />
            ))}
          </div>
        </div>
      </div>
      {kind === 'both' && (
        <p className="stage-hint">
          Finish the call on the basic phone and the card appears in the clinic queue. In the full design the clinic line answers the call and
          the clinic's intake phone runs the speech step (open question 7); here both screens share this browser's storage.
        </p>
      )}
    </StageShell>
  );
}

function Switch({ to, on, children }: { to: string; on: boolean; children: ReactNode }) {
  return (
    <button type="button" className="stage-tab" aria-pressed={on} onClick={() => navigate(to)}>
      {children}
    </button>
  );
}

function Device({ kind, start, follow }: { kind: DeviceKind; start: string; follow: boolean }) {
  const d = DEVICES[kind];
  const [src] = useState(() => `./?embed=1#${start}`); // fixed per mount; the iframe navigates itself after that
  const ref = useRef<HTMLIFrameElement>(null);

  // Single-device view: keep the address bar in step with the screen, and switch device when the app
  // moves to the other side (for example the walk-in "Start intake" button opens the intake).
  const onLoad = () => {
    const w = ref.current?.contentWindow;
    if (!follow || !w) return;
    const sync = () => {
      const p = w.location.hash.replace(/^#/, '') || '/';
      if (kindOf(p) === kind) history.replaceState(null, '', `#${p}`);
      else location.replace(`#${p}`);
    };
    w.addEventListener('hashchange', sync);
  };

  return (
    <figure className={`device device-${kind}`} style={{ width: d.w + (d.bare ? 0 : BEZEL * 2) }}>
      <div className={d.bare ? 'device-bare' : 'device-shell'} style={{ padding: d.bare ? 0 : BEZEL }}>
        <iframe ref={ref} src={src} title={`${d.label} screen`} width={d.w} height={d.h} onLoad={onLoad} />
      </div>
      <figcaption>
        <b>{d.label}</b> <span>{d.note}</span>
      </figcaption>
    </figure>
  );
}
