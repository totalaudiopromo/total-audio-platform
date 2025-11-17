/**
 * Guardrails
 * Ensure mesh actions respect system boundaries
 */

import type { Action, GuardrailCheck } from '../types';

/**
 * Check action against guardrails
 */
export function checkGuardrails(action: Action): GuardrailCheck {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Rule 1: No binding actions allowed
  if (action.binding) {
    violations.push('Binding actions are not allowed - mesh provides recommendations only');
  }

  // Rule 2: No email sending
  if (
    action.type.includes('send_email') ||
    action.type.includes('email') ||
    action.payload?.action === 'send_email'
  ) {
    violations.push('Direct email sending not allowed from mesh layer');
  }

  // Rule 3: No contact/segment modifications
  if (
    action.type.includes('modify_contact') ||
    action.type.includes('update_segment') ||
    action.type.includes('delete_')
  ) {
    violations.push('Direct data modifications not allowed from mesh layer');
  }

  // Rule 4: No campaign execution
  if (action.type.includes('execute_campaign') || action.type.includes('start_automation')) {
    violations.push('Direct campaign execution not allowed from mesh layer');
  }

  // Warning: High priority recommendations should have justification
  if ((action.priority === 'urgent' || action.priority === 'high') && !action.payload?.reasoning) {
    warnings.push('High/urgent priority recommendations should include reasoning');
  }

  return {
    action,
    passed: violations.length === 0,
    violations,
    warnings,
  };
}

/**
 * Validate action before routing
 */
export function validateAction(action: Action): void {
  const check = checkGuardrails(action);

  if (!check.passed) {
    throw new Error(`Guardrail violation: ${check.violations.join(', ')}`);
  }

  if (check.warnings.length > 0) {
    console.warn('Action warnings:', check.warnings);
  }
}
