import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import serveStatic from 'serve-static'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  server: {
    // Expose PRODUCT-MASTER as a static path during development so images can be served
    middlewareMode: false,
    setup: function(app: any) {
      // serve-static is available via connect which Vite uses; only enable in dev
      const productMasterPath = path.resolve(__dirname, 'PRODUCT-MASTER');
      app.use('/product-master', serveStatic(productMasterPath, { index: false }));
    }
  }
}))