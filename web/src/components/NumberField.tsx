// Number field: unit inside, range below. Out of range is refused with a plain message, never guessed.
import { useId } from 'react';

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
  min?: number; // no range: any number above zero
  max?: number;
  step?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const n = Number(value);
  const ranged = min !== undefined && max !== undefined;
  const outOfRange = value !== '' && (Number.isNaN(n) || n < 0 || (ranged && (n < min! || n > max!)));
  return (
    <div className={`field${outOfRange ? ' field-flag' : ''}`}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-box">
        <input
          id={id}
          inputMode="decimal"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-invalid={outOfRange}
          aria-describedby={`${id}-hint`}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="field-unit">{unit}</span>
      </div>
      <p id={`${id}-hint`} className="t-body-sm field-hint">
        {outOfRange ? (ranged ? `Check: must be between ${min} and ${max} ${unit}. Not saved.` : 'Check: not a number. Not saved.') : ranged ? `Allowed ${min} to ${max}` : unit}
      </p>
    </div>
  );
}
