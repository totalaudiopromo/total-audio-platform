import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/trend-detection.ts', 'src/content-fusion.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['axios', 'cheerio', 'rss-parser', 'node-cron', 'openai', 'sentiment', 'compromise', 'date-fns'],
  target: 'node18',
  bundle: true,
  minify: false
});