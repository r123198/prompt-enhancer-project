'use client';

import { type StepMeta } from '@/domain/FlowState';

interface StepIndicatorProps {
  readonly steps: ReadonlyArray<StepMeta>;
  readonly currentIndex: number;
}

export default function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      {/* Step dots and lines */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isActive = i === currentIndex;
          const dotClass = `step-dot${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`;
          const lineClass = `step-line${i < currentIndex ? ' completed' : ''}`;
          return (
            <div key={step.id} style={{ display: 'contents' }}>
              <div
                className={dotClass}
                aria-label={`Step ${i + 1}: ${step.label}`}
                role="progressbar"
                aria-valuenow={isActive ? 1 : isCompleted ? 1 : 0}
                aria-valuemin={0}
                aria-valuemax={1}
              />
              {i < steps.length - 1 && <div className={lineClass} />}
            </div>
          );
        })}
      </div>
      {/* Step labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 'var(--space-sm)',
        }}
      >
        {steps.map((step, i) => {
          const isActive = i === currentIndex;
          return (
            <span
              key={step.id}
              className="text-label-caps"
              style={{
                color: isActive ? 'var(--primary)' : 'var(--outline)',
                textAlign: 'center',
                flex: 1,
              }}
            >
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
