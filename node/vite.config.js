import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from 'node:path'

const isSSR = process.env.BUILD_SSR === 'true'

export default defineConfig({

  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: 'public',
  build: isSSR ? {
    // SSR build configuration
    ssr: 'src/entry-server.jsx',
    outDir: 'dist/server',
    rollupOptions: {
      input: 'src/entry-server.jsx'
    }
  } : {
    // Client build configuration
    outDir: 'dist/client'
  }
})


