import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"

export default defineConfig(({ mode }) => ({
  base: process.env.VERCEL ? "/" : (mode === 'production' ? "/guitarPizza--AntiGravity/" : "/"),
  plugins: [react(), wasm(), topLevelAwait()],
  // Load .env files from the parent directory (repo root)
  envDir: '..',
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: path.resolve(__dirname, './node_modules/buffer/'),
      '@solana-program/token': path.resolve(__dirname, './src/utils/emptyMock.ts')
    },
    dedupe: ['@stellar/stellar-sdk']
  },
  optimizeDeps: {
    include: ['@stellar/stellar-sdk', '@stellar/stellar-sdk/contract', '@stellar/stellar-sdk/rpc', 'buffer'],
    exclude: ['@solana-program/token', '@solana/kit'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: false
  }
}))
