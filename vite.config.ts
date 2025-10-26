import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['medusa.glaza.me', 'localhost'],
  },
})
