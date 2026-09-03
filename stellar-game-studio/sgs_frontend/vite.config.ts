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
    alias: [
      { find: /^react-aria\/(.*)/, replacement: path.resolve(__dirname, './node_modules/react-aria/dist/exports/$1.js') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: 'buffer', replacement: path.resolve(__dirname, './node_modules/buffer/') },
      { find: '@solana-program/token', replacement: path.resolve(__dirname, './src/utils/emptyMock.ts') },
      { find: '@stripe/stripe-js', replacement: path.resolve(__dirname, './src/utils/emptyMock.ts') },
      { find: '@farcaster/mini-app-solana', replacement: path.resolve(__dirname, './src/utils/emptyMock.ts') }
    ],
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
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@privy-io')) return 'vendor-privy';
          if (id.includes('@noir-lang') || id.includes('backend_barretenberg')) return 'vendor-noir';
          if (id.includes('@stellar/stellar-sdk')) return 'vendor-stellar';
          if (id.includes('viem')) return 'vendor-viem';
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false
  }
}))
