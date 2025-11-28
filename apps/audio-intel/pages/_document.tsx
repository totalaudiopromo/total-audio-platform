import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document for Pages Router compatibility
 * Required for Next.js 15 to properly handle 404 page fallback
 * when using App Router alongside Pages Router fallback
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
