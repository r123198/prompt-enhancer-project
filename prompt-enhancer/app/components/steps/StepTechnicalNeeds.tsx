'use client';

import { type TechnicalNeedsEntry } from '@/domain/FlowState';

interface StepTechnicalNeedsProps {
  readonly value: ReadonlyArray<TechnicalNeedsEntry>;
  readonly onChange: (needs: ReadonlyArray<TechnicalNeedsEntry>) => void;
  readonly complexityScale: number;
  readonly onComplexityScaleChange: (scale: number) => void;
}

const NEED_ICONS: Record<string, string> = {
  'Need a Database?': 'database',
  'Need User Authentication?': 'shield_person',
  'Need API Integrations?': 'api',
  'Need Real-time Updates?': 'sync',
};

export default function StepTechnicalNeeds({
  value,
  onChange,
  complexityScale,
  onComplexityScaleChange,
}: StepTechnicalNeedsProps) {
  const toggle = (index: number): void => {
    const mutableNeeds = [...value];
    const current = mutableNeeds[index];
    if (current) {
      mutableNeeds[index] = { ...current, enabled: !current.enabled };
      onChange(mutableNeeds);
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: 'var(--space-sm)' }}>
          Technical requirements
        </h2>
        <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)' }}>
          Toggle the technical capabilities your app needs.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {value.map((need, i) => (
          <div
            key={need.label}
            className="glass-panel"
            style={{
              padding: 'var(--space-md) var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 'var(--radius-md)',
              borderColor: need.enabled ? 'var(--primary)' : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 24,
                  color: need.enabled ? 'var(--primary)' : 'var(--on-surface-variant)',
                  fontVariationSettings: need.enabled ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {NEED_ICONS[need.label] ?? 'settings'}
              </span>
              <span className="text-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
                {need.label}
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={need.enabled}
              aria-label={need.label}
              className={`toggle-track${need.enabled ? ' enabled' : ''}`}
              onClick={() => toggle(i)}
            >
              <div className="toggle-thumb" />
            </button>
          </div>
        ))}
      </div>

      {/* Complexity Slider */}
      <div style={{ marginTop: 'var(--space-lg)' }}>
        <h3 className="text-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
          Estimated App Complexity
        </h3>
        <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--space-md)' }}>
          Estimate the architecture complexity scale for the builder.
        </p>

        <div className="slider-container">
          <div className="slider-label-row">
            <span className="text-label-caps" style={{ color: 'var(--primary)' }}>
              Scale: {complexityScale} / 5
            </span>
            <span className="text-label-caps">
              {complexityScale === 1 && 'Simple MVP'}
              {complexityScale === 2 && 'Standard App'}
              {complexityScale === 3 && 'Advanced App'}
              {complexityScale === 4 && 'Complex System'}
              {complexityScale === 5 && 'Enterprise Scale'}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={complexityScale}
            onChange={(e) => onComplexityScaleChange(parseInt(e.target.value, 10))}
            className="slider-input"
            aria-label="Complexity Scale"
          />

          <div className="slider-ticks">
            {[1, 2, 3, 4, 5].map((tick) => (
              <span
                key={tick}
                className={`slider-tick${tick === complexityScale ? ' active' : ''}`}
              >
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
