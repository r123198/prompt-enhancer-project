'use client';

import { useState, useCallback } from 'react';

interface ResultDisplayProps {
  readonly prompt: string;
  readonly onRestart: () => void;
}

export default function ResultDisplay({ prompt, onRestart }: ResultDisplayProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [prompt]);

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', marginBottom: 'var(--space-sm)' }}>
          Your enhanced prompt is ready
        </h2>
        <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)' }}>
          Copy this prompt and paste it into your AI app builder.
        </p>
      </div>

      {/* Output container */}
      <div className="glass-panel glow-active" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--outline-variant)',
          }}
        >
          <span className="text-label-caps" style={{ color: 'var(--primary)' }}>
            Generated Prompt
          </span>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18, color: 'var(--secondary-fixed)', fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
        </div>
        <div className="result-output" style={{ border: 'none', borderRadius: 0 }}>
          {prompt}
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-md)',
          marginTop: 'var(--space-lg)',
          flexWrap: 'wrap',
        }}
      >
        <button
          id="copy-to-clipboard"
          type="button"
          className="btn-primary"
          onClick={handleCopy}
          style={{ flex: '1 1 200px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button
          id="restart-process"
          type="button"
          className="btn-ghost"
          onClick={onRestart}
          style={{ flex: '1 1 200px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            restart_alt
          </span>
          Start Over
        </button>
      </div>
    </div>
  );
}
