// Step progress for the patient flow: section name in words plus a segmented bar.
export function Progress({ step, total, section }: { step: number; total: number; section: string }) {
  return (
    <div className="progress">
      <p className="progress-text">
        <span className="section-label">{section}</span>
        <span className="t-body-sm t-muted">
          Step {step} of {total}
        </span>
      </p>
      <div className="progress-bar" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={`Step ${step} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < step ? 'done' : undefined} />
        ))}
      </div>
    </div>
  );
}
