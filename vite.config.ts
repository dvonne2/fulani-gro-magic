import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from 'fs';
import { partytownVite } from '@qwik.dev/partytown/utils';
import { visualizer } from 'rollup-plugin-visualizer';

const copyCriticalFiles = () => ({
  name: 'copy-critical-files',
  writeBundle() {
    const criticalFiles = [
      'manifest.json',
      'sw.js',
      '.htaccess',
      'favicon.ico',
      'robots.txt',
      'analytics-deferred.js'
    ];

    criticalFiles.forEach(file => {
      let src, dest;
      if (file.startsWith('proxy/')) {
        src = path.resolve(__dirname, file);
        dest = path.resolve(__dirname, 'dist', file);
      } else {
        src = path.resolve(__dirname, 'public', file);
        dest = path.resolve(__dirname, 'dist', file);
      }
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    });
  }
});

const makeCssAsync = () => ({
  name: 'make-css-async',
  closeBundle() {
    const indexPath = path.resolve(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      let html = fs.readFileSync(indexPath, 'utf-8');
      // Replace stylesheet links with async loading pattern
      html = html.replace(
        /<link rel="stylesheet" href="(\/assets\/main-[^"]+\.css)">/g,
        '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
      );
      fs.writeFileSync(indexPath, html);
    }
  }
});

export default defineConfig({
  base: '/',
  define: {
    __META_PIXEL_ID__: JSON.stringify(process.env.META_PIXEL_ID || '220381209723501'),
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://94.72.104.4',
        changeOrigin: true,
        headers: {
          'Host': 'vitalvida.systemforce.ng'
        },
        secure: false,
      }
    }
  },
  plugins: [
    partytownVite({ dest: path.resolve(__dirname, 'dist', '~partytown') }),
    react(),
    copyCriticalFiles(),
    // makeCssAsync(), // Disabled - SSG script handles async CSS
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    target: 'es2020',
    minify: 'terser',
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 300,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'query': ['@tanstack/react-query'],
          'icons': ['lucide-react'],
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slot'
          ],
          'utils': ['date-fns', 'clsx', 'tailwind-merge'],
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name?.split('.').pop() || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            return `assets/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    copyPublicDir: true,
  },
  publicDir: 'public',
});
