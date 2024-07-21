import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api/v1/users': 'https://demo-blog-website-dwt4.onrender.com',
      '/api/v1/upload': 'https://demo-blog-website-dwt4.onrender.com',
      '/api/v1/share': 'https://demo-blog-website-dwt4.onrender.com',
      '/api/v1/total': 'https://demo-blog-website-dwt4.onrender.com',
      // '/api/v1/users': 'http://localhost:8000',
      // '/api/v1/upload': 'http://localhost:8000',
      // '/api/v1/share': 'http://localhost:8000',
      // '/api/v1/total': 'http://localhost:8000',
    },
  },
  plugins: [react()],
})
