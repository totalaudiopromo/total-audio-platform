/**
 * operatoros-no-raw-colour
 *
 * Disallows raw colours in OperatorOS apps.
 * Enforces use of theme tokens from @total-audio/ui-operatoros.
 *
 * Violations:
 * - Hard-coded hex or rgb/rgba colours in JSX/TSX
 * - Tailwind classes for arbitrary colors
 * - Inline styles for colour/box-shadow
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow raw colours in OperatorOS apps - use theme tokens',
      category: 'UI Standards',
      recommended: true,
    },
    messages: {
      hardCodedColor:
        'Hard-coded colours are not allowed in OperatorOS. Use CSS variables (--operator-*) or theme tokens.',
      arbitraryColor:
        'Arbitrary Tailwind colors are not allowed in OperatorOS. Use theme tokens or CSS variables.',
      inlineStyle:
        'Inline color/background/shadow styles are not allowed in OperatorOS. Use theme tokens.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only apply to OperatorOS code (totalaud.io app, operator-os package, ui-operatoros package)
    const isOperatorOSCode =
      filename.includes('/apps/totalaud.io/') ||
      filename.includes('/packages/operator-os/') ||
      filename.includes('/packages/ui-operatoros/');

    if (!isOperatorOSCode) {
      return {};
    }

    return {
      // Check JSX inline styles
      JSXAttribute(node) {
        if (node.name.name === 'style' && node.value?.expression?.type === 'ObjectExpression') {
          const styleObj = node.value.expression;

          styleObj.properties.forEach((prop) => {
            const disallowedProps = [
              'color',
              'colour',
              'backgroundColor',
              'background',
              'boxShadow',
              'borderColor',
            ];

            if (disallowedProps.includes(prop.key.name)) {
              context.report({
                node: prop,
                messageId: 'inlineStyle',
              });
            }
          });
        }

        // Check className for arbitrary Tailwind values
        if (node.name.name === 'className' && node.value?.value) {
          const className = node.value.value;

          // Check for arbitrary color values
          const arbitraryColorPattern = /(bg|text|border|shadow)-\[#[0-9A-Fa-f]{3,8}\]/;
          if (arbitraryColorPattern.test(className)) {
            context.report({
              node,
              messageId: 'arbitraryColor',
            });
          }
        }
      },

      // Check for hard-coded hex colors in Literal nodes
      Literal(node) {
        if (typeof node.value === 'string') {
          // Match hex colors: #FFF, #FFFFFF, #FFFFFFFF
          const hexColorPattern = /^#[0-9A-Fa-f]{3,8}$/;
          if (hexColorPattern.test(node.value)) {
            context.report({
              node,
              messageId: 'hardCodedColor',
            });
          }
        }
      },
    };
  },
};
