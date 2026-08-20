import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        dead_code: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Nomes de chunk neutros (sem "privacy"/"cookie" no ficheiro) para evitar
        // que bloqueadores de anúncios/privacidade rejeitem o pedido de rede
        // (net::ERR_BLOCKED_BY_CLIENT) às páginas legais em produção.
        chunkFileNames: 'assets/chunk-[hash].js'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});