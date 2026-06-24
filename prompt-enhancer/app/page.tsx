'use client';

import { useState, useCallback, useRef } from 'react';
import {
  FlowStateManager,
  FlowStepId,
  STEP_ORDER,
  DEFAULT_TECHNICAL_NEEDS,
  type AudienceType,
  type FeatureType,
  type TechnicalNeedsEntry,
} from '@/domain/FlowState';

import StepIndicator from '@/app/components/StepIndicator';
import StepCoreIdea from '@/app/components/steps/StepCoreIdea';
import StepTargetAudience from '@/app/components/steps/StepTargetAudience';
import StepKeyFeatures from '@/app/components/steps/StepKeyFeatures';
import StepTechnicalNeeds from '@/app/components/steps/StepTechnicalNeeds';
import ResultDisplay from '@/app/components/ResultDisplay';

type AppPhase = 'flow' | 'loading' | 'result';

export default function Home() {
  // ── State ─────────────────────────────────────────────────────────────
  const managerRef = useRef<FlowStateManager>(new FlowStateManager());

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [coreIdea, setCoreIdea] = useState<string>('');
  const [audience, setAudience] = useState<AudienceType | null>(null);
  const [features, setFeatures] = useState<ReadonlyArray<FeatureType>>([]);
  const [techNeeds, setTechNeeds] = useState<ReadonlyArray<TechnicalNeedsEntry>>(
    DEFAULT_TECHNICAL_NEEDS
  );
  const [complexityScale, setComplexityScale] = useState<number>(3);
  const [phase, setPhase] = useState<AppPhase>('flow');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // ── Sync helpers ──────────────────────────────────────────────────────
  const syncManagerState = useCallback((): void => {
    const manager = managerRef.current;
    manager.setCoreIdea(coreIdea);
    if (audience) manager.setTargetAudience(audience);
    manager.setKeyFeatures(features);
    manager.setTechnicalNeeds(techNeeds);
    manager.setComplexityScale(complexityScale);
  }, [coreIdea, audience, features, techNeeds, complexityScale]);

  // ── Navigation ────────────────────────────────────────────────────────
  const handleNext = useCallback((): void => {
    syncManagerState();
    const manager = managerRef.current;
    if (manager.canProceedFromStep(stepIndex)) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
    }
  }, [stepIndex, syncManagerState]);

  const handleBack = useCallback((): void => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  }, [stepIndex]);

  // ── Generate ──────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async (): Promise<void> => {
    syncManagerState();
    const manager = managerRef.current;
    if (!manager.canProceedFromStep(stepIndex)) return;

    setPhase('loading');
    setError(null);

    try {
      const payload = manager.buildPayload();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: Record<string, string> = await response.json() as Record<string, string>;

      if (!response.ok || data['error']) {
        setError(data['error'] ?? 'An unexpected error occurred.');
        setPhase('flow');
        return;
      }

      setGeneratedPrompt(data['prompt'] ?? '');
      setPhase('result');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      setError(`Failed to generate prompt: ${message}`);
      setPhase('flow');
    }
  }, [stepIndex, syncManagerState]);

  // ── Restart ───────────────────────────────────────────────────────────
  const handleRestart = useCallback((): void => {
    const manager = managerRef.current;
    manager.reset();
    setCoreIdea('');
    setAudience(null);
    setFeatures([]);
    setTechNeeds(DEFAULT_TECHNICAL_NEEDS);
    setComplexityScale(3);
    setStepIndex(0);
    setPhase('flow');
    setGeneratedPrompt('');
    setError(null);
  }, []);

  // ── Validation check ─────────────────────────────────────────────────
  const isCurrentStepValid = (): boolean => {
    switch (STEP_ORDER[stepIndex]?.id) {
      case FlowStepId.CoreIdea:
        return coreIdea.trim().length > 0;
      case FlowStepId.TargetAudience:
        return audience !== null;
      case FlowStepId.KeyFeatures:
        return features.length > 0;
      case FlowStepId.TechnicalNeeds:
        return true;
      default:
        return false;
    }
  };

  const isLastStep = stepIndex === STEP_ORDER.length - 1;

  // ── Render step content ───────────────────────────────────────────────
  const renderStepContent = (): React.ReactNode => {
    const currentStepId = STEP_ORDER[stepIndex]?.id;
    switch (currentStepId) {
      case FlowStepId.CoreIdea:
        return <StepCoreIdea value={coreIdea} onChange={setCoreIdea} />;
      case FlowStepId.TargetAudience:
        return <StepTargetAudience value={audience} onChange={setAudience} />;
      case FlowStepId.KeyFeatures:
        return <StepKeyFeatures value={features} onChange={setFeatures} />;
      case FlowStepId.TechnicalNeeds:
        return (
          <StepTechnicalNeeds
            value={techNeeds}
            onChange={setTechNeeds}
            complexityScale={complexityScale}
            onComplexityScaleChange={setComplexityScale}
          />
        );
      default:
        return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          padding: 'var(--space-md) var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          borderBottom: '1px solid var(--outline-variant)',
          background: 'var(--surface-container)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-default)',
            background: 'var(--primary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--on-primary-container)',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
          >
            terminal
          </span>
        </div>
        <div>
          <h1 className="text-body-lg" style={{ fontWeight: 700, color: 'var(--on-surface)', margin: 0, lineHeight: 1.2 }}>
            Vibe Coder
          </h1>
          <p className="text-label-caps" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
            Prompt Enhancer
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container-app" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Loading state */}
        {phase === 'loading' && (
          <div style={{ width: '100%', maxWidth: 700, textAlign: 'center', paddingTop: 'var(--space-xl)' }}>
            <div className="vibe-bar" style={{ width: '100%', marginBottom: 'var(--space-lg)' }} />
            <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: 'var(--space-sm)' }}>
              Enhancing your prompt...
            </h2>
            <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)' }}>
              Our AI is crafting a comprehensive, production-ready prompt for your app idea.
            </p>
          </div>
        )}

        {/* Result state */}
        {phase === 'result' && (
          <div style={{ width: '100%', maxWidth: 800 }}>
            <ResultDisplay prompt={generatedPrompt} onRestart={handleRestart} />
          </div>
        )}

        {/* Flow state */}
        {phase === 'flow' && (
          <div style={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            {/* Step indicator */}
            <StepIndicator steps={STEP_ORDER} currentIndex={stepIndex} />

            {/* Error message */}
            {error && (
              <div
                className="glass-panel"
                style={{
                  padding: 'var(--space-md)',
                  borderColor: 'var(--error)',
                  borderRadius: 'var(--radius-default)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: 'var(--error)', fontSize: 20 }}>
                  error
                </span>
                <span className="text-body-md" style={{ color: 'var(--error)' }}>
                  {error}
                </span>
              </div>
            )}

            {/* Step content */}
            {renderStepContent()}

            {/* Navigation buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-md)',
                paddingTop: 'var(--space-md)',
                borderTop: '1px solid var(--outline-variant)',
              }}
            >
              <button
                type="button"
                className="btn-ghost"
                onClick={handleBack}
                disabled={stepIndex === 0}
                style={{ opacity: stepIndex === 0 ? 0.3 : 1 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  arrow_back
                </span>
                Back
              </button>

              {isLastStep ? (
                <button
                  id="generate-prompt"
                  type="button"
                  className="btn-primary"
                  onClick={handleGenerate}
                  disabled={!isCurrentStepValid()}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                  Generate Prompt
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                >
                  Next
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    arrow_forward
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: 'var(--space-md) var(--space-lg)',
          borderTop: '1px solid var(--outline-variant)',
          textAlign: 'center',
        }}
      >
        <p className="text-label-caps" style={{ color: 'var(--outline)', margin: 0 }}>
          Built with Stitch × Next.js — Powered by OpenRouter
        </p>
      </footer>
    </div>
  );
}
