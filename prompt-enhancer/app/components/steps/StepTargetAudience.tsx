'use client';

import { AudienceType } from '@/domain/FlowState';

interface StepTargetAudienceProps {
  readonly value: AudienceType | null;
  readonly onChange: (audience: AudienceType) => void;
}

const AUDIENCE_OPTIONS: ReadonlyArray<{
  readonly type: AudienceType;
  readonly icon: string;
  readonly description: string;
}> = [
  { type: AudienceType.GeneralPublic, icon: 'public', description: 'Everyday users and consumers' },
  { type: AudienceType.Developers, icon: 'code', description: 'Software engineers and technical users' },
  { type: AudienceType.BusinessUsers, icon: 'business_center', description: 'Professionals and enterprise teams' },
  { type: AudienceType.Designers, icon: 'palette', description: 'Creative professionals and UI/UX designers' },
  { type: AudienceType.Students, icon: 'school', description: 'Learners and educational use cases' },
];

export default function StepTargetAudience({ value, onChange }: StepTargetAudienceProps) {
  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: 'var(--space-sm)' }}>
          Who is this for?
        </h2>
        <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)' }}>
          Select the primary audience for your application.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-md)', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {AUDIENCE_OPTIONS.map((option) => {
          const isSelected = value === option.type;
          return (
            <button
              key={option.type}
              type="button"
              className={`card${isSelected ? ' selected' : ''}`}
              onClick={() => onChange(option.type)}
              aria-pressed={isSelected}
              style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 28,
                  color: isSelected ? 'var(--primary)' : 'var(--on-surface-variant)',
                  fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {option.icon}
              </span>
              <span
                className="text-body-md"
                style={{ fontWeight: 600, color: 'var(--on-surface)' }}
              >
                {option.type}
              </span>
              <span
                className="text-body-md"
                style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}
              >
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      {value === null && (
        <p
          className="text-label-caps"
          style={{ color: 'var(--error)', marginTop: 'var(--space-md)' }}
        >
          Select an audience to continue
        </p>
      )}
    </div>
  );
}
