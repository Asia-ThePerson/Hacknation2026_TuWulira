// Large targets, icon plus word on every option, selected state shown by fill, border and a check.
import { YES_NO, type Option } from './answers.ts';
import { Icon } from './Icon.tsx';

export function AnswerButtons({
  name,
  options = YES_NO,
  value,
  onChange,
  compact,
}: {
  name: string; // accessible group label, usually the question
  options?: Option[];
  value: string | undefined;
  onChange: (value: string) => void;
  compact?: boolean; // short options in one row, e.g. units
}) {
  return (
    <div className={`answers${compact ? ' answers-compact' : ''}`} role="radiogroup" aria-label={name}>
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`answer${o.uncertain ? ' answer-uncertain' : ''}`}
            onClick={() => onChange(o.value)}
          >
            {o.icon && <Icon name={o.icon} size={28} />}
            <span className="answer-label">{o.label}</span>
            {selected && (
              <span className="answer-tick">
                <Icon name="check" size={20} label="Selected" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
