import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // auto-updates the service worker when you redeploy
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Job Application Tracker',
        short_name: 'JobTracker',
        description: 'Track your job applications',
        theme_color: '#1976d2', // matches MUI's default primary blue
        background_color: '#ffffff',
        display: 'standalone', // this is what removes the browser chrome on install
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
