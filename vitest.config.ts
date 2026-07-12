import react from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [mdx(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
