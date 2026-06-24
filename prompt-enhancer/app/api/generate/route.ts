import { NextRequest, NextResponse } from 'next/server';
import { type FlowPayload, type TechnicalNeedsEntry } from '@/domain/FlowState';

// ─── Types ──────────────────────────────────────────────────────────────────

interface OpenRouterMessage {
  readonly role: 'system' | 'user';
  readonly content: string;
}

interface OpenRouterChoice {
  readonly message: {
    readonly content: string;
  };
}

interface OpenRouterResponse {
  readonly choices: ReadonlyArray<OpenRouterChoice>;
  readonly error?: {
    readonly message: string;
  };
}

// ─── Prompt Builder ─────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are an expert prompt engineer and software architect. Your job is to take a user's casual, high-level description of a web application they want to build using an AI "vibe coding" platform (like Lovable, Base44, or Bolt.new) and transform it into a comprehensive, well-structured prompt that will produce a high-quality application.

Your output prompt MUST include:
1. A clear project title and one-paragraph summary
2. Detailed feature specifications with acceptance criteria
3. UI/UX requirements (layout, navigation, responsive design)
4. Data model / schema if applicable
5. Technical stack recommendations
6. User flow descriptions
7. Edge cases and error handling guidance

Write the output prompt in the second person ("You will build...") directed at the AI builder.
Be specific, actionable, and thorough. The goal is to eliminate ambiguity so the AI builder produces a polished, production-ready application on the first attempt.

Format the output as a single cohesive prompt — NOT a bullet list of requirements. Write it as prose with clear section headers using markdown.`;
}

function buildUserMessage(payload: FlowPayload): string {
  const featuresFormatted = payload.keyFeatures.join(', ');
  const techNeedsFormatted = payload.technicalNeeds
    .map((n: TechnicalNeedsEntry) => `${n.label} → ${n.enabled ? 'Yes' : 'No'}`)
    .join('\n  ');

  return `Here is what the user wants to build:

**Core Idea:**
${payload.coreIdea}

**Target Audience:** ${payload.targetAudience}

**Key Features:** ${featuresFormatted}

**Estimated App Complexity (1-5 scale):** ${payload.complexityScale}

**Technical Needs:**
  ${techNeedsFormatted}

Please generate a comprehensive, detailed prompt that I can paste directly into an AI app builder to create this application.`;
}

// ─── Validation ─────────────────────────────────────────────────────────────

function validatePayload(body: unknown): body is FlowPayload {
  if (typeof body !== 'object' || body === null) return false;
  const obj = body as Record<string, unknown>;
  return (
    typeof obj['coreIdea'] === 'string' &&
    typeof obj['targetAudience'] === 'string' &&
    Array.isArray(obj['keyFeatures']) &&
    Array.isArray(obj['technicalNeeds']) &&
    typeof obj['complexityScale'] === 'number'
  );
}

// ─── Route Handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env['OPENROUTER_API_KEY'];
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server configuration error: missing API key.' },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    );
  }

  if (!validatePayload(body)) {
    return NextResponse.json(
      { error: 'Invalid payload structure.' },
      { status: 400 }
    );
  }

  const messages: ReadonlyArray<OpenRouterMessage> = [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: buildUserMessage(body) },
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://vibe-coder-prompt-enhancer.vercel.app',
        'X-Title': 'Vibe Coder Prompt Enhancer',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        max_tokens: 4000,
      }),
    });

    const data: OpenRouterResponse = await response.json() as OpenRouterResponse;

    if (!response.ok || data.error) {
      const errorMessage = data.error?.message ?? `OpenRouter API error (${response.status})`;
      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }

    const generatedPrompt = data.choices?.[0]?.message?.content;
    if (!generatedPrompt) {
      return NextResponse.json(
        { error: 'No response generated from the model.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to contact OpenRouter: ${message}` },
      { status: 502 }
    );
  }
}
