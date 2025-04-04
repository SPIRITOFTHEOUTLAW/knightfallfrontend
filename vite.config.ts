import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          // Use a glob pattern to copy all files and folders within Cesium
          src: 'node_modules/cesium/Build/Cesium/**',
          dest: 'cesium'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      // Alias Cesium to the built version
      cesium: path.resolve(__dirname, 'node_modules/cesium/Build/Cesium')
    }
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium')
  }
});
