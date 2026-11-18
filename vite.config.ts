import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // 3D kütüphaneleri ayrı parça: karşılama dışındaki ekranlar onu beklemeden açılır
        manualChunks(id: string) {
          if (/node_modules[\/](three|@react-three|three-stdlib|troika|camera-controls|maath)/.test(id)) return 'three'
          if (/node_modules[\/](react|react-dom|scheduler|framer-motion|motion-dom|motion-utils|zustand)[\/]/.test(id)) return 'vendor'
          return undefined
        },
      },
    },
  },
})
