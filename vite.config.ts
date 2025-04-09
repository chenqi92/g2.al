import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    // 在构建后复制 _headers 和 _redirects 文件
    {
      name: 'copy-cf-files',
      closeBundle() {
        // 确保 _redirects 文件存在，用于处理SPA路由
        const redirectsContent = `
/*    /index.html   200
`;
        fs.writeFileSync(path.resolve(__dirname, 'dist/_redirects'), redirectsContent.trim());
        console.log('已创建 _redirects 文件用于SPA路由');
      }
    }
  ],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'react-hot-toast', 'lucide-react'],
        }
      }
    }
  }
});
