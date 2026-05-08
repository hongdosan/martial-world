import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/martial-arts/',
  plugins: [react()],
  server: { port: 3000 },
  build: { outDir: 'dist' },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
