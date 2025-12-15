import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Fix: Ensure we always stringify a string, even if empty. 
      // JSON.stringify(undefined) causes Vite to skip defining the variable, leading to "process is not defined" in browser.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
    server: {
      port: 3000,
    },
  };
});