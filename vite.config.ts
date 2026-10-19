import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { renderShareMetadata } from './src/lib/share-meta';

export default defineConfig({
  plugins: [react(), {
    name: 'birthday-share-metadata',
    transformIndexHtml(html) {
      return html.replace('<!-- birthday-share-meta -->', renderShareMetadata());
    },
  }],
  server: {
    port: 5173,
    host: true, // Exposes to local network (0.0.0.0)
    open: false,
  },
});
