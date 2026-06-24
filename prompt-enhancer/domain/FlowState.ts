'use strict';

// ─── Enums ──────────────────────────────────────────────────────────────────

export enum FlowStepId {
  CoreIdea = 'core-idea',
  TargetAudience = 'target-audience',
  KeyFeatures = 'key-features',
  TechnicalNeeds = 'technical-needs',
}

export enum AudienceType {
  GeneralPublic = 'General Public',
  Developers = 'Developers',
  BusinessUsers = 'Business Users',
  Designers = 'Designers',
  Students = 'Students',
}

export enum FeatureType {
  UserAuth = 'User Authentication',
  Dashboard = 'Dashboard',
  DataVisualization = 'Data Visualization',
  Notifications = 'Notifications',
  Payments = 'Payments',
  FileUpload = 'File Upload',
  ChatMessaging = 'Chat / Messaging',
  Search = 'Search',
}

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface CoreIdeaData {
  readonly description: string;
}

export interface TargetAudienceData {
  readonly audience: AudienceType;
}

export interface KeyFeaturesData {
  readonly features: ReadonlyArray<FeatureType>;
}

export interface TechnicalNeedsEntry {
  readonly label: string;
  readonly enabled: boolean;
}

export interface TechnicalNeedsData {
  readonly needs: ReadonlyArray<TechnicalNeedsEntry>;
}

export interface FlowPayload {
  readonly coreIdea: string;
  readonly targetAudience: AudienceType;
  readonly keyFeatures: ReadonlyArray<FeatureType>;
  readonly technicalNeeds: ReadonlyArray<TechnicalNeedsEntry>;
  readonly complexityScale: number;
}

// ─── Step Metadata ──────────────────────────────────────────────────────────

export interface StepMeta {
  readonly id: FlowStepId;
  readonly label: string;
  readonly index: number;
}

export const STEP_ORDER: ReadonlyArray<StepMeta> = [
  { id: FlowStepId.CoreIdea, label: 'Core Idea', index: 0 },
  { id: FlowStepId.TargetAudience, label: 'Target Audience', index: 1 },
  { id: FlowStepId.KeyFeatures, label: 'Key Features', index: 2 },
  { id: FlowStepId.TechnicalNeeds, label: 'Technical Needs', index: 3 },
];

export const TOTAL_STEPS: number = STEP_ORDER.length;

// ─── Default Technical Needs ────────────────────────────────────────────────

export const DEFAULT_TECHNICAL_NEEDS: ReadonlyArray<TechnicalNeedsEntry> = [
  { label: 'Need a Database?', enabled: false },
  { label: 'Need User Authentication?', enabled: false },
  { label: 'Need API Integrations?', enabled: false },
  { label: 'Need Real-time Updates?', enabled: false },
];

// ─── FlowStateManager ──────────────────────────────────────────────────────

export class FlowStateManager {
  private _currentStepIndex: number;
  private _coreIdea: CoreIdeaData;
  private _targetAudience: TargetAudienceData | null;
  private _keyFeatures: KeyFeaturesData;
  private _technicalNeeds: TechnicalNeedsData;
  private _complexityScale: number;

  constructor() {
    this._currentStepIndex = 0;
    this._coreIdea = { description: '' };
    this._targetAudience = null;
    this._keyFeatures = { features: [] };
    this._technicalNeeds = { needs: [...DEFAULT_TECHNICAL_NEEDS] };
    this._complexityScale = 3;
  }

  // ── Accessors ───────────────────────────────────────────────────────────

  get currentStepIndex(): number {
    return this._currentStepIndex;
  }

  get currentStep(): StepMeta {
    return STEP_ORDER[this._currentStepIndex];
  }

  get steps(): ReadonlyArray<StepMeta> {
    return STEP_ORDER;
  }

  get coreIdea(): CoreIdeaData {
    return this._coreIdea;
  }

  get targetAudience(): TargetAudienceData | null {
    return this._targetAudience;
  }

  get keyFeatures(): KeyFeaturesData {
    return this._keyFeatures;
  }

  get technicalNeeds(): TechnicalNeedsData {
    return this._technicalNeeds;
  }

  get complexityScale(): number {
    return this._complexityScale;
  }

  get isFirstStep(): boolean {
    return this._currentStepIndex === 0;
  }

  get isLastStep(): boolean {
    return this._currentStepIndex === STEP_ORDER.length - 1;
  }

  // ── Step Data Setters ───────────────────────────────────────────────────

  setCoreIdea(description: string): void {
    this._coreIdea = { description: description.trim() };
  }

  setTargetAudience(audience: AudienceType): void {
    this._targetAudience = { audience };
  }

  setKeyFeatures(features: ReadonlyArray<FeatureType>): void {
    this._keyFeatures = { features: [...features] };
  }

  setTechnicalNeeds(needs: ReadonlyArray<TechnicalNeedsEntry>): void {
    this._technicalNeeds = { needs: [...needs] };
  }

  setComplexityScale(scale: number): void {
    if (scale < 1 || scale > 5) {
      throw new Error('Complexity scale must be between 1 and 5.');
    }
    this._complexityScale = scale;
  }

  // ── Validation ──────────────────────────────────────────────────────────

  canProceedFromStep(stepIndex: number): boolean {
    switch (STEP_ORDER[stepIndex]?.id) {
      case FlowStepId.CoreIdea:
        return this._coreIdea.description.trim().length > 0;
      case FlowStepId.TargetAudience:
        return this._targetAudience !== null;
      case FlowStepId.KeyFeatures:
        return this._keyFeatures.features.length > 0;
      case FlowStepId.TechnicalNeeds:
        return true; // all toggles default to false — always valid
      default:
        return false;
    }
  }

  canProceed(): boolean {
    return this.canProceedFromStep(this._currentStepIndex);
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  goNext(): boolean {
    if (!this.canProceed()) return false;
    if (this._currentStepIndex < STEP_ORDER.length - 1) {
      this._currentStepIndex += 1;
      return true;
    }
    return false;
  }

  goBack(): boolean {
    if (this._currentStepIndex > 0) {
      this._currentStepIndex -= 1;
      return true;
    }
    return false;
  }

  // ── Payload Builder ─────────────────────────────────────────────────────

  buildPayload(): FlowPayload {
    if (!this._targetAudience) {
      throw new Error('Cannot build payload: target audience is not set.');
    }
    return {
      coreIdea: this._coreIdea.description,
      targetAudience: this._targetAudience.audience,
      keyFeatures: [...this._keyFeatures.features],
      technicalNeeds: [...this._technicalNeeds.needs],
      complexityScale: this._complexityScale,
    };
  }

  // ── Reset ───────────────────────────────────────────────────────────────

  reset(): void {
    this._currentStepIndex = 0;
    this._coreIdea = { description: '' };
    this._targetAudience = null;
    this._keyFeatures = { features: [] };
    this._technicalNeeds = { needs: [...DEFAULT_TECHNICAL_NEEDS] };
    this._complexityScale = 3;
  }
}
