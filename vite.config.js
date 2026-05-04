import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 分割 React 核心
          'react-vendor': ['react', 'react-dom'],
          // 分割 Lucide 图标
          'lucide': ['lucide-react'],
        },
      },
    },
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        // 只删除 console.log，保留 warn 和 error
        pure_funcs: ['console.log'],
        drop_debugger: true,
      },
    },
    // 生成 sourcemap
    sourcemap: false,
    // 分块大小警告阈值
    chunkSizeWarningLimit: 500,
  },
  // 开发服务器优化
  server: {
    host: '0.0.0.0',
  },
  // 预览服务器优化
  preview: {
    port: 4173,
  },
})