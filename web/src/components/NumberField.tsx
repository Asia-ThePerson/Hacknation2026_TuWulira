// Number field: unit inside, range below. Out of range is refused with a plain message, never guessed.
import { useId } from 'react';

// What is wrong with a typed number, or null when it is fine (empty is fine: not entered).
export function numberProblem(value: string | undefined, min?: number, max?: number, unit = ''): string | null {
  if (!value) return null;
  const v = value.trim();
  if (/^-\s*\d/.test(v)) return 'Must be 0 or more. Not saved.';
  if (!/^\d+(\.\d+)?$/.test(v)) return 'Check: not a number. Not saved.';
  const n = Number(v);
  if (min !== undefined && max !== undefined && (n < min || n > max)) return `Check: must be between ${min} and ${max}${unit ? ` ${unit}` : ''}. Not saved.`;
  return null;
}

export function NumberField({
  label,
  unit,
  min,
  max,
  step = 0.1,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  min?: number; // no range: any number, 0 or more
  max?: number;
  step?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const ranged = min !== undefined && max !== undefined;
  const problem = numberProblem(value, min, max, unit);
  const outOfRange = problem !== null;
  return (
    <div className={`field${outOfRange ? ' field-flag' : ''}`}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-box">
        <input
          id={id}
          inputMode={step >= 1 ? 'numeric' : 'decimal'}
          type="text"
          value={value}
          aria-invalid={outOfRange}
          aria-describedby={`${id}-hint`}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="field-unit">{unit}</span>
      </div>
      <p id={`${id}-hint`} className="t-body-sm field-hint">
        {problem ?? (ranged ? `Allowed ${min} to ${max}` : unit || '0 or more')}
      </p>
    </div>
  );
}
