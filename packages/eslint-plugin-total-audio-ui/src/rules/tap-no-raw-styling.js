/**
 * tap-no-raw-styling
 *
 * Disallows raw styling in TAP apps.
 * Enforces use of @total-audio/ui-tap components and tokens.
 *
 * Violations:
 * - Inline style objects with color, backgroundColor, boxShadow
 * - Tailwind classes for arbitrary colors (e.g., bg-[#FF0000])
 * - Direct usage of unapproved fonts
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow raw styling in TAP apps - use @total-audio/ui-tap',
      category: 'UI Standards',
      recommended: true,
    },
    messages: {
      inlineColor:
        'Inline color styles are not allowed in TAP apps. Use @total-audio/ui-tap components or tap-* tokens.',
      inlineBackground:
        'Inline backgroundColor styles are not allowed in TAP apps. Use @total-audio/ui-tap components or tap-slate-* tokens.',
      inlineBoxShadow:
        'Inline boxShadow styles are not allowed in TAP apps. Use tap-shadow-* tokens.',
      arbitraryColor:
        'Arbitrary Tailwind colors (e.g., bg-[#...]) are not allowed in TAP apps. Use tap-* color tokens.',
      unapprovedFont:
        'Unapproved font families are not allowed in TAP apps. Use font-sans (Inter) or font-mono (JetBrains Mono).',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only apply to TAP apps (audio-intel, command-centre, web, pitch-generator, tracker)
    const isTAPApp =
      filename.includes('/apps/audio-intel/') ||
      filename.includes('/apps/command-centre/') ||
      filename.includes('/apps/web/') ||
      filename.includes('/apps/pitch-generator/') ||
      filename.includes('/apps/tracker/');

    if (!isTAPApp) {
      return {};
    }

    return {
      // Check JSX inline styles
      JSXAttribute(node) {
        if (node.name.name === 'style' && node.value?.expression?.type === 'ObjectExpression') {
          const styleObj = node.value.expression;

          styleObj.properties.forEach((prop) => {
            if (prop.key.name === 'color' || prop.key.name === 'colour') {
              context.report({
                node: prop,
                messageId: 'inlineColor',
              });
            }

            if (prop.key.name === 'backgroundColor') {
              context.report({
                node: prop,
                messageId: 'inlineBackground',
              });
            }

            if (prop.key.name === 'boxShadow') {
              context.report({
                node: prop,
                messageId: 'inlineBoxShadow',
              });
            }

            if (prop.key.name === 'fontFamily') {
              context.report({
                node: prop,
                messageId: 'unapprovedFont',
              });
            }
          });
        }

        // Check className for arbitrary Tailwind values
        if (node.name.name === 'className' && node.value?.value) {
          const className = node.value.value;

          // Check for arbitrary color values: bg-[#...], text-[#...], border-[#...]
          const arbitraryColorPattern = /(bg|text|border|shadow)-\[#[0-9A-Fa-f]{3,8}\]/;
          if (arbitraryColorPattern.test(className)) {
            context.report({
              node,
              messageId: 'arbitraryColor',
            });
          }
        }
      },
    };
  },
};
