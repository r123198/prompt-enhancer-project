'use client';

interface StepCoreIdeaProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export default function StepCoreIdea({ value, onChange }: StepCoreIdeaProps) {
  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: 'var(--space-sm)' }}>
          What&rsquo;s your app idea?
        </h2>
        <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)' }}>
          Describe your application concept in your own words. Be as detailed or as vague as you like &mdash; we&rsquo;ll help you refine it.
        </p>
      </div>

      <div className="glass-panel prompt-input-focus" style={{ borderRadius: 'var(--radius-md)' }}>
        <div
          style={{
            padding: 'var(--space-md)',
            paddingBottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span className="text-label-caps" style={{ color: 'var(--on-surface-variant)' }}>
            Core Idea
          </span>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 18,
              color: 'var(--secondary-fixed)',
              fontVariationSettings: "'FILL' 1",
            }}
          >
            auto_awesome
          </span>
        </div>
        <textarea
          id="core-idea-input"
          className="prompt-textarea"
          placeholder="e.g., I want to build a task management app for remote teams with real-time collaboration..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Describe your app idea"
        />
      </div>

      {value.trim().length === 0 && (
        <p
          className="text-label-caps"
          style={{ color: 'var(--error)', marginTop: 'var(--space-sm)' }}
        >
          Please describe your idea to continue
        </p>
      )}
    </div>
  );
}
