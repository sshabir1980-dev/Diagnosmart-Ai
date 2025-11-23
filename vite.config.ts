
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Removed define: { 'process.env': process.env } as it conflicts with Vite's import.meta.env
})
