import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './', // Wajib relative path agar CSS/Tailwind & aset statis aman di Vercel
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true
  }
});
