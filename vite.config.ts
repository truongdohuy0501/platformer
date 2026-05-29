import { defineConfig } from 'vite';

/** Set VITE_BASE_PATH=/your-repo/ in CI for GitHub Pages. */
const base = process.env.VITE_BASE_PATH ?? './';

export default defineConfig({
  base,
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
});
