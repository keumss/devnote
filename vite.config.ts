import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  base: './',
  plugins: [mdx(), react(), tailwindcss()],
});
