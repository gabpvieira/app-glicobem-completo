import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              gemini: ['@google/genai']
            }
          }
        },
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      },
      server: {
        port: 5173,
        host: true
      },
      preview: {
        port: 4173,
        host: true
      },
      optimizeDeps: {
        include: ['react', 'react-dom', '@google/genai']
      }
    };
});
