export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:5050/api',
        changeOrigin: true
      }
    }
  },
  // Ensure static files are served from public directory
  ssr: true
})
