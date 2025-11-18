/**
 * no-cross-product-ui-imports
 *
 * Prevents cross-product UI imports.
 * TAP apps cannot import from @total-audio/ui-operatoros.
 * OperatorOS cannot import from @total-audio/ui-tap.
 *
 * This enforces strict separation of the two UI worlds.
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent cross-product UI imports between TAP and OperatorOS',
      category: 'UI Standards',
      recommended: true,
    },
    messages: {
      tapImportingOperatorOS:
        'TAP apps cannot import from @total-audio/ui-operatoros. Use @total-audio/ui-tap instead.',
      operatorOSImportingTAP:
        'OperatorOS apps cannot import from @total-audio/ui-tap. Use @total-audio/ui-operatoros instead.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Determine which product this file belongs to
    const isTAPApp =
      filename.includes('/apps/audio-intel/') ||
      filename.includes('/apps/command-centre/') ||
      filename.includes('/apps/web/') ||
      filename.includes('/apps/pitch-generator/') ||
      filename.includes('/apps/tracker/');

    const isOperatorOSCode =
      filename.includes('/apps/totalaud.io/') ||
      filename.includes('/packages/operator-os/') ||
      filename.includes('/packages/ui-operatoros/');

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        // TAP app importing OperatorOS UI
        if (isTAPApp && importSource.includes('@total-audio/ui-operatoros')) {
          context.report({
            node,
            messageId: 'tapImportingOperatorOS',
          });
        }

        // OperatorOS importing TAP UI
        if (isOperatorOSCode && importSource.includes('@total-audio/ui-tap')) {
          context.report({
            node,
            messageId: 'operatorOSImportingTAP',
          });
        }
      },
    };
  },
};
