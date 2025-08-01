import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // load env based on list below
  const everyEnv = loadEnv(mode, process.cwd(), '');
  const filteredEnv = Object.keys(everyEnv).filter(
    (e) => e == 'VITE_API_URL' || e == 'VITE_STRIPE_PUBLISHABLE_KEY'
  );
  const env: any = {};
  for (const envSelected of filteredEnv) {
    env[envSelected] = everyEnv[envSelected];
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@composables': path.resolve(__dirname, './src/composables'),
        '@router': path.resolve(__dirname, './src/router'),
        '@services': path.resolve(__dirname, './src/services'),
        '@stores': path.resolve(__dirname, './src/stores'),
        '@types': path.resolve(__dirname, './src/types'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@views': path.resolve(__dirname, './src/views')
      }
    },
    // Explicitly handle environment variables for configuration
    define: {
      'process.env': env
    },
    server: {
      // enable polling for wsl ubuntu
      watch: {
        usePolling: true // Enable polling for file changes
      },
      // Configure proxy for development if needed
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
