'use client';

import { FeatureType } from '@/domain/FlowState';

interface StepKeyFeaturesProps {
  readonly value: ReadonlyArray<FeatureType>;
  readonly onChange: (features: ReadonlyArray<FeatureType>) => void;
}

const FEATURE_OPTIONS: ReadonlyArray<{
  readonly type: FeatureType;
  readonly icon: string;
}> = [
  { type: FeatureType.UserAuth, icon: 'lock' },
  { type: FeatureType.Dashboard, icon: 'dashboard' },
  { type: FeatureType.DataVisualization, icon: 'bar_chart' },
  { type: FeatureType.Notifications, icon: 'notifications' },
  { type: FeatureType.Payments, icon: 'payments' },
  { type: FeatureType.FileUpload, icon: 'upload_file' },
  { type: FeatureType.ChatMessaging, icon: 'chat' },
  { type: FeatureType.Search, icon: 'search' },
];

export default function StepKeyFeatures({ value, onChange }: StepKeyFeaturesProps) {
  const toggleFeature = (feature: FeatureType): void => {
    const mutableFeatures = [...value];
    const index = mutableFeatures.indexOf(feature);
    if (index >= 0) {
      mutableFeatures.splice(index, 1);
    } else {
      mutableFeatures.push(feature);
    }
    onChange(mutableFeatures);
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: 'var(--space-sm)' }}>
          What features do you need?
        </h2>
        <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)' }}>
          Select all the features your application should include.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        {FEATURE_OPTIONS.map((option) => {
          const isActive = value.includes(option.type);
          return (
            <button
              key={option.type}
              type="button"
              className={`chip${isActive ? ' active' : ''}`}
              onClick={() => toggleFeature(option.type)}
              aria-pressed={isActive}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 16,
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {option.icon}
              </span>
              {option.type}
            </button>
          );
        })}
      </div>

      {value.length === 0 && (
        <p
          className="text-label-caps"
          style={{ color: 'var(--error)', marginTop: 'var(--space-md)' }}
        >
          Select at least one feature to continue
        </p>
      )}
    </div>
  );
}
