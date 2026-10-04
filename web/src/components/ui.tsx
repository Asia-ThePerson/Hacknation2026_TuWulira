// Reusable building blocks. Names and states follow docs/design/design-system.md, Components.
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useOnline } from '../online.ts';
import { Icon, type IconName } from './Icon.tsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'danger' | 'quiet';
  icon?: IconName;
  block?: boolean;
};

export function Button({ variant = 'primary', icon, block, className = '', children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={`btn btn-${variant}${block ? ' btn-block' : ''} ${className}`} {...rest}>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
    </button>
  );
}

// Status tags never rely on colour: each kind has its own border style, icon or word.
export type TagKind = 'urgent' | 'card' | 'flag' | 'outline' | 'confirmed' | 'reported';
const TAG_ICON: Partial<Record<TagKind, IconName>> = { urgent: 'alert', confirmed: 'check' };

export function Tag({ kind, children }: { kind: TagKind; children: ReactNode }) {
  const icon = TAG_ICON[kind];
  return (
    <span className={`tag tag-${kind}`}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  );
}

// Danger: "Tell the nurse now." Ask: "Not sure. Please ask a person." Info: neutral notes.
export function Banner({ kind, title, children }: { kind: 'danger' | 'ask' | 'info'; title: string; children?: ReactNode }) {
  const icon: IconName = kind === 'danger' ? 'alert' : kind === 'ask' ? 'person' : 'question';
  return (
    <div className={`banner banner-${kind}`} role={kind === 'danger' ? 'alert' : 'status'}>
      <Icon name={icon} size={28} />
      <div>
        <p className="banner-title">{title}</p>
        {children && <div className="banner-body">{children}</div>}
      </div>
    </div>
  );
}

export function SectionLabel({ n, children }: { n?: number | string; children: ReactNode }) {
  return (
    <p className="section-label">
      {n !== undefined && <>{n} · </>}
      {children}
    </p>
  );
}

export function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="chip" aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}

// Navy app bar. Patient screens pass no role; staff screens show role and the lock timer.
export function AppBar({ eyebrow, title, meta, onBack }: { eyebrow?: string; title: string; meta?: ReactNode; onBack?: () => void }) {
  const online = useOnline();
  return (
    <header className="appbar">
      <div className="appbar-status">
        <span role="status">{online ? 'Works offline' : 'No signal · still working'}</span>
        <span className="t-body-sm">Synthetic demo data</span>
      </div>
      <div className="appbar-main">
        {onBack && (
          <button type="button" className="appbar-back" onClick={onBack} aria-label="Back">
            <Icon name="back" size={24} />
          </button>
        )}
        <div className="appbar-titles">
          {eyebrow && <p className="appbar-eyebrow">{eyebrow}</p>}
          <h1 className="appbar-title">{title}</h1>
        </div>
        {meta && <div className="appbar-meta">{meta}</div>}
      </div>
    </header>
  );
}
