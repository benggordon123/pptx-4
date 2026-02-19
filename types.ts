
export type AppTab = 'dashboard' | 'drafting' | 'tone' | 'crisis' | 'admin';

export interface PromptBlueprint {
  role: string;
  task: string;
  context: string;
  format: string;
  fullPromptTemplate: string;
}

// Module 1: Drafting
export interface ReplyWizardResult { reply: string; blueprint: PromptBlueprint; }
export interface SubjectLineResult { suggestions: string[]; blueprint: PromptBlueprint; }
export interface SummarizerResult { summary: string; actionItem: string; blueprint: PromptBlueprint; }
export type ReplyStance = 'Agree' | 'Decline' | 'Negotiate';

// Module 2: Tone
export interface ToneAnalysis { warmth: number; professionalism: number; improvement: string; blueprint: PromptBlueprint; }
export interface RewriteResult { output: string; blueprint: PromptBlueprint; }
export interface ClarityResult { jargonFound: { original: string; simpler: string; }[]; readabilityScore: number; blueprint: PromptBlueprint; }

// Module 3: Crisis
export interface CrisisAnalysis { psychologicalInsights: string[]; responseDraft: string; blueprint: PromptBlueprint; }
export interface EscalationResult { riskLevel: 'Low' | 'Medium' | 'High'; triggers: string[]; advice: string; blueprint: PromptBlueprint; }
export interface RootCauseResult { causes: string[]; structuralFix: string; blueprint: PromptBlueprint; }

// Module 4: Admin
export interface MeetingExtraction { proposedSlots: string[]; confirmationMessage: string; blueprint: PromptBlueprint; }
export interface TaskExtraction { tasks: { task: string; priority: 'High' | 'Medium' | 'Low'; }[]; blueprint: PromptBlueprint; }
export interface OOOResult { message: string; blueprint: PromptBlueprint; }
