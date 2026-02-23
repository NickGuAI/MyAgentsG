/**
 * PlanMode types - shared between frontend and backend
 * For ExitPlanMode and EnterPlanMode SDK tool interception
 */

export interface ExitPlanModeAllowedPrompt {
  tool: 'Bash';
  prompt: string;
}

export interface ExitPlanModeRequest {
  requestId: string;
  plan?: string;
  allowedPrompts?: ExitPlanModeAllowedPrompt[];
}

export interface EnterPlanModeRequest {
  requestId: string;
}
