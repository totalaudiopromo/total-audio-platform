/**
 * eslint-plugin-total-audio-ui
 *
 * ESLint plugin to enforce Total Audio UI standards.
 *
 * Rules:
 * - tap-no-raw-styling: Enforce TAP UI standards in TAP apps
 * - operatoros-no-raw-colour: Enforce OperatorOS theme tokens
 * - no-cross-product-ui-imports: Prevent TAP/OperatorOS UI mixing
 */

import tapNoRawStyling from './rules/tap-no-raw-styling.js';
import operatorosNoRawColour from './rules/operatoros-no-raw-colour.js';
import noCrossProductUiImports from './rules/no-cross-product-ui-imports.js';

export default {
  rules: {
    'tap-no-raw-styling': tapNoRawStyling,
    'operatoros-no-raw-colour': operatorosNoRawColour,
    'no-cross-product-ui-imports': noCrossProductUiImports,
  },
  configs: {
    recommended: {
      plugins: ['total-audio-ui'],
      rules: {
        'total-audio-ui/tap-no-raw-styling': 'error',
        'total-audio-ui/operatoros-no-raw-colour': 'error',
        'total-audio-ui/no-cross-product-ui-imports': 'error',
      },
    },
  },
};
