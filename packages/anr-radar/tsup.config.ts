import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    types: 'src/types.ts',
    anrStore: 'src/anrStore.ts',
    scoringEngine: 'src/scoringEngine.ts',
    momentumEngine: 'src/momentumEngine.ts',
    shortlistEngine: 'src/shortlistEngine.ts',
    insightEngine: 'src/insightEngine.ts',
    eventIngestion: 'src/eventIngestion.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
});
